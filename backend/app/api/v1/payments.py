import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import Order, Payment, User
from app.providers import get_payment_provider
from app.schemas.schemas import (
    PaymentCreateIntentRequest, PaymentCreateIntentResponse,
    PaymentVerifyRequest, PaymentResponse
)
from app.services.invoice_service import generate_invoice_for_order
from app.services.provisioning_service import provision_order

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.post("/create-intent", response_model=PaymentCreateIntentResponse)
def create_payment_intent(
    payload: PaymentCreateIntentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Initialize a payment transaction via the configured PaymentProvider.
    Ensures order belongs to user and has not already been paid.
    """
    order = db.query(Order).filter(Order.id == payload.order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")

    if order.status in ["ACTIVE", "PAYMENT_CONFIRMED", "PROVISIONING"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order has already been paid.")

    provider = get_payment_provider()
    pay_res = provider.create_payment(
        order_id=order.id,
        amount=order.total,
        currency=order.currency,
        customer_info={"name": current_user.name, "email": current_user.email}
    )

    # Upsert payment record in PENDING state
    payment = db.query(Payment).filter(Payment.order_id == order.id).first()
    if not payment:
        payment = Payment(
            id=str(uuid.uuid4()),
            order_id=order.id,
            provider="mock",
            transaction_id=pay_res["transaction_id"],
            amount=order.total,
            currency=order.currency,
            status="PENDING",
            payment_method=payload.payment_method
        )
        db.add(payment)
    else:
        payment.transaction_id = pay_res["transaction_id"]
        payment.status = "PENDING"
        payment.payment_method = payload.payment_method

    db.commit()

    return PaymentCreateIntentResponse(
        order_id=order.id,
        order_number=order.order_number,
        amount=order.total,
        currency=order.currency,
        provider=pay_res["provider"],
        transaction_id=pay_res["transaction_id"],
        client_token=pay_res["client_token"],
        key_id=pay_res.get("key_id"),
        notes=pay_res.get("notes", "")
    )

@router.post("/verify", response_model=PaymentResponse)
def verify_payment(
    payload: PaymentVerifyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Server-side verification of payment tokens.
    Never trusts client success states.
    If valid, confirms payment, generates invoice, and runs automated provisioning.
    """
    order = db.query(Order).filter(Order.id == payload.order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")

    payment = db.query(Payment).filter(Payment.order_id == order.id).first()
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment record not found.")

    provider = get_payment_provider()
    verify_res = provider.verify_payment(
        order_id=order.id,
        transaction_id=payload.transaction_id,
        signature_or_token=payload.client_token
    )

    if not verify_res.get("verified"):
        payment.status = "FAILED"
        order.status = "PENDING"
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment verification failed: invalid signature or rejected by gateway."
        )

    # Success: Mark paid
    payment.status = "PAID"
    payment.updated_at = datetime.now(timezone.utc)
    order.status = "PAYMENT_CONFIRMED"
    db.commit()

    # Automatically generate official Invoice
    generate_invoice_for_order(db, order)

    # Trigger Provisioning workflow
    provision_order(db, order.id)

    db.refresh(payment)
    return PaymentResponse.model_validate(payment)

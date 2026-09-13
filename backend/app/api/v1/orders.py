import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.core.config import settings
from app.models.models import Order, OrderItem, User, HostingPlan, TldPrice
from app.schemas.schemas import CheckoutRequest, OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create an order using server-side authoritative pricing from database.
    Order remains in PENDING status until payment is verified.
    """
    if not payload.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart cannot be empty.")

    # Generate sequential order number
    count = db.query(Order).count() + 1
    year = datetime.now(timezone.utc).year
    order_number = f"NXR-ORD-{year}-{count:05d}"

    subtotal = 0.0
    order_items_to_create = []

    for item in payload.items:
        qty = max(1, item.quantity)
        if item.product_type == "DOMAIN":
            domain_name = item.product_reference.lower().strip()
            tld = "." + domain_name.split(".")[-1]
            tld_row = db.query(TldPrice).filter(TldPrice.tld == tld, TldPrice.active == True).first()
            unit_price = tld_row.registration_price if tld_row else 899.0
            line_total = unit_price * qty
            subtotal += line_total
            order_items_to_create.append(
                OrderItem(
                    id=str(uuid.uuid4()),
                    product_type="DOMAIN",
                    product_reference=domain_name,
                    name=f"Domain Registration: {domain_name} ({qty} yr)",
                    quantity=qty,
                    unit_price=unit_price,
                    total=line_total,
                    meta_info=item.meta_info or {}
                )
            )
        elif item.product_type == "HOSTING":
            plan = db.query(HostingPlan).filter(HostingPlan.slug == item.product_reference, HostingPlan.active == True).first()
            if not plan:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Hosting plan {item.product_reference} not found.")
            unit_price = plan.price
            line_total = unit_price * qty
            subtotal += line_total
            order_items_to_create.append(
                OrderItem(
                    id=str(uuid.uuid4()),
                    product_type="HOSTING",
                    product_reference=plan.slug,
                    name=f"Web Hosting: {plan.name} (Annual)",
                    quantity=qty,
                    unit_price=unit_price,
                    total=line_total,
                    meta_info=item.meta_info or {}
                )
            )

    tax_rate = settings.TAX_RATE_PERCENT
    tax = round(subtotal * (tax_rate / 100.0), 2)
    total = round(subtotal + tax, 2)

    new_order = Order(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        order_number=order_number,
        subtotal=round(subtotal, 2),
        tax=tax,
        total=total,
        currency=settings.DEFAULT_CURRENCY,
        status="PENDING"
    )
    db.add(new_order)
    db.flush()

    for o_item in order_items_to_create:
        o_item.order_id = new_order.id
        db.add(o_item)

    # Update billing info on user profile if provided
    if payload.billing_phone and not current_user.phone:
        current_user.phone = payload.billing_phone
    if payload.billing_address and not current_user.address:
        current_user.address = payload.billing_address

    db.commit()
    db.refresh(new_order)
    return OrderResponse.model_validate(new_order)

@router.get("", response_model=List[OrderResponse])
def list_user_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retrieve all orders placed by the current customer."""
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return [OrderResponse.model_validate(o) for o in orders]

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_details(order_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get details for a specific order owned by current customer."""
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")
    return OrderResponse.model_validate(order)

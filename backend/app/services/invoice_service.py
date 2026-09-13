import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.models import Order, Invoice, User

def generate_invoice_for_order(db: Session, order: Order) -> Invoice:
    """Generate a clean, sequential, and authoritative invoice for a paid order."""
    # Check if invoice already exists
    existing = db.query(Invoice).filter(Invoice.order_id == order.id).first()
    if existing:
        return existing

    # Generate sequential invoice number
    count = db.query(Invoice).count() + 1
    year = datetime.now(timezone.utc).year
    invoice_num = f"NXR-{year}-{count:05d}"

    invoice = Invoice(
        id=str(uuid.uuid4()),
        order_id=order.id,
        user_id=order.user_id,
        invoice_number=invoice_num,
        amount=order.subtotal,
        tax=order.tax,
        total=order.total,
        status="PAID",
        issued_at=datetime.now(timezone.utc)
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice

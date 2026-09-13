from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import Invoice, User
from app.schemas.schemas import InvoiceResponse

router = APIRouter(prefix="/invoices", tags=["Invoices"])

@router.get("", response_model=List[InvoiceResponse])
def list_invoices(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all issued invoices for current customer."""
    invoices = db.query(Invoice).filter(Invoice.user_id == current_user.id).order_by(Invoice.issued_at.desc()).all()
    return [InvoiceResponse.model_validate(inv) for inv in invoices]

@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(invoice_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retrieve detailed invoice record."""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id, Invoice.user_id == current_user.id).first()
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found.")
    return InvoiceResponse.model_validate(invoice)

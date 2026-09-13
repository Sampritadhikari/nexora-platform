from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.models.models import Order, User
from app.schemas.schemas import OrderResponse
from app.services.provisioning_service import provision_order

router = APIRouter(prefix="/admin/orders", tags=["Admin Orders"])

@router.get("", response_model=List[OrderResponse])
def list_all_orders(
    status_filter: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    query = db.query(Order)
    if status_filter:
        query = query.filter(Order.status == status_filter.upper())
    orders = query.order_by(Order.created_at.desc()).all()
    return [OrderResponse.model_validate(o) for o in orders]

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_admin(
    order_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")
    return OrderResponse.model_validate(order)

@router.post("/{order_id}/retry-provisioning")
def retry_provisioning(
    order_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Admin manual action to retry provisioning a failed order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")

    success = provision_order(db, order_id)
    db.refresh(order)
    return {
        "success": success,
        "order_status": order.status,
        "notes": order.provisioning_notes
    }

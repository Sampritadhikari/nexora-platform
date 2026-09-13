from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.models.models import User, Domain, HostingAccount, Order, SupportTicket
from app.schemas.schemas import UserResponse, DomainResponse, HostingAccountResponse, OrderResponse, SupportTicketResponse

router = APIRouter(prefix="/admin/customers", tags=["Admin Customers"])

@router.get("", response_model=List[UserResponse])
def list_customers(
    search: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    query = db.query(User).filter(User.role == "CUSTOMER")
    if search:
        s = f"%{search.strip()}%"
        query = query.filter((User.name.ilike(s)) | (User.email.ilike(s)))
    if status_filter:
        query = query.filter(User.status == status_filter.upper())
    
    customers = query.order_by(User.created_at.desc()).all()
    return [UserResponse.model_validate(c) for c in customers]

@router.get("/{customer_id}")
def get_customer_details(
    customer_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    customer = db.query(User).filter(User.id == customer_id, User.role == "CUSTOMER").first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found.")

    domains = db.query(Domain).filter(Domain.user_id == customer.id).all()
    hosting = db.query(HostingAccount).filter(HostingAccount.user_id == customer.id).all()
    orders = db.query(Order).filter(Order.user_id == customer.id).order_by(Order.created_at.desc()).all()
    tickets = db.query(SupportTicket).filter(SupportTicket.user_id == customer.id).order_by(SupportTicket.created_at.desc()).all()

    return {
        "customer": UserResponse.model_validate(customer),
        "domains": [DomainResponse.model_validate(d) for d in domains],
        "hosting": [HostingAccountResponse.model_validate(h) for h in hosting],
        "orders": [OrderResponse.model_validate(o) for o in orders],
        "tickets": [SupportTicketResponse.model_validate(t) for t in tickets],
    }

@router.put("/{customer_id}/status")
def update_customer_status(
    customer_id: str,
    new_status: str = Query(..., regex="^(ACTIVE|SUSPENDED)$"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    customer = db.query(User).filter(User.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found.")
    customer.status = new_status
    db.commit()
    return {"success": True, "status": customer.status}

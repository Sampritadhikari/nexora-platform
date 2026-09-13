import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.models.models import SupportTicket, SupportMessage, User
from app.schemas.schemas import (
    SupportTicketResponse, SupportTicketDetailResponse,
    SupportMessageCreate, SupportMessageResponse
)

router = APIRouter(prefix="/admin/support", tags=["Admin Support"])

@router.get("/tickets", response_model=List[SupportTicketResponse])
def list_all_tickets(
    status_filter: Optional[str] = Query(None),
    category_filter: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    query = db.query(SupportTicket)
    if status_filter:
        query = query.filter(SupportTicket.status == status_filter.upper())
    if category_filter:
        query = query.filter(SupportTicket.category == category_filter.upper())
    tickets = query.order_by(SupportTicket.updated_at.desc()).all()
    return [SupportTicketResponse.model_validate(t) for t in tickets]

@router.get("/tickets/{ticket_id}", response_model=SupportTicketDetailResponse)
def get_ticket_admin(
    ticket_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support ticket not found.")
    return SupportTicketDetailResponse.model_validate(ticket)

@router.post("/tickets/{ticket_id}/reply", response_model=SupportMessageResponse, status_code=status.HTTP_201_CREATED)
def admin_reply_to_ticket(
    ticket_id: str,
    payload: SupportMessageCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support ticket not found.")

    msg = SupportMessage(
        id=str(uuid.uuid4()),
        ticket_id=ticket.id,
        user_id=admin.id,
        sender_role="ADMIN",
        sender_name="Nexora Engineering Support",
        message=payload.message.strip()
    )
    db.add(msg)
    ticket.status = "WAITING_FOR_CUSTOMER"
    ticket.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(msg)
    return SupportMessageResponse.model_validate(msg)

@router.put("/tickets/{ticket_id}/status", response_model=SupportTicketResponse)
def update_ticket_status(
    ticket_id: str,
    new_status: str = Query(..., regex="^(OPEN|IN_PROGRESS|WAITING_FOR_CUSTOMER|RESOLVED|CLOSED)$"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support ticket not found.")

    ticket.status = new_status
    ticket.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(ticket)
    return SupportTicketResponse.model_validate(ticket)

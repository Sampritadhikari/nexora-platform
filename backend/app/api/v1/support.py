import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import SupportTicket, SupportMessage, User
from app.schemas.schemas import (
    SupportTicketCreate, SupportTicketResponse, SupportTicketDetailResponse,
    SupportMessageCreate, SupportMessageResponse
)

router = APIRouter(prefix="/support", tags=["Support Tickets"])

@router.get("/tickets", response_model=List[SupportTicketResponse])
def list_tickets(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all support tickets submitted by current customer."""
    tickets = db.query(SupportTicket).filter(
        SupportTicket.user_id == current_user.id
    ).order_by(SupportTicket.updated_at.desc()).all()
    return [SupportTicketResponse.model_validate(t) for t in tickets]

@router.post("/tickets", response_model=SupportTicketDetailResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(
    payload: SupportTicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Open a new support ticket with an initial customer message."""
    count = db.query(SupportTicket).count() + 1
    ticket_num = f"TICK-{count:05d}"

    ticket = SupportTicket(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        ticket_number=ticket_num,
        subject=payload.subject.strip(),
        category=payload.category,
        priority=payload.priority,
        status="OPEN"
    )
    db.add(ticket)
    db.flush()

    first_msg = SupportMessage(
        id=str(uuid.uuid4()),
        ticket_id=ticket.id,
        user_id=current_user.id,
        sender_role="CUSTOMER",
        sender_name=current_user.name,
        message=payload.message.strip()
    )
    db.add(first_msg)
    db.commit()
    db.refresh(ticket)
    return SupportTicketDetailResponse.model_validate(ticket)

@router.get("/tickets/{ticket_id}", response_model=SupportTicketDetailResponse)
def get_ticket(ticket_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Fetch ticket details including full message conversation history."""
    ticket = db.query(SupportTicket).filter(
        SupportTicket.id == ticket_id,
        SupportTicket.user_id == current_user.id
    ).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support ticket not found.")
    return SupportTicketDetailResponse.model_validate(ticket)

@router.post("/tickets/{ticket_id}/messages", response_model=SupportMessageResponse, status_code=status.HTTP_201_CREATED)
def add_ticket_message(
    ticket_id: str,
    payload: SupportMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a customer reply to an existing support ticket."""
    ticket = db.query(SupportTicket).filter(
        SupportTicket.id == ticket_id,
        SupportTicket.user_id == current_user.id
    ).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support ticket not found.")

    msg = SupportMessage(
        id=str(uuid.uuid4()),
        ticket_id=ticket.id,
        user_id=current_user.id,
        sender_role="CUSTOMER",
        sender_name=current_user.name,
        message=payload.message.strip()
    )
    db.add(msg)
    ticket.status = "OPEN"  # Reopen if customer replies
    ticket.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(msg)
    return SupportMessageResponse.model_validate(msg)

@router.post("/tickets/{ticket_id}/close", response_model=SupportTicketResponse)
def close_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Customer closes their resolved support ticket."""
    ticket = db.query(SupportTicket).filter(
        SupportTicket.id == ticket_id,
        SupportTicket.user_id == current_user.id
    ).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support ticket not found.")

    ticket.status = "CLOSED"
    ticket.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(ticket)
    return SupportTicketResponse.model_validate(ticket)

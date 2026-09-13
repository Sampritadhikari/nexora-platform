from datetime import datetime, timedelta, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import RenewalRecord, Domain, HostingAccount, User
from app.schemas.schemas import RenewalRecordResponse, RenewalToggleAutoRenew

router = APIRouter(prefix="/renewals", tags=["Renewals"])

@router.get("", response_model=List[RenewalRecordResponse])
def get_user_renewals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all upcoming renewals for the customer sorted by expiry date."""
    records = db.query(RenewalRecord).filter(
        RenewalRecord.user_id == current_user.id
    ).order_by(RenewalRecord.expiry_date.asc()).all()
    return [RenewalRecordResponse.model_validate(r) for r in records]

@router.post("/{renewal_id}/toggle-auto-renew", response_model=RenewalRecordResponse)
def toggle_auto_renew(
    renewal_id: str,
    payload: RenewalToggleAutoRenew,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Toggle auto-renew setting for an individual renewal record."""
    rec = db.query(RenewalRecord).filter(RenewalRecord.id == renewal_id, RenewalRecord.user_id == current_user.id).first()
    if not rec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Renewal record not found.")

    rec.auto_renew = payload.auto_renew
    if rec.resource_type == "DOMAIN":
        dom = db.query(Domain).filter(Domain.id == rec.resource_id).first()
        if dom:
            dom.auto_renew = payload.auto_renew

    db.commit()
    db.refresh(rec)
    return RenewalRecordResponse.model_validate(rec)

@router.post("/{renewal_id}/renew-now", response_model=RenewalRecordResponse)
def renew_resource_now(
    renewal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Perform immediate renewal extension for a domain or hosting package."""
    rec = db.query(RenewalRecord).filter(RenewalRecord.id == renewal_id, RenewalRecord.user_id == current_user.id).first()
    if not rec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Renewal record not found.")

    new_expiry = rec.expiry_date + timedelta(days=365)
    rec.expiry_date = new_expiry
    rec.status = "RENEWED"

    if rec.resource_type == "DOMAIN":
        dom = db.query(Domain).filter(Domain.id == rec.resource_id).first()
        if dom:
            dom.expiry_date = new_expiry
    elif rec.resource_type == "HOSTING":
        host = db.query(HostingAccount).filter(HostingAccount.id == rec.resource_id).first()
        if host:
            host.expiry_date = new_expiry

    db.commit()
    db.refresh(rec)
    return RenewalRecordResponse.model_validate(rec)

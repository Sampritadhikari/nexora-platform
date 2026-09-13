from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import HostingPlan, HostingAccount, User
from app.schemas.schemas import HostingPlanResponse, HostingAccountResponse

router = APIRouter(prefix="/hosting", tags=["Hosting"])

@router.get("/plans", response_model=List[HostingPlanResponse])
def get_hosting_plans(db: Session = Depends(get_db)):
    """Fetch all active database-driven hosting plans for public and customer display."""
    plans = db.query(HostingPlan).filter(HostingPlan.active == True).order_by(HostingPlan.price.asc()).all()
    return [HostingPlanResponse.model_validate(p) for p in plans]

@router.get("/plans/{slug}", response_model=HostingPlanResponse)
def get_hosting_plan(slug: str, db: Session = Depends(get_db)):
    """Fetch details of a specific hosting plan by slug."""
    plan = db.query(HostingPlan).filter(HostingPlan.slug == slug, HostingPlan.active == True).first()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hosting plan not found.")
    return HostingPlanResponse.model_validate(plan)

@router.get("", response_model=List[HostingAccountResponse])
def get_user_hosting_accounts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all active hosting accounts for the authenticated customer."""
    accounts = db.query(HostingAccount).filter(HostingAccount.user_id == current_user.id).order_by(HostingAccount.created_at.desc()).all()
    return [HostingAccountResponse.model_validate(a) for a in accounts]

@router.get("/{account_id}", response_model=HostingAccountResponse)
def get_hosting_account_details(account_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Fetch resource metrics and control panel connection info for a customer's hosting account."""
    account = db.query(HostingAccount).filter(HostingAccount.id == account_id, HostingAccount.user_id == current_user.id).first()
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hosting account not found.")
    return HostingAccountResponse.model_validate(account)

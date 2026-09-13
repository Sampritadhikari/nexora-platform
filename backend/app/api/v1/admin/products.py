import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.models.models import HostingPlan, TldPrice, User
from app.schemas.schemas import (
    HostingPlanResponse, HostingPlanCreate, HostingPlanUpdate,
    TldPriceResponse, TldPriceCreate, TldPriceUpdate
)

router = APIRouter(prefix="/admin/products", tags=["Admin Products"])

# --- Hosting Plans ---
@router.get("/hosting", response_model=List[HostingPlanResponse])
def list_all_hosting_plans(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    plans = db.query(HostingPlan).order_by(HostingPlan.price.asc()).all()
    return [HostingPlanResponse.model_validate(p) for p in plans]

@router.post("/hosting", response_model=HostingPlanResponse, status_code=status.HTTP_201_CREATED)
def create_hosting_plan(
    payload: HostingPlanCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    existing = db.query(HostingPlan).filter(HostingPlan.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Hosting plan slug already exists.")

    plan = HostingPlan(
        id=str(uuid.uuid4()),
        name=payload.name,
        slug=payload.slug,
        description=payload.description,
        price=payload.price,
        renewal_price=payload.renewal_price,
        billing_period=payload.billing_period,
        storage=payload.storage,
        bandwidth=payload.bandwidth,
        website_limit=payload.website_limit,
        email_limit=payload.email_limit,
        ssl_enabled=payload.ssl_enabled,
        backup_enabled=payload.backup_enabled,
        is_popular=payload.is_popular,
        active=payload.active,
        features=payload.features
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return HostingPlanResponse.model_validate(plan)

@router.put("/hosting/{plan_id}", response_model=HostingPlanResponse)
def update_hosting_plan(
    plan_id: str,
    payload: HostingPlanUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    plan = db.query(HostingPlan).filter(HostingPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hosting plan not found.")

    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(plan, field, val)

    db.commit()
    db.refresh(plan)
    return HostingPlanResponse.model_validate(plan)

# --- TLDs ---
@router.get("/tlds", response_model=List[TldPriceResponse])
def list_all_tlds(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    tlds = db.query(TldPrice).order_by(TldPrice.registration_price.asc()).all()
    return [TldPriceResponse.model_validate(t) for t in tlds]

@router.post("/tlds", response_model=TldPriceResponse, status_code=status.HTTP_201_CREATED)
def create_tld(
    payload: TldPriceCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    tld_clean = payload.tld.lower().strip()
    if not tld_clean.startswith("."):
        tld_clean = f".{tld_clean}"

    existing = db.query(TldPrice).filter(TldPrice.tld == tld_clean).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"TLD {tld_clean} already exists.")

    tld = TldPrice(
        id=str(uuid.uuid4()),
        tld=tld_clean,
        registration_price=payload.registration_price,
        renewal_price=payload.renewal_price,
        transfer_price=payload.transfer_price,
        is_popular=payload.is_popular,
        active=payload.active
    )
    db.add(tld)
    db.commit()
    db.refresh(tld)
    return TldPriceResponse.model_validate(tld)

@router.put("/tlds/{tld_id}", response_model=TldPriceResponse)
def update_tld(
    tld_id: str,
    payload: TldPriceUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    tld = db.query(TldPrice).filter(TldPrice.id == tld_id).first()
    if not tld:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TLD not found.")

    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(tld, field, val)

    db.commit()
    db.refresh(tld)
    return TldPriceResponse.model_validate(tld)

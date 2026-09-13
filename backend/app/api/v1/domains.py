from typing import List, Optional
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import Domain, User, TldPrice, RenewalRecord
from app.providers import get_domain_provider
from app.schemas.schemas import (
    DomainSearchResponse, DomainAvailabilityItem, DomainResponse,
    NameserversUpdateRequest, DomainRenewRequest, TldPriceResponse
)

router = APIRouter(prefix="/domains", tags=["Domains"])

@router.get("/tlds", response_model=List[TldPriceResponse])
def get_public_tlds(db: Session = Depends(get_db)):
    """Fetch active TLDs and their authoritative registration/renewal rates."""
    tlds = db.query(TldPrice).filter(TldPrice.active == True).all()
    return [TldPriceResponse.model_validate(t) for t in tlds]

@router.get("/search", response_model=DomainSearchResponse)
def search_domain(
    query: str = Query(..., min_length=2, max_length=100, description="Domain name query to search"),
    db: Session = Depends(get_db)
):
    """
    Search domain availability and pricing across active database TLDs.
    Handles inputs like 'mybrand' or 'mybrand.com'.
    """
    clean_query = query.lower().strip()
    # Separate label from TLD if provided
    parts = clean_query.split(".")
    base_name = parts[0]
    specific_tld = ("." + ".".join(parts[1:])) if len(parts) > 1 else None

    # Retrieve active TLDs
    db_tlds = db.query(TldPrice).filter(TldPrice.active == True).all()
    if not db_tlds:
        # Fallback rates if seed hasn't run yet
        tld_rates = {
            ".com": (899.0, 999.0),
            ".in": (499.0, 599.0),
            ".co.in": (399.0, 499.0),
            ".org": (999.0, 1099.0),
            ".net": (949.0, 1049.0),
            ".io": (2999.0, 3199.0),
            ".tech": (599.0, 1299.0),
        }
    else:
        tld_rates = {t.tld: (t.registration_price, t.renewal_price) for t in db_tlds}

    provider = get_domain_provider()
    results: List[DomainAvailabilityItem] = []

    # If specific TLD was requested and exists in our catalogue, check it first
    target_tlds = [specific_tld] if (specific_tld and specific_tld in tld_rates) else list(tld_rates.keys())

    for tld in target_tlds:
        full_domain = f"{base_name}{tld}"
        # Check DB if already registered by any user in our system
        in_db = db.query(Domain).filter(Domain.domain_name == full_domain, Domain.status == "ACTIVE").first()
        if in_db:
            is_available = False
        else:
            check_res = provider.check_availability(full_domain)
            is_available = check_res.get("is_available", True)

        reg_price, ren_price = tld_rates.get(tld, (999.0, 999.0))
        results.append(
            DomainAvailabilityItem(
                domain_name=full_domain,
                tld=tld,
                is_available=is_available,
                registration_price=reg_price,
                renewal_price=ren_price,
                currency="INR"
            )
        )

    return DomainSearchResponse(query=clean_query, results=results)

@router.get("", response_model=List[DomainResponse])
def get_user_domains(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retrieve all active domains owned by the authenticated customer."""
    domains = db.query(Domain).filter(Domain.user_id == current_user.id).order_by(Domain.created_at.desc()).all()
    return [DomainResponse.model_validate(d) for d in domains]

@router.get("/{domain_id}", response_model=DomainResponse)
def get_domain_details(domain_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Fetch details, nameservers, and DNS records for a specific owned domain."""
    domain = db.query(Domain).filter(Domain.id == domain_id, Domain.user_id == current_user.id).first()
    if not domain:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Domain not found or unauthorized.")
    return DomainResponse.model_validate(domain)

@router.put("/{domain_id}/nameservers", response_model=DomainResponse)
def update_nameservers(
    domain_id: str,
    data: NameserversUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update authoritative nameservers for a customer's domain."""
    domain = db.query(Domain).filter(Domain.id == domain_id, Domain.user_id == current_user.id).first()
    if not domain:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Domain not found.")

    provider = get_domain_provider()
    provider.update_nameservers(domain.domain_name, data.nameservers)

    domain.nameservers = data.nameservers
    db.commit()
    db.refresh(domain)
    return DomainResponse.model_validate(domain)

@router.post("/{domain_id}/auto-renew", response_model=DomainResponse)
def toggle_auto_renew(
    domain_id: str,
    auto_renew: bool = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Toggle auto-renew status for a domain."""
    domain = db.query(Domain).filter(Domain.id == domain_id, Domain.user_id == current_user.id).first()
    if not domain:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Domain not found.")

    domain.auto_renew = auto_renew
    # Also sync renewal record
    renewal = db.query(RenewalRecord).filter(RenewalRecord.resource_id == domain.id).first()
    if renewal:
        renewal.auto_renew = auto_renew

    db.commit()
    db.refresh(domain)
    return DomainResponse.model_validate(domain)

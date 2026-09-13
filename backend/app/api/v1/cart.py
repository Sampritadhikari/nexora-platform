from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.core.config import settings
from app.models.models import HostingPlan, TldPrice
from app.schemas.schemas import CartValidateRequest, CartCalculationResponse, ComputedCartItem

router = APIRouter(prefix="/cart", tags=["Cart & Pricing"])

@router.post("/calculate", response_model=CartCalculationResponse)
def calculate_cart(payload: CartValidateRequest, db: Session = Depends(get_db)):
    """
    Authoritative server-side price calculator.
    Never trusts prices sent from the client.
    Re-queries database rates for all domains and hosting plans.
    """
    computed_items = []
    subtotal = 0.0

    for item in payload.items:
        qty = max(1, item.quantity)
        if item.product_type == "DOMAIN":
            domain_name = item.product_reference.lower().strip()
            tld = "." + domain_name.split(".")[-1]
            tld_row = db.query(TldPrice).filter(TldPrice.tld == tld, TldPrice.active == True).first()
            if not tld_row:
                # Default fallback if unseeded
                unit_price = 899.0
            else:
                unit_price = tld_row.registration_price
            
            line_total = unit_price * qty
            subtotal += line_total
            computed_items.append(
                ComputedCartItem(
                    product_type="DOMAIN",
                    product_reference=domain_name,
                    name=f"Domain Registration: {domain_name} ({qty} yr)",
                    quantity=qty,
                    unit_price=unit_price,
                    total=line_total,
                    meta_info=item.meta_info or {}
                )
            )

        elif item.product_type == "HOSTING":
            plan_slug = item.product_reference
            plan = db.query(HostingPlan).filter(HostingPlan.slug == plan_slug, HostingPlan.active == True).first()
            if not plan:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Hosting plan '{plan_slug}' is unavailable or inactive."
                )
            unit_price = plan.price
            line_total = unit_price * qty
            subtotal += line_total
            computed_items.append(
                ComputedCartItem(
                    product_type="HOSTING",
                    product_reference=plan.slug,
                    name=f"Web Hosting: {plan.name} (Annual)",
                    quantity=qty,
                    unit_price=unit_price,
                    total=line_total,
                    meta_info=item.meta_info or {}
                )
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unknown product type: {item.product_type}"
            )

    tax_rate = settings.TAX_RATE_PERCENT
    tax = round(subtotal * (tax_rate / 100.0), 2)
    total = round(subtotal + tax, 2)

    return CartCalculationResponse(
        items=computed_items,
        subtotal=round(subtotal, 2),
        tax=tax,
        tax_rate=tax_rate,
        total=total,
        currency=settings.DEFAULT_CURRENCY
    )

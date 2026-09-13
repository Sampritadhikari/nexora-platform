from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.api.deps import get_db, get_current_admin
from app.core.config import settings
from app.models.models import User

router = APIRouter(prefix="/admin/system", tags=["Admin System"])

@router.get("/status")
def get_system_status(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Deliver health check and active provider telemetry to admin."""
    # Test DB query
    db_alive = False
    try:
        db.execute(text("SELECT 1"))
        db_alive = True
    except Exception:
        db_alive = False

    return {
        "platform_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.APP_ENV,
        "database_connected": db_alive,
        "database_url_target": settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else "local_instance",
        "providers": {
            "domain": settings.DOMAIN_PROVIDER,
            "hosting": settings.HOSTING_PROVIDER,
            "payment": settings.PAYMENT_PROVIDER,
            "email": settings.EMAIL_PROVIDER
        },
        "tax_rate_percent": settings.TAX_RATE_PERCENT,
        "currency": settings.DEFAULT_CURRENCY
    }

from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.deps import get_db, get_current_admin
from app.models.models import (
    User, Domain, HostingAccount, Order, Payment, SupportTicket, RenewalRecord
)
from app.schemas.schemas import AdminDashboardStats

router = APIRouter(prefix="/admin/dashboard", tags=["Admin Dashboard"])

@router.get("/stats", response_model=AdminDashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Deliver 100% database-driven key performance metrics.
    Zero fake statistics. Displays 0 if empty.
    """
    total_customers = db.query(User).filter(User.role == "CUSTOMER").count()
    active_domains = db.query(Domain).filter(Domain.status == "ACTIVE").count()
    active_hosting = db.query(HostingAccount).filter(HostingAccount.status == "ACTIVE").count()
    total_orders = db.query(Order).count()

    # Calculate actual revenue from confirmed payments
    revenue_sum = db.query(func.sum(Payment.amount)).filter(Payment.status == "PAID").scalar()
    total_revenue = round(float(revenue_sum or 0.0), 2)

    pending_payments = db.query(Payment).filter(Payment.status == "PENDING").count()
    open_tickets = db.query(SupportTicket).filter(
        SupportTicket.status.in_(["OPEN", "IN_PROGRESS", "WAITING_FOR_CUSTOMER"])
    ).count()

    now = datetime.now(timezone.utc)
    in_30_days = now + timedelta(days=30)
    upcoming_renewals = db.query(RenewalRecord).filter(
        RenewalRecord.status == "UPCOMING",
        RenewalRecord.expiry_date >= now,
        RenewalRecord.expiry_date <= in_30_days
    ).count()

    return AdminDashboardStats(
        total_customers=total_customers,
        active_domains=active_domains,
        active_hosting=active_hosting,
        total_orders=total_orders,
        total_revenue=total_revenue,
        pending_payments=pending_payments,
        open_tickets=open_tickets,
        upcoming_renewals_30_days=upcoming_renewals
    )

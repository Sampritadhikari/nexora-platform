import logging
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.models import RenewalRecord, User, Domain, HostingAccount
from app.providers import get_email_provider

logger = logging.getLogger("nexora.renewals")

def check_and_process_renewals(db: Session):
    """
    Periodic job logic checking for upcoming renewals and sending notices
    at 30 days, 15 days, 7 days, and 1 day before expiration.
    """
    now = datetime.now(timezone.utc)
    email_provider = get_email_provider()

    records = db.query(RenewalRecord).filter(RenewalRecord.status == "UPCOMING").all()
    for rec in records:
        delta = rec.expiry_date - now
        days_left = delta.days

        user = db.query(User).filter(User.id == rec.user_id).first()
        if not user:
            continue

        sent_flags = list(rec.reminders_sent or [])

        # Check reminder thresholds
        thresholds = [
            (30, "30_DAYS"),
            (15, "15_DAYS"),
            (7, "7_DAYS"),
            (1, "1_DAY")
        ]

        for days_thresh, flag in thresholds:
            if days_left <= days_thresh and flag not in sent_flags:
                sent_flags.append(flag)
                rec.reminders_sent = sent_flags
                db.commit()

                email_provider.send_email(
                    to_email=user.email,
                    subject=f"Renewal Notice: {rec.resource_name} expires in {days_left} days",
                    body_html=f"<p>Hello {user.name},</p><p>Your service {rec.resource_name} is set to renew on {rec.expiry_date.strftime('%Y-%m-%d')}. Price: ₹{rec.renewal_price}.</p>"
                )
                logger.info(f"Sent {flag} reminder for {rec.resource_name} to {user.email}")

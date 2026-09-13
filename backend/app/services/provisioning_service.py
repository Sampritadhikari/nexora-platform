import uuid
import logging
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.models import (
    Order, Domain, HostingAccount, HostingPlan, RenewalRecord, User
)
from app.providers import get_domain_provider, get_hosting_provider, get_email_provider

logger = logging.getLogger("nexora.provisioning")

def provision_order(db: Session, order_id: str) -> bool:
    """
    Execute end-to-end provisioning for an order once payment is confirmed.
    Provisions domains and hosting accounts through provider abstractions.
    Updates order status to ACTIVE or PROVISIONING_FAILED.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        logger.error(f"Order {order_id} not found for provisioning.")
        return False

    user = db.query(User).filter(User.id == order.user_id).first()
    if not user:
        logger.error(f"User {order.user_id} not found for order {order_id}.")
        return False

    order.status = "PROVISIONING"
    db.commit()

    domain_provider = get_domain_provider()
    hosting_provider = get_hosting_provider()
    email_provider = get_email_provider()

    provisioning_notes = []
    created_domains = {}  # domain_name -> Domain model
    now = datetime.now(timezone.utc)

    try:
        # Step 1: Provision any Domains first
        for item in order.items:
            if item.product_type == "DOMAIN":
                domain_name = item.product_reference.lower().strip()
                tld = "." + domain_name.split(".")[-1]
                years = item.quantity or 1
                
                # Check if user already has this active domain
                existing_domain = db.query(Domain).filter(Domain.domain_name == domain_name).first()
                if existing_domain and existing_domain.status == "ACTIVE":
                    # Extend expiry if already exists
                    existing_domain.expiry_date = existing_domain.expiry_date + timedelta(days=365 * years)
                    provisioning_notes.append(f"Domain {domain_name} renewed for {years} year(s).")
                    created_domains[domain_name] = existing_domain
                else:
                    reg_res = domain_provider.register_domain(
                        domain_name=domain_name,
                        years=years,
                        contact_info={"name": user.name, "email": user.email}
                    )
                    
                    expiry = now + timedelta(days=365 * years)
                    new_domain = Domain(
                        id=str(uuid.uuid4()),
                        user_id=user.id,
                        domain_name=domain_name,
                        tld=tld,
                        status="ACTIVE",
                        registration_date=now,
                        expiry_date=expiry,
                        auto_renew=True,
                        provider_reference=reg_res.get("provider_reference"),
                        nameservers=reg_res.get("nameservers", ["ns1.nexoradns.com", "ns2.nexoradns.com"]),
                        dns_records=[
                            {"type": "A", "name": "@", "value": "192.0.2.1", "ttl": 3600},
                            {"type": "CNAME", "name": "www", "value": f"{domain_name}.", "ttl": 3600}
                        ]
                    )
                    db.add(new_domain)
                    db.flush()
                    created_domains[domain_name] = new_domain

                    # Add renewal record
                    tld_renewal_price = item.unit_price  # or lookup renewal rate
                    renewal = RenewalRecord(
                        id=str(uuid.uuid4()),
                        user_id=user.id,
                        resource_type="DOMAIN",
                        resource_id=new_domain.id,
                        resource_name=domain_name,
                        expiry_date=expiry,
                        renewal_price=tld_renewal_price,
                        auto_renew=True,
                        status="UPCOMING"
                    )
                    db.add(renewal)
                    provisioning_notes.append(f"Domain {domain_name} registered successfully.")

        # Step 2: Provision Hosting Packages
        for item in order.items:
            if item.product_type == "HOSTING":
                plan_slug = item.product_reference
                plan = db.query(HostingPlan).filter(HostingPlan.slug == plan_slug).first()
                if not plan:
                    # Fallback to id match if slug wasn't passed
                    plan = db.query(HostingPlan).filter(HostingPlan.id == plan_slug).first()
                
                if not plan:
                    raise Exception(f"Hosting plan '{plan_slug}' could not be resolved.")

                # Determine primary domain for hosting
                associated_domain = item.meta_info.get("domain_name") if item.meta_info else None
                if not associated_domain and created_domains:
                    associated_domain = list(created_domains.keys())[0]
                if not associated_domain:
                    associated_domain = f"site-{uuid.uuid4().hex[:6]}.nexoracloud.net"

                # Sanitize username for control panel
                clean_name = ''.join(c for c in user.name if c.isalnum()).lower()[:5] or "user"
                cpanel_user = f"{clean_name}{uuid.uuid4().hex[:3]}"

                host_res = hosting_provider.create_account(
                    username=cpanel_user,
                    domain_name=associated_domain,
                    plan_slug=plan.slug,
                    contact_email=user.email
                )

                expiry = now + timedelta(days=365)
                domain_rec = created_domains.get(associated_domain)

                hosting_account = HostingAccount(
                    id=str(uuid.uuid4()),
                    user_id=user.id,
                    hosting_plan_id=plan.id,
                    domain_id=domain_rec.id if domain_rec else None,
                    domain_name=associated_domain,
                    status="ACTIVE",
                    start_date=now,
                    expiry_date=expiry,
                    provider_reference=host_res.get("provider_reference"),
                    cpanel_username=cpanel_user,
                    server_hostname=host_res.get("server_hostname", "cpanel1.nexoracloud.net"),
                    server_ip=host_res.get("server_ip", "103.14.120.45")
                )
                db.add(hosting_account)
                db.flush()

                # Add hosting renewal record
                renewal = RenewalRecord(
                    id=str(uuid.uuid4()),
                    user_id=user.id,
                    resource_type="HOSTING",
                    resource_id=hosting_account.id,
                    resource_name=f"{plan.name} ({associated_domain})",
                    expiry_date=expiry,
                    renewal_price=plan.renewal_price,
                    auto_renew=True,
                    status="UPCOMING"
                )
                db.add(renewal)
                provisioning_notes.append(f"Hosting package {plan.name} provisioned on {associated_domain}.")

        order.status = "ACTIVE"
        order.provisioning_notes = "\n".join(provisioning_notes)
        db.commit()

        # Send confirmation email via email provider
        email_provider.send_email(
            to_email=user.email,
            subject=f"Welcome to Nexora - Order {order.order_number} Active",
            body_html=f"<p>Hello {user.name},</p><p>Your infrastructure order {order.order_number} has been provisioned and is active!</p>"
        )
        return True

    except Exception as exc:
        logger.exception(f"Provisioning failed for order {order_id}: {exc}")
        order.status = "PROVISIONING_FAILED"
        order.provisioning_notes = f"Provisioning failed at {now.isoformat()}: {str(exc)}"
        db.commit()
        return False

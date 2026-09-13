import sys
import os
import uuid

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.models import User, HostingPlan, TldPrice

def seed():
    print("Initializing schema tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Admin User
        admin_email = "admin@nexora.io"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                id=str(uuid.uuid4()),
                name="Nexora Administrator",
                email=admin_email,
                password_hash=hash_password("NexoraAdmin@2026!"),
                role="ADMIN",
                status="ACTIVE",
                phone="+91 98765 43210",
                company="Nexora Technologies Ltd.",
                address="Level 14, High-Tech City, Hyderabad, India"
            )
            db.add(admin)
            print(f"Created Admin: {admin_email} (NexoraAdmin@2026!)")
        else:
            print(f"Admin already exists: {admin_email}")

        # 2. Seed Demo Customer User
        customer_email = "customer@nexora.io"
        customer = db.query(User).filter(User.email == customer_email).first()
        if not customer:
            customer = User(
                id=str(uuid.uuid4()),
                name="Samarth Verma",
                email=customer_email,
                password_hash=hash_password("NexoraCustomer@2026!"),
                role="CUSTOMER",
                status="ACTIVE",
                phone="+91 98111 22334",
                company="Apex Digital Labs",
                address="Sector 62, Noida, Uttar Pradesh, India"
            )
            db.add(customer)
            print(f"Created Customer: {customer_email} (NexoraCustomer@2026!)")
        else:
            print(f"Customer already exists: {customer_email}")

        # 3. Seed TLD Pricing
        tlds = [
            (".com", 899.0, 999.0, 899.0, True),
            (".in", 499.0, 599.0, 499.0, True),
            (".co.in", 399.0, 499.0, 399.0, False),
            (".org", 999.0, 1099.0, 999.0, True),
            (".net", 949.0, 1049.0, 949.0, False),
            (".io", 2999.0, 3199.0, 2999.0, True),
            (".tech", 599.0, 1299.0, 599.0, False),
            (".dev", 1199.0, 1299.0, 1199.0, False),
        ]

        for tld_str, reg_p, ren_p, tra_p, pop in tlds:
            existing_tld = db.query(TldPrice).filter(TldPrice.tld == tld_str).first()
            if not existing_tld:
                tld_rec = TldPrice(
                    id=str(uuid.uuid4()),
                    tld=tld_str,
                    registration_price=reg_p,
                    renewal_price=ren_p,
                    transfer_price=tra_p,
                    is_popular=pop,
                    active=True
                )
                db.add(tld_rec)
                print(f"Seeded TLD: {tld_str} -> INR {reg_p}")

        # 4. Seed Hosting Plans
        plans = [
            {
                "name": "Starter",
                "slug": "starter",
                "description": "Essential infrastructure designed for portfolio sites, personal blogs, and new projects.",
                "price": 999.0,
                "renewal_price": 999.0,
                "billing_period": "YEARLY",
                "storage": "10 GB NVMe Storage",
                "bandwidth": "Unmetered Bandwidth",
                "website_limit": 1,
                "email_limit": 5,
                "ssl_enabled": True,
                "backup_enabled": False,
                "is_popular": False,
                "active": True,
                "features": [
                    "1 Website",
                    "10 GB Ultra-Fast NVMe SSD",
                    "Unmetered Bandwidth",
                    "Free SSL Certificate",
                    "5 Business Email Accounts",
                    "Nexora Cloud Control Panel",
                    "99.9% Uptime SLA Guarantee",
                    "Automated Weekly Snapshots"
                ]
            },
            {
                "name": "Business",
                "slug": "business",
                "description": "High-performance hosting built for growing businesses, client portals, and e-commerce stores.",
                "price": 1999.0,
                "renewal_price": 1999.0,
                "billing_period": "YEARLY",
                "storage": "50 GB NVMe Storage",
                "bandwidth": "Unmetered Bandwidth",
                "website_limit": 5,
                "email_limit": 25,
                "ssl_enabled": True,
                "backup_enabled": True,
                "is_popular": True,
                "active": True,
                "features": [
                    "5 Websites",
                    "50 GB Ultra-Fast NVMe SSD",
                    "Unmetered Bandwidth",
                    "Free Wildcard SSL",
                    "25 Business Email Accounts",
                    "Daily Automated Backups",
                    "Enhanced 2x RAM & CPU Burst",
                    "HTTP/3 & Brotli Compression",
                    "Free Domain for 1st Year",
                    "Priority Technical Support"
                ]
            },
            {
                "name": "Professional",
                "slug": "professional",
                "description": "Maximum compute allocation with advanced developer staging and isolated container security.",
                "price": 3499.0,
                "renewal_price": 3499.0,
                "billing_period": "YEARLY",
                "storage": "100 GB NVMe Storage",
                "bandwidth": "Unmetered Bandwidth",
                "website_limit": 10,
                "email_limit": 100,
                "ssl_enabled": True,
                "backup_enabled": True,
                "is_popular": False,
                "active": True,
                "features": [
                    "10 Websites",
                    "100 GB Enterprise NVMe SSD",
                    "Unmetered Bandwidth",
                    "Free Wildcard SSL",
                    "100 Business Email Accounts",
                    "Real-Time Hourly Backups",
                    "1-Click Staging & Git Deploy",
                    "Dedicated IPv4 Address",
                    "Redis & Memcached Object Caching",
                    "24/7 Rapid Response VIP Support"
                ]
            },
            {
                "name": "Enterprise",
                "slug": "enterprise",
                "description": "Bespoke high-availability cluster architecture engineered for enterprise traffic and compliance.",
                "price": 6999.0,
                "renewal_price": 6999.0,
                "billing_period": "YEARLY",
                "storage": "250 GB NVMe Storage",
                "bandwidth": "Unmetered Bandwidth",
                "website_limit": 50,
                "email_limit": 500,
                "ssl_enabled": True,
                "backup_enabled": True,
                "is_popular": False,
                "active": True,
                "features": [
                    "50 Websites",
                    "250 GB Enterprise NVMe SSD",
                    "Unmetered High-Throughput Bandwidth",
                    "Dedicated High-Core Compute",
                    "Instant Failover Architecture",
                    "Enterprise DDoS Mitigation (Cloudflare L3/L4/L7)",
                    "Custom SLA (99.99%)",
                    "Dedicated Account Technical Manager",
                    "Phone & Slack Channel Support"
                ]
            }
        ]

        for p in plans:
            existing_plan = db.query(HostingPlan).filter(HostingPlan.slug == p["slug"]).first()
            if not existing_plan:
                plan_rec = HostingPlan(
                    id=str(uuid.uuid4()),
                    name=p["name"],
                    slug=p["slug"],
                    description=p["description"],
                    price=p["price"],
                    renewal_price=p["renewal_price"],
                    billing_period=p["billing_period"],
                    storage=p["storage"],
                    bandwidth=p["bandwidth"],
                    website_limit=p["website_limit"],
                    email_limit=p["email_limit"],
                    ssl_enabled=p["ssl_enabled"],
                    backup_enabled=p["backup_enabled"],
                    is_popular=p["is_popular"],
                    active=p["active"],
                    features=p["features"]
                )
                db.add(plan_rec)
                print(f"Seeded Hosting Plan: {p['name']} -> INR {p['price']}/yr")

        db.commit()
        print("Database seed completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()

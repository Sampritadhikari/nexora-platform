import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_public_tlds():
    res = client.get("/api/v1/domains/tlds")
    assert res.status_code == 200
    tlds = res.json()
    assert len(tlds) >= 5
    tld_names = [t["tld"] for t in tlds]
    assert ".com" in tld_names
    assert ".in" in tld_names

def test_domain_search():
    res = client.get("/api/v1/domains/search?query=nexoracloudtest123")
    assert res.status_code == 200
    data = res.json()
    assert "results" in data
    assert len(data["results"]) > 0
    # .com should be available
    com_result = next((r for r in data["results"] if r["tld"] == ".com"), None)
    assert com_result is not None
    assert com_result["is_available"] is True
    assert com_result["registration_price"] > 0

def test_hosting_plans():
    res = client.get("/api/v1/hosting/plans")
    assert res.status_code == 200
    plans = res.json()
    assert len(plans) >= 4
    plan_slugs = [p["slug"] for p in plans]
    assert "starter" in plan_slugs
    assert "business" in plan_slugs

def test_auth_and_checkout_flow():
    import uuid
    email = f"testuser_{uuid.uuid4().hex[:6]}@example.com"
    pwd = "TestPassword@2026!"

    # 1. Register
    reg_res = client.post("/api/v1/auth/register", json={
        "name": "Integration Tester",
        "email": email,
        "password": pwd,
        "phone": "+91 99999 88888"
    })
    assert reg_res.status_code == 201
    auth_data = reg_res.json()
    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Check /me
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == email

    # 3. Server-side authoritative cart computation
    cart_res = client.post("/api/v1/cart/calculate", json={
        "items": [
            {
                "product_type": "DOMAIN",
                "product_reference": f"brand{uuid.uuid4().hex[:4]}.com",
                "name": "Domain Registration",
                "quantity": 1
            },
            {
                "product_type": "HOSTING",
                "product_reference": "business",
                "name": "Business Hosting",
                "quantity": 1
            }
        ]
    })
    assert cart_res.status_code == 200
    calculated = cart_res.json()
    assert calculated["subtotal"] > 0
    assert calculated["tax"] > 0
    assert calculated["total"] == round(calculated["subtotal"] + calculated["tax"], 2)

    # 4. Create Order
    domain_to_buy = f"brand{uuid.uuid4().hex[:4]}.com"
    order_res = client.post("/api/v1/orders", headers=headers, json={
        "items": [
            {
                "product_type": "DOMAIN",
                "product_reference": domain_to_buy,
                "name": "Domain Registration",
                "quantity": 1
            },
            {
                "product_type": "HOSTING",
                "product_reference": "business",
                "name": "Business Hosting",
                "quantity": 1,
                "meta_info": {"domain_name": domain_to_buy}
            }
        ],
        "billing_name": "Integration Tester",
        "billing_email": email,
        "billing_phone": "+91 99999 88888",
        "billing_address": "Tech Park, Bangalore"
    })
    assert order_res.status_code == 201
    order = order_res.json()
    order_id = order["id"]
    assert order["status"] == "PENDING"
    assert len(order["items"]) == 2

    # 5. Create Payment Intent
    intent_res = client.post("/api/v1/payments/create-intent", headers=headers, json={
        "order_id": order_id,
        "payment_method": "CREDIT_CARD"
    })
    assert intent_res.status_code == 200
    intent = intent_res.json()
    assert "client_token" in intent
    assert intent["transaction_id"].startswith("tx_mock_")

    # 6. Verify Payment (Triggers server-side verification, provisioning & invoice)
    verify_res = client.post("/api/v1/payments/verify", headers=headers, json={
        "order_id": order_id,
        "transaction_id": intent["transaction_id"],
        "client_token": intent["client_token"],
        "payment_method": "CREDIT_CARD"
    })
    assert verify_res.status_code == 200
    assert verify_res.json()["status"] == "PAID"

    # 7. Check Order Status is now ACTIVE
    order_check = client.get(f"/api/v1/orders/{order_id}", headers=headers)
    assert order_check.status_code == 200
    assert order_check.json()["status"] == "ACTIVE"

    # 8. Check Provisioned Domain in customer account
    domains_res = client.get("/api/v1/domains", headers=headers)
    assert domains_res.status_code == 200
    user_domains = domains_res.json()
    assert any(d["domain_name"] == domain_to_buy for d in user_domains)

    # 9. Check Provisioned Hosting Account in customer account
    hosting_res = client.get("/api/v1/hosting", headers=headers)
    assert hosting_res.status_code == 200
    user_hosting = hosting_res.json()
    assert any(h["domain_name"] == domain_to_buy for h in user_hosting)

    # 10. Check Generated Invoice
    inv_res = client.get("/api/v1/invoices", headers=headers)
    assert inv_res.status_code == 200
    invoices = inv_res.json()
    assert len(invoices) >= 1
    assert invoices[0]["status"] == "PAID"

    # 11. Support Ticket Flow
    ticket_res = client.post("/api/v1/support/tickets", headers=headers, json={
        "subject": "Question regarding SSL configuration",
        "category": "TECHNICAL",
        "priority": "MEDIUM",
        "message": "Hello, could you confirm if the wildcard SSL is active on my new domain?"
    })
    assert ticket_res.status_code == 201
    ticket = ticket_res.json()
    assert ticket["status"] == "OPEN"
    assert len(ticket["messages"]) == 1

    # 12. Add Reply to ticket
    msg_res = client.post(f"/api/v1/support/tickets/{ticket['id']}/messages", headers=headers, json={
        "message": "Following up with additional DNS info."
    })
    assert msg_res.status_code == 201

def test_admin_rbac_and_dashboard():
    # Login as seeded Admin
    admin_login = client.post("/api/v1/auth/login", json={
        "email": "admin@nexora.io",
        "password": "NexoraAdmin@2026!"
    })
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Fetch Admin Dashboard Stats (real DB numbers)
    stats_res = client.get("/api/v1/admin/dashboard/stats", headers=admin_headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_customers"] >= 1
    assert stats["total_orders"] >= 1
    assert stats["total_revenue"] >= 0
    assert stats["active_domains"] >= 1

    # Fetch Admin Customers
    cust_res = client.get("/api/v1/admin/customers", headers=admin_headers)
    assert cust_res.status_code == 200
    assert len(cust_res.json()) >= 1

    # Customer trying to access admin endpoint should receive 403
    cust_login = client.post("/api/v1/auth/login", json={
        "email": "customer@nexora.io",
        "password": "NexoraCustomer@2026!"
    })
    assert cust_login.status_code == 200
    cust_token = cust_login.json()["access_token"]
    cust_headers = {"Authorization": f"Bearer {cust_token}"}

    forbidden_res = client.get("/api/v1/admin/dashboard/stats", headers=cust_headers)
    assert forbidden_res.status_code == 403

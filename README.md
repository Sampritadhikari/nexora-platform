# NEXORA — Premium Domain & Web Hosting Platform (V1 SaaS)

> **"Domains. Hosting. Infrastructure. Simplified."**
> A production-style V1 SaaS platform engineered for domain registry, high-performance NVMe cloud hosting, automated provisioning, and customer lifecycle management. Designed with the aesthetic polish of Cloudflare, Vercel, Stripe, and Linear.

---

## 1. High-Level Architecture & Tech Stack

```
nexora-platform/
├── backend/                   # Independent FastAPI REST API
│   ├── app/
│   │   ├── api/v1/            # Auth, Domains, Hosting, Cart, Orders, Payments, Invoices, Renewals, Support, Admin
│   │   ├── core/              # Config (Pydantic), Security (PBKDF2/JWT), Database (PostgreSQL/SQLAlchemy)
│   │   ├── models/            # SQLAlchemy 2.0 Schema Models
│   │   ├── schemas/           # Pydantic Request & Response Validation
│   │   ├── providers/         # Domain, Hosting, Payment, Email Abstraction & Mock Providers
│   │   └── services/          # Provisioning, Invoice Generation, Renewal Reminders
│   ├── scripts/seed.py        # Database seeder (Admin, Customer, TLD rates, Hosting plans)
│   └── tests/test_api.py      # Automated business logic and RBAC test suite
├── frontend/                  # Next.js App Router with TypeScript & Tailwind CSS
│   ├── src/
│   │   ├── app/               # Public site, Customer Dashboard, Admin Console, Commerce routes
│   │   ├── components/        # Reusable design system, ThemeToggle, DomainSearchBar, HostingCard
│   │   ├── context/           # AuthContext (JWT/RBAC), CartContext (Server synced), ThemeContext (Light/Dark)
│   │   ├── config/brand.ts    # Centralized brand tokens & company metadata
│   │   └── lib/               # Typed API client with error handling & formatting utils
├── docker-compose.yml         # Containerization for PostgreSQL, FastAPI, and Next.js
└── README.md
```

### Core Technologies
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide Icons, Inter + Manrope typography.
- **Backend**: FastAPI (Python 3.14/3.11+), Pydantic v2, SQLAlchemy 2.0, Uvicorn, PyJWT.
- **Database**: PostgreSQL (with automatic graceful fallback to local SQLite for zero-friction local development).
- **Authentication**: Salted & Hashed Passwords via PBKDF2-HMAC-SHA256, Stateless JWT Access Tokens, Role-Based Access Control (`CUSTOMER`, `ADMIN`).

---

## 2. Default Seed Credentials

Run `python -m scripts.seed` inside `backend/` to seed initial accounts and catalogue:

| Role | Email | Password | Console Access |
|---|---|---|---|
| **Administrator** | `admin@nexora.io` | `NexoraAdmin@2026!` | Customer Dashboard + `/admin` Executive Console |
| **Customer Demo** | `customer@nexora.io` | `NexoraCustomer@2026!` | Customer Dashboard (`/dashboard`) |

---

## 3. Quickstart & Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m scripts.seed
uvicorn app.main:app --reload --port 8000
```
- Interactive API Documentation (Swagger UI): `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:3000` in your browser.

---

## 4. Key Business Logic & Provisioning Lifecycle

1. **Authoritative Server Pricing**:
   - The frontend never dictates pricing or totals.
   - The `/api/v1/cart/calculate` and `/api/v1/orders` endpoints strictly re-query database records (`tld_prices` and `hosting_plans`) and enforce an authoritative 18% GST tax rate.
2. **Order & Provisioning Lifecycle**:
   ```
   PENDING -> PAYMENT_CONFIRMED -> PROVISIONING -> ACTIVE (or PROVISIONING_FAILED)
   ```
   - When a payment intent is verified with server-side HMAC signatures, the order status transitions to `PAYMENT_CONFIRMED`.
   - The system automatically triggers `generate_invoice_for_order` (creating unique sequential invoice numbers like `NXR-2026-00001`).
   - The automated `provision_order` workflow registers the domain through the active `DomainProvider`, provisions the server container through the `HostingProvider`, creates active records in the database, sets up `RenewalRecord` entries, and marks the order as `ACTIVE`.
   - If a provider fails, the order status is safely preserved as `PROVISIONING_FAILED` and can be manually retried by an administrator in `/admin/orders`.

---

## 5. Provider Abstraction Architecture

Provider interfaces are completely decoupled using abstract base classes in `backend/app/providers/`:
- **DomainProvider** (`BaseDomainProvider`):
  - `check_availability(domain_name)`
  - `register_domain(domain_name, years, contact_info)`
  - `renew_domain(domain_name, years)`
  - `update_nameservers(domain_name, nameservers)`
  - `get_dns_records(domain_name)`
  - *Mock Implementation*: `MockDomainProvider` for local development. Swappable with Namecheap, ResellerClub, or OpenSRS by adding their API clients and setting `DOMAIN_PROVIDER=resellerclub` in `.env`.
- **HostingProvider** (`BaseHostingProvider`):
  - `create_account(username, domain, plan_slug, email)`
  - `suspend_account(username, reason)`
  - `terminate_account(username)`
  - `get_account_details(username)`
  - *Mock Implementation*: `MockHostingProvider` simulating cPanel/DirectAdmin/Kubernetes account allocation.
- **PaymentProvider** (`BasePaymentProvider`):
  - `create_payment(order_id, amount, currency, customer_info)`
  - `verify_payment(order_id, transaction_id, signature_or_token)`
  - `refund_payment(transaction_id, amount, reason)`
  - *Mock Implementation*: `MockPaymentProvider` utilizing HMAC-SHA256 server signatures. Swappable with Razorpay or Stripe without changing API or UI code.
- **EmailProvider** (`BaseEmailProvider`):
  - `send_email(to_email, subject, html, text)`
  - *Mock Implementation*: `MockEmailProvider` logging transactional notices, renewal reminders, and provisioning confirmations.

---

## 6. Testing

The backend includes a comprehensive automated test suite verifying auth, domain search, hosting plans, cart computation, order creation, payment verification, automated provisioning, and admin RBAC:

```bash
cd backend
pytest tests/ -v
```
All 6 integration test suites pass with 100% assertions.

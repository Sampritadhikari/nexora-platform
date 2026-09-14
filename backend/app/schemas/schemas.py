from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field

# --- Auth Schemas ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    phone: Optional[str] = None
    company: Optional[str] = None
    address: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    status: str
    phone: Optional[str] = None
    company: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    address: Optional[str] = None

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

# --- Domain Schemas ---
class DnsRecord(BaseModel):
    type: str  # A, CNAME, MX, TXT
    name: str
    value: str
    ttl: int = 3600

class NameserversUpdateRequest(BaseModel):
    nameservers: List[str] = Field(..., min_length=2, max_length=5)

class DomainAvailabilityItem(BaseModel):
    domain_name: str
    tld: str
    is_available: bool
    registration_price: float
    renewal_price: float
    currency: str = "INR"

class DomainSearchResponse(BaseModel):
    query: str
    results: List[DomainAvailabilityItem]

class DomainResponse(BaseModel):
    id: str
    domain_name: str
    tld: str
    status: str
    registration_date: datetime
    expiry_date: datetime
    auto_renew: bool
    nameservers: List[str]
    dns_records: Optional[List[Dict[str, Any]]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DomainRenewRequest(BaseModel):
    years: int = Field(1, ge=1, le=10)

# --- Hosting Schemas ---
class HostingPlanResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    price: float
    renewal_price: float
    billing_period: str
    storage: str
    bandwidth: str
    website_limit: int
    email_limit: int
    ssl_enabled: bool
    backup_enabled: bool
    is_popular: bool
    active: bool
    features: List[str]

    class Config:
        from_attributes = True

class HostingPlanCreate(BaseModel):
    name: str
    slug: str
    description: str
    price: float
    renewal_price: float
    billing_period: str = "YEARLY"
    storage: str
    bandwidth: str = "Unmetered"
    website_limit: int = 1
    email_limit: int = 5
    ssl_enabled: bool = True
    backup_enabled: bool = True
    is_popular: bool = False
    active: bool = True
    features: List[str] = []

class HostingPlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    renewal_price: Optional[float] = None
    storage: Optional[str] = None
    bandwidth: Optional[str] = None
    website_limit: Optional[int] = None
    email_limit: Optional[int] = None
    ssl_enabled: Optional[bool] = None
    backup_enabled: Optional[bool] = None
    is_popular: Optional[bool] = None
    active: Optional[bool] = None
    features: Optional[List[str]] = None

class HostingAccountResponse(BaseModel):
    id: str
    hosting_plan_id: str
    domain_name: str
    status: str
    start_date: datetime
    expiry_date: datetime
    cpanel_username: Optional[str] = None
    server_hostname: str
    server_ip: str
    plan: Optional[HostingPlanResponse] = None

    class Config:
        from_attributes = True

# --- Cart & Commerce Schemas ---
class CartItem(BaseModel):
    product_type: str  # DOMAIN, HOSTING
    product_reference: str  # e.g., "mycompany.com" or plan slug "starter"
    name: str
    quantity: int = 1
    meta_info: Optional[Dict[str, Any]] = None

class CartValidateRequest(BaseModel):
    items: List[CartItem]

class ComputedCartItem(BaseModel):
    product_type: str
    product_reference: str
    name: str
    quantity: int
    unit_price: float
    total: float
    meta_info: Dict[str, Any] = {}

class CartCalculationResponse(BaseModel):
    items: List[ComputedCartItem]
    subtotal: float
    tax: float
    tax_rate: float
    total: float
    currency: str

# --- Order Schemas ---
class OrderItemResponse(BaseModel):
    id: str
    product_type: str
    product_reference: str
    name: str
    quantity: int
    unit_price: float
    total: float

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: str
    order_number: str
    subtotal: float
    tax: float
    total: float
    currency: str
    status: str
    created_at: datetime
    items: List[OrderItemResponse]
    provisioning_notes: Optional[str] = None

    class Config:
        from_attributes = True

class CheckoutRequest(BaseModel):
    items: List[CartItem]
    billing_name: str
    billing_email: EmailStr
    billing_phone: Optional[str] = None
    billing_address: Optional[str] = None

# --- Payment Schemas ---
class PaymentCreateIntentRequest(BaseModel):
    order_id: str
    payment_method: str = "CREDIT_CARD"

class PaymentCreateIntentResponse(BaseModel):
    order_id: str
    order_number: str
    amount: float
    currency: str
    provider: str
    transaction_id: str
    client_token: str
    key_id: Optional[str] = None
    notes: str

class PaymentVerifyRequest(BaseModel):
    order_id: str
    transaction_id: str
    client_token: str
    payment_method: str = "CREDIT_CARD"

class PaymentResponse(BaseModel):
    id: str
    order_id: str
    provider: str
    transaction_id: str
    amount: float
    currency: str
    status: str
    payment_method: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Invoice Schemas ---
class InvoiceResponse(BaseModel):
    id: str
    order_id: str
    invoice_number: str
    amount: float
    tax: float
    total: float
    status: str
    issued_at: datetime
    order: Optional[OrderResponse] = None

    class Config:
        from_attributes = True

# --- Support Ticket Schemas ---
class SupportMessageResponse(BaseModel):
    id: str
    ticket_id: str
    user_id: str
    sender_role: str
    sender_name: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

class SupportMessageCreate(BaseModel):
    message: str = Field(..., min_length=2)

class SupportTicketCreate(BaseModel):
    subject: str = Field(..., min_length=4, max_length=200)
    category: str = "TECHNICAL"
    priority: str = "MEDIUM"
    message: str = Field(..., min_length=10)

class SupportTicketResponse(BaseModel):
    id: str
    ticket_number: str
    subject: str
    category: str
    priority: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SupportTicketDetailResponse(SupportTicketResponse):
    messages: List[SupportMessageResponse] = []

# --- Renewal Schemas ---
class RenewalRecordResponse(BaseModel):
    id: str
    resource_type: str
    resource_id: str
    resource_name: str
    expiry_date: datetime
    renewal_price: float
    auto_renew: bool
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class RenewalToggleAutoRenew(BaseModel):
    auto_renew: bool

# --- TLD Price Schemas ---
class TldPriceResponse(BaseModel):
    id: str
    tld: str
    registration_price: float
    renewal_price: float
    transfer_price: float
    is_popular: bool
    active: bool

    class Config:
        from_attributes = True

class TldPriceCreate(BaseModel):
    tld: str
    registration_price: float
    renewal_price: float
    transfer_price: float
    is_popular: bool = False
    active: bool = True

class TldPriceUpdate(BaseModel):
    registration_price: Optional[float] = None
    renewal_price: Optional[float] = None
    transfer_price: Optional[float] = None
    is_popular: Optional[bool] = None
    active: Optional[bool] = None

# --- Admin Dashboard Stats ---
class AdminDashboardStats(BaseModel):
    total_customers: int
    active_domains: int
    active_hosting: int
    total_orders: int
    total_revenue: float
    pending_payments: int
    open_tickets: int
    upcoming_renewals_30_days: int

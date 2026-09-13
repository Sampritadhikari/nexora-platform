import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON, Enum
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="CUSTOMER", nullable=False)  # CUSTOMER, ADMIN
    status = Column(String(20), default="ACTIVE", nullable=False)  # ACTIVE, SUSPENDED
    phone = Column(String(30), nullable=True)
    company = Column(String(120), nullable=True)
    address = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    # Relationships
    domains = relationship("Domain", back_populates="user", cascade="all, delete-orphan")
    hosting_accounts = relationship("HostingAccount", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="user", cascade="all, delete-orphan")
    tickets = relationship("SupportTicket", back_populates="user", cascade="all, delete-orphan")
    renewals = relationship("RenewalRecord", back_populates="user", cascade="all, delete-orphan")


class Domain(Base):
    __tablename__ = "domains"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    domain_name = Column(String(255), unique=True, index=True, nullable=False)
    tld = Column(String(30), nullable=False, index=True)
    status = Column(String(30), default="ACTIVE", nullable=False)  # ACTIVE, PENDING, EXPIRED
    registration_date = Column(DateTime, default=utcnow, nullable=False)
    expiry_date = Column(DateTime, nullable=False, index=True)
    auto_renew = Column(Boolean, default=True, nullable=False)
    provider_reference = Column(String(100), nullable=True)
    nameservers = Column(JSON, default=lambda: ["ns1.nexoradns.com", "ns2.nexoradns.com"])
    dns_records = Column(JSON, default=list)
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    user = relationship("User", back_populates="domains")
    hosting_accounts = relationship("HostingAccount", back_populates="domain")


class HostingPlan(Base):
    __tablename__ = "hosting_plans"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)  # Annual registration price
    renewal_price = Column(Float, nullable=False)
    billing_period = Column(String(20), default="YEARLY", nullable=False)  # YEARLY, MONTHLY
    storage = Column(String(50), nullable=False)  # e.g., "10 GB NVMe"
    bandwidth = Column(String(50), default="Unmetered", nullable=False)
    website_limit = Column(Integer, default=1, nullable=False)
    email_limit = Column(Integer, default=5, nullable=False)
    ssl_enabled = Column(Boolean, default=True, nullable=False)
    backup_enabled = Column(Boolean, default=True, nullable=False)
    is_popular = Column(Boolean, default=False, nullable=False)
    active = Column(Boolean, default=True, nullable=False)
    features = Column(JSON, default=list)
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    accounts = relationship("HostingAccount", back_populates="plan")


class HostingAccount(Base):
    __tablename__ = "hosting_accounts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    hosting_plan_id = Column(String(36), ForeignKey("hosting_plans.id"), nullable=False)
    domain_id = Column(String(36), ForeignKey("domains.id", ondelete="SET NULL"), nullable=True)
    domain_name = Column(String(255), nullable=False)
    status = Column(String(30), default="ACTIVE", nullable=False)  # ACTIVE, PENDING, SUSPENDED, TERMINATED
    start_date = Column(DateTime, default=utcnow, nullable=False)
    expiry_date = Column(DateTime, nullable=False, index=True)
    provider_reference = Column(String(100), nullable=True)
    cpanel_username = Column(String(50), nullable=True)
    server_hostname = Column(String(100), default="srv1.nexora.internal")
    server_ip = Column(String(50), default="192.0.2.100")
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    user = relationship("User", back_populates="hosting_accounts")
    plan = relationship("HostingPlan", back_populates="accounts")
    domain = relationship("Domain", back_populates="hosting_accounts")


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    subtotal = Column(Float, nullable=False)
    tax = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    currency = Column(String(10), default="INR", nullable=False)
    status = Column(String(30), default="PENDING", nullable=False)  # PENDING, PAYMENT_CONFIRMED, PROVISIONING, ACTIVE, PROVISIONING_FAILED, CANCELLED
    provisioning_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="order", uselist=False)
    invoice = relationship("Invoice", back_populates="order", uselist=False)


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_type = Column(String(30), nullable=False)  # DOMAIN, HOSTING, RENEWAL
    product_reference = Column(String(100), nullable=False)  # Domain name or Plan slug
    name = Column(String(200), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    unit_price = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    meta_info = Column(JSON, default=dict)

    order = relationship("Order", back_populates="items")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), unique=True, nullable=False)
    provider = Column(String(50), default="mock", nullable=False)
    transaction_id = Column(String(100), unique=True, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR", nullable=False)
    status = Column(String(30), default="PENDING", nullable=False)  # PENDING, PROCESSING, PAID, FAILED, REFUNDED
    payment_method = Column(String(50), default="CREDIT_CARD", nullable=False)
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    order = relationship("Order", back_populates="payment")


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), unique=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    invoice_number = Column(String(50), unique=True, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    tax = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    status = Column(String(30), default="PAID", nullable=False)  # PAID, PENDING, CANCELLED
    issued_at = Column(DateTime, default=utcnow, nullable=False)

    order = relationship("Order", back_populates="invoice")
    user = relationship("User", back_populates="invoices")


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    ticket_number = Column(String(30), unique=True, index=True, nullable=False)
    subject = Column(String(200), nullable=False)
    category = Column(String(50), default="TECHNICAL", nullable=False)  # TECHNICAL, BILLING, DOMAIN, HOSTING, SALES
    priority = Column(String(20), default="MEDIUM", nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String(30), default="OPEN", nullable=False)  # OPEN, IN_PROGRESS, WAITING_FOR_CUSTOMER, RESOLVED, CLOSED
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    user = relationship("User", back_populates="tickets")
    messages = relationship("SupportMessage", back_populates="ticket", cascade="all, delete-orphan")


class SupportMessage(Base):
    __tablename__ = "support_messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_id = Column(String(36), ForeignKey("support_tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    sender_role = Column(String(20), default="CUSTOMER", nullable=False)  # CUSTOMER, ADMIN, SYSTEM
    sender_name = Column(String(120), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utcnow, nullable=False)

    ticket = relationship("SupportTicket", back_populates="messages")


class RenewalRecord(Base):
    __tablename__ = "renewal_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resource_type = Column(String(30), nullable=False)  # DOMAIN, HOSTING
    resource_id = Column(String(36), nullable=False, index=True)
    resource_name = Column(String(255), nullable=False)
    expiry_date = Column(DateTime, nullable=False, index=True)
    renewal_price = Column(Float, nullable=False)
    auto_renew = Column(Boolean, default=True, nullable=False)
    status = Column(String(30), default="UPCOMING", nullable=False)  # UPCOMING, RENEWED, EXPIRED, CANCELLED
    reminders_sent = Column(JSON, default=list)  # ["30_DAYS", "15_DAYS", etc.]
    created_at = Column(DateTime, default=utcnow, nullable=False)

    user = relationship("User", back_populates="renewals")


class TldPrice(Base):
    __tablename__ = "tld_prices"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tld = Column(String(30), unique=True, index=True, nullable=False)  # e.g., ".com", ".in"
    registration_price = Column(Float, nullable=False)
    renewal_price = Column(Float, nullable=False)
    transfer_price = Column(Float, nullable=False)
    is_popular = Column(Boolean, default=False, nullable=False)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)

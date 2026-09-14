from app.core.config import settings
from app.providers.domain.base import BaseDomainProvider
from app.providers.domain.mock import MockDomainProvider
from app.providers.hosting.base import BaseHostingProvider
from app.providers.hosting.mock import MockHostingProvider
from app.providers.payment.mock import MockPaymentProvider
from app.providers.payment.razorpay import RazorpayPaymentProvider
from app.providers.email.base import BaseEmailProvider
from app.providers.email.mock import MockEmailProvider

def get_domain_provider() -> BaseDomainProvider:
    return MockDomainProvider()

def get_hosting_provider() -> BaseHostingProvider:
    return MockHostingProvider()

def get_payment_provider() -> BasePaymentProvider:
    if settings.PAYMENT_PROVIDER.lower() == "razorpay":
        return RazorpayPaymentProvider()
    return RazorpayPaymentProvider()  # Default to Razorpay provider

def get_email_provider() -> BaseEmailProvider:
    # Later, add SendGridEmailProvider, SmtpEmailProvider
    return MockEmailProvider()

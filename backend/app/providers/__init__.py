from app.core.config import settings
from app.providers.domain.base import BaseDomainProvider
from app.providers.domain.mock import MockDomainProvider
from app.providers.hosting.base import BaseHostingProvider
from app.providers.hosting.mock import MockHostingProvider
from app.providers.payment.base import BasePaymentProvider
from app.providers.payment.mock import MockPaymentProvider
from app.providers.email.base import BaseEmailProvider
from app.providers.email.mock import MockEmailProvider

def get_domain_provider() -> BaseDomainProvider:
    # Later, add real providers such as NamecheapDomainProvider, ResellerClubProvider
    return MockDomainProvider()

def get_hosting_provider() -> BaseHostingProvider:
    # Later, add cPanelHostingProvider, PleskHostingProvider
    return MockHostingProvider()

def get_payment_provider() -> BasePaymentProvider:
    # Later, add RazorpayPaymentProvider, StripePaymentProvider
    return MockPaymentProvider()

def get_email_provider() -> BaseEmailProvider:
    # Later, add SendGridEmailProvider, SmtpEmailProvider
    return MockEmailProvider()

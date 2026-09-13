from abc import ABC, abstractmethod
from typing import Dict, Any

class BasePaymentProvider(ABC):
    @abstractmethod
    def create_payment(self, order_id: str, amount: float, currency: str, customer_info: Dict[str, Any]) -> Dict[str, Any]:
        """Create payment order/session with gateway."""
        pass

    @abstractmethod
    def verify_payment(self, order_id: str, transaction_id: str, signature_or_token: str) -> Dict[str, Any]:
        """Server-side verification of payment completion."""
        pass

    @abstractmethod
    def refund_payment(self, transaction_id: str, amount: float, reason: str) -> Dict[str, Any]:
        """Process a payment refund."""
        pass

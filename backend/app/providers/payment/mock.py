import hmac
import hashlib
import uuid
from typing import Dict, Any
from app.core.config import settings
from app.providers.payment.base import BasePaymentProvider

class MockPaymentProvider(BasePaymentProvider):
    def _generate_signature(self, order_id: str, tx_id: str) -> str:
        key = settings.JWT_SECRET.encode('utf-8')
        msg = f"{order_id}:{tx_id}:MOCK_SUCCESS".encode('utf-8')
        return hmac.new(key, msg, hashlib.sha256).hexdigest()

    def create_payment(self, order_id: str, amount: float, currency: str, customer_info: Dict[str, Any]) -> Dict[str, Any]:
        tx_id = f"tx_mock_{uuid.uuid4().hex[:12]}"
        client_token = self._generate_signature(order_id, tx_id)
        return {
            "success": True,
            "order_id": order_id,
            "transaction_id": tx_id,
            "client_token": client_token,
            "amount": amount,
            "currency": currency,
            "provider": "mock",
            "notes": "Development Mock Payment Gateway Session"
        }

    def verify_payment(self, order_id: str, transaction_id: str, signature_or_token: str) -> Dict[str, Any]:
        expected = self._generate_signature(order_id, transaction_id)
        # Server-side verification
        is_valid = hmac.compare_digest(expected, signature_or_token)
        if is_valid:
            return {
                "verified": True,
                "status": "PAID",
                "transaction_id": transaction_id,
                "order_id": order_id,
                "message": "Payment verified successfully by server."
            }
        return {
            "verified": False,
            "status": "FAILED",
            "transaction_id": transaction_id,
            "order_id": order_id,
            "message": "Invalid payment verification signature."
        }

    def refund_payment(self, transaction_id: str, amount: float, reason: str) -> Dict[str, Any]:
        refund_id = f"ref_{uuid.uuid4().hex[:10]}"
        return {
            "success": True,
            "refund_id": refund_id,
            "transaction_id": transaction_id,
            "amount": amount,
            "status": "REFUNDED",
            "reason": reason
        }

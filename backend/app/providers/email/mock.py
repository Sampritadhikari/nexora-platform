import logging
from typing import Dict, Any, Optional
from app.providers.email.base import BaseEmailProvider

logger = logging.getLogger("nexora.email")

class MockEmailProvider(BaseEmailProvider):
    def send_email(self, to_email: str, subject: str, body_html: str, body_text: Optional[str] = None) -> Dict[str, Any]:
        logger.info(f"[MOCK EMAIL DISPATCHED] To: {to_email} | Subject: {subject}")
        return {
            "success": True,
            "to": to_email,
            "subject": subject,
            "provider": "MockEmailProvider",
            "message": "Email logged and dispatched to mock inbox."
        }

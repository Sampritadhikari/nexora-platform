from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional

class BaseEmailProvider(ABC):
    @abstractmethod
    def send_email(self, to_email: str, subject: str, body_html: str, body_text: Optional[str] = None) -> Dict[str, Any]:
        """Send a transactional email."""
        pass

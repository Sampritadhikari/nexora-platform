from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseHostingProvider(ABC):
    @abstractmethod
    def create_account(self, username: str, domain_name: str, plan_slug: str, contact_email: str) -> Dict[str, Any]:
        """Provision a new hosting account (cPanel/DirectAdmin/Cloud)."""
        pass

    @abstractmethod
    def suspend_account(self, username: str, reason: str) -> Dict[str, Any]:
        """Suspend a hosting account."""
        pass

    @abstractmethod
    def unsuspend_account(self, username: str) -> Dict[str, Any]:
        """Unsuspend an account."""
        pass

    @abstractmethod
    def terminate_account(self, username: str) -> Dict[str, Any]:
        """Terminate a hosting account."""
        pass

    @abstractmethod
    def get_account_details(self, username: str) -> Dict[str, Any]:
        """Fetch account disk, bandwidth, and resource telemetry."""
        pass

    @abstractmethod
    def change_password(self, username: str, new_password: str) -> Dict[str, Any]:
        """Change hosting account control panel password."""
        pass

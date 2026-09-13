import uuid
import secrets
from typing import Dict, Any
from app.providers.hosting.base import BaseHostingProvider

class MockHostingProvider(BaseHostingProvider):
    def create_account(self, username: str, domain_name: str, plan_slug: str, contact_email: str) -> Dict[str, Any]:
        ref = f"CPANEL-{uuid.uuid4().hex[:8].upper()}"
        temp_pwd = f"Nxr_{secrets.token_urlsafe(8)}!"
        return {
            "success": True,
            "provider_reference": ref,
            "username": username,
            "domain_name": domain_name,
            "server_hostname": "cpanel1.nexoracloud.net",
            "server_ip": "103.14.120.45",
            "cpanel_url": "https://cpanel1.nexoracloud.net:2083",
            "nameservers": ["ns1.nexoradns.com", "ns2.nexoradns.com"],
            "temp_password": temp_pwd,
            "status": "ACTIVE"
        }

    def suspend_account(self, username: str, reason: str) -> Dict[str, Any]:
        return {
            "success": True,
            "username": username,
            "status": "SUSPENDED",
            "reason": reason
        }

    def unsuspend_account(self, username: str) -> Dict[str, Any]:
        return {
            "success": True,
            "username": username,
            "status": "ACTIVE"
        }

    def terminate_account(self, username: str) -> Dict[str, Any]:
        return {
            "success": True,
            "username": username,
            "status": "TERMINATED"
        }

    def get_account_details(self, username: str) -> Dict[str, Any]:
        return {
            "username": username,
            "disk_used_mb": 1420,
            "disk_total_mb": 10240,
            "bandwidth_used_gb": 12.4,
            "bandwidth_total_gb": 100,
            "php_version": "8.3",
            "status": "ACTIVE"
        }

    def change_password(self, username: str, new_password: str) -> Dict[str, Any]:
        return {
            "success": True,
            "username": username,
            "message": "Control panel password updated successfully."
        }

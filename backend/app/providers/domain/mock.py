import uuid
from typing import Dict, Any, List
from app.providers.domain.base import BaseDomainProvider

# Domains deterministically simulated as taken
RESERVED_TAKEN_DOMAINS = {
    "google.com", "apple.com", "microsoft.com", "amazon.com", "facebook.com",
    "nexora.com", "stripe.com", "cloudflare.com", "vercel.com", "linear.app",
    "github.com", "openai.com", "netflix.com", "gov.in", "nic.in"
}

class MockDomainProvider(BaseDomainProvider):
    def check_availability(self, domain_name: str) -> Dict[str, Any]:
        domain_clean = domain_name.lower().strip()
        is_available = domain_clean not in RESERVED_TAKEN_DOMAINS
        return {
            "domain_name": domain_clean,
            "is_available": is_available,
            "status": "AVAILABLE" if is_available else "UNAVAILABLE",
            "provider": "MockDomainRegistrar"
        }

    def register_domain(self, domain_name: str, years: int, contact_info: Dict[str, Any]) -> Dict[str, Any]:
        ref = f"MOCK-REG-{uuid.uuid4().hex[:10].upper()}"
        return {
            "success": True,
            "domain_name": domain_name.lower().strip(),
            "provider_reference": ref,
            "years": years,
            "nameservers": ["ns1.nexoradns.com", "ns2.nexoradns.com"],
            "status": "ACTIVE"
        }

    def renew_domain(self, domain_name: str, years: int) -> Dict[str, Any]:
        ref = f"MOCK-REN-{uuid.uuid4().hex[:10].upper()}"
        return {
            "success": True,
            "domain_name": domain_name.lower().strip(),
            "provider_reference": ref,
            "years_added": years,
            "status": "ACTIVE"
        }

    def get_domain_details(self, domain_name: str) -> Dict[str, Any]:
        return {
            "domain_name": domain_name,
            "status": "ACTIVE",
            "nameservers": ["ns1.nexoradns.com", "ns2.nexoradns.com"],
            "whois_privacy": True,
            "registrar": "Nexora Registry Services"
        }

    def update_nameservers(self, domain_name: str, nameservers: List[str]) -> Dict[str, Any]:
        return {
            "success": True,
            "domain_name": domain_name,
            "nameservers": nameservers,
            "message": "Authoritative nameservers updated successfully."
        }

    def get_dns_records(self, domain_name: str) -> List[Dict[str, Any]]:
        return [
            {"type": "A", "name": "@", "value": "192.0.2.1", "ttl": 3600},
            {"type": "CNAME", "name": "www", "value": f"{domain_name}.", "ttl": 3600},
            {"type": "MX", "name": "@", "value": f"mail.{domain_name}.", "ttl": 3600, "priority": 10},
            {"type": "TXT", "name": "@", "value": "v=spf1 include:spf.nexora.com ~all", "ttl": 3600},
        ]

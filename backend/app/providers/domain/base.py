from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseDomainProvider(ABC):
    @abstractmethod
    def check_availability(self, domain_name: str) -> Dict[str, Any]:
        """Check availability of a specific domain name."""
        pass

    @abstractmethod
    def register_domain(self, domain_name: str, years: int, contact_info: Dict[str, Any]) -> Dict[str, Any]:
        """Register a new domain name."""
        pass

    @abstractmethod
    def renew_domain(self, domain_name: str, years: int) -> Dict[str, Any]:
        """Renew an existing domain name."""
        pass

    @abstractmethod
    def get_domain_details(self, domain_name: str) -> Dict[str, Any]:
        """Retrieve domain status, nameservers, and whois data."""
        pass

    @abstractmethod
    def update_nameservers(self, domain_name: str, nameservers: List[str]) -> Dict[str, Any]:
        """Update authoritative nameservers for a domain."""
        pass

    @abstractmethod
    def get_dns_records(self, domain_name: str) -> List[Dict[str, Any]]:
        """Retrieve DNS zone records."""
        pass

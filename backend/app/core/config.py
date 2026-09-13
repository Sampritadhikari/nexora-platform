import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "Nexora Platform API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    APP_ENV: str = "development"
    
    # Security
    JWT_SECRET: str = "nexora_super_secret_jwt_key_development_only_change_in_production_2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    # Primary is PostgreSQL. If PostgreSQL is unreachable in dev, database.py will gracefully handle SQLite fallback.
    DATABASE_URL: str = Field(
        default="postgresql+psycopg://postgres:postgres@localhost:5432/nexora",
        description="PostgreSQL or SQLite database connection string"
    )
    SQLITE_FALLBACK_URL: str = "sqlite:///./nexora.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]
    
    # Providers Mode (development uses mock providers)
    DOMAIN_PROVIDER: str = "mock"
    HOSTING_PROVIDER: str = "mock"
    PAYMENT_PROVIDER: str = "mock"
    EMAIL_PROVIDER: str = "mock"
    
    # Real Provider credentials placeholders (configured via .env in production)
    DOMAIN_PROVIDER_API_KEY: Optional[str] = None
    DOMAIN_PROVIDER_API_SECRET: Optional[str] = None
    HOSTING_PROVIDER_API_KEY: Optional[str] = None
    HOSTING_PROVIDER_API_SECRET: Optional[str] = None
    PAYMENT_PROVIDER_KEY_ID: Optional[str] = None
    PAYMENT_PROVIDER_KEY_SECRET: Optional[str] = None
    EMAIL_PROVIDER_API_KEY: Optional[str] = None
    
    # Currency & Tax
    DEFAULT_CURRENCY: str = "INR"
    TAX_RATE_PERCENT: float = 18.0  # e.g., 18% GST

    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
        "extra": "ignore"
    }

settings = Settings()

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import Base, engine
# Import all models to ensure metadata registration
from app.models import *

# Routers
from app.api.v1.auth import router as auth_router
from app.api.v1.domains import router as domains_router
from app.api.v1.hosting import router as hosting_router
from app.api.v1.cart import router as cart_router
from app.api.v1.orders import router as orders_router
from app.api.v1.payments import router as payments_router
from app.api.v1.invoices import router as invoices_router
from app.api.v1.renewals import router as renewals_router
from app.api.v1.support import router as support_router

# Admin Routers
from app.api.v1.admin.dashboard import router as admin_dashboard_router
from app.api.v1.admin.customers import router as admin_customers_router
from app.api.v1.admin.orders import router as admin_orders_router
from app.api.v1.admin.products import router as admin_products_router
from app.api.v1.admin.support import router as admin_support_router
from app.api.v1.admin.system import router as admin_system_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("nexora.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database schema tables exist
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database initialized successfully.")
    yield
    # Shutdown: Clean up connections
    logger.info("Shutting down Nexora API.")

app = FastAPI(
    title="Nexora Cloud Infrastructure API",
    description="Mission-critical REST API powering Nexora Domains, High-Performance Hosting, and Infrastructure Orchestration.",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Response Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Global Exception Handler for safe error sanitization
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled server error at {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Our engineering team has been notified."}
    )

# Register API v1 Routers
api_prefix = settings.API_V1_STR
app.include_router(auth_router, prefix=api_prefix)
app.include_router(domains_router, prefix=api_prefix)
app.include_router(hosting_router, prefix=api_prefix)
app.include_router(cart_router, prefix=api_prefix)
app.include_router(orders_router, prefix=api_prefix)
app.include_router(payments_router, prefix=api_prefix)
app.include_router(invoices_router, prefix=api_prefix)
app.include_router(renewals_router, prefix=api_prefix)
app.include_router(support_router, prefix=api_prefix)

# Register Admin Routers
app.include_router(admin_dashboard_router, prefix=api_prefix)
app.include_router(admin_customers_router, prefix=api_prefix)
app.include_router(admin_orders_router, prefix=api_prefix)
app.include_router(admin_products_router, prefix=api_prefix)
app.include_router(admin_support_router, prefix=api_prefix)
app.include_router(admin_system_router, prefix=api_prefix)

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "Nexora API",
        "version": settings.VERSION,
        "environment": settings.APP_ENV
    }

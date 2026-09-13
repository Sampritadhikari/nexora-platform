import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

logger = logging.getLogger("nexora.database")

Base = declarative_base()

def get_engine():
    db_url = settings.DATABASE_URL
    try:
        if db_url.startswith("postgresql"):
            # Attempt to connect to PostgreSQL with a short connect_timeout
            engine = create_engine(
                db_url,
                pool_pre_ping=True,
                connect_args={"connect_timeout": 3} if "psycopg" in db_url else {}
            )
            # Test connection
            with engine.connect() as conn:
                logger.info("Successfully connected to primary PostgreSQL database.")
                return engine
        else:
            return create_engine(
                db_url,
                connect_args={"check_same_thread": False} if "sqlite" in db_url else {}
            )
    except Exception as e:
        logger.warning(
            f"Could not connect to PostgreSQL at {db_url} ({e}). "
            f"Falling back gracefully to local development SQLite database: {settings.SQLITE_FALLBACK_URL}"
        )
        return create_engine(
            settings.SQLITE_FALLBACK_URL,
            connect_args={"check_same_thread": False}
        )

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

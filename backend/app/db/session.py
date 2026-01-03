from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.core.config import settings

# ----------------------------------
# Engine
# ----------------------------------
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    connect_args={"check_same_thread": False}
    if settings.DATABASE_URL.startswith("sqlite")
    else {},
)

# ----------------------------------
# Session factory
# ----------------------------------
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=Session,
    future=True,
)

# ----------------------------------
# Dependency (FastAPI)
# ----------------------------------
def get_db() -> Session:
    """
    Fornece uma sessão de banco de dados por request
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

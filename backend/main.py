from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import register_exception_handlers

from app.api.routes import (
    auth,
    users,
    dashboard,
    payments,
    communication,
    segmentation,
)
from app.api.routes import base_v2 as base

from app.api.middlewares.logging import LoggingMiddleware
from app.api.middlewares.rate_limit import RateLimitMiddleware

# 🔹 IMPORTS DO BANCO
from app.db.base import Base
from app.db.session import engine

# 🔹 IMPORTAR MODELS (OBRIGATÓRIO)
from app.models import User  # noqa: F401
from app.models.importacao_log import ImportacaoLog  # noqa: F401

# -------------------------------------------------
# Inicialização da aplicação
# -------------------------------------------------
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API Backend do Sistema",
    debug=settings.DEBUG
)

# -------------------------------------------------
# Evento de startup → cria tabelas
# -------------------------------------------------
@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)

# -------------------------------------------------
# Middlewares
# -------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)

if settings.ENABLE_RATE_LIMIT:
    app.add_middleware(RateLimitMiddleware)

# -------------------------------------------------
# Handlers de exceção
# -------------------------------------------------
register_exception_handlers(app)

# -------------------------------------------------
# Rotas
# -------------------------------------------------
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(payments.router, prefix="/payments", tags=["Payments"])
app.include_router(communication.router, prefix="/communication", tags=["Communication"])
app.include_router(segmentation.router, prefix="/segmentation", tags=["Segmentation"])
app.include_router(base.router, prefix="/base", tags=["Base Upload"])

# -------------------------------------------------
# Health check
# -------------------------------------------------
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }

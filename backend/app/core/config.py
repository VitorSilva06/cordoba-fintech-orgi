from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    # ----------------------------------
    # Aplicação
    # ----------------------------------
    APP_NAME: str = "Backend API"
    DEBUG: bool = False
    APP_VERSION: str = "0.1.0"

    # ----------------------------------
    # Segurança
    # ----------------------------------
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # ----------------------------------
    # Banco de Dados
    # ----------------------------------
    DATABASE_URL: str

    # ----------------------------------
    # CORS
    # ----------------------------------
    CORS_ORIGINS: List[str] = ["*"]

    # ----------------------------------
    # Rate limit
    # ----------------------------------
    ENABLE_RATE_LIMIT: bool = False
    RATE_LIMIT_PER_MINUTE: int = 60

    # ----------------------------------
    # Integrações externas
    # ----------------------------------
    WHATSAPP_API_URL: str | None = None
    WHATSAPP_API_TOKEN: str | None = None

    PAYMENT_GATEWAY_URL: str | None = None
    PAYMENT_GATEWAY_TOKEN: str | None = None

    # ----------------------------------
    # Uploads
    # ----------------------------------
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 10

    # PYDANTIC V2
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow",
    )


settings = Settings()

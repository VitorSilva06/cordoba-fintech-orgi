from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # ----------------------------------
    # App / Server
    # ----------------------------------
    APP_NAME: str = "Cordoba Fintech API"
    APP_VERSION: str = "1.0.0"
    ENV: str = "development"
    DEBUG: bool = False

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # ----------------------------------
    # Segurança / Auth
    # ----------------------------------
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # ----------------------------------
    # Banco de dados
    # ----------------------------------
    DATABASE_URL: str

    # ----------------------------------
    # CORS
    # ----------------------------------
    CORS_ORIGINS: List[str] = []

    # ----------------------------------
    # Rate limit
    # ----------------------------------
    ENABLE_RATE_LIMIT: bool = False
    RATE_LIMIT_PER_MINUTE: int = 60

    # ----------------------------------
    # Uploads
    # ----------------------------------
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 10

    # ----------------------------------
    # Logging
    # ----------------------------------
    LOG_LEVEL: str = "INFO"
    LOG_DIR: str = "logs"

    # ----------------------------------
    # Feature flags
    # ----------------------------------
    ENABLE_DOCS: bool = True
    ENABLE_TESTS: bool = False

    # ----------------------------------
    # Integrações
    # ----------------------------------
    WHATSAPP_API_KEY: str | None = None
    VOICE_API_KEY: str | None = None
    SMS_API_KEY: str | None = None

    PAYMENT_GATEWAY_API_KEY: str | None = None
    PAYMENT_GATEWAY_URL: str | None = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "forbid"  # mantém segurança


settings = Settings()

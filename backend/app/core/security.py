from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Dict

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import settings

# ----------------------------------
# Configuração de hash de senha
# ----------------------------------
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

# ----------------------------------
# Validação de senha
# ----------------------------------
def validate_password_bytes(password: str) -> None:
    if len(password.encode("utf-8")) > 72:
        raise ValueError("A senha não pode exceder 72 bytes")


# ----------------------------------
# JWT
# ----------------------------------
def create_access_token(
    subject: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    now = datetime.now(tz=timezone.utc)

    expire = (
        now + expires_delta
        if expires_delta
        else now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode: Dict[str, Any] = {
        "sub": subject,
        "iat": now,
        "exp": expire,
    }

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        return jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
    except JWTError:
        return None


# ----------------------------------
# Senhas
# ----------------------------------
def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    validate_password_bytes(password)
    return pwd_context.hash(password)

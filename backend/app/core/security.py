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
# JWT
# ----------------------------------
def create_access_token(
    subject: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Cria um JWT access token

    :param subject: Identificador do usuário (user.id)
    :param expires_delta: Tempo de expiração opcional
    :return: JWT token
    """
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
    """
    Decodifica e valida um JWT

    :param token: JWT recebido
    :return: Payload do token ou None se inválido
    """
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
    """
    Verifica se a senha em texto corresponde ao hash armazenado
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Gera hash seguro da senha
    """
    return pwd_context.hash(password)

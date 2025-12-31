from datetime import datetime, timedelta
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
    now = datetime.utcnow()

    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
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


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodifica e valida um JWT

    :param token: JWT recebido
    :return: Payload do token ou None se inválido
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return payload
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
    Verifica se a senha em texto corresponde ao hash
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Gera hash seguro da senha
    """
    return pwd_context.hash(password)
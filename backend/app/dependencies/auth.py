from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.core.exceptions import UnauthorizedException
from app.db.session import get_db
from app.repositories.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    payload = decode_access_token(token)

    if not payload or "sub" not in payload:
        raise UnauthorizedException("Token inválido")

    user_id = int(payload["sub"])

    user = UserRepository(db).get_by_id(user_id)

    if not user or not user.is_active:
        raise UnauthorizedException("Usuário não autorizado")

    return user

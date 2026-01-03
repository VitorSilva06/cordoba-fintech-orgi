from datetime import timedelta

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_access_token,
    verify_password,
)
from app.core.exceptions import UnauthorizedException
from app.schemas.auth import Token
from app.schemas.user import UserResponse
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.db.session import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Autenticação básica (email + password).
    Retorna JWT.
    """

    password = form_data.password

    # 🔐 Proteção obrigatória do bcrypt (72 BYTES, não caracteres)
    if len(password.encode("utf-8")) > 72:
        raise UnauthorizedException("Usuário ou senha inválidos")

    user_repo = UserRepository(db)
    user: User | None = user_repo.get_by_email(form_data.username)

    if not user or not verify_password(password, user.hashed_password):
        raise UnauthorizedException("Usuário ou senha inválidos")

    access_token = create_access_token(
        subject=str(user.id),
        expires_delta=timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        ),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me", response_model=UserResponse)
def me(
    current_user: User = Depends(get_current_user),
):
    """
    Retorna dados do usuário autenticado
    """
    return current_user

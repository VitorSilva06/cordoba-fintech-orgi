from datetime import timedelta

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.security import (
    create_access_token,
    verify_password,
    get_password_hash,
)
from app.core.exceptions import UnauthorizedException
from app.schemas.auth import Token
from app.schemas.user import UserResponse
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.db.session import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Autenticação básica (username + password).
    Retorna JWT.
    """
    user_repo = UserRepository(db)
    user: User | None = user_repo.get_by_email(form_data.username)

    if not user or not verify_password(form_data.password, user.password_hash):
        raise UnauthorizedException("Usuário ou senha inválidos")

    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    access_token = create_access_token(
        subject=str(user.id),
        expires_delta=access_token_expires,
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

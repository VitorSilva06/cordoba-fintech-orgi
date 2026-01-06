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
from app.schemas.auth2 import OAuth2EmailRequestForm
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.db.session import get_db

router = APIRouter()

@router.post(
    "/login",
    response_model=Token,
    summary="Login com email e senha",
    description="Use seu email cadastrado para autenticação",
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    password = form_data.password
    email = form_data.username  # ← aqui é o email

    # Proteção bcrypt
    if len(password.encode("utf-8")) > 72:
        raise UnauthorizedException("Usuário ou senha inválidos")

    user_repo = UserRepository(db)
    user = user_repo.get_by_email(email)

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


@router.get("/me/access-status")
def get_access_status(
    current_user: User = Depends(get_current_user),
):
    """
    Retorna o status de acesso do usuário aos dados.
    
    - Diretores: Sempre têm acesso global
    - Usuários com tenant: Têm acesso ao tenant atribuído
    - Usuários sem tenant: Não têm acesso a nenhum dado
    """
    has_access = current_user.is_diretor or current_user.tenant_id is not None
    
    return {
        "has_data_access": has_access,
        "is_director": current_user.is_diretor,
        "tenant_id": current_user.tenant_id,
        "role": current_user.role.value if hasattr(current_user.role, 'value') else current_user.role,
        "message": None if has_access else "Você ainda não foi atribuído a nenhum tenant. Aguarde a atribuição pelo administrador para visualizar os dados."
    }

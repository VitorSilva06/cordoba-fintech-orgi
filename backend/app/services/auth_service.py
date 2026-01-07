from datetime import timedelta
from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.core.security import (
    verify_password,
    create_access_token,
)
from app.core.exceptions import AuthenticationError
from app.core.config import settings


class AuthService:
    """
    Serviço responsável por autenticação e autorização
    """

    @staticmethod
    def authenticate(
        db: Session,
        email: str,
        password: str,
        tenant_id: int | None = None,
    ) -> dict:
        """
        Autentica o usuário e retorna token JWT
        """

        user = UserRepository.get_by_email(db, email)

        if not user:
            raise AuthenticationError("Credenciais inválidas")

        if not user.is_active:
            raise AuthenticationError("Usuário inativo")

        if tenant_id is not None and user.tenant_id != tenant_id:
            raise AuthenticationError("Usuário não pertence ao tenant")

        if not verify_password(password, user.hashed_password):
            raise AuthenticationError("Credenciais inválidas")

        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "tenant_id": user.tenant_id,
            "is_superuser": user.is_superuser,
        }

        access_token_expires = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

        access_token = create_access_token(
            data=token_data,
            expires_delta=access_token_expires,
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "tenant_id": user.tenant_id,
            },
        }

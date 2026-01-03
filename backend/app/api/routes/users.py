from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserResponse
from app.dependencies.auth import get_current_user

router = APIRouter()

# ----------------------------------
# Criar usuário (público)
# ----------------------------------
@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
):
    user_repo = UserRepository(db)

    # Verifica se email já existe
    if user_repo.get_by_email(user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado",
        )

    # Criação do usuário (hash da senha ocorre no repositório)
    return user_repo.create(user_in)


# ----------------------------------
# Listar usuários (protegido)
# ----------------------------------
@router.get(
    "/",
    response_model=List[UserResponse],
)
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_repo = UserRepository(db)
    return user_repo.list()

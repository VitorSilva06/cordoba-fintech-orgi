from typing import Optional, List

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.core.security import get_password_hash
from app.schemas.user import UserCreate


class UserRepository:
    """
    Camada de acesso a dados para usuários
    """

    def __init__(self, db: Session):
        self.db = db

    # ----------------------------------
    # Consultas
    # ----------------------------------
    def get_by_id(self, user_id: int) -> Optional[User]:
        return (
            self.db
            .query(User)
            .filter(User.id == user_id)
            .first()
        )

    def get_by_email(self, email: str) -> Optional[User]:
        return (
            self.db
            .query(User)
            .filter(User.email == email)
            .first()
        )

    def list(self, skip: int = 0, limit: int = 100) -> List[User]:
        return (
            self.db
            .query(User)
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ----------------------------------
    # Escrita
    # ----------------------------------
    def create(self, user_in: UserCreate) -> User:
        try:
            hashed_password = get_password_hash(user_in.password)
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(exc),
            )

        user = User(
            name=user_in.name,
            email=user_in.email,
            hashed_password=hashed_password,
            is_active=True,
            is_superuser=False,
        )

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user: User, **kwargs) -> User:
        for key, value in kwargs.items():
            if hasattr(user, key) and value is not None:
                setattr(user, key, value)

        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user: User) -> None:
        self.db.delete(user)
        self.db.commit()

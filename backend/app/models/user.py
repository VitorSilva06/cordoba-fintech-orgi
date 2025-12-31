from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    # ----------------------------------
    # Identificação
    # ----------------------------------
    id = Column(Integer, primary_key=True, index=True)

    # ----------------------------------
    # Dados básicos
    # ----------------------------------
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)

    # ----------------------------------
    # Segurança
    # ----------------------------------
    hashed_password = Column(String(255), nullable=False)

    # ----------------------------------
    # Permissões / Status
    # ----------------------------------
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    # ----------------------------------
    # Auditoria
    # ----------------------------------
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email}>"

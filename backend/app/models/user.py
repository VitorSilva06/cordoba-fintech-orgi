from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from uuid6 import uuid7

from app.db.base import Base


class UserRole(str, enum.Enum):
    OPERADOR = "operador"
    GERENTE = "gerente"
    DIRETOR = "diretor"


class User(Base):
    __tablename__ = "users"

    # ----------------------------------
    # Identificação
    # ----------------------------------
    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid7()),
        index=True
    )

    # ----------------------------------
    # Tenant (Multi-tenancy)
    # ----------------------------------
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

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
    role = Column(
        Enum(
            UserRole,
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
            name="userrole",
        ),
        default=UserRole.OPERADOR,
        nullable=False,
    )

    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)

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

    # ----------------------------------
    # Relacionamentos
    # ----------------------------------
    tenant = relationship("Tenant", back_populates="usuarios")

    @property
    def is_diretor(self) -> bool:
        return self.role == UserRole.DIRETOR

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email} role={self.role}>"
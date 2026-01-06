from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base


class UserRole(str, enum.Enum):
    """Cargos disponíveis no sistema"""
    OPERADOR = "operador"
    GERENTE = "gerente"
    DIRETOR = "diretor"


class User(Base):
    __tablename__ = "users"

    # ----------------------------------
    # Identificação
    # ----------------------------------
    id = Column(Integer, primary_key=True, index=True)

    # ----------------------------------
    # Tenant (Multi-tenancy)
    # ----------------------------------
    tenant_id = Column(
        Integer, 
        ForeignKey("tenants.id", ondelete="SET NULL"),
        nullable=True,  # NULL para diretores (acesso global)
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
        Enum(UserRole),
        default=UserRole.OPERADOR,
        nullable=False
    )
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

    # ----------------------------------
    # Relacionamentos
    # ----------------------------------
    tenant = relationship("Tenant", back_populates="usuarios")

    @property
    def is_diretor(self) -> bool:
        """Verifica se o usuário é diretor (acesso global)"""
        return self.role == UserRole.DIRETOR

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email} role={self.role}>"

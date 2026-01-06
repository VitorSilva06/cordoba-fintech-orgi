from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base import Base


class Tenant(Base):
    """
    Representa uma empresa cliente da Córdoba Fintech.
    Cada tenant possui seus próprios usuários, clientes e contratos.
    """
    __tablename__ = "tenants"

    # ----------------------------------
    # Identificação
    # ----------------------------------
    id = Column(Integer, primary_key=True, index=True)
    
    # ----------------------------------
    # Dados da Empresa
    # ----------------------------------
    nome = Column(String(255), nullable=False)
    cnpj = Column(String(18), unique=True, index=True, nullable=False)
    
    # ----------------------------------
    # Contato
    # ----------------------------------
    email = Column(String(255), nullable=True)
    telefone = Column(String(20), nullable=True)
    
    # ----------------------------------
    # Status
    # ----------------------------------
    ativo = Column(Boolean, default=True)
    
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
    usuarios = relationship("User", back_populates="tenant")
    clientes = relationship("Cliente", back_populates="tenant")
    contratos = relationship("Contrato", back_populates="tenant")

    def __repr__(self) -> str:
        return f"<Tenant id={self.id} nome={self.nome}>"

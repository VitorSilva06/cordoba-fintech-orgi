from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base


class Sexo(str, enum.Enum):
    """Sexo do cliente"""
    MASCULINO = "M"
    FEMININO = "F"
    OUTRO = "O"


class Cliente(Base):
    """
    Representa um devedor/cliente de um tenant.
    Cada cliente pertence a um tenant específico.
    """
    __tablename__ = "clientes"

    # ----------------------------------
    # Identificação
    # ----------------------------------
    id = Column(Integer, primary_key=True, index=True)
    
    # ----------------------------------
    # Tenant (Multi-tenancy)
    # ----------------------------------
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # ----------------------------------
    # Dados Pessoais
    # ----------------------------------
    nome = Column(String(255), nullable=False)
    cpf = Column(String(14), nullable=False, index=True)  # XXX.XXX.XXX-XX
    data_nascimento = Column(Date, nullable=True)
    sexo = Column(Enum(Sexo), nullable=True)
    
    # ----------------------------------
    # Contato
    # ----------------------------------
    telefone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    
    # ----------------------------------
    # Endereço
    # ----------------------------------
    endereco = Column(String(500), nullable=True)
    cidade = Column(String(100), nullable=True)
    estado = Column(String(2), nullable=True)
    cep = Column(String(9), nullable=True)

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
    tenant = relationship("Tenant", back_populates="clientes")
    contratos = relationship("Contrato", back_populates="cliente")

    @property
    def cpf_mascarado(self) -> str:
        """Retorna CPF com apenas os últimos dígitos visíveis: ***.***XXX-XX"""
        if self.cpf and len(self.cpf) >= 7:
            return f"***.***.{self.cpf[-7:]}"
        return "***.***.***-**"

    @property
    def idade(self) -> int | None:
        """Calcula a idade do cliente"""
        if self.data_nascimento:
            from datetime import date
            today = date.today()
            return today.year - self.data_nascimento.year - (
                (today.month, today.day) < (self.data_nascimento.month, self.data_nascimento.day)
            )
        return None

    def __repr__(self) -> str:
        return f"<Cliente id={self.id} nome={self.nome} cpf={self.cpf_mascarado}>"

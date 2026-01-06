from sqlalchemy import Column, Integer, String, Date, DateTime, Numeric, ForeignKey, Enum, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from datetime import date

from app.db.base import Base


class StatusContrato(str, enum.Enum):
    """Status do contrato"""
    ATIVO = "ativo"
    PAGO = "pago"
    ATRASADO = "atrasado"
    CANCELADO = "cancelado"
    NEGOCIADO = "negociado"


class Contrato(Base):
    """
    Representa um contrato/dívida de um cliente.
    Cada contrato pertence a um cliente e a um tenant.
    """
    __tablename__ = "contratos"

    # ----------------------------------
    # Identificação
    # ----------------------------------
    id = Column(Integer, primary_key=True, index=True)
    numero_contrato = Column(String(50), nullable=True, index=True)
    
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
    # Cliente
    # ----------------------------------
    cliente_id = Column(
        Integer,
        ForeignKey("clientes.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # ----------------------------------
    # Valores
    # ----------------------------------
    valor_original = Column(Numeric(15, 2), nullable=False)
    valor_atualizado = Column(Numeric(15, 2), nullable=True)
    valor_pago = Column(Numeric(15, 2), default=0)
    
    # ----------------------------------
    # Datas
    # ----------------------------------
    data_contrato = Column(Date, nullable=True)
    data_vencimento = Column(Date, nullable=False)
    data_pagamento = Column(Date, nullable=True)
    
    # ----------------------------------
    # Status
    # ----------------------------------
    status = Column(
        Enum(StatusContrato),
        default=StatusContrato.ATIVO,
        nullable=False,
        index=True
    )

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
    tenant = relationship("Tenant", back_populates="contratos")
    cliente = relationship("Cliente", back_populates="contratos")

    @property
    def dias_atraso(self) -> int:
        """Calcula os dias de atraso (D+)"""
        if self.status == StatusContrato.PAGO:
            return 0
        
        hoje = date.today()
        if self.data_vencimento and hoje > self.data_vencimento:
            return (hoje - self.data_vencimento).days
        return 0

    @property
    def valor_pendente(self) -> float:
        """Calcula o valor pendente"""
        valor = float(self.valor_atualizado or self.valor_original or 0)
        pago = float(self.valor_pago or 0)
        return max(0, valor - pago)

    @property
    def faixa_atraso(self) -> str:
        """Retorna a faixa de atraso (D+)"""
        dias = self.dias_atraso
        if dias == 0:
            return "Em dia"
        elif dias <= 30:
            return "D+1-30"
        elif dias <= 60:
            return "D+31-60"
        elif dias <= 90:
            return "D+61-90"
        elif dias <= 180:
            return "D+91-180"
        else:
            return "D+180+"

    def __repr__(self) -> str:
        return f"<Contrato id={self.id} valor={self.valor_original} status={self.status}>"

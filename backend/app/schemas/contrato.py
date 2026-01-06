from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from decimal import Decimal
from enum import Enum


class StatusContratoEnum(str, Enum):
    ATIVO = "ativo"
    PAGO = "pago"
    ATRASADO = "atrasado"
    CANCELADO = "cancelado"
    NEGOCIADO = "negociado"


class ContratoBase(BaseModel):
    """Schema base para Contrato"""
    numero_contrato: Optional[str] = None
    valor_original: Decimal = Field(..., gt=0)
    valor_atualizado: Optional[Decimal] = None
    data_contrato: Optional[date] = None
    data_vencimento: date
    status: StatusContratoEnum = StatusContratoEnum.ATIVO


class ContratoCreate(ContratoBase):
    """Schema para criação de Contrato"""
    cliente_id: int


class ContratoUpdate(BaseModel):
    """Schema para atualização de Contrato"""
    valor_atualizado: Optional[Decimal] = None
    valor_pago: Optional[Decimal] = None
    data_pagamento: Optional[date] = None
    status: Optional[StatusContratoEnum] = None


class ContratoResponse(ContratoBase):
    """Schema de resposta para Contrato"""
    id: int
    tenant_id: int
    cliente_id: int
    valor_pago: Decimal
    data_pagamento: Optional[date] = None
    dias_atraso: int
    valor_pendente: float
    faixa_atraso: str
    created_at: datetime

    class Config:
        from_attributes = True


class ContratoSimple(BaseModel):
    """Schema simplificado para listas"""
    id: int
    numero_contrato: Optional[str] = None
    valor_original: Decimal
    valor_pendente: float
    dias_atraso: int
    status: str
    faixa_atraso: str

    class Config:
        from_attributes = True

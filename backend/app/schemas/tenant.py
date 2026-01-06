from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TenantBase(BaseModel):
    """Schema base para Tenant"""
    nome: str = Field(..., min_length=2, max_length=255)
    cnpj: str = Field(..., min_length=14, max_length=18)
    email: Optional[str] = None
    telefone: Optional[str] = None


class TenantCreate(TenantBase):
    """Schema para criação de Tenant"""
    pass


class TenantUpdate(BaseModel):
    """Schema para atualização de Tenant"""
    nome: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    ativo: Optional[bool] = None


class TenantResponse(TenantBase):
    """Schema de resposta para Tenant"""
    id: int
    ativo: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TenantSimple(BaseModel):
    """Schema simplificado para exibição em listas"""
    id: int
    nome: str
    cnpj: str

    class Config:
        from_attributes = True

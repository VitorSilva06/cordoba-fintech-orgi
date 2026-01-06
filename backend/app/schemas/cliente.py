from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from enum import Enum


class SexoEnum(str, Enum):
    MASCULINO = "M"
    FEMININO = "F"
    OUTRO = "O"


class ClienteBase(BaseModel):
    """Schema base para Cliente"""
    nome: str = Field(..., min_length=2, max_length=255)
    cpf: str = Field(..., min_length=11, max_length=14)
    data_nascimento: Optional[date] = None
    sexo: Optional[SexoEnum] = None
    telefone: Optional[str] = None
    email: Optional[str] = None
    endereco: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    cep: Optional[str] = None


class ClienteCreate(ClienteBase):
    """Schema para criação de Cliente"""
    pass


class ClienteResponse(ClienteBase):
    """Schema de resposta para Cliente"""
    id: int
    tenant_id: int
    cpf_mascarado: str
    idade: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ClienteSimple(BaseModel):
    """Schema simplificado para listas e top devedores"""
    id: int
    nome: str
    cpf_mascarado: str
    idade: Optional[int] = None
    sexo: Optional[str] = None

    class Config:
        from_attributes = True

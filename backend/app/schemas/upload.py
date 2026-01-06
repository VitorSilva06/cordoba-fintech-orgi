"""
Schemas para Upload e Gestão de Base
"""
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from decimal import Decimal
from pydantic import BaseModel, Field
from enum import Enum


class TipoImportacao(str, Enum):
    """Tipo de importação"""
    NOVA_BASE = "nova_base"
    ATUALIZACAO = "atualizacao"
    INCREMENTAL = "incremental"


class StatusImportacao(str, Enum):
    """Status da importação"""
    PENDENTE = "pendente"
    PROCESSANDO = "processando"
    CONCLUIDO = "concluido"
    ERRO = "erro"
    CANCELADO = "cancelado"


class StatusValidacao(str, Enum):
    """Status de validação de linha"""
    VALIDO = "valido"
    ERRO = "erro"
    DUPLICADO = "duplicado"
    ATUALIZAR = "atualizar"
    NOVO = "novo"


# ==========================================
# Schemas de Campos Esperados
# ==========================================
class CampoObrigatorio(BaseModel):
    """Campo obrigatório para upload"""
    nome: str
    descricao: str
    tipo: str
    exemplo: str
    alternativas: List[str] = []


class CampoOpcional(BaseModel):
    """Campo opcional para upload"""
    nome: str
    descricao: str
    tipo: str
    exemplo: str
    alternativas: List[str] = []


class EstruturaCampos(BaseModel):
    """Estrutura completa de campos esperados"""
    obrigatorios: List[CampoObrigatorio]
    opcionais: List[CampoOpcional]


# ==========================================
# Schemas de Preview/Validação
# ==========================================
class LinhaPreview(BaseModel):
    """Preview de uma linha do arquivo"""
    linha: int
    cpf: Optional[str] = None
    nome: Optional[str] = None
    valor: Optional[Decimal] = None
    vencimento: Optional[date] = None
    status_validacao: StatusValidacao
    acao: str  # "criar", "atualizar", "ignorar"
    erros: List[str] = []
    dados_existentes: Optional[Dict[str, Any]] = None


class PreviewUpload(BaseModel):
    """Preview completo do upload"""
    arquivo: str
    total_linhas: int
    linhas_validas: int
    linhas_invalidas: int
    novos_clientes: int
    atualizacoes: int
    duplicados: int
    preview: List[LinhaPreview]
    colunas_encontradas: List[str]
    colunas_mapeadas: Dict[str, str]


# ==========================================
# Schemas de Resultado da Importação
# ==========================================
class ResultadoImportacao(BaseModel):
    """Resultado da importação"""
    id_importacao: str
    arquivo: str
    tipo_importacao: TipoImportacao
    status: StatusImportacao
    total_linhas: int
    clientes_criados: int
    clientes_atualizados: int
    contratos_criados: int
    contratos_atualizados: int
    total_erros: int
    erros: List[str] = []
    data_inicio: datetime
    data_fim: Optional[datetime] = None
    tenant_id: int
    usuario_id: int


class ResumoImportacao(BaseModel):
    """Resumo simplificado"""
    sucesso: bool
    mensagem: str
    clientes_processados: int
    contratos_processados: int
    erros: int


# ==========================================
# Schemas de Log de Importação
# ==========================================
class LogImportacao(BaseModel):
    """Log de uma importação"""
    id: str
    arquivo: str
    tipo: TipoImportacao
    status: StatusImportacao
    total_linhas: int
    processados: int
    erros: int
    data: datetime
    usuario: str
    tenant_nome: Optional[str] = None

    class Config:
        from_attributes = True


class ListaLogsImportacao(BaseModel):
    """Lista de logs de importação"""
    logs: List[LogImportacao]
    total: int
    pagina: int
    por_pagina: int


# ==========================================
# Schemas de Base/Clientes Carregados
# ==========================================
class ClienteBase(BaseModel):
    """Cliente na base"""
    id: int
    nome: str
    cpf_masked: str
    telefone: Optional[str] = None
    email: Optional[str] = None
    total_contratos: int
    valor_total: Decimal
    status: str
    data_cadastro: datetime


class ListaClientesBase(BaseModel):
    """Lista de clientes da base"""
    clientes: List[ClienteBase]
    total: int
    pagina: int
    por_pagina: int


# ==========================================
# Request Schemas
# ==========================================
class IniciarImportacaoRequest(BaseModel):
    """Request para iniciar importação"""
    tipo_importacao: TipoImportacao = TipoImportacao.INCREMENTAL
    sobrescrever_existentes: bool = False
    validar_apenas: bool = False


class ConfirmarImportacaoRequest(BaseModel):
    """Request para confirmar importação após preview"""
    id_preview: str
    confirmar: bool = True

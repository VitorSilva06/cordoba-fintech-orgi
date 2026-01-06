"""
Model para Log de Importação
"""
from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Text, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base


class TipoImportacao(str, enum.Enum):
    """Tipo de importação"""
    NOVA_BASE = "nova_base"
    ATUALIZACAO = "atualizacao"
    INCREMENTAL = "incremental"


class StatusImportacao(str, enum.Enum):
    """Status da importação"""
    PENDENTE = "pendente"
    PROCESSANDO = "processando"
    CONCLUIDO = "concluido"
    ERRO = "erro"
    CANCELADO = "cancelado"


class ImportacaoLog(Base):
    """
    Log de importações de base.
    Registra cada upload e seu processamento.
    """
    __tablename__ = "importacao_logs"

    # ----------------------------------
    # Identificação
    # ----------------------------------
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String(36), unique=True, index=True, nullable=False)
    
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
    # Usuário que realizou
    # ----------------------------------
    usuario_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    
    # ----------------------------------
    # Arquivo
    # ----------------------------------
    nome_arquivo = Column(String(255), nullable=False)
    tamanho_bytes = Column(Integer, nullable=True)
    caminho_arquivo = Column(String(500), nullable=True)
    
    # ----------------------------------
    # Tipo e Status
    # ----------------------------------
    tipo = Column(Enum(TipoImportacao), default=TipoImportacao.INCREMENTAL, nullable=False)
    status = Column(Enum(StatusImportacao), default=StatusImportacao.PENDENTE, nullable=False)
    
    # ----------------------------------
    # Métricas
    # ----------------------------------
    total_linhas = Column(Integer, default=0)
    linhas_processadas = Column(Integer, default=0)
    clientes_criados = Column(Integer, default=0)
    clientes_atualizados = Column(Integer, default=0)
    contratos_criados = Column(Integer, default=0)
    contratos_atualizados = Column(Integer, default=0)
    total_erros = Column(Integer, default=0)
    
    # ----------------------------------
    # Detalhes (JSON)
    # ----------------------------------
    erros_detalhes = Column(JSON, nullable=True)  # Lista de erros
    colunas_mapeadas = Column(JSON, nullable=True)  # Mapeamento de colunas
    configuracao = Column(JSON, nullable=True)  # Configurações usadas
    
    # ----------------------------------
    # Timestamps
    # ----------------------------------
    data_inicio = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    data_fim = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # ----------------------------------
    # Relationships
    # ----------------------------------
    tenant = relationship("Tenant", backref="importacoes")
    usuario = relationship("User", backref="importacoes")

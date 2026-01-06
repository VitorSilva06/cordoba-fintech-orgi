from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal


# =====================================================
# DASHBOARD PRINCIPAL
# =====================================================

class DistribuicaoStatus(BaseModel):
    """Distribuição de contratos por status"""
    status: str
    quantidade: int
    percentual: float
    valor_total: Decimal


class FaixaAtraso(BaseModel):
    """Distribuição por faixa de atraso (D+)"""
    faixa: str
    quantidade: int
    percentual: float
    valor_total: Decimal


class TopDevedor(BaseModel):
    """Top devedores com maior valor pendente"""
    nome: str
    cpf_mascarado: str
    total_contratos: int
    valor_pendente: Decimal
    max_atraso: int


class DashboardPrincipal(BaseModel):
    """Schema completo do Dashboard Principal"""
    # KPIs principais
    total_contratos: int
    total_devedores: int = 0
    contratos_ativos: int
    ativos: int = 0  # Alias para contratos_ativos
    contratos_pagos: int
    quitados: int = 0  # Alias para contratos_pagos
    contratos_atrasados: int
    atrasados: int = 0  # Alias para contratos_atrasados
    valor_total: Decimal
    valor_total_carteira: Decimal = Decimal("0")  # Alias para valor_total
    media_atraso: float
    
    # Gráficos
    distribuicao_status: List[DistribuicaoStatus]
    faixas_atraso: List[FaixaAtraso]
    top_devedores: List[TopDevedor]
    
    # Identificação do tenant (para diretores)
    tenant_id: Optional[int] = None
    tenant_nome: Optional[str] = None
    
    def model_post_init(self, __context):
        # Preenche aliases
        self.ativos = self.contratos_ativos
        self.quitados = self.contratos_pagos
        self.atrasados = self.contratos_atrasados
        self.valor_total_carteira = self.valor_total


class DashboardPrincipalConsolidado(BaseModel):
    """Dashboard consolidado para diretores (todos os tenants)"""
    total_geral: DashboardPrincipal
    por_tenant: List[DashboardPrincipal]


# =====================================================
# DASHBOARD DE ANÁLISE DE CLIENTES
# =====================================================

class DistribuicaoFaixaEtaria(BaseModel):
    """Distribuição por faixa etária"""
    faixa: str
    quantidade: int
    percentual: float


class DistribuicaoSexo(BaseModel):
    """Distribuição por sexo"""
    sexo: str
    quantidade: int
    percentual: float


class ClienteRanking(BaseModel):
    """Cliente para ranking (top 5)"""
    nome: str
    cpf_mascarado: str
    valor_total: Decimal
    total_contratos: int
    taxa_pontualidade: float


class PerfilDemografico(BaseModel):
    """Perfil demográfico dos clientes"""
    distribuicao_faixa_etaria: List[DistribuicaoFaixaEtaria]
    distribuicao_sexo: List[DistribuicaoSexo]
    top_5_maior_inadimplencia: List[ClienteRanking]
    top_5_melhor_comportamento: List[ClienteRanking]


class PontualidadePagamento(BaseModel):
    """Distribuição de pontualidade"""
    categoria: str  # "Em dia", "1-30 dias", "31-60 dias", etc.
    quantidade: int
    percentual: float


class DistribuicaoReincidencia(BaseModel):
    """Distribuição de reincidência"""
    categoria: str  # "Primeira vez", "Reincidente", "Crônico"
    quantidade: int
    percentual: float


class PerfilComportamental(BaseModel):
    """Perfil comportamental (histórico do pagador)"""
    pontualidade_pagamento: List[PontualidadePagamento]
    distribuicao_reincidencia: List[DistribuicaoReincidencia]


class InadimplenciaPorFaixa(BaseModel):
    """Inadimplência por faixa de valor"""
    faixa_valor: str  # "R$ 0-1k", "R$ 1k-5k", etc.
    quantidade: int
    valor_total: Decimal
    percentual: float


class EvolucaoMensal(BaseModel):
    """Evolução mensal do comportamento"""
    mes: str
    novos_inadimplentes: int
    recuperados: int
    taxa_recuperacao: float


class PropensaoPagamento(BaseModel):
    """Propensão ao pagamento (perfil de risco)"""
    evolucao_comportamento: List[EvolucaoMensal]


class AnaliseClientePorFaixa(BaseModel):
    """Análise de clientes por faixa de atraso"""
    faixa_d_plus: str
    total_clientes: int
    valor_total: Decimal
    idade_media: float
    sexo_m: int
    sexo_f: int
    reincidencia: float


class DashboardAnaliseClientes(BaseModel):
    """Schema completo do Dashboard de Análise de Clientes"""
    # KPIs principais
    d_plus_medio: float
    bons_pagadores: int
    reincidentes: int
    inadimplentes: int
    ticket_medio: Decimal
    idade_media: float
    
    # Perfis
    perfil_demografico: PerfilDemografico
    perfil_comportamental: PerfilComportamental
    perfil_financeiro: List[InadimplenciaPorFaixa]
    propensao_pagamento: PropensaoPagamento
    analise_por_faixa: List[AnaliseClientePorFaixa]
    
    # Identificação do tenant (para diretores)
    tenant_id: Optional[int] = None
    tenant_nome: Optional[str] = None


class DashboardAnaliseClientesConsolidado(BaseModel):
    """Dashboard consolidado para diretores"""
    total_geral: DashboardAnaliseClientes
    por_tenant: List[DashboardAnaliseClientes]

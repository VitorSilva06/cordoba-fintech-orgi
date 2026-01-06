from typing import Optional, List
from decimal import Decimal

from sqlalchemy.orm import Session

from app.repositories.contrato_repository import ContratoRepository
from app.repositories.cliente_repository import ClienteRepository
from app.repositories.tenant_repository import TenantRepository
from app.schemas.dashboard import (
    DashboardPrincipal,
    DashboardPrincipalConsolidado,
    DashboardAnaliseClientes,
    DistribuicaoStatus,
    FaixaAtraso,
    TopDevedor,
    DistribuicaoFaixaEtaria,
    DistribuicaoSexo,
    ClienteRanking,
    PerfilDemografico,
    PontualidadePagamento,
    DistribuicaoReincidencia,
    PerfilComportamental,
    InadimplenciaPorFaixa,
    EvolucaoMensal,
    PerfilRisco,
    PropensaoPagamento,
    AnaliseClientePorFaixa,
)
from app.models.contrato import StatusContrato


class DashboardService:
    """Serviço para cálculo dos dados do Dashboard"""

    def __init__(self, db: Session):
        self.db = db
        self.contrato_repo = ContratoRepository(db)
        self.cliente_repo = ClienteRepository(db)
        self.tenant_repo = TenantRepository(db)

    def get_dashboard_principal(
        self, 
        tenant_id: Optional[int] = None
    ) -> DashboardPrincipal:
        """
        Retorna dados do Dashboard Principal.
        
        Se tenant_id for None, retorna dados de todos os tenants (visão diretor).
        """
        # KPIs principais
        total_contratos = self.contrato_repo.count_total(tenant_id)
        total_devedores = self.cliente_repo.count(tenant_id)
        contagem_status = self.contrato_repo.count_by_status(tenant_id)
        
        # Status pode vir em minúsculo ou maiúsculo dependendo do enum
        contratos_ativos = contagem_status.get('ativo', 0) or contagem_status.get('ATIVO', 0)
        contratos_pagos = contagem_status.get('pago', 0) or contagem_status.get('PAGO', 0)
        contratos_atrasados = contagem_status.get('atrasado', 0) or contagem_status.get('ATRASADO', 0)
        
        valor_total = self.contrato_repo.get_valor_total(tenant_id)
        media_atraso = self.contrato_repo.get_media_atraso(tenant_id)
        
        # Distribuições
        distribuicao_raw = self.contrato_repo.get_distribuicao_status(tenant_id)
        distribuicao_status = [
            DistribuicaoStatus(**d) for d in distribuicao_raw
        ]
        
        faixas_raw = self.contrato_repo.get_faixas_atraso(tenant_id)
        faixas_atraso = [
            FaixaAtraso(**f) for f in faixas_raw
        ]
        
        # Top devedores
        top_raw = self.contrato_repo.get_top_devedores(tenant_id, limit=10)
        top_devedores = [
            TopDevedor(**t) for t in top_raw
        ]
        
        # Identificação do tenant
        tenant_nome = None
        if tenant_id:
            tenant = self.tenant_repo.get_by_id(tenant_id)
            tenant_nome = tenant.nome if tenant else None
        
        return DashboardPrincipal(
            total_contratos=total_contratos,
            total_devedores=total_devedores,
            contratos_ativos=contratos_ativos,
            ativos=contratos_ativos,
            contratos_pagos=contratos_pagos,
            quitados=contratos_pagos,
            contratos_atrasados=contratos_atrasados,
            atrasados=contratos_atrasados,
            valor_total=valor_total,
            valor_total_carteira=valor_total,
            media_atraso=media_atraso,
            distribuicao_status=distribuicao_status,
            faixas_atraso=faixas_atraso,
            top_devedores=top_devedores,
            tenant_id=tenant_id,
            tenant_nome=tenant_nome,
        )

    def get_dashboard_principal_consolidado(self) -> DashboardPrincipalConsolidado:
        """
        Retorna Dashboard Principal consolidado para diretores.
        Inclui visão geral e por tenant.
        """
        # Total geral (todos os tenants)
        total_geral = self.get_dashboard_principal(tenant_id=None)
        
        # Por tenant
        tenants = self.tenant_repo.list(only_active=True)
        por_tenant = [
            self.get_dashboard_principal(tenant_id=t.id)
            for t in tenants
        ]
        
        return DashboardPrincipalConsolidado(
            total_geral=total_geral,
            por_tenant=por_tenant,
        )

    def get_dashboard_analise_clientes(
        self, 
        tenant_id: Optional[int] = None
    ) -> DashboardAnaliseClientes:
        """
        Retorna dados do Dashboard de Análise de Clientes.
        """
        # KPIs principais
        d_plus_medio = self.contrato_repo.get_d_plus_medio(tenant_id)
        bons_pagadores = self.contrato_repo.count_bons_pagadores(tenant_id)
        reincidentes = self.contrato_repo.count_reincidentes(tenant_id)
        inadimplentes = self.contrato_repo.count_inadimplentes(tenant_id)
        ticket_medio = self.contrato_repo.get_ticket_medio(tenant_id)
        idade_media = self.cliente_repo.get_idade_media(tenant_id)
        
        # Perfil Demográfico
        faixa_etaria_raw = self.cliente_repo.get_distribuicao_faixa_etaria(tenant_id)
        distribuicao_faixa_etaria = [
            DistribuicaoFaixaEtaria(**f) for f in faixa_etaria_raw
        ]
        
        sexo_raw = self.cliente_repo.get_distribuicao_sexo(tenant_id)
        distribuicao_sexo = [
            DistribuicaoSexo(**s) for s in sexo_raw
        ]
        
        top_inadimplencia_raw = self.cliente_repo.get_top_maior_inadimplencia(tenant_id)
        top_5_maior_inadimplencia = [
            ClienteRanking(**c) for c in top_inadimplencia_raw
        ]
        
        top_comportamento_raw = self.cliente_repo.get_top_melhor_comportamento(tenant_id)
        top_5_melhor_comportamento = [
            ClienteRanking(**c) for c in top_comportamento_raw
        ]
        
        perfil_demografico = PerfilDemografico(
            distribuicao_faixa_etaria=distribuicao_faixa_etaria,
            distribuicao_sexo=distribuicao_sexo,
            top_5_maior_inadimplencia=top_5_maior_inadimplencia,
            top_5_melhor_comportamento=top_5_melhor_comportamento,
        )
        
        # Perfil Comportamental
        pontualidade_raw = self.contrato_repo.get_pontualidade_pagamento(tenant_id)
        pontualidade_pagamento = [
            PontualidadePagamento(**p) for p in pontualidade_raw
        ]
        
        reincidencia_raw = self.contrato_repo.get_distribuicao_reincidencia(tenant_id)
        distribuicao_reincidencia = [
            DistribuicaoReincidencia(**r) for r in reincidencia_raw
        ]
        
        perfil_comportamental = PerfilComportamental(
            pontualidade_pagamento=pontualidade_pagamento,
            distribuicao_reincidencia=distribuicao_reincidencia,
        )
        
        # Perfil Financeiro
        perfil_financeiro_raw = self.contrato_repo.get_inadimplencia_por_faixa_valor(tenant_id)
        perfil_financeiro = [
            InadimplenciaPorFaixa(**f) for f in perfil_financeiro_raw
        ]
        
        # Propensão ao Pagamento
        evolucao_raw = self.contrato_repo.get_evolucao_mensal(tenant_id)
        evolucao_comportamento = [
            EvolucaoMensal(**e) for e in evolucao_raw
        ]
        
        perfil_risco_raw = self.contrato_repo.get_perfil_risco(tenant_id)
        perfil_risco = [
            PerfilRisco(**p) for p in perfil_risco_raw
        ]
        
        propensao_pagamento = PropensaoPagamento(
            evolucao_comportamento=evolucao_comportamento,
            perfil_risco=perfil_risco,
        )
        
        # Análise por Faixa de Atraso
        analise_faixa_raw = self.contrato_repo.get_analise_por_faixa_atraso(tenant_id)
        analise_por_faixa = [
            AnaliseClientePorFaixa(**a) for a in analise_faixa_raw
        ]
        
        # Identificação do tenant
        tenant_nome = None
        if tenant_id:
            tenant = self.tenant_repo.get_by_id(tenant_id)
            tenant_nome = tenant.nome if tenant else None
        
        return DashboardAnaliseClientes(
            d_plus_medio=d_plus_medio,
            bons_pagadores=bons_pagadores,
            reincidentes=reincidentes,
            inadimplentes=inadimplentes,
            ticket_medio=ticket_medio,
            idade_media=idade_media,
            perfil_demografico=perfil_demografico,
            perfil_comportamental=perfil_comportamental,
            perfil_financeiro=perfil_financeiro,
            propensao_pagamento=propensao_pagamento,
            analise_por_faixa=analise_por_faixa,
            tenant_id=tenant_id,
            tenant_nome=tenant_nome,
        )

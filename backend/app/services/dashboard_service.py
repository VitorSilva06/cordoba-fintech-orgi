from typing import Optional, List
from decimal import Decimal

from sqlalchemy.orm import Session

from app.repositories.contrato_repository import ContratoRepository
from app.repositories.cliente_repository import ClienteRepository
from app.repositories.tenant_repository import TenantRepository
from app.schemas.dashboard import (
    DashboardPrincipal,
    DashboardPrincipalConsolidado,
    DistribuicaoStatus,
    FaixaAtraso,
    TopDevedor,
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

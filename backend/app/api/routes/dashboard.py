from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User, UserRole
from app.dependencies.auth import get_current_user
from app.dependencies.tenant import get_tenant_filter, TenantFilter
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import DashboardPrincipal, DashboardAnaliseClientes

router = APIRouter()


# ----------------------------------
# Dashboard Principal
# ----------------------------------
@router.get("/principal", response_model=DashboardPrincipal)
def dashboard_principal(
    tenant_filter: TenantFilter = Depends(get_tenant_filter),
    db: Session = Depends(get_db),
):
    """
    Dashboard principal com métricas de contratos e devedores.
    
    - Operadores/Gerentes: Veem apenas dados do seu tenant
    - Diretores: Precisam especificar tenant_id via query param ou veem consolidado
    """
    service = DashboardService(db)
    return service.get_dashboard_principal(tenant_filter.tenant_id)


@router.get("/principal/consolidado", response_model=DashboardPrincipal)
def dashboard_principal_consolidado(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Dashboard principal consolidado (todos os tenants).
    
    Disponível apenas para diretores.
    """
    if current_user.role != UserRole.DIRETOR:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso restrito a diretores"
        )
    
    service = DashboardService(db)
    return service.get_dashboard_principal_consolidado()


# ----------------------------------
# Dashboard por Tenant (para diretores)
# ----------------------------------
@router.get("/tenants")
def list_tenants_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Lista resumo de todos os tenants para visão do diretor.
    """
    if current_user.role != UserRole.DIRETOR:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso restrito a diretores"
        )
    
    from app.repositories.tenant_repository import TenantRepository
    from app.repositories.contrato_repository import ContratoRepository
    
    tenant_repo = TenantRepository(db)
    contrato_repo = ContratoRepository(db)
    
    tenants = tenant_repo.list()
    result = []
    
    for tenant in tenants:
        total = contrato_repo.count(tenant.id)
        atrasados = contrato_repo.count_by_status(tenant.id).get("ATRASADO", 0)
        valor = contrato_repo.sum_valor_original(tenant.id)
        
        result.append({
            "id": tenant.id,
            "nome": tenant.nome,
            "cnpj": tenant.cnpj,
            "total_contratos": total,
            "contratos_atrasados": atrasados,
            "valor_total": float(valor),
        })
    
    return {"tenants": result}


# ----------------------------------
# Dashboard do operador
# ----------------------------------
@router.get("/operator")
def dashboard_operator(
    tenant_filter: TenantFilter = Depends(get_tenant_filter),
    db: Session = Depends(get_db),
):
    service = DashboardService(db)
    data = service.get_dashboard_principal(tenant_filter.tenant_id)
    return {
        "dashboard": "operator",
        "data": {
            "tasks_pending": data.total_contratos - data.quitados,
            "tasks_completed": data.quitados,
        },
    }


# ----------------------------------
# Dashboard do gestor
# ----------------------------------
@router.get("/manager")
def dashboard_manager(
    tenant_filter: TenantFilter = Depends(get_tenant_filter),
    db: Session = Depends(get_db),
):
    service = DashboardService(db)
    data = service.get_dashboard_principal(tenant_filter.tenant_id)
    return {
        "dashboard": "manager",
        "data": {
            "total_clients": data.total_devedores,
            "active_contracts": data.total_contratos,
            "valor_carteira": float(data.valor_total_carteira),
        },
    }


# ----------------------------------
# Dashboard do diretor
# ----------------------------------
@router.get("/director")
def dashboard_director(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != UserRole.DIRETOR:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso restrito a diretores"
        )
    
    service = DashboardService(db)
    data = service.get_dashboard_principal_consolidado()
    return {
        "dashboard": "director",
        "data": {
            "total_contracts": data.total_contratos,
            "total_debtors": data.total_devedores,
            "total_value": float(data.valor_total_carteira),
            "overdue_contracts": data.atrasados,
        },
    }


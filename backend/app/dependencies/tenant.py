from typing import Optional
from fastapi import Depends, HTTPException, status

from app.models.user import User, UserRole
from app.dependencies.auth import get_current_user


class TenantFilter:
    """
    Filtro de tenant para isolamento de dados.
    
    - Usuários comuns (operador/gerente) só veem dados do seu tenant
    - Diretores podem ver todos os tenants ou filtrar por um específico
    """
    
    def __init__(
        self,
        current_user: User = Depends(get_current_user),
        tenant_id: Optional[int] = None  # Query param para diretores
    ):
        self.current_user = current_user
        self._requested_tenant_id = tenant_id
    
    @property
    def tenant_id(self) -> Optional[int]:
        """
        Retorna o tenant_id para filtrar queries.
        
        - Diretor sem filtro: None (vê todos)
        - Diretor com filtro: tenant_id especificado
        - Outros usuários: tenant_id do próprio usuário
        """
        if self.current_user.is_diretor:
            return self._requested_tenant_id  # None = todos, ou específico
        return self.current_user.tenant_id
    
    @property
    def is_global_view(self) -> bool:
        """Verifica se é visão global (diretor vendo todos)"""
        return self.current_user.is_diretor and self._requested_tenant_id is None
    
    def validate_tenant_access(self, tenant_id: int) -> None:
        """
        Valida se o usuário tem acesso ao tenant especificado.
        Lança exceção se não tiver permissão.
        """
        if self.current_user.is_diretor:
            return  # Diretor tem acesso a todos
        
        if self.current_user.tenant_id != tenant_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Você não tem permissão para acessar dados deste tenant"
            )


def get_tenant_filter(
    current_user: User = Depends(get_current_user),
    tenant_id: Optional[int] = None
) -> TenantFilter:
    """
    Dependency para injetar o filtro de tenant nas rotas.
    
    Uso:
        @router.get("/dados")
        def listar_dados(tenant_filter: TenantFilter = Depends(get_tenant_filter)):
            # tenant_filter.tenant_id será:
            # - None para diretores (visão global)
            # - tenant_id do usuário para outros cargos
    """
    return TenantFilter(current_user, tenant_id)


def require_tenant(
    current_user: User = Depends(get_current_user)
) -> int:
    """
    Dependency que exige que o usuário tenha um tenant associado.
    Usado para operações que precisam de um tenant específico (ex: upload).
    
    Lança exceção se o usuário não tiver tenant.
    """
    if current_user.tenant_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuário não está associado a nenhum tenant"
        )
    return current_user.tenant_id

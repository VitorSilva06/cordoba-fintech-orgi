from typing import Optional
from fastapi import Depends, HTTPException, status

from app.models.user import User, UserRole
from app.dependencies.auth import get_current_user


class TenantAccessError(Exception):
    """Exceção para erros de acesso a tenant"""
    pass


class TenantFilter:
    """
    Filtro de tenant para isolamento de dados.
    
    Regras de acesso:
    - Diretores: Veem todos os tenants (visão global) ou podem filtrar por um específico
    - Gerentes/Operadores com tenant: Veem apenas dados do seu tenant
    - Usuários sem tenant: NÃO veem nenhum dado (exceto diretor)
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
        - Outros usuários COM tenant: tenant_id do próprio usuário
        - Outros usuários SEM tenant: -1 (filtro que não retorna nada)
        """
        if self.current_user.is_diretor:
            return self._requested_tenant_id  # None = todos, ou específico
        
        # Usuário sem tenant não vê nenhum dado
        if self.current_user.tenant_id is None:
            return -1  # ID inexistente = nenhum resultado
        
        return self.current_user.tenant_id
    
    @property
    def is_global_view(self) -> bool:
        """Verifica se é visão global (diretor vendo todos)"""
        return self.current_user.is_diretor and self._requested_tenant_id is None
    
    @property
    def has_tenant_access(self) -> bool:
        """Verifica se o usuário tem acesso a algum tenant"""
        return self.current_user.is_diretor or self.current_user.tenant_id is not None
    
    @property
    def is_unassigned_user(self) -> bool:
        """Verifica se é um usuário não atribuído a nenhum tenant"""
        return not self.current_user.is_diretor and self.current_user.tenant_id is None
    
    def validate_tenant_access(self, tenant_id: int) -> None:
        """
        Valida se o usuário tem acesso ao tenant especificado.
        Lança exceção se não tiver permissão.
        """
        if self.current_user.is_diretor:
            return  # Diretor tem acesso a todos
        
        if self.current_user.tenant_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Você não está atribuído a nenhum tenant. Contate o administrador."
            )
        
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


def get_tenant_id(
    current_user: User = Depends(get_current_user),
    tenant_id: Optional[int] = None
) -> Optional[int]:
    """
    Dependency simples que retorna apenas o tenant_id para filtrar queries.
    
    Regras:
    - Diretor sem filtro: None (vê todos)
    - Diretor com filtro: tenant_id especificado
    - Usuários COM tenant: tenant_id do próprio usuário
    - Usuários SEM tenant: -1 (não vê nenhum dado)
    """
    if current_user.is_diretor:
        return tenant_id  # None = todos, ou específico
    
    # Usuário sem tenant não vê nenhum dado
    if current_user.tenant_id is None:
        return -1  # ID inexistente = nenhum resultado
    
    return current_user.tenant_id


def get_user_tenant_status(
    current_user: User = Depends(get_current_user)
) -> dict:
    """
    Retorna o status de acesso do usuário ao tenant.
    Útil para o frontend saber se deve mostrar dados ou mensagem de "sem acesso".
    """
    return {
        "has_access": current_user.is_diretor or current_user.tenant_id is not None,
        "is_director": current_user.is_diretor,
        "tenant_id": current_user.tenant_id,
        "message": None if (current_user.is_diretor or current_user.tenant_id) 
                   else "Você ainda não foi atribuído a nenhum tenant. Contate o administrador."
    }


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

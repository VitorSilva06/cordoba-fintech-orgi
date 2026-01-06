from typing import Optional, List

from sqlalchemy.orm import Session

from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate, TenantUpdate


class TenantRepository:
    """Camada de acesso a dados para Tenants"""

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, tenant_id: int) -> Optional[Tenant]:
        return self.db.query(Tenant).filter(Tenant.id == tenant_id).first()

    def get_by_cnpj(self, cnpj: str) -> Optional[Tenant]:
        return self.db.query(Tenant).filter(Tenant.cnpj == cnpj).first()

    def list(self, skip: int = 0, limit: int = 100, only_active: bool = True) -> List[Tenant]:
        query = self.db.query(Tenant)
        if only_active:
            query = query.filter(Tenant.ativo == True)
        return query.offset(skip).limit(limit).all()

    def create(self, tenant_in: TenantCreate) -> Tenant:
        tenant = Tenant(
            nome=tenant_in.nome,
            cnpj=tenant_in.cnpj,
            email=tenant_in.email,
            telefone=tenant_in.telefone,
            ativo=True,
        )
        self.db.add(tenant)
        self.db.commit()
        self.db.refresh(tenant)
        return tenant

    def update(self, tenant: Tenant, tenant_in: TenantUpdate) -> Tenant:
        update_data = tenant_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(tenant, key, value)
        self.db.commit()
        self.db.refresh(tenant)
        return tenant

    def delete(self, tenant: Tenant) -> None:
        self.db.delete(tenant)
        self.db.commit()

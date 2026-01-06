from typing import Optional, List

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.cliente import Cliente
from app.schemas.cliente import ClienteCreate


class ClienteRepository:
    """Camada de acesso a dados para Clientes (devedores)"""

    def __init__(self, db: Session):
        self.db = db

    def _base_query(self, tenant_id: Optional[int] = None):
        """Query base com filtro opcional de tenant"""
        query = self.db.query(Cliente)
        if tenant_id is not None:
            query = query.filter(Cliente.tenant_id == tenant_id)
        return query

    def get_by_id(self, cliente_id: int, tenant_id: Optional[int] = None) -> Optional[Cliente]:
        return self._base_query(tenant_id).filter(Cliente.id == cliente_id).first()

    def get_by_cpf(self, cpf: str, tenant_id: int) -> Optional[Cliente]:
        return (
            self.db.query(Cliente)
            .filter(Cliente.cpf == cpf, Cliente.tenant_id == tenant_id)
            .first()
        )

    def list(
        self, 
        tenant_id: Optional[int] = None,
        skip: int = 0, 
        limit: int = 100
    ) -> List[Cliente]:
        return self._base_query(tenant_id).offset(skip).limit(limit).all()

    def count(self, tenant_id: Optional[int] = None) -> int:
        return self._base_query(tenant_id).count()

    def create(self, cliente_in: ClienteCreate, tenant_id: int) -> Cliente:
        cliente = Cliente(
            tenant_id=tenant_id,
            nome=cliente_in.nome,
            cpf=cliente_in.cpf,
            data_nascimento=cliente_in.data_nascimento,
            sexo=cliente_in.sexo.value if cliente_in.sexo else None,
            telefone=cliente_in.telefone,
            email=cliente_in.email,
            endereco=cliente_in.endereco,
            cidade=cliente_in.cidade,
            estado=cliente_in.estado,
            cep=cliente_in.cep,
        )
        self.db.add(cliente)
        self.db.commit()
        self.db.refresh(cliente)
        return cliente

    def create_or_update(self, cliente_in: ClienteCreate, tenant_id: int) -> Cliente:
        """Cria ou atualiza cliente pelo CPF"""
        existing = self.get_by_cpf(cliente_in.cpf, tenant_id)
        if existing:
            # Atualiza dados
            for key, value in cliente_in.model_dump(exclude_unset=True).items():
                if hasattr(existing, key) and value is not None:
                    setattr(existing, key, value)
            self.db.commit()
            self.db.refresh(existing)
            return existing
        return self.create(cliente_in, tenant_id)

    def bulk_create(self, clientes: List[ClienteCreate], tenant_id: int) -> int:
        """Cria múltiplos clientes de uma vez. Retorna quantidade criada."""
        count = 0
        for cliente_in in clientes:
            self.create_or_update(cliente_in, tenant_id)
            count += 1
        return count

    # ----------------------------------
    # Queries para Dashboard
    # ----------------------------------
    def count_by_sexo(self, tenant_id: Optional[int] = None) -> dict:
        query = self.db.query(
            Cliente.sexo,
            func.count(Cliente.id).label('quantidade')
        )
        if tenant_id:
            query = query.filter(Cliente.tenant_id == tenant_id)
        result = query.group_by(Cliente.sexo).all()
        return {row.sexo: row.quantidade for row in result}

    def get_idade_media(self, tenant_id: Optional[int] = None) -> float:
        from datetime import date
        from sqlalchemy import extract
        
        query = self.db.query(
            func.avg(
                extract('year', func.current_date()) - 
                extract('year', Cliente.data_nascimento)
            )
        ).filter(Cliente.data_nascimento.isnot(None))
        
        if tenant_id:
            query = query.filter(Cliente.tenant_id == tenant_id)
        
        result = query.scalar()
        return float(result) if result else 0.0

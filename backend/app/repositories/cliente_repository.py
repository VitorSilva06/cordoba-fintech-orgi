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

    def get_distribuicao_faixa_etaria(self, tenant_id: Optional[int] = None) -> List[dict]:
        """Retorna distribuição de clientes por faixa etária"""
        from sqlalchemy import case, extract
        from datetime import date
        
        # Calcula idade
        idade_expr = extract('year', func.current_date()) - extract('year', Cliente.data_nascimento)
        
        # Faixas etárias
        faixa_case = case(
            (idade_expr < 25, '18-24'),
            (idade_expr < 35, '25-34'),
            (idade_expr < 45, '35-44'),
            (idade_expr < 55, '45-54'),
            (idade_expr < 65, '55-64'),
            else_='65+'
        )
        
        query = self.db.query(
            faixa_case.label('faixa'),
            func.count(Cliente.id).label('quantidade')
        ).filter(Cliente.data_nascimento.isnot(None))
        
        if tenant_id:
            query = query.filter(Cliente.tenant_id == tenant_id)
        
        result = query.group_by(faixa_case).all()
        
        # Total para calcular percentual
        total = sum(r.quantidade for r in result) or 1
        
        # Ordenar as faixas
        ordem_faixas = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
        data = []
        for faixa in ordem_faixas:
            qtd = next((r.quantidade for r in result if r.faixa == faixa), 0)
            data.append({
                'faixa': faixa,
                'quantidade': qtd,
                'percentual': round((qtd / total) * 100, 2)
            })
        
        return data

    def get_distribuicao_sexo(self, tenant_id: Optional[int] = None) -> List[dict]:
        """Retorna distribuição de clientes por sexo"""
        query = self.db.query(
            Cliente.sexo,
            func.count(Cliente.id).label('quantidade')
        )
        if tenant_id:
            query = query.filter(Cliente.tenant_id == tenant_id)
        
        result = query.group_by(Cliente.sexo).all()
        total = sum(r.quantidade for r in result) or 1
        
        return [
            {
                'sexo': 'Masculino' if r.sexo and r.sexo.value == 'M' else ('Feminino' if r.sexo and r.sexo.value == 'F' else 'Não informado'),
                'quantidade': r.quantidade,
                'percentual': round((r.quantidade / total) * 100, 2)
            }
            for r in result
        ]

    def get_top_maior_inadimplencia(self, tenant_id: Optional[int] = None, limit: int = 5) -> List[dict]:
        """Retorna top clientes com maior inadimplência"""
        from app.models.contrato import Contrato, StatusContrato
        
        query = self.db.query(
            Cliente.nome,
            Cliente.cpf,
            func.sum(Contrato.valor_original).label('valor_total'),
            func.count(Contrato.id).label('total_contratos'),
        ).join(
            Contrato, Cliente.id == Contrato.cliente_id
        ).filter(
            Contrato.status == StatusContrato.ATRASADO
        )
        
        if tenant_id:
            query = query.filter(Cliente.tenant_id == tenant_id)
        
        result = query.group_by(
            Cliente.id, Cliente.nome, Cliente.cpf
        ).order_by(
            func.sum(Contrato.valor_original).desc()
        ).limit(limit).all()
        
        return [
            {
                'nome': r.nome,
                'cpf_mascarado': f"***.***.{r.cpf[-7:]}" if r.cpf and len(r.cpf) >= 7 else "***.***.***-**",
                'valor_total': float(r.valor_total or 0),
                'total_contratos': r.total_contratos,
                'taxa_inadimplencia': 100.0  # Todos aqui são inadimplentes
            }
            for r in result
        ]

    def get_top_melhor_comportamento(self, tenant_id: Optional[int] = None, limit: int = 5) -> List[dict]:
        """Retorna top clientes com melhor comportamento (pagam em dia)"""
        from app.models.contrato import Contrato, StatusContrato
        
        query = self.db.query(
            Cliente.nome,
            Cliente.cpf,
            func.sum(Contrato.valor_original).label('valor_total'),
            func.count(Contrato.id).label('total_contratos'),
        ).join(
            Contrato, Cliente.id == Contrato.cliente_id
        ).filter(
            Contrato.status == StatusContrato.PAGO
        )
        
        if tenant_id:
            query = query.filter(Cliente.tenant_id == tenant_id)
        
        result = query.group_by(
            Cliente.id, Cliente.nome, Cliente.cpf
        ).order_by(
            func.count(Contrato.id).desc()
        ).limit(limit).all()
        
        return [
            {
                'nome': r.nome,
                'cpf_mascarado': f"***.***.{r.cpf[-7:]}" if r.cpf and len(r.cpf) >= 7 else "***.***.***-**",
                'valor_total': float(r.valor_total or 0),
                'total_contratos': r.total_contratos,
                'taxa_inadimplencia': 0.0  # Todos aqui são bons pagadores
            }
            for r in result
        ]

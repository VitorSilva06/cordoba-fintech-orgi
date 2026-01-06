from typing import Optional, List, Dict, Any
from decimal import Decimal

from sqlalchemy.orm import Session
from sqlalchemy import func, case, and_

from app.models.contrato import Contrato, StatusContrato
from app.models.cliente import Cliente
from app.schemas.contrato import ContratoCreate, ContratoUpdate


class ContratoRepository:
    """Camada de acesso a dados para Contratos"""

    def __init__(self, db: Session):
        self.db = db

    def _base_query(self, tenant_id: Optional[int] = None):
        """Query base com filtro opcional de tenant"""
        query = self.db.query(Contrato)
        if tenant_id is not None:
            query = query.filter(Contrato.tenant_id == tenant_id)
        return query

    def get_by_id(self, contrato_id: int, tenant_id: Optional[int] = None) -> Optional[Contrato]:
        return self._base_query(tenant_id).filter(Contrato.id == contrato_id).first()

    def list(
        self, 
        tenant_id: Optional[int] = None,
        status: Optional[StatusContrato] = None,
        skip: int = 0, 
        limit: int = 100
    ) -> List[Contrato]:
        query = self._base_query(tenant_id)
        if status:
            query = query.filter(Contrato.status == status)
        return query.offset(skip).limit(limit).all()

    def create(self, contrato_in: ContratoCreate, tenant_id: int) -> Contrato:
        contrato = Contrato(
            tenant_id=tenant_id,
            cliente_id=contrato_in.cliente_id,
            numero_contrato=contrato_in.numero_contrato,
            valor_original=contrato_in.valor_original,
            valor_atualizado=contrato_in.valor_atualizado,
            data_contrato=contrato_in.data_contrato,
            data_vencimento=contrato_in.data_vencimento,
            status=contrato_in.status,
            valor_pago=Decimal("0"),
        )
        self.db.add(contrato)
        self.db.commit()
        self.db.refresh(contrato)
        return contrato

    def update(self, contrato: Contrato, contrato_in: ContratoUpdate) -> Contrato:
        update_data = contrato_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(contrato, key, value)
        self.db.commit()
        self.db.refresh(contrato)
        return contrato

    # ----------------------------------
    # Queries para Dashboard Principal
    # ----------------------------------
    def count(self, tenant_id: Optional[int] = None) -> int:
        return self._base_query(tenant_id).count()

    def count_total(self, tenant_id: Optional[int] = None) -> int:
        return self.count(tenant_id)

    def sum_valor_original(self, tenant_id: Optional[int] = None) -> Decimal:
        """Soma total do valor original dos contratos"""
        query = self.db.query(func.sum(Contrato.valor_original))
        if tenant_id:
            query = query.filter(Contrato.tenant_id == tenant_id)
        result = query.scalar()
        return Decimal(result) if result else Decimal("0")

    def count_by_status(self, tenant_id: Optional[int] = None) -> Dict[str, int]:
        query = self.db.query(
            Contrato.status,
            func.count(Contrato.id).label('quantidade')
        )
        if tenant_id:
            query = query.filter(Contrato.tenant_id == tenant_id)
        result = query.group_by(Contrato.status).all()
        return {row.status.value if hasattr(row.status, 'value') else row.status: row.quantidade for row in result}

    def get_valor_total(self, tenant_id: Optional[int] = None) -> Decimal:
        query = self.db.query(func.sum(Contrato.valor_original))
        if tenant_id:
            query = query.filter(Contrato.tenant_id == tenant_id)
        result = query.scalar()
        return Decimal(result) if result else Decimal("0")

    def get_media_atraso(self, tenant_id: Optional[int] = None) -> float:
        """Calcula média de dias de atraso para contratos atrasados"""
        from datetime import date
        
        query = self.db.query(
            func.avg(
                func.julianday(func.current_date()) - 
                func.julianday(Contrato.data_vencimento)
            )
        ).filter(
            Contrato.status == StatusContrato.ATRASADO,
            Contrato.data_vencimento < date.today()
        )
        
        if tenant_id:
            query = query.filter(Contrato.tenant_id == tenant_id)
        
        result = query.scalar()
        return float(result) if result else 0.0

    def get_distribuicao_status(self, tenant_id: Optional[int] = None) -> List[Dict]:
        """Retorna distribuição de contratos por status com valores"""
        query = self.db.query(
            Contrato.status,
            func.count(Contrato.id).label('quantidade'),
            func.sum(Contrato.valor_original).label('valor_total')
        )
        if tenant_id:
            query = query.filter(Contrato.tenant_id == tenant_id)
        
        result = query.group_by(Contrato.status).all()
        total = sum(row.quantidade for row in result)
        
        return [
            {
                'status': row.status.value if hasattr(row.status, 'value') else row.status,
                'quantidade': row.quantidade,
                'percentual': (row.quantidade / total * 100) if total > 0 else 0,
                'valor_total': Decimal(row.valor_total or 0)
            }
            for row in result
        ]

    def get_faixas_atraso(self, tenant_id: Optional[int] = None) -> List[Dict]:
        """Retorna distribuição por faixa de atraso (D+)"""
        from datetime import date
        
        hoje = date.today()
        
        # Define as faixas
        faixas = [
            ('Em dia', 0, 0),
            ('D+1-30', 1, 30),
            ('D+31-60', 31, 60),
            ('D+61-90', 61, 90),
            ('D+91-180', 91, 180),
            ('D+180+', 181, 9999),
        ]
        
        resultados = []
        total_geral = 0
        
        for faixa_nome, min_dias, max_dias in faixas:
            query = self.db.query(
                func.count(Contrato.id).label('quantidade'),
                func.sum(Contrato.valor_original).label('valor_total')
            )
            
            if tenant_id:
                query = query.filter(Contrato.tenant_id == tenant_id)
            
            if min_dias == 0 and max_dias == 0:
                # Em dia: vencimento >= hoje ou já pago
                query = query.filter(
                    (Contrato.data_vencimento >= hoje) | 
                    (Contrato.status == StatusContrato.PAGO)
                )
            else:
                # Calcula dias de atraso
                query = query.filter(
                    Contrato.data_vencimento < hoje,
                    Contrato.status != StatusContrato.PAGO,
                    func.julianday(func.current_date()) - func.julianday(Contrato.data_vencimento) >= min_dias,
                    func.julianday(func.current_date()) - func.julianday(Contrato.data_vencimento) <= max_dias
                )
            
            row = query.first()
            quantidade = row.quantidade or 0
            total_geral += quantidade
            
            resultados.append({
                'faixa': faixa_nome,
                'quantidade': quantidade,
                'valor_total': Decimal(row.valor_total or 0)
            })
        
        # Calcula percentuais
        for r in resultados:
            r['percentual'] = (r['quantidade'] / total_geral * 100) if total_geral > 0 else 0
        
        return resultados

    def get_top_devedores(self, tenant_id: Optional[int] = None, limit: int = 10) -> List[Dict]:
        """Retorna top devedores com maior valor pendente"""
        from datetime import date
        
        query = self.db.query(
            Cliente.id,
            Cliente.nome,
            Cliente.cpf,
            func.count(Contrato.id).label('total_contratos'),
            func.sum(Contrato.valor_original - func.coalesce(Contrato.valor_pago, 0)).label('valor_pendente'),
            func.max(
                func.julianday(func.current_date()) - func.julianday(Contrato.data_vencimento)
            ).label('max_atraso')
        ).join(
            Contrato, Cliente.id == Contrato.cliente_id
        ).filter(
            Contrato.status != StatusContrato.PAGO
        )
        
        if tenant_id:
            query = query.filter(Contrato.tenant_id == tenant_id)
        
        result = query.group_by(
            Cliente.id, Cliente.nome, Cliente.cpf
        ).order_by(
            func.sum(Contrato.valor_original - func.coalesce(Contrato.valor_pago, 0)).desc()
        ).limit(limit).all()
        
        return [
            {
                'nome': row.nome,
                'cpf_mascarado': f"***.***{row.cpf[-7:]}" if row.cpf and len(row.cpf) >= 7 else "***.***.***-**",
                'total_contratos': row.total_contratos,
                'valor_pendente': Decimal(row.valor_pendente or 0),
                'max_atraso': int(row.max_atraso or 0)
            }
            for row in result
        ]

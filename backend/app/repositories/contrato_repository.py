from typing import Optional, List, Dict, Any
from decimal import Decimal

from sqlalchemy.orm import Session
from sqlalchemy import func, case, and_, or_

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

    # ========================================
    # Métodos para Dashboard Análise Clientes
    # ========================================
    
    def get_d_plus_medio(self, tenant_id: Optional[int] = None) -> float:
        """Retorna D+ médio (média de dias de atraso)"""
        from datetime import date
        hoje = date.today()
        
        query = self.db.query(
            func.avg(
                func.julianday(func.current_date()) - func.julianday(Contrato.data_vencimento)
            )
        ).filter(
            Contrato.data_vencimento < hoje,
            Contrato.status != StatusContrato.PAGO
        )
        
        if tenant_id:
            query = query.filter(Contrato.tenant_id == tenant_id)
        
        result = query.scalar()
        return round(float(result), 1) if result and result > 0 else 0.0

    def count_bons_pagadores(self, tenant_id: Optional[int] = None) -> int:
        """Conta clientes que pagaram todos os contratos"""
        # Subquery para clientes com contratos atrasados
        from sqlalchemy import exists, and_
        
        subquery = self.db.query(Cliente.id).join(
            Contrato, Cliente.id == Contrato.cliente_id
        ).filter(
            Contrato.status == StatusContrato.PAGO
        ).group_by(Cliente.id)
        
        if tenant_id:
            subquery = subquery.filter(Cliente.tenant_id == tenant_id)
        
        return subquery.count()

    def count_reincidentes(self, tenant_id: Optional[int] = None) -> int:
        """Conta clientes com mais de um contrato atrasado"""
        query = self.db.query(
            Cliente.id,
            func.count(Contrato.id).label('qtd_atrasados')
        ).join(
            Contrato, Cliente.id == Contrato.cliente_id
        ).filter(
            Contrato.status == StatusContrato.ATRASADO
        )
        
        if tenant_id:
            query = query.filter(Cliente.tenant_id == tenant_id)
        
        result = query.group_by(Cliente.id).having(
            func.count(Contrato.id) > 1
        ).all()
        
        return len(result)

    def count_inadimplentes(self, tenant_id: Optional[int] = None) -> int:
        """Conta clientes com pelo menos um contrato atrasado"""
        query = self.db.query(
            func.count(func.distinct(Contrato.cliente_id))
        ).filter(
            Contrato.status == StatusContrato.ATRASADO
        )
        
        if tenant_id:
            query = query.filter(Contrato.tenant_id == tenant_id)
        
        result = query.scalar()
        return result or 0

    def get_ticket_medio(self, tenant_id: Optional[int] = None) -> Decimal:
        """Retorna ticket médio dos contratos"""
        query = self.db.query(
            func.avg(Contrato.valor_original)
        )
        
        if tenant_id:
            query = query.filter(Contrato.tenant_id == tenant_id)
        
        result = query.scalar()
        return Decimal(round(float(result), 2)) if result else Decimal('0')

    def get_pontualidade_pagamento(self, tenant_id: Optional[int] = None) -> List[Dict]:
        """Retorna distribuição de pontualidade de pagamento"""
        from datetime import date
        hoje = date.today()
        
        categorias = [
            ('Em dia', lambda q: q.filter(
                (Contrato.data_vencimento >= hoje) | (Contrato.status == StatusContrato.PAGO)
            )),
            ('1-30 dias', lambda q: q.filter(
                Contrato.status != StatusContrato.PAGO,
                Contrato.data_vencimento < hoje,
                func.julianday(func.current_date()) - func.julianday(Contrato.data_vencimento) <= 30
            )),
            ('31-60 dias', lambda q: q.filter(
                Contrato.status != StatusContrato.PAGO,
                func.julianday(func.current_date()) - func.julianday(Contrato.data_vencimento) > 30,
                func.julianday(func.current_date()) - func.julianday(Contrato.data_vencimento) <= 60
            )),
            ('61-90 dias', lambda q: q.filter(
                Contrato.status != StatusContrato.PAGO,
                func.julianday(func.current_date()) - func.julianday(Contrato.data_vencimento) > 60,
                func.julianday(func.current_date()) - func.julianday(Contrato.data_vencimento) <= 90
            )),
            ('90+ dias', lambda q: q.filter(
                Contrato.status != StatusContrato.PAGO,
                func.julianday(func.current_date()) - func.julianday(Contrato.data_vencimento) > 90
            )),
        ]
        
        resultados = []
        total = 0
        
        for categoria, filtro in categorias:
            query = self.db.query(func.count(Contrato.id))
            if tenant_id:
                query = query.filter(Contrato.tenant_id == tenant_id)
            query = filtro(query)
            qtd = query.scalar() or 0
            total += qtd
            resultados.append({'categoria': categoria, 'quantidade': qtd})
        
        # Calcula percentuais
        for r in resultados:
            r['percentual'] = round((r['quantidade'] / total * 100), 2) if total > 0 else 0
        
        return resultados

    def get_distribuicao_reincidencia(self, tenant_id: Optional[int] = None) -> List[Dict]:
        """Retorna distribuição de reincidência"""
        # Conta quantos contratos atrasados cada cliente tem
        subquery = self.db.query(
            Contrato.cliente_id,
            func.count(Contrato.id).label('qtd_atrasados')
        ).filter(
            Contrato.status == StatusContrato.ATRASADO
        )
        
        if tenant_id:
            subquery = subquery.filter(Contrato.tenant_id == tenant_id)
        
        subquery = subquery.group_by(Contrato.cliente_id).subquery()
        
        # Primeira vez (1 contrato), Reincidente (2-3), Crônico (4+)
        query_primeira = self.db.query(func.count()).select_from(subquery).filter(subquery.c.qtd_atrasados == 1)
        query_reincidente = self.db.query(func.count()).select_from(subquery).filter(
            subquery.c.qtd_atrasados >= 2, subquery.c.qtd_atrasados <= 3
        )
        query_cronico = self.db.query(func.count()).select_from(subquery).filter(subquery.c.qtd_atrasados >= 4)
        
        primeira = query_primeira.scalar() or 0
        reincidente = query_reincidente.scalar() or 0
        cronico = query_cronico.scalar() or 0
        
        total = primeira + reincidente + cronico or 1
        
        return [
            {'categoria': 'Primeira vez', 'quantidade': primeira, 'percentual': round(primeira/total*100, 2)},
            {'categoria': 'Reincidente', 'quantidade': reincidente, 'percentual': round(reincidente/total*100, 2)},
            {'categoria': 'Crônico', 'quantidade': cronico, 'percentual': round(cronico/total*100, 2)},
        ]

    def get_inadimplencia_por_faixa_valor(self, tenant_id: Optional[int] = None) -> List[Dict]:
        """Retorna inadimplência por faixa de valor"""
        faixas = [
            ('R$ 0-1k', 0, 1000),
            ('R$ 1k-5k', 1000, 5000),
            ('R$ 5k-10k', 5000, 10000),
            ('R$ 10k-50k', 10000, 50000),
            ('R$ 50k+', 50000, 999999999),
        ]
        
        resultados = []
        total = 0
        
        for faixa_nome, min_val, max_val in faixas:
            query = self.db.query(
                func.count(Contrato.id).label('quantidade'),
                func.sum(Contrato.valor_original).label('valor_total')
            ).filter(
                Contrato.status == StatusContrato.ATRASADO,
                Contrato.valor_original >= min_val,
                Contrato.valor_original < max_val
            )
            
            if tenant_id:
                query = query.filter(Contrato.tenant_id == tenant_id)
            
            row = query.first()
            qtd = row.quantidade or 0
            total += qtd
            
            resultados.append({
                'faixa_valor': faixa_nome,
                'quantidade': qtd,
                'valor_total': Decimal(row.valor_total or 0)
            })
        
        for r in resultados:
            r['percentual'] = round((r['quantidade'] / total * 100), 2) if total > 0 else 0
        
        return resultados

    def get_evolucao_mensal(self, tenant_id: Optional[int] = None, meses: int = 6) -> List[Dict]:
        """Retorna evolução mensal de inadimplência (últimos N meses)"""
        from datetime import date, timedelta
        from sqlalchemy import extract
        
        hoje = date.today()
        resultados = []
        
        for i in range(meses - 1, -1, -1):
            # Calcula mês
            mes_data = hoje - timedelta(days=i * 30)
            mes_str = mes_data.strftime('%b/%y')
            
            # Novos inadimplentes no mês (contratos que passaram da data de vencimento)
            query_novos = self.db.query(func.count(Contrato.id)).filter(
                extract('month', Contrato.data_vencimento) == mes_data.month,
                extract('year', Contrato.data_vencimento) == mes_data.year,
                Contrato.status == StatusContrato.ATRASADO
            )
            
            # Recuperados no mês (pagos no mês)
            query_recuperados = self.db.query(func.count(Contrato.id)).filter(
                extract('month', Contrato.data_pagamento) == mes_data.month,
                extract('year', Contrato.data_pagamento) == mes_data.year,
                Contrato.status == StatusContrato.PAGO
            )
            
            if tenant_id:
                query_novos = query_novos.filter(Contrato.tenant_id == tenant_id)
                query_recuperados = query_recuperados.filter(Contrato.tenant_id == tenant_id)
            
            novos = query_novos.scalar() or 0
            recuperados = query_recuperados.scalar() or 0
            
            resultados.append({
                'mes': mes_str,
                'novos_inadimplentes': novos,
                'recuperados': recuperados,
                'taxa_recuperacao': round((recuperados / novos * 100), 2) if novos > 0 else 0
            })
        
        return resultados

    def get_analise_por_faixa_atraso(self, tenant_id: Optional[int] = None) -> List[Dict]:
        """Retorna análise detalhada por faixa de atraso (D+)"""
        from datetime import date
        from sqlalchemy import extract, case
        
        hoje = date.today()
        
        faixas = [
            ('D+0-30', 0, 30),
            ('D+31-60', 31, 60),
            ('D+61-90', 61, 90),
            ('D+91-180', 91, 180),
            ('D+180+', 181, 9999),
        ]
        
        resultados = []
        
        for faixa_nome, min_dias, max_dias in faixas:
            # Query base para a faixa
            base_filter = [
                Contrato.status != StatusContrato.PAGO,
                Contrato.data_vencimento < hoje,
                func.julianday(func.current_date()) - func.julianday(Contrato.data_vencimento) >= min_dias,
                func.julianday(func.current_date()) - func.julianday(Contrato.data_vencimento) <= max_dias
            ]
            
            query = self.db.query(
                func.count(func.distinct(Contrato.cliente_id)).label('total_clientes'),
                func.sum(Contrato.valor_original).label('valor_total'),
                func.avg(
                    extract('year', func.current_date()) - extract('year', Cliente.data_nascimento)
                ).label('idade_media'),
                func.sum(case((Cliente.sexo == 'M', 1), else_=0)).label('sexo_m'),
                func.sum(case((Cliente.sexo == 'F', 1), else_=0)).label('sexo_f'),
            ).join(
                Cliente, Contrato.cliente_id == Cliente.id
            ).filter(*base_filter)
            
            if tenant_id:
                query = query.filter(Contrato.tenant_id == tenant_id)
            
            row = query.first()
            
            # Calcula reincidência para esta faixa
            total_clientes = row.total_clientes or 0
            
            resultados.append({
                'faixa_d_plus': faixa_nome,
                'total_clientes': total_clientes,
                'valor_total': Decimal(row.valor_total or 0),
                'idade_media': round(float(row.idade_media or 0), 1),
                'sexo_m': row.sexo_m or 0,
                'sexo_f': row.sexo_f or 0,
                'reincidencia': 0.0  # Simplificado por enquanto
            })
        
        return resultados

    def get_perfil_risco(self, tenant_id: Optional[int] = None) -> List[Dict]:
        """Retorna distribuição de clientes por perfil de risco"""
        from datetime import date
        
        hoje = date.today()
        
        # Definição dos perfis de risco baseado em dias de atraso
        perfis = [
            {'nivel': 'Baixo', 'descricao': 'Pagamento em dia ou até 30 dias', 'min_dias': 0, 'max_dias': 30},
            {'nivel': 'Médio', 'descricao': 'Atraso de 31 a 90 dias', 'min_dias': 31, 'max_dias': 90},
            {'nivel': 'Alto', 'descricao': 'Atraso acima de 90 dias', 'min_dias': 91, 'max_dias': 9999},
        ]
        
        # Total de clientes para cálculo de percentual
        total_query = self.db.query(func.count(func.distinct(Contrato.cliente_id)))
        if tenant_id:
            total_query = total_query.filter(Contrato.tenant_id == tenant_id)
        total_clientes = total_query.scalar() or 1  # Evita divisão por zero
        
        resultados = []
        
        for perfil in perfis:
            # Clientes em dia (pagos ou não vencidos) vão para "Baixo"
            if perfil['nivel'] == 'Baixo':
                query = self.db.query(func.count(func.distinct(Contrato.cliente_id))).filter(
                    or_(
                        Contrato.status == StatusContrato.PAGO,
                        and_(
                            Contrato.status == StatusContrato.ATIVO,
                            Contrato.data_vencimento >= hoje
                        ),
                        and_(
                            Contrato.data_vencimento < hoje,
                            func.julianday(func.current_date()) - func.julianday(Contrato.data_vencimento) <= 30
                        )
                    )
                )
            else:
                query = self.db.query(func.count(func.distinct(Contrato.cliente_id))).filter(
                    Contrato.data_vencimento < hoje,
                    func.julianday(func.current_date()) - func.julianday(Contrato.data_vencimento) >= perfil['min_dias'],
                    func.julianday(func.current_date()) - func.julianday(Contrato.data_vencimento) <= perfil['max_dias']
                )
            
            if tenant_id:
                query = query.filter(Contrato.tenant_id == tenant_id)
            
            quantidade = query.scalar() or 0
            percentual = round((quantidade / total_clientes * 100), 1) if total_clientes > 0 else 0
            
            resultados.append({
                'nivel': perfil['nivel'],
                'descricao': perfil['descricao'],
                'percentual': percentual,
                'quantidade': quantidade
            })
        
        return resultados

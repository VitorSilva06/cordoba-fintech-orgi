import pandas as pd
from typing import List, Dict, Any, Optional
from decimal import Decimal
from datetime import datetime, date
from io import BytesIO

from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException, status

from app.models.cliente import Cliente, Sexo
from app.models.contrato import Contrato, StatusContrato
from app.repositories.cliente_repository import ClienteRepository
from app.repositories.contrato_repository import ContratoRepository


class UploadService:
    """Serviço para processamento de uploads de base Excel"""

    # Mapeamento das colunas esperadas
    REQUIRED_COLUMNS = {
        'nome': ['nome', 'name', 'cliente', 'devedor'],
        'cpf': ['cpf', 'cpf_cnpj', 'documento'],
        'valor': ['valor', 'valor_original', 'value', 'divida', 'valor_divida'],
        'vencimento': ['vencimento', 'data_vencimento', 'dt_vencimento', 'due_date'],
    }

    OPTIONAL_COLUMNS = {
        'data_nascimento': ['data_nascimento', 'nascimento', 'dt_nascimento', 'birth_date'],
        'sexo': ['sexo', 'genero', 'gender'],
        'telefone': ['telefone', 'tel', 'phone', 'celular'],
        'email': ['email', 'e-mail'],
        'numero_contrato': ['numero_contrato', 'contrato', 'num_contrato', 'contract'],
        'status': ['status', 'situacao'],
        'data_contrato': ['data_contrato', 'dt_contrato'],
    }

    def __init__(self, db: Session):
        self.db = db
        self.cliente_repo = ClienteRepository(db)
        self.contrato_repo = ContratoRepository(db)

    def _find_column(self, df_columns: List[str], possible_names: List[str]) -> Optional[str]:
        """Encontra o nome da coluna no DataFrame"""
        df_columns_lower = [c.lower().strip() for c in df_columns]
        for name in possible_names:
            if name.lower() in df_columns_lower:
                idx = df_columns_lower.index(name.lower())
                return df_columns[idx]
        return None

    def _map_columns(self, df: pd.DataFrame) -> Dict[str, str]:
        """Mapeia colunas do DataFrame para os nomes esperados"""
        mapping = {}
        
        # Colunas obrigatórias
        for field, possible_names in self.REQUIRED_COLUMNS.items():
            col = self._find_column(list(df.columns), possible_names)
            if col is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Coluna obrigatória não encontrada: {field}. Possíveis nomes: {possible_names}"
                )
            mapping[field] = col
        
        # Colunas opcionais
        for field, possible_names in self.OPTIONAL_COLUMNS.items():
            col = self._find_column(list(df.columns), possible_names)
            if col:
                mapping[field] = col
        
        return mapping

    def _parse_date(self, value) -> Optional[date]:
        """Converte valor para date"""
        if pd.isna(value) or value is None:
            return None
        if isinstance(value, (datetime, date)):
            return value if isinstance(value, date) else value.date()
        try:
            return pd.to_datetime(value).date()
        except:
            return None

    def _parse_decimal(self, value) -> Decimal:
        """Converte valor para Decimal"""
        if pd.isna(value) or value is None:
            return Decimal("0")
        try:
            # Remove formatação brasileira
            if isinstance(value, str):
                value = value.replace("R$", "").replace(".", "").replace(",", ".").strip()
            return Decimal(str(value))
        except:
            return Decimal("0")

    def _parse_cpf(self, value) -> str:
        """Normaliza CPF"""
        if pd.isna(value) or value is None:
            return ""
        cpf = str(value).strip()
        # Remove caracteres não numéricos
        cpf_nums = ''.join(filter(str.isdigit, cpf))
        # Formata XXX.XXX.XXX-XX
        if len(cpf_nums) == 11:
            return f"{cpf_nums[:3]}.{cpf_nums[3:6]}.{cpf_nums[6:9]}-{cpf_nums[9:]}"
        return cpf

    def _parse_sexo(self, value) -> Optional[Sexo]:
        """Converte valor para Sexo"""
        if pd.isna(value) or value is None:
            return None
        v = str(value).upper().strip()
        if v in ['M', 'MASCULINO', 'MASC', 'MALE']:
            return Sexo.MASCULINO
        elif v in ['F', 'FEMININO', 'FEM', 'FEMALE']:
            return Sexo.FEMININO
        return Sexo.OUTRO

    def _parse_status(self, value) -> StatusContrato:
        """Converte valor para StatusContrato"""
        if pd.isna(value) or value is None:
            return StatusContrato.ATIVO
        v = str(value).lower().strip()
        if v in ['pago', 'quitado', 'paid']:
            return StatusContrato.PAGO
        elif v in ['atrasado', 'atraso', 'vencido', 'late', 'overdue']:
            return StatusContrato.ATRASADO
        elif v in ['cancelado', 'cancelled']:
            return StatusContrato.CANCELADO
        elif v in ['negociado', 'renegociado']:
            return StatusContrato.NEGOCIADO
        return StatusContrato.ATIVO

    async def process_excel(
        self, 
        file: UploadFile, 
        tenant_id: int
    ) -> Dict[str, Any]:
        """
        Processa arquivo Excel e importa clientes/contratos.
        
        Retorna relatório com quantidade de registros processados.
        """
        # Valida extensão
        if not file.filename.endswith(('.xlsx', '.xls')):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Arquivo deve ser Excel (.xlsx ou .xls)"
            )
        
        # Lê o arquivo
        try:
            contents = await file.read()
            df = pd.read_excel(BytesIO(contents))
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Erro ao ler arquivo Excel: {str(e)}"
            )
        
        if df.empty:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Arquivo Excel está vazio"
            )
        
        # Mapeia colunas
        col_map = self._map_columns(df)
        
        # Processa registros
        clientes_criados = 0
        contratos_criados = 0
        erros = []
        
        for idx, row in df.iterrows():
            try:
                # Dados do cliente
                cpf = self._parse_cpf(row[col_map['cpf']])
                if not cpf:
                    erros.append(f"Linha {idx + 2}: CPF inválido")
                    continue
                
                # Busca ou cria cliente
                cliente = self.cliente_repo.get_by_cpf(cpf, tenant_id)
                if not cliente:
                    cliente = Cliente(
                        tenant_id=tenant_id,
                        nome=str(row[col_map['nome']]).strip(),
                        cpf=cpf,
                        data_nascimento=self._parse_date(row.get(col_map.get('data_nascimento'))),
                        sexo=self._parse_sexo(row.get(col_map.get('sexo'))),
                        telefone=str(row.get(col_map.get('telefone'), '')).strip() or None,
                        email=str(row.get(col_map.get('email'), '')).strip() or None,
                    )
                    self.db.add(cliente)
                    self.db.flush()  # Para obter o ID
                    clientes_criados += 1
                
                # Cria contrato
                contrato = Contrato(
                    tenant_id=tenant_id,
                    cliente_id=cliente.id,
                    numero_contrato=str(row.get(col_map.get('numero_contrato'), '')).strip() or None,
                    valor_original=self._parse_decimal(row[col_map['valor']]),
                    data_vencimento=self._parse_date(row[col_map['vencimento']]),
                    data_contrato=self._parse_date(row.get(col_map.get('data_contrato'))),
                    status=self._parse_status(row.get(col_map.get('status'))),
                    valor_pago=Decimal("0"),
                )
                
                if contrato.valor_original <= 0:
                    erros.append(f"Linha {idx + 2}: Valor inválido")
                    continue
                
                if contrato.data_vencimento is None:
                    erros.append(f"Linha {idx + 2}: Data de vencimento inválida")
                    continue
                
                self.db.add(contrato)
                contratos_criados += 1
                
            except Exception as e:
                erros.append(f"Linha {idx + 2}: {str(e)}")
        
        # Commit
        self.db.commit()
        
        return {
            "arquivo": file.filename,
            "total_linhas": len(df),
            "clientes_criados": clientes_criados,
            "contratos_criados": contratos_criados,
            "erros": erros[:20],  # Limita a 20 erros
            "total_erros": len(erros),
        }

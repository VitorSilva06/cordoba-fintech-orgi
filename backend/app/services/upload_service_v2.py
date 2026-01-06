"""
Serviço Completo para Upload e Gestão de Base
Inclui: Preview, Validação, Importação, Atualização
"""
import pandas as pd
import uuid
from typing import List, Dict, Any, Optional, Tuple
from decimal import Decimal
from datetime import datetime, date
from io import BytesIO

from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import UploadFile, HTTPException, status

from app.models.cliente import Cliente, Sexo
from app.models.contrato import Contrato, StatusContrato
from app.models.importacao_log import ImportacaoLog, TipoImportacao as TipoImportacaoModel, StatusImportacao as StatusImportacaoModel
from app.repositories.cliente_repository import ClienteRepository
from app.repositories.contrato_repository import ContratoRepository
from app.schemas.upload import (
    TipoImportacao, StatusImportacao, StatusValidacao,
    CampoObrigatorio, CampoOpcional, EstruturaCampos,
    LinhaPreview, PreviewUpload, ResultadoImportacao,
    LogImportacao, ListaLogsImportacao
)


class UploadService:
    """Serviço completo para processamento de uploads de base"""

    # Mapeamento das colunas esperadas - OBRIGATÓRIAS
    REQUIRED_COLUMNS = {
        'cpf': {
            'alternativas': ['cpf', 'cpf_cnpj', 'documento', 'doc'],
            'descricao': 'CPF do devedor (somente números ou com formatação)',
            'tipo': 'texto',
            'exemplo': '123.456.789-00'
        },
        'nome': {
            'alternativas': ['nome', 'name', 'cliente', 'devedor', 'nome_cliente'],
            'descricao': 'Nome completo do devedor',
            'tipo': 'texto',
            'exemplo': 'João da Silva'
        },
        'valor': {
            'alternativas': ['valor', 'valor_original', 'value', 'divida', 'valor_divida', 'valor_devido'],
            'descricao': 'Valor da dívida',
            'tipo': 'numérico',
            'exemplo': '1500.00'
        },
        'vencimento': {
            'alternativas': ['vencimento', 'data_vencimento', 'dt_vencimento', 'due_date', 'data_vcto'],
            'descricao': 'Data de vencimento da dívida',
            'tipo': 'data',
            'exemplo': '2024-12-31'
        },
    }

    # Colunas opcionais
    OPTIONAL_COLUMNS = {
        'data_nascimento': {
            'alternativas': ['data_nascimento', 'nascimento', 'dt_nascimento', 'birth_date', 'dt_nasc'],
            'descricao': 'Data de nascimento do devedor',
            'tipo': 'data',
            'exemplo': '1985-05-15'
        },
        'sexo': {
            'alternativas': ['sexo', 'genero', 'gender', 'sex'],
            'descricao': 'Sexo (M/F)',
            'tipo': 'texto',
            'exemplo': 'M'
        },
        'telefone': {
            'alternativas': ['telefone', 'tel', 'phone', 'celular', 'fone', 'contato'],
            'descricao': 'Telefone de contato',
            'tipo': 'texto',
            'exemplo': '(11) 99999-8888'
        },
        'email': {
            'alternativas': ['email', 'e-mail', 'mail'],
            'descricao': 'E-mail do devedor',
            'tipo': 'texto',
            'exemplo': 'joao@email.com'
        },
        'numero_contrato': {
            'alternativas': ['numero_contrato', 'contrato', 'num_contrato', 'contract', 'nro_contrato'],
            'descricao': 'Número do contrato',
            'tipo': 'texto',
            'exemplo': 'CTR-2024-001'
        },
        'status': {
            'alternativas': ['status', 'situacao', 'status_contrato'],
            'descricao': 'Status do contrato (ativo, atrasado, pago)',
            'tipo': 'texto',
            'exemplo': 'ativo'
        },
        'data_contrato': {
            'alternativas': ['data_contrato', 'dt_contrato', 'data_emissao'],
            'descricao': 'Data de emissão do contrato',
            'tipo': 'data',
            'exemplo': '2024-01-15'
        },
        'endereco': {
            'alternativas': ['endereco', 'address', 'logradouro', 'rua'],
            'descricao': 'Endereço completo',
            'tipo': 'texto',
            'exemplo': 'Rua das Flores, 123'
        },
        'cidade': {
            'alternativas': ['cidade', 'city', 'municipio'],
            'descricao': 'Cidade',
            'tipo': 'texto',
            'exemplo': 'São Paulo'
        },
        'estado': {
            'alternativas': ['estado', 'uf', 'state'],
            'descricao': 'Estado (UF)',
            'tipo': 'texto',
            'exemplo': 'SP'
        },
        'cep': {
            'alternativas': ['cep', 'zip', 'postal_code'],
            'descricao': 'CEP',
            'tipo': 'texto',
            'exemplo': '01234-567'
        },
    }

    # Cache de preview para confirmar importação
    _preview_cache: Dict[str, Dict] = {}

    def __init__(self, db: Session):
        self.db = db
        self.cliente_repo = ClienteRepository(db)
        self.contrato_repo = ContratoRepository(db)

    # ==========================================
    # MÉTODOS PÚBLICOS
    # ==========================================

    def get_estrutura_campos(self) -> EstruturaCampos:
        """Retorna a estrutura de campos esperados para o upload"""
        obrigatorios = [
            CampoObrigatorio(
                nome=nome,
                descricao=info['descricao'],
                tipo=info['tipo'],
                exemplo=info['exemplo'],
                alternativas=info['alternativas']
            )
            for nome, info in self.REQUIRED_COLUMNS.items()
        ]
        
        opcionais = [
            CampoOpcional(
                nome=nome,
                descricao=info['descricao'],
                tipo=info['tipo'],
                exemplo=info['exemplo'],
                alternativas=info['alternativas']
            )
            for nome, info in self.OPTIONAL_COLUMNS.items()
        ]
        
        return EstruturaCampos(obrigatorios=obrigatorios, opcionais=opcionais)

    async def preview_upload(
        self, 
        file: UploadFile, 
        tenant_id: int,
        tipo_importacao: TipoImportacao = TipoImportacao.INCREMENTAL
    ) -> PreviewUpload:
        """
        Gera preview do upload sem importar.
        Analisa arquivo, mapeia colunas, identifica novos vs atualizações.
        """
        # Lê o arquivo
        df = await self._read_file(file)
        
        # Mapeia colunas
        col_map = self._map_columns(df)
        
        # Analisa cada linha
        preview_linhas = []
        novos = 0
        atualizacoes = 0
        duplicados = 0
        invalidos = 0
        
        cpfs_vistos = set()
        
        for idx, row in df.iterrows():
            linha_num = idx + 2  # +2 porque Excel começa em 1 e tem header
            
            # Valida e extrai dados
            erros = []
            cpf = self._parse_cpf(row.get(col_map.get('cpf')))
            nome = str(row.get(col_map.get('nome'), '')).strip()
            valor = self._parse_decimal(row.get(col_map.get('valor')))
            vencimento = self._parse_date(row.get(col_map.get('vencimento')))
            
            # Validações
            if not cpf or len(cpf.replace('.', '').replace('-', '')) != 11:
                erros.append("CPF inválido")
            if not nome:
                erros.append("Nome obrigatório")
            if valor <= 0:
                erros.append("Valor deve ser maior que zero")
            if not vencimento:
                erros.append("Data de vencimento inválida")
            
            # Verifica duplicado no arquivo
            if cpf in cpfs_vistos:
                status_val = StatusValidacao.DUPLICADO
                acao = "ignorar"
                duplicados += 1
            elif erros:
                status_val = StatusValidacao.ERRO
                acao = "ignorar"
                invalidos += 1
            else:
                # Verifica se existe no banco
                cliente_existente = self.cliente_repo.get_by_cpf(cpf, tenant_id) if cpf else None
                
                if cliente_existente:
                    status_val = StatusValidacao.ATUALIZAR
                    acao = "atualizar"
                    atualizacoes += 1
                else:
                    status_val = StatusValidacao.NOVO
                    acao = "criar"
                    novos += 1
            
            cpfs_vistos.add(cpf)
            
            # Dados existentes para preview
            dados_existentes = None
            if status_val == StatusValidacao.ATUALIZAR and cliente_existente:
                dados_existentes = {
                    "nome": cliente_existente.nome,
                    "telefone": cliente_existente.telefone,
                    "email": cliente_existente.email,
                }
            
            preview_linhas.append(LinhaPreview(
                linha=linha_num,
                cpf=self._mask_cpf(cpf) if cpf else None,
                nome=nome[:50] if nome else None,
                valor=valor if valor > 0 else None,
                vencimento=vencimento,
                status_validacao=status_val,
                acao=acao,
                erros=erros,
                dados_existentes=dados_existentes
            ))
        
        # Gera ID do preview e salva em cache
        preview_id = str(uuid.uuid4())
        self._preview_cache[preview_id] = {
            'df': df,
            'col_map': col_map,
            'tenant_id': tenant_id,
            'tipo_importacao': tipo_importacao,
            'arquivo': file.filename,
            'timestamp': datetime.now()
        }
        
        return PreviewUpload(
            arquivo=file.filename,
            total_linhas=len(df),
            linhas_validas=novos + atualizacoes,
            linhas_invalidas=invalidos + duplicados,
            novos_clientes=novos,
            atualizacoes=atualizacoes,
            duplicados=duplicados,
            preview=preview_linhas[:100],  # Limita a 100 linhas no preview
            colunas_encontradas=list(df.columns),
            colunas_mapeadas=col_map
        )

    async def confirmar_importacao(
        self,
        preview_id: str,
        tenant_id: int,
        usuario_id: int,
        sobrescrever: bool = False
    ) -> ResultadoImportacao:
        """
        Confirma e executa a importação após preview.
        """
        # Recupera preview do cache
        if preview_id not in self._preview_cache:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Preview expirado ou inválido. Faça upload novamente."
            )
        
        cache = self._preview_cache[preview_id]
        df = cache['df']
        col_map = cache['col_map']
        tipo_importacao = cache['tipo_importacao']
        arquivo = cache['arquivo']
        
        # Cria log de importação
        log_uuid = str(uuid.uuid4())
        log = ImportacaoLog(
            uuid=log_uuid,
            tenant_id=tenant_id,
            usuario_id=usuario_id,
            nome_arquivo=arquivo,
            tipo=TipoImportacaoModel(tipo_importacao.value),
            status=StatusImportacaoModel.PROCESSANDO,
            total_linhas=len(df),
            colunas_mapeadas=col_map,
            data_inicio=datetime.now()
        )
        self.db.add(log)
        self.db.flush()
        
        # Processa importação
        resultado = await self._processar_importacao(
            df, col_map, tenant_id, usuario_id, sobrescrever, log
        )
        
        # Remove do cache
        del self._preview_cache[preview_id]
        
        return resultado

    async def importar_direto(
        self,
        file: UploadFile,
        tenant_id: int,
        usuario_id: int,
        tipo_importacao: TipoImportacao = TipoImportacao.INCREMENTAL,
        sobrescrever: bool = False
    ) -> ResultadoImportacao:
        """
        Importa arquivo diretamente sem preview.
        """
        # Lê o arquivo
        df = await self._read_file(file)
        
        # Mapeia colunas
        col_map = self._map_columns(df)
        
        # Cria log de importação
        log_uuid = str(uuid.uuid4())
        log = ImportacaoLog(
            uuid=log_uuid,
            tenant_id=tenant_id,
            usuario_id=usuario_id,
            nome_arquivo=file.filename,
            tipo=TipoImportacaoModel(tipo_importacao.value),
            status=StatusImportacaoModel.PROCESSANDO,
            total_linhas=len(df),
            colunas_mapeadas=col_map,
            data_inicio=datetime.now()
        )
        self.db.add(log)
        self.db.flush()
        
        # Processa
        return await self._processar_importacao(
            df, col_map, tenant_id, usuario_id, sobrescrever, log
        )

    def get_logs_importacao(
        self,
        tenant_id: Optional[int] = None,
        pagina: int = 1,
        por_pagina: int = 20
    ) -> ListaLogsImportacao:
        """Retorna logs de importação"""
        query = self.db.query(ImportacaoLog)
        
        if tenant_id:
            query = query.filter(ImportacaoLog.tenant_id == tenant_id)
        
        total = query.count()
        
        logs = query.order_by(
            ImportacaoLog.data_inicio.desc()
        ).offset(
            (pagina - 1) * por_pagina
        ).limit(por_pagina).all()
        
        return ListaLogsImportacao(
            logs=[
                LogImportacao(
                    id=log.uuid,
                    arquivo=log.nome_arquivo,
                    tipo=TipoImportacao(log.tipo.value),
                    status=StatusImportacao(log.status.value),
                    total_linhas=log.total_linhas,
                    processados=log.linhas_processadas,
                    erros=log.total_erros,
                    data=log.data_inicio,
                    usuario=log.usuario.nome if log.usuario else "Sistema",
                    tenant_nome=log.tenant.nome if log.tenant else None
                )
                for log in logs
            ],
            total=total,
            pagina=pagina,
            por_pagina=por_pagina
        )

    # ==========================================
    # MÉTODOS AUXILIARES PRIVADOS
    # ==========================================

    async def _read_file(self, file: UploadFile) -> pd.DataFrame:
        """Lê arquivo Excel ou CSV"""
        filename = file.filename.lower()
        contents = await file.read()
        
        try:
            if filename.endswith('.csv'):
                # Tenta diferentes encodings
                for encoding in ['utf-8', 'latin-1', 'cp1252']:
                    try:
                        df = pd.read_csv(BytesIO(contents), encoding=encoding)
                        break
                    except:
                        continue
                else:
                    raise ValueError("Não foi possível ler o arquivo CSV")
            elif filename.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(BytesIO(contents))
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Formato não suportado. Use Excel (.xlsx, .xls) ou CSV (.csv)"
                )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Erro ao ler arquivo: {str(e)}"
            )
        
        if df.empty:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Arquivo está vazio"
            )
        
        return df

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
        for field, info in self.REQUIRED_COLUMNS.items():
            col = self._find_column(list(df.columns), info['alternativas'])
            if col is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Coluna obrigatória não encontrada: {field}. Possíveis nomes: {info['alternativas']}"
                )
            mapping[field] = col
        
        # Colunas opcionais
        for field, info in self.OPTIONAL_COLUMNS.items():
            col = self._find_column(list(df.columns), info['alternativas'])
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
            if isinstance(value, str):
                value = value.replace("R$", "").replace(".", "").replace(",", ".").strip()
            return Decimal(str(float(value)))
        except:
            return Decimal("0")

    def _parse_cpf(self, value) -> str:
        """Normaliza CPF"""
        if pd.isna(value) or value is None:
            return ""
        cpf = str(value).strip()
        cpf_nums = ''.join(filter(str.isdigit, cpf))
        if len(cpf_nums) == 11:
            return f"{cpf_nums[:3]}.{cpf_nums[3:6]}.{cpf_nums[6:9]}-{cpf_nums[9:]}"
        return cpf

    def _mask_cpf(self, cpf: str) -> str:
        """Mascara CPF para exibição"""
        if not cpf:
            return "***.***.***-**"
        nums = ''.join(filter(str.isdigit, cpf))
        if len(nums) >= 5:
            return f"***.***.*{nums[-5:-2]}-{nums[-2:]}"
        return "***.***.***-**"

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

    async def _processar_importacao(
        self,
        df: pd.DataFrame,
        col_map: Dict[str, str],
        tenant_id: int,
        usuario_id: int,
        sobrescrever: bool,
        log: ImportacaoLog
    ) -> ResultadoImportacao:
        """Processa a importação efetivamente"""
        clientes_criados = 0
        clientes_atualizados = 0
        contratos_criados = 0
        contratos_atualizados = 0
        erros = []
        linhas_processadas = 0
        
        cpfs_processados = set()
        
        try:
            for idx, row in df.iterrows():
                try:
                    cpf = self._parse_cpf(row.get(col_map.get('cpf')))
                    
                    if not cpf or cpf in cpfs_processados:
                        continue
                    
                    cpfs_processados.add(cpf)
                    
                    # Dados do cliente
                    nome = str(row.get(col_map.get('nome'), '')).strip()
                    valor = self._parse_decimal(row.get(col_map.get('valor')))
                    vencimento = self._parse_date(row.get(col_map.get('vencimento')))
                    
                    if not nome or valor <= 0 or not vencimento:
                        erros.append(f"Linha {idx + 2}: Dados obrigatórios inválidos")
                        continue
                    
                    # Busca cliente existente
                    cliente = self.cliente_repo.get_by_cpf(cpf, tenant_id)
                    
                    if cliente:
                        # Atualiza se sobrescrever
                        if sobrescrever:
                            cliente.nome = nome
                            if 'telefone' in col_map:
                                cliente.telefone = str(row.get(col_map['telefone'], '')).strip() or cliente.telefone
                            if 'email' in col_map:
                                cliente.email = str(row.get(col_map['email'], '')).strip() or cliente.email
                            if 'data_nascimento' in col_map:
                                cliente.data_nascimento = self._parse_date(row.get(col_map['data_nascimento'])) or cliente.data_nascimento
                            if 'sexo' in col_map:
                                cliente.sexo = self._parse_sexo(row.get(col_map['sexo'])) or cliente.sexo
                            clientes_atualizados += 1
                    else:
                        # Cria novo cliente
                        cliente = Cliente(
                            tenant_id=tenant_id,
                            nome=nome,
                            cpf=cpf,
                            data_nascimento=self._parse_date(row.get(col_map.get('data_nascimento'))),
                            sexo=self._parse_sexo(row.get(col_map.get('sexo'))),
                            telefone=str(row.get(col_map.get('telefone'), '')).strip() or None,
                            email=str(row.get(col_map.get('email'), '')).strip() or None,
                            endereco=str(row.get(col_map.get('endereco'), '')).strip() or None,
                            cidade=str(row.get(col_map.get('cidade'), '')).strip() or None,
                            estado=str(row.get(col_map.get('estado'), '')).strip()[:2].upper() or None,
                            cep=str(row.get(col_map.get('cep'), '')).strip() or None,
                        )
                        self.db.add(cliente)
                        self.db.flush()
                        clientes_criados += 1
                    
                    # Cria contrato
                    numero_contrato = str(row.get(col_map.get('numero_contrato'), '')).strip() or None
                    
                    # Verifica se contrato já existe
                    contrato_existente = None
                    if numero_contrato:
                        contrato_existente = self.db.query(Contrato).filter(
                            Contrato.tenant_id == tenant_id,
                            Contrato.numero_contrato == numero_contrato
                        ).first()
                    
                    if contrato_existente and sobrescrever:
                        contrato_existente.valor_original = valor
                        contrato_existente.data_vencimento = vencimento
                        contrato_existente.status = self._parse_status(row.get(col_map.get('status')))
                        contratos_atualizados += 1
                    elif not contrato_existente:
                        contrato = Contrato(
                            tenant_id=tenant_id,
                            cliente_id=cliente.id,
                            numero_contrato=numero_contrato,
                            valor_original=valor,
                            data_vencimento=vencimento,
                            data_contrato=self._parse_date(row.get(col_map.get('data_contrato'))),
                            status=self._parse_status(row.get(col_map.get('status'))),
                            valor_pago=Decimal("0"),
                        )
                        self.db.add(contrato)
                        contratos_criados += 1
                    
                    linhas_processadas += 1
                    
                except Exception as e:
                    erros.append(f"Linha {idx + 2}: {str(e)}")
            
            # Commit
            self.db.commit()
            
            # Atualiza log
            log.status = StatusImportacaoModel.CONCLUIDO
            log.linhas_processadas = linhas_processadas
            log.clientes_criados = clientes_criados
            log.clientes_atualizados = clientes_atualizados
            log.contratos_criados = contratos_criados
            log.contratos_atualizados = contratos_atualizados
            log.total_erros = len(erros)
            log.erros_detalhes = erros[:50]
            log.data_fim = datetime.now()
            self.db.commit()
            
        except Exception as e:
            self.db.rollback()
            log.status = StatusImportacaoModel.ERRO
            log.erros_detalhes = [str(e)]
            log.data_fim = datetime.now()
            self.db.commit()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro durante importação: {str(e)}"
            )
        
        return ResultadoImportacao(
            id_importacao=log.uuid,
            arquivo=log.nome_arquivo,
            tipo_importacao=TipoImportacao(log.tipo.value),
            status=StatusImportacao(log.status.value),
            total_linhas=log.total_linhas,
            clientes_criados=clientes_criados,
            clientes_atualizados=clientes_atualizados,
            contratos_criados=contratos_criados,
            contratos_atualizados=contratos_atualizados,
            total_erros=len(erros),
            erros=erros[:20],
            data_inicio=log.data_inicio,
            data_fim=log.data_fim,
            tenant_id=tenant_id,
            usuario_id=usuario_id
        )


# Função auxiliar para compatibilidade
async def process_excel(db: Session, file: UploadFile, tenant_id: int) -> Dict[str, Any]:
    """Função de compatibilidade com código antigo"""
    service = UploadService(db)
    resultado = await service.importar_direto(file, tenant_id, 0)
    return {
        "arquivo": resultado.arquivo,
        "total_linhas": resultado.total_linhas,
        "clientes_criados": resultado.clientes_criados,
        "contratos_criados": resultado.contratos_criados,
        "erros": resultado.erros,
        "total_erros": resultado.total_erros,
    }

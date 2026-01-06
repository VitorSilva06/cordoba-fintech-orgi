"""
Rotas de Gestão de Base
Upload, Validação, Importação e Consulta de Base de Devedores
"""
import os
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi.responses import FileResponse
from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
    status,
    Query,
)
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.models.cliente import Cliente
from app.models.contrato import Contrato
from app.dependencies.auth import get_current_user
from app.dependencies.tenant import get_tenant_id, require_tenant
from app.services.upload_service_v2 import UploadService
from app.schemas.upload import (
    EstruturaCampos, PreviewUpload, ResultadoImportacao,
    ListaLogsImportacao, TipoImportacao, IniciarImportacaoRequest,
    ListaClientesBase, ClienteBase
)

from pydantic import BaseModel
from sqlalchemy import func
from decimal import Decimal


router = APIRouter()


# ==========================================
# Schemas de Resposta
# ==========================================
class BaseUploadResponse(BaseModel):
    id: str
    filename: str
    size_kb: float
    uploaded_at: datetime


class BaseFileResponse(BaseModel):
    id: str
    filename: str
    uploaded_at: datetime


class ExcelUploadResponse(BaseModel):
    arquivo: str
    total_linhas: int
    clientes_criados: int
    contratos_criados: int
    total_erros: int
    erros: List[str]


class EstatisticasBase(BaseModel):
    """Estatísticas da base de dados"""
    total_clientes: int
    total_contratos: int
    valor_total: float
    clientes_com_atraso: int
    ultima_importacao: Optional[datetime] = None


# ==========================================
# Helpers
# ==========================================
def ensure_upload_dir():
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


def validate_file(file: UploadFile):
    allowed_extensions = [".csv", ".xlsx", ".xls"]
    ext = os.path.splitext(file.filename)[1].lower()

    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato inválido. Use CSV ou Excel (.csv, .xlsx, .xls)",
        )


# ==========================================
# ESTRUTURA DE CAMPOS
# ==========================================
@router.get("/campos", response_model=EstruturaCampos)
def get_estrutura_campos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retorna a estrutura de campos esperados para o upload.
    Inclui campos obrigatórios e opcionais com exemplos.
    """
    service = UploadService(db)
    return service.get_estrutura_campos()


# ==========================================
# PREVIEW DE UPLOAD
# ==========================================
@router.post("/upload/preview", response_model=PreviewUpload)
async def preview_upload(
    file: UploadFile = File(..., description="Arquivo Excel ou CSV"),
    tipo: TipoImportacao = Query(TipoImportacao.INCREMENTAL, description="Tipo de importação"),
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(require_tenant),
    db: Session = Depends(get_db),
):
    """
    Gera preview do upload sem importar.
    
    Analisa o arquivo e retorna:
    - Quantos registros serão criados
    - Quantos serão atualizados
    - Quais têm erros
    - Mapeamento de colunas
    """
    ensure_upload_dir()
    validate_file(file)
    
    service = UploadService(db)
    return await service.preview_upload(file, tenant_id, tipo)


# ==========================================
# CONFIRMAR IMPORTAÇÃO
# ==========================================
@router.post("/upload/confirmar/{preview_id}", response_model=ResultadoImportacao)
async def confirmar_importacao(
    preview_id: str,
    sobrescrever: bool = Query(False, description="Sobrescrever dados existentes"),
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(require_tenant),
    db: Session = Depends(get_db),
):
    """
    Confirma a importação após preview.
    
    Use o preview_id retornado pelo endpoint de preview.
    """
    service = UploadService(db)
    return await service.confirmar_importacao(
        preview_id, tenant_id, current_user.id, sobrescrever
    )


# ==========================================
# IMPORTAÇÃO DIRETA
# ==========================================
@router.post("/upload/excel", response_model=ResultadoImportacao)
async def upload_excel_direto(
    file: UploadFile = File(..., description="Arquivo Excel com base de devedores"),
    tipo: TipoImportacao = Query(TipoImportacao.INCREMENTAL),
    sobrescrever: bool = Query(False),
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(require_tenant),
    db: Session = Depends(get_db),
):
    """
    Upload e processamento direto de arquivo Excel/CSV.
    
    Campos obrigatórios:
    - cpf: CPF do devedor
    - nome: Nome completo
    - valor: Valor da dívida
    - vencimento: Data de vencimento
    
    Campos opcionais:
    - data_nascimento, sexo, telefone, email
    - numero_contrato, status, data_contrato
    - endereco, cidade, estado, cep
    """
    ensure_upload_dir()
    validate_file(file)
    
    # Salva o arquivo
    content = await file.read()
    await file.seek(0)
    
    file_id = str(uuid.uuid4())
    safe_filename = f"{file_id}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
    
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Processa
    service = UploadService(db)
    return await service.importar_direto(
        file, tenant_id, current_user.id, tipo, sobrescrever
    )


# ==========================================
# LOGS DE IMPORTAÇÃO
# ==========================================
@router.get("/logs", response_model=ListaLogsImportacao)
def get_logs_importacao(
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
    db: Session = Depends(get_db),
):
    """
    Lista histórico de importações.
    
    Diretores veem todas as importações.
    Gerentes veem apenas do seu tenant.
    """
    service = UploadService(db)
    return service.get_logs_importacao(tenant_id, pagina, por_pagina)


# ==========================================
# ESTATÍSTICAS DA BASE
# ==========================================
@router.get("/estatisticas", response_model=EstatisticasBase)
def get_estatisticas_base(
    current_user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
    db: Session = Depends(get_db),
):
    """
    Retorna estatísticas gerais da base de dados.
    """
    from app.models.importacao_log import ImportacaoLog, StatusImportacao as StatusModel
    from app.models.contrato import StatusContrato
    
    # Total clientes
    query_clientes = db.query(func.count(Cliente.id))
    if tenant_id:
        query_clientes = query_clientes.filter(Cliente.tenant_id == tenant_id)
    total_clientes = query_clientes.scalar() or 0
    
    # Total contratos
    query_contratos = db.query(func.count(Contrato.id))
    if tenant_id:
        query_contratos = query_contratos.filter(Contrato.tenant_id == tenant_id)
    total_contratos = query_contratos.scalar() or 0
    
    # Valor total
    query_valor = db.query(func.sum(Contrato.valor_original))
    if tenant_id:
        query_valor = query_valor.filter(Contrato.tenant_id == tenant_id)
    valor_total = query_valor.scalar() or 0
    
    # Clientes com atraso
    query_atraso = db.query(func.count(func.distinct(Contrato.cliente_id))).filter(
        Contrato.status == StatusContrato.ATRASADO
    )
    if tenant_id:
        query_atraso = query_atraso.filter(Contrato.tenant_id == tenant_id)
    clientes_atraso = query_atraso.scalar() or 0
    
    # Última importação
    query_ultima = db.query(ImportacaoLog.data_fim).filter(
        ImportacaoLog.status == StatusModel.CONCLUIDO
    )
    if tenant_id:
        query_ultima = query_ultima.filter(ImportacaoLog.tenant_id == tenant_id)
    ultima = query_ultima.order_by(ImportacaoLog.data_fim.desc()).first()
    
    return EstatisticasBase(
        total_clientes=total_clientes,
        total_contratos=total_contratos,
        valor_total=float(valor_total),
        clientes_com_atraso=clientes_atraso,
        ultima_importacao=ultima[0] if ultima else None
    )


# ==========================================
# LISTAR CLIENTES DA BASE
# ==========================================
@router.get("/clientes", response_model=ListaClientesBase)
def listar_clientes_base(
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
    busca: Optional[str] = Query(None, description="Busca por nome ou CPF"),
    status_filter: Optional[str] = Query(None, description="Filtro por status"),
    current_user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
    db: Session = Depends(get_db),
):
    """
    Lista clientes da base com informações resumidas.
    """
    from app.models.contrato import StatusContrato
    
    # Subquery para totais de contratos
    subquery = db.query(
        Contrato.cliente_id,
        func.count(Contrato.id).label('total_contratos'),
        func.sum(Contrato.valor_original).label('valor_total'),
        func.max(Contrato.status).label('status')
    ).group_by(Contrato.cliente_id).subquery()
    
    # Query principal
    query = db.query(
        Cliente,
        subquery.c.total_contratos,
        subquery.c.valor_total,
        subquery.c.status
    ).outerjoin(
        subquery, Cliente.id == subquery.c.cliente_id
    )
    
    if tenant_id:
        query = query.filter(Cliente.tenant_id == tenant_id)
    
    if busca:
        query = query.filter(
            (Cliente.nome.ilike(f"%{busca}%")) |
            (Cliente.cpf.ilike(f"%{busca}%"))
        )
    
    # Total
    total = query.count()
    
    # Paginação
    results = query.order_by(Cliente.nome).offset(
        (pagina - 1) * por_pagina
    ).limit(por_pagina).all()
    
    clientes = []
    for cliente, total_contratos, valor_total, status_contrato in results:
        # Mascara CPF
        cpf_nums = ''.join(filter(str.isdigit, cliente.cpf or ''))
        cpf_masked = f"***.***.*{cpf_nums[-5:-2]}-{cpf_nums[-2:]}" if len(cpf_nums) >= 5 else "***.***.***-**"
        
        # Status baseado em contratos
        if status_contrato:
            status_str = status_contrato if isinstance(status_contrato, str) else status_contrato.value
        else:
            status_str = "sem_contrato"
        
        clientes.append(ClienteBase(
            id=cliente.id,
            nome=cliente.nome,
            cpf_masked=cpf_masked,
            telefone=cliente.telefone,
            email=cliente.email,
            total_contratos=total_contratos or 0,
            valor_total=Decimal(valor_total or 0),
            status=status_str,
            data_cadastro=cliente.created_at
        ))
    
    return ListaClientesBase(
        clientes=clientes,
        total=total,
        pagina=pagina,
        por_pagina=por_pagina
    )


# ==========================================
# DOWNLOAD DE TEMPLATE
# ==========================================
@router.get("/template")
def download_template(
    formato: str = Query("xlsx", enum=["xlsx", "csv"]),
    current_user: User = Depends(get_current_user),
):
    """
    Faz download de um template de exemplo para importação.
    """
    import pandas as pd
    from io import BytesIO
    from fastapi.responses import StreamingResponse
    
    # Dados de exemplo
    dados = {
        'cpf': ['123.456.789-00', '987.654.321-00', '111.222.333-44'],
        'nome': ['João da Silva', 'Maria Santos', 'Pedro Oliveira'],
        'valor': [1500.00, 2300.50, 890.00],
        'vencimento': ['2024-12-31', '2024-11-15', '2025-01-20'],
        'telefone': ['(11) 99999-8888', '(21) 98888-7777', '(31) 97777-6666'],
        'email': ['joao@email.com', 'maria@email.com', 'pedro@email.com'],
        'sexo': ['M', 'F', 'M'],
        'data_nascimento': ['1985-05-15', '1990-08-22', '1978-03-10'],
        'numero_contrato': ['CTR-001', 'CTR-002', 'CTR-003'],
        'status': ['ativo', 'atrasado', 'ativo'],
        'endereco': ['Rua A, 123', 'Av. B, 456', 'Rua C, 789'],
        'cidade': ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'],
        'estado': ['SP', 'RJ', 'MG'],
        'cep': ['01234-567', '20000-000', '30000-000'],
    }
    
    df = pd.DataFrame(dados)
    
    output = BytesIO()
    
    if formato == "xlsx":
        df.to_excel(output, index=False, sheet_name="Devedores")
        output.seek(0)
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=template_importacao.xlsx"}
        )
    else:
        df.to_csv(output, index=False)
        output.seek(0)
        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=template_importacao.csv"}
        )


# ==========================================
# UPLOAD SIMPLES (compatibilidade)
# ==========================================
@router.post("/upload", response_model=BaseUploadResponse)
async def upload_base(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload simples de arquivo (compatibilidade)"""
    ensure_upload_dir()
    validate_file(file)

    content = await file.read()
    size_mb = len(content) / (1024 * 1024)

    if size_mb > settings.MAX_UPLOAD_SIZE_MB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Arquivo excede o tamanho máximo permitido",
        )

    file_id = str(uuid.uuid4())
    safe_filename = f"{file_id}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as f:
        f.write(content)

    return {
        "id": file_id,
        "filename": file.filename,
        "size_kb": round(len(content) / 1024, 2),
        "uploaded_at": datetime.utcnow(),
    }


# ==========================================
# LISTAR ARQUIVOS
# ==========================================
@router.get("/files", response_model=List[BaseFileResponse])
def list_uploaded_files(
    current_user: User = Depends(get_current_user),
):
    """Lista arquivos enviados"""
    ensure_upload_dir()
    files = []

    for filename in os.listdir(settings.UPLOAD_DIR):
        if "_" in filename:
            file_id, original = filename.split("_", 1)
            files.append(
                {
                    "id": file_id,
                    "filename": original,
                    "uploaded_at": datetime.utcfromtimestamp(
                        os.path.getctime(
                            os.path.join(settings.UPLOAD_DIR, filename)
                        )
                    ),
                }
            )

    return files


# ==========================================
# DOWNLOAD DE ARQUIVO
# ==========================================
@router.get("/download/{file_id}")
def download_file(
    file_id: str,
    current_user: User = Depends(get_current_user),
):
    """Download de arquivo por ID"""
    ensure_upload_dir()

    for filename in os.listdir(settings.UPLOAD_DIR):
        if filename.startswith(file_id):
            file_path = os.path.join(settings.UPLOAD_DIR, filename)

            if not os.path.isfile(file_path):
                break

            return FileResponse(
                path=file_path,
                filename=filename,
                media_type="application/octet-stream",
            )

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Arquivo não encontrado",
    )

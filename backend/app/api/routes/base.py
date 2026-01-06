import os
import uuid
from datetime import datetime
from typing import List
from fastapi.responses import FileResponse
from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.tenant import get_tenant_filter, require_tenant
from app.services.upload_service import UploadService

from pydantic import BaseModel


router = APIRouter()

# ----------------------------------
# Schemas
# ----------------------------------
class BaseUploadResponse(BaseModel):
    id: str
    filename: str
    size_kb: float
    uploaded_at: datetime


class ExcelUploadResponse(BaseModel):
    arquivo: str
    total_linhas: int
    clientes_criados: int
    contratos_criados: int
    total_erros: int
    erros: List[str]


class BaseFileResponse(BaseModel):
    id: str
    filename: str
    uploaded_at: datetime


# ----------------------------------
# Helpers
# ----------------------------------
def ensure_upload_dir():
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


def validate_file(file: UploadFile):
    allowed_extensions = [".csv", ".xlsx"]
    ext = os.path.splitext(file.filename)[1].lower()

    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato inválido. Use CSV ou Excel.",
        )


# ----------------------------------
# Upload de base (arquivo simples)
# ----------------------------------
@router.post("/upload", response_model=BaseUploadResponse)
async def upload_base(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
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


# ----------------------------------
# Listar arquivos enviados
# ----------------------------------
@router.get("/files", response_model=List[BaseFileResponse])
def list_uploaded_files(
    current_user: User = Depends(get_current_user),
):
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


# ----------------------------------
# Download de arquivo
# ----------------------------------
@router.get("/download/{file_id}")
def download_file(
    file_id: str,
    current_user: User = Depends(get_current_user),
):
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


# ----------------------------------
# Upload e processamento de Excel
# ----------------------------------
@router.post("/upload/excel", response_model=ExcelUploadResponse)
async def upload_excel_base(
    file: UploadFile = File(..., description="Arquivo Excel com base de devedores"),
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(require_tenant),
    db: Session = Depends(get_db),
):
    """
    Upload e processamento de arquivo Excel contendo base de devedores.
    
    O arquivo deve conter pelo menos as colunas:
    - nome (ou: name, cliente, devedor)
    - cpf (ou: cpf_cnpj, documento)
    - valor (ou: valor_original, divida)
    - vencimento (ou: data_vencimento)
    
    Colunas opcionais:
    - data_nascimento, sexo, telefone, email
    - numero_contrato, status, data_contrato
    """
    ensure_upload_dir()
    
    # Salva o arquivo
    content = await file.read()
    await file.seek(0)  # Reset para o service ler novamente
    
    file_id = str(uuid.uuid4())
    safe_filename = f"{file_id}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
    
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Processa o Excel
    upload_service = UploadService(db)
    result = await upload_service.process_excel(file, tenant_id)
    
    return result


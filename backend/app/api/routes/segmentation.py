from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import uuid4
from datetime import datetime

from app.db.session import get_db
from app.models.user import User
from app.dependencies.auth import get_current_user

from pydantic import BaseModel


router = APIRouter(
    prefix="/segmentation",
    tags=["Segmentation"],
)

# ----------------------------------
# Schemas (MVP)
# ----------------------------------
class SegmentCreate(BaseModel):
    name: str
    min_days_overdue: int
    max_days_overdue: int


class SegmentResponse(BaseModel):
    id: str
    name: str
    min_days_overdue: int
    max_days_overdue: int
    created_at: datetime


# ----------------------------------
# Criar segmento
# ----------------------------------
@router.post("/", response_model=SegmentResponse)
def create_segment(
    payload: SegmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.min_days_overdue < 0 or payload.max_days_overdue < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dias de atraso inválidos",
        )

    if payload.min_days_overdue > payload.max_days_overdue:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Intervalo inválido",
        )

    segment = {
        "id": str(uuid4()),
        "name": payload.name,
        "min_days_overdue": payload.min_days_overdue,
        "max_days_overdue": payload.max_days_overdue,
        "created_at": datetime.utcnow(),
    }

    # 🔜 Futuro:
    # - persistir no banco
    # - validar conflitos de faixa
    # - associar a esteiras/scripts

    return segment


# ----------------------------------
# Listar segmentos
# ----------------------------------
@router.get("/", response_model=List[SegmentResponse])
def list_segments(
    current_user: User = Depends(get_current_user),
):
    return [
        {
            "id": str(uuid4()),
            "name": "Até 30 dias",
            "min_days_overdue": 0,
            "max_days_overdue": 30,
            "created_at": datetime.utcnow(),
        },
        {
            "id": str(uuid4()),
            "name": "31 a 60 dias",
            "min_days_overdue": 31,
            "max_days_overdue": 60,
            "created_at": datetime.utcnow(),
        },
    ]


# ----------------------------------
# Simular segmentação de um cliente
# ----------------------------------
@router.get("/simulate/{days_overdue}")
def simulate_segmentation(
    days_overdue: int,
    current_user: User = Depends(get_current_user),
):
    if days_overdue < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dias inválidos",
        )

    if days_overdue <= 30:
        segment = "Até 30 dias"
    elif days_overdue <= 60:
        segment = "31 a 60 dias"
    elif days_overdue <= 90:
        segment = "61 a 90 dias"
    else:
        segment = "Acima de 90 dias"

    return {
        "days_overdue": days_overdue,
        "segment": segment,
    }

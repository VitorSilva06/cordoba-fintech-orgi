from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import uuid4
from datetime import datetime

from app.db.session import get_db
from app.models.user import User
from app.dependencies.auth import get_current_user

router = APIRouter()

# ----------------------------------
# Schemas locais simples (MVP)
# ----------------------------------
from pydantic import BaseModel


class PaymentCreate(BaseModel):
    amount: float
    method: str  # pix | boleto | card
    description: str | None = None


class PaymentResponse(BaseModel):
    id: str
    amount: float
    method: str
    status: str
    created_at: datetime


# ----------------------------------
# Criar pagamento
# ----------------------------------
@router.post("/", response_model=PaymentResponse)
def create_payment(
    payload: PaymentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valor inválido",
        )

    payment = {
        "id": str(uuid4()),
        "amount": payload.amount,
        "method": payload.method,
        "status": "pending",
        "created_at": datetime.utcnow(),
    }

    # 🔜 Futuro:
    # - chamar gateway (Mercado Pago / PicPay)
    # - persistir no banco
    # - registrar webhook

    return payment


# ----------------------------------
# Listar pagamentos do usuário
# ----------------------------------
@router.get("/", response_model=List[PaymentResponse])
def list_payments(
    current_user: User = Depends(get_current_user),
):
    # Mock inicial
    return [
        {
            "id": str(uuid4()),
            "amount": 150.00,
            "method": "pix",
            "status": "paid",
            "created_at": datetime.utcnow(),
        }
    ]


# ----------------------------------
# Consultar pagamento específico
# ----------------------------------
@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(
    payment_id: str,
    current_user: User = Depends(get_current_user),
):
    return {
        "id": payment_id,
        "amount": 200.00,
        "method": "boleto",
        "status": "pending",
        "created_at": datetime.utcnow(),
    }

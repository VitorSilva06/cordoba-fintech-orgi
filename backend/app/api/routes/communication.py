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
    prefix="/communication",
    tags=["Communication"],
)

# ----------------------------------
# Schemas (MVP)
# ----------------------------------
class MessageCreate(BaseModel):
    channel: str  # whatsapp | voice | sms
    to: str
    message: str


class MessageResponse(BaseModel):
    id: str
    channel: str
    to: str
    status: str
    created_at: datetime


# ----------------------------------
# Enviar mensagem
# ----------------------------------
@router.post("/send", response_model=MessageResponse)
def send_message(
    payload: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.channel not in ["whatsapp", "voice", "sms"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Canal inválido",
        )

    message = {
        "id": str(uuid4()),
        "channel": payload.channel,
        "to": payload.to,
        "status": "sent",
        "created_at": datetime.utcnow(),
    }

    # 🔜 Futuro:
    # - integrar RedeService
    # - persistir envio no banco
    # - tratar erros e retries
    # - capturar webhooks

    return message


# ----------------------------------
# Histórico de comunicações
# ----------------------------------
@router.get("/history", response_model=List[MessageResponse])
def communication_history(
    current_user: User = Depends(get_current_user),
):
    return [
        {
            "id": str(uuid4()),
            "channel": "whatsapp",
            "to": "+55999999999",
            "status": "delivered",
            "created_at": datetime.utcnow(),
        }
    ]


# ----------------------------------
# Webhook (retorno de status)
# ----------------------------------
@router.post("/webhook")
def communication_webhook(payload: dict):
    """
    Endpoint para receber callbacks da RedeService
    """
    return {"status": "received", "payload": payload}

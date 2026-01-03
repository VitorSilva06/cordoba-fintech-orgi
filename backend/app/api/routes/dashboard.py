from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.dependencies.auth import get_current_user

router = APIRouter()

# ----------------------------------
# Dashboard geral (base)
# ----------------------------------
@router.get("/")
def dashboard_base(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return {
        "message": "Dashboard base",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
        },
    }


# ----------------------------------
# Dashboard do operador
# ----------------------------------
@router.get("/operator")
def dashboard_operator(
    current_user: User = Depends(get_current_user),
):
    return {
        "dashboard": "operator",
        "data": {
            "tasks_pending": 12,
            "tasks_completed": 34,
        },
    }


# ----------------------------------
# Dashboard do gestor
# ----------------------------------
@router.get("/manager")
def dashboard_manager(
    current_user: User = Depends(get_current_user),
):
    return {
        "dashboard": "manager",
        "data": {
            "total_clients": 120,
            "active_clients": 98,
        },
    }


# ----------------------------------
# Dashboard do diretor
# ----------------------------------
@router.get("/director")
def dashboard_director(
    current_user: User = Depends(get_current_user),
):
    return {
        "dashboard": "director",
        "data": {
            "revenue": 150000,
            "growth_rate": "12%",
        },
    }

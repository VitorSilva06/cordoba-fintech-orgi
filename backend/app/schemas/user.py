from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ----------------------------------
# Schema de criação de usuário
# ----------------------------------
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=6)

    class Config:
        from_attributes = True


# ----------------------------------
# Schema de resposta de usuário
# ----------------------------------
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_active: bool
    is_superuser: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

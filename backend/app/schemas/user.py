from pydantic import BaseModel, Field, field_validator
from pydantic.networks import EmailStr
from typing import Optional
from datetime import datetime


# ----------------------------------
# Schema de criação de usuário
# ----------------------------------
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)

    @field_validator("password")
    @classmethod
    def password_max_72_bytes(cls, v: str) -> str:
        if len(v.encode("utf-8")) > 72:
            raise ValueError("A senha não pode exceder 72 bytes")
        return v

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

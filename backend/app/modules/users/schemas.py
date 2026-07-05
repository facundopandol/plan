from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import EmailStr, Field

from app.core.schemas import ORMModel


class UserBase(ORMModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    currency: str = Field(default="ARS", min_length=3, max_length=3)
    locale: str = Field(default="es-AR", max_length=10)
    monthly_savings_goal: Decimal = Field(default=Decimal("0"), ge=0)
    monthly_investment_goal: Decimal = Field(default=Decimal("0"), ge=0)
    primary_color: str = Field(default="zinc", max_length=20)
    dark_mode: bool = False
    is_active: bool = True


class UserCreate(UserBase):
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserUpdate(ORMModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    email: EmailStr | None = None
    currency: str | None = Field(default=None, min_length=3, max_length=3)
    locale: str | None = Field(default=None, max_length=10)
    monthly_savings_goal: Decimal | None = Field(default=None, ge=0)
    monthly_investment_goal: Decimal | None = Field(default=None, ge=0)
    primary_color: str | None = Field(default=None, max_length=20)
    dark_mode: bool | None = None
    is_active: bool | None = None
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

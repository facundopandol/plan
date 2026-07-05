from datetime import date as DateType, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import Field

from app.core.schemas import ORMModel


class ObligationBase(ORMModel):
    name: str = Field(min_length=1, max_length=120)
    amount: Decimal = Field(gt=0)
    due_date: DateType | None = None
    due_day: int | None = Field(default=None, ge=1, le=31)
    frequency: str | None = Field(default=None, max_length=20)
    category_name: str | None = Field(default=None, max_length=50)
    month_id: UUID | None = None
    category_id: UUID | None = None
    active: bool = True
    paid: bool = False
    is_fixed: bool = False


class ObligationCreate(ObligationBase):
    pass


class ObligationUpdate(ORMModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    amount: Decimal | None = Field(default=None, gt=0)
    due_date: DateType | None = None
    due_day: int | None = Field(default=None, ge=1, le=31)
    frequency: str | None = Field(default=None, max_length=20)
    category_name: str | None = Field(default=None, max_length=50)
    month_id: UUID | None = None
    category_id: UUID | None = None
    active: bool | None = None
    paid: bool | None = None
    is_fixed: bool | None = None


class ObligationResponse(ObligationBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

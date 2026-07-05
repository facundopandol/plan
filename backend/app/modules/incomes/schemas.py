from datetime import date as DateType, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import Field

from app.core.schemas import ORMModel


class IncomeBase(ORMModel):
    name: str = Field(min_length=1, max_length=120)
    description: str | None = None
    income_type: str = Field(default="Otro", max_length=50)
    amount: Decimal = Field(gt=0)
    date: DateType | None = None
    month_id: UUID | None = None
    category_id: UUID | None = None
    recurring: bool = False
    is_plan_item: bool = False


class IncomeCreate(IncomeBase):
    pass


class IncomeUpdate(ORMModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = None
    income_type: str | None = Field(default=None, max_length=50)
    amount: Decimal | None = Field(default=None, gt=0)
    date: DateType | None = None
    month_id: UUID | None = None
    category_id: UUID | None = None
    recurring: bool | None = None
    is_plan_item: bool | None = None


class IncomeResponse(IncomeBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

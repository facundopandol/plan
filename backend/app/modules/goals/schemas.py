from datetime import date as DateType, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import Field

from app.core.schemas import ORMModel


class GoalBase(ORMModel):
    name: str = Field(min_length=1, max_length=120)
    target_amount: Decimal = Field(gt=0)
    saved_amount: Decimal = Field(default=Decimal("0"), ge=0)
    target_date: DateType
    icon: str = Field(default="Target", max_length=30)
    color: str = Field(default="emerald", max_length=20)


class GoalCreate(GoalBase):
    pass


class GoalUpdate(ORMModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    target_amount: Decimal | None = Field(default=None, gt=0)
    saved_amount: Decimal | None = Field(default=None, ge=0)
    target_date: DateType | None = None
    icon: str | None = Field(default=None, max_length=30)
    color: str | None = Field(default=None, max_length=20)


class GoalResponse(GoalBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

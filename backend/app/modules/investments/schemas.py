from datetime import date as DateType, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import Field

from app.core.schemas import ORMModel


class InvestmentBase(ORMModel):
    date: DateType
    investment_type: str = Field(max_length=50)
    amount: Decimal = Field(gt=0)
    comment: str = ""
    goal_id: UUID | None = None
    personal_destination_name: str | None = Field(default=None, max_length=120)


class InvestmentCreate(InvestmentBase):
    pass


class InvestmentUpdate(ORMModel):
    date: DateType | None = None
    investment_type: str | None = Field(default=None, max_length=50)
    amount: Decimal | None = Field(default=None, gt=0)
    comment: str | None = None
    goal_id: UUID | None = None
    personal_destination_name: str | None = Field(default=None, max_length=120)


class InvestmentResponse(InvestmentBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

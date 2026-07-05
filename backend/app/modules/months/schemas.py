from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import Field, field_validator

from app.core.schemas import ORMModel


class MonthBase(ORMModel):
    year_month: str = Field(min_length=7, max_length=7, pattern=r"^\d{4}-\d{2}$")
    label: str = Field(min_length=1, max_length=50)
    investment_goal: Decimal = Field(default=Decimal("0"), ge=0)

    @field_validator("year_month")
    @classmethod
    def validate_year_month(cls, value: str) -> str:
        year, month = value.split("-")
        month_int = int(month)
        if not 1 <= month_int <= 12:
            raise ValueError("Invalid month in year_month")
        return value


class MonthCreate(MonthBase):
    pass


class MonthUpdate(ORMModel):
    year_month: str | None = Field(default=None, min_length=7, max_length=7, pattern=r"^\d{4}-\d{2}$")
    label: str | None = Field(default=None, min_length=1, max_length=50)
    investment_goal: Decimal | None = Field(default=None, ge=0)


class MonthResponse(MonthBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

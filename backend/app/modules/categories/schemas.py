from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import Field

from app.core.schemas import ORMModel


class CategoryKind(str, Enum):
    INCOME = "income"
    OBLIGATION = "obligation"
    INVESTMENT = "investment"


class CategoryBase(ORMModel):
    name: str = Field(min_length=1, max_length=100)
    kind: CategoryKind
    description: str | None = Field(default=None, max_length=255)


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(ORMModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    kind: CategoryKind | None = None
    description: str | None = Field(default=None, max_length=255)


class CategoryResponse(CategoryBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

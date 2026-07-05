import enum
from datetime import datetime
from uuid import UUID

from sqlalchemy import Enum, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class CategoryKind(str, enum.Enum):
    INCOME = "income"
    OBLIGATION = "obligation"
    INVESTMENT = "investment"


class Category(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "categories"
    __table_args__ = (UniqueConstraint("user_id", "name", "kind", name="uq_category_user_name_kind"),)

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    kind: Mapped[CategoryKind] = mapped_column(Enum(CategoryKind, name="category_kind"), nullable=False)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)

    user: Mapped["User"] = relationship(back_populates="categories")
    incomes: Mapped[list["Income"]] = relationship(back_populates="category")
    obligations: Mapped[list["Obligation"]] = relationship(back_populates="category")

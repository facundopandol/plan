from datetime import date
from decimal import Decimal
from uuid import UUID

from sqlalchemy import Boolean, Date, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Income(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "incomes"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    month_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("months.id", ondelete="SET NULL"), nullable=True, index=True
    )
    category_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True
    )
    date: Mapped[date | None] = mapped_column(Date, nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    income_type: Mapped[str] = mapped_column(String(50), nullable=False, default="Otro")
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    recurring: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_plan_item: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    user: Mapped["User"] = relationship(back_populates="incomes")
    month: Mapped["Month | None"] = relationship(back_populates="incomes")
    category: Mapped["Category | None"] = relationship(back_populates="incomes")

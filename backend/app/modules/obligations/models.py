from datetime import date
from decimal import Decimal
from uuid import UUID

from sqlalchemy import Boolean, Date, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Obligation(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "obligations"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    month_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("months.id", ondelete="SET NULL"), nullable=True, index=True
    )
    category_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True
    )
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    due_day: Mapped[int | None] = mapped_column(Integer, nullable=True)
    frequency: Mapped[str | None] = mapped_column(String(20), nullable=True)
    category_name: Mapped[str | None] = mapped_column(String(50), nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    paid: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_fixed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    user: Mapped["User"] = relationship(back_populates="obligations")
    month: Mapped["Month | None"] = relationship(back_populates="obligations")
    category: Mapped["Category | None"] = relationship(back_populates="obligations")

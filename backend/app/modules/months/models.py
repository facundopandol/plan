from datetime import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import ForeignKey, Numeric, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Month(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "months"
    __table_args__ = (UniqueConstraint("user_id", "year_month", name="uq_month_user_year_month"),)

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    year_month: Mapped[str] = mapped_column(String(7), nullable=False, index=True)
    label: Mapped[str] = mapped_column(String(50), nullable=False)
    investment_goal: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False, default=0)

    user: Mapped["User"] = relationship(back_populates="months")
    incomes: Mapped[list["Income"]] = relationship(back_populates="month")
    obligations: Mapped[list["Obligation"]] = relationship(back_populates="month")

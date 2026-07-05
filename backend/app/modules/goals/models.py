from datetime import date
from decimal import Decimal
from uuid import UUID

from sqlalchemy import Date, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Goal(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "goals"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    target_amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    saved_amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False, default=0)
    target_date: Mapped[date] = mapped_column(Date, nullable=False)
    icon: Mapped[str] = mapped_column(String(30), nullable=False, default="Target")
    color: Mapped[str] = mapped_column(String(20), nullable=False, default="emerald")

    user: Mapped["User"] = relationship(back_populates="goals")

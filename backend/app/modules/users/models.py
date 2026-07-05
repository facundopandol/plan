from datetime import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class User(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="ARS")
    locale: Mapped[str] = mapped_column(String(10), nullable=False, default="es-AR")
    monthly_savings_goal: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False, default=0)
    monthly_investment_goal: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False, default=0)
    primary_color: Mapped[str] = mapped_column(String(20), nullable=False, default="zinc")
    dark_mode: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    categories: Mapped[list["Category"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    months: Mapped[list["Month"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    incomes: Mapped[list["Income"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    obligations: Mapped[list["Obligation"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    investments: Mapped[list["Investment"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    goals: Mapped[list["Goal"]] = relationship(back_populates="user", cascade="all, delete-orphan")

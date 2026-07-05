from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.repository import BaseRepository
from app.modules.months.models import Month


class MonthRepository(BaseRepository[Month]):
    def get_for_user(self, db: Session, month_id: UUID, user_id: UUID) -> Month | None:
        stmt = select(Month).where(Month.id == month_id, Month.user_id == user_id)
        return db.scalars(stmt).first()

    def get_by_year_month(self, db: Session, user_id: UUID, year_month: str) -> Month | None:
        stmt = select(Month).where(Month.user_id == user_id, Month.year_month == year_month)
        return db.scalars(stmt).first()

    def list_for_user(
        self,
        db: Session,
        user_id: UUID,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[Month], int]:
        stmt = select(Month).where(Month.user_id == user_id).order_by(Month.year_month.desc())
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = db.scalar(count_stmt) or 0
        items = list(db.scalars(stmt.offset(skip).limit(limit)).all())
        return items, total


month_repository = MonthRepository(Month)

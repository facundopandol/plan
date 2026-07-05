from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.repository import BaseRepository
from app.modules.incomes.models import Income


class IncomeRepository(BaseRepository[Income]):
    def get_for_user(self, db: Session, income_id: UUID, user_id: UUID) -> Income | None:
        stmt = select(Income).where(Income.id == income_id, Income.user_id == user_id)
        return db.scalars(stmt).first()

    def list_for_user(
        self,
        db: Session,
        user_id: UUID,
        *,
        month_id: UUID | None = None,
        is_plan_item: bool | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[Income], int]:
        stmt = select(Income).where(Income.user_id == user_id)
        if month_id is not None:
            stmt = stmt.where(Income.month_id == month_id)
        if is_plan_item is not None:
            stmt = stmt.where(Income.is_plan_item == is_plan_item)
        stmt = stmt.order_by(Income.date.desc().nullslast(), Income.created_at.desc())
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = db.scalar(count_stmt) or 0
        items = list(db.scalars(stmt.offset(skip).limit(limit)).all())
        return items, total


income_repository = IncomeRepository(Income)

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.repository import BaseRepository
from app.modules.obligations.models import Obligation


class ObligationRepository(BaseRepository[Obligation]):
    def get_for_user(self, db: Session, obligation_id: UUID, user_id: UUID) -> Obligation | None:
        stmt = select(Obligation).where(Obligation.id == obligation_id, Obligation.user_id == user_id)
        return db.scalars(stmt).first()

    def list_for_user(
        self,
        db: Session,
        user_id: UUID,
        *,
        month_id: UUID | None = None,
        is_fixed: bool | None = None,
        active: bool | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[Obligation], int]:
        stmt = select(Obligation).where(Obligation.user_id == user_id)
        if month_id is not None:
            stmt = stmt.where(Obligation.month_id == month_id)
        if is_fixed is not None:
            stmt = stmt.where(Obligation.is_fixed == is_fixed)
        if active is not None:
            stmt = stmt.where(Obligation.active == active)
        stmt = stmt.order_by(Obligation.due_date.asc().nullslast(), Obligation.due_day.asc().nullslast())
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = db.scalar(count_stmt) or 0
        items = list(db.scalars(stmt.offset(skip).limit(limit)).all())
        return items, total


obligation_repository = ObligationRepository(Obligation)

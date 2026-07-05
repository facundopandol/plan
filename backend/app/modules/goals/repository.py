from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.repository import BaseRepository
from app.modules.goals.models import Goal


class GoalRepository(BaseRepository[Goal]):
    def get_for_user(self, db: Session, goal_id: UUID, user_id: UUID) -> Goal | None:
        stmt = select(Goal).where(Goal.id == goal_id, Goal.user_id == user_id)
        return db.scalars(stmt).first()

    def list_for_user(
        self,
        db: Session,
        user_id: UUID,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[Goal], int]:
        stmt = select(Goal).where(Goal.user_id == user_id).order_by(Goal.target_date.asc())
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = db.scalar(count_stmt) or 0
        items = list(db.scalars(stmt.offset(skip).limit(limit)).all())
        return items, total


goal_repository = GoalRepository(Goal)

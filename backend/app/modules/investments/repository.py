from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.repository import BaseRepository
from app.modules.investments.models import Investment


class InvestmentRepository(BaseRepository[Investment]):
    def get_for_user(self, db: Session, investment_id: UUID, user_id: UUID) -> Investment | None:
        stmt = select(Investment).where(Investment.id == investment_id, Investment.user_id == user_id)
        return db.scalars(stmt).first()

    def list_for_user(
        self,
        db: Session,
        user_id: UUID,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[Investment], int]:
        stmt = select(Investment).where(Investment.user_id == user_id).order_by(Investment.date.desc())
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = db.scalar(count_stmt) or 0
        items = list(db.scalars(stmt.offset(skip).limit(limit)).all())
        return items, total


investment_repository = InvestmentRepository(Investment)

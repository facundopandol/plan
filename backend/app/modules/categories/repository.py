from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.repository import BaseRepository
from app.modules.categories.models import Category, CategoryKind


class CategoryRepository(BaseRepository[Category]):
    def get_for_user(self, db: Session, category_id: UUID, user_id: UUID) -> Category | None:
        stmt = select(Category).where(Category.id == category_id, Category.user_id == user_id)
        return db.scalars(stmt).first()

    def list_for_user(
        self,
        db: Session,
        user_id: UUID,
        *,
        kind: CategoryKind | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[Category], int]:
        stmt = select(Category).where(Category.user_id == user_id)
        if kind is not None:
            stmt = stmt.where(Category.kind == kind)
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = db.scalar(count_stmt) or 0
        items = list(db.scalars(stmt.offset(skip).limit(limit)).all())
        return items, total


category_repository = CategoryRepository(Category)

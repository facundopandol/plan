from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.categories.models import Category, CategoryKind
from app.modules.categories.repository import category_repository
from app.modules.categories.schemas import CategoryCreate, CategoryUpdate
from app.modules.users.models import User


class CategoryService:
    def list_categories(
        self,
        db: Session,
        user: User,
        *,
        kind: CategoryKind | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[Category], int]:
        return category_repository.list_for_user(db, user.id, kind=kind, skip=skip, limit=limit)

    def get_category(self, db: Session, user: User, category_id: UUID) -> Category:
        category = category_repository.get_for_user(db, category_id, user.id)
        if category is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        return category

    def create_category(self, db: Session, user: User, payload: CategoryCreate) -> Category:
        data = payload.model_dump()
        data["user_id"] = user.id
        return category_repository.create(db, data)

    def update_category(
        self,
        db: Session,
        user: User,
        category_id: UUID,
        payload: CategoryUpdate,
    ) -> Category:
        category = self.get_category(db, user, category_id)
        data = payload.model_dump(exclude_unset=True)
        return category_repository.update(db, category, data)

    def delete_category(self, db: Session, user: User, category_id: UUID) -> None:
        category = self.get_category(db, user, category_id)
        category_repository.delete(db, category.id)


category_service = CategoryService()

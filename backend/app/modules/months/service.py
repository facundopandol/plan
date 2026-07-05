from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.months.models import Month
from app.modules.months.repository import month_repository
from app.modules.months.schemas import MonthCreate, MonthUpdate
from app.modules.users.models import User


class MonthService:
    def list_months(
        self,
        db: Session,
        user: User,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[Month], int]:
        return month_repository.list_for_user(db, user.id, skip=skip, limit=limit)

    def get_month(self, db: Session, user: User, month_id: UUID) -> Month:
        month = month_repository.get_for_user(db, month_id, user.id)
        if month is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Month not found")
        return month

    def create_month(self, db: Session, user: User, payload: MonthCreate) -> Month:
        existing = month_repository.get_by_year_month(db, user.id, payload.year_month)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Month already exists for this user",
            )
        data = payload.model_dump()
        data["user_id"] = user.id
        return month_repository.create(db, data)

    def update_month(
        self,
        db: Session,
        user: User,
        month_id: UUID,
        payload: MonthUpdate,
    ) -> Month:
        month = self.get_month(db, user, month_id)
        data = payload.model_dump(exclude_unset=True)
        if "year_month" in data and data["year_month"] != month.year_month:
            existing = month_repository.get_by_year_month(db, user.id, data["year_month"])
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Month already exists for this user",
                )
        return month_repository.update(db, month, data)

    def delete_month(self, db: Session, user: User, month_id: UUID) -> None:
        month = self.get_month(db, user, month_id)
        month_repository.delete(db, month.id)


month_service = MonthService()

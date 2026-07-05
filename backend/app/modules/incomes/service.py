from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.incomes.models import Income
from app.modules.incomes.repository import income_repository
from app.modules.incomes.schemas import IncomeCreate, IncomeUpdate
from app.modules.users.models import User


class IncomeService:
    def list_incomes(
        self,
        db: Session,
        user: User,
        *,
        month_id: UUID | None = None,
        is_plan_item: bool | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[Income], int]:
        return income_repository.list_for_user(
            db,
            user.id,
            month_id=month_id,
            is_plan_item=is_plan_item,
            skip=skip,
            limit=limit,
        )

    def get_income(self, db: Session, user: User, income_id: UUID) -> Income:
        income = income_repository.get_for_user(db, income_id, user.id)
        if income is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Income not found")
        return income

    def create_income(self, db: Session, user: User, payload: IncomeCreate) -> Income:
        data = payload.model_dump()
        data["user_id"] = user.id
        return income_repository.create(db, data)

    def update_income(
        self,
        db: Session,
        user: User,
        income_id: UUID,
        payload: IncomeUpdate,
    ) -> Income:
        income = self.get_income(db, user, income_id)
        data = payload.model_dump(exclude_unset=True)
        return income_repository.update(db, income, data)

    def delete_income(self, db: Session, user: User, income_id: UUID) -> None:
        income = self.get_income(db, user, income_id)
        income_repository.delete(db, income.id)


income_service = IncomeService()

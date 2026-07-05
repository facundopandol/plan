from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.investments.models import Investment
from app.modules.investments.repository import investment_repository
from app.modules.investments.schemas import InvestmentCreate, InvestmentUpdate
from app.modules.users.models import User


class InvestmentService:
    def list_investments(
        self,
        db: Session,
        user: User,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[Investment], int]:
        return investment_repository.list_for_user(db, user.id, skip=skip, limit=limit)

    def get_investment(self, db: Session, user: User, investment_id: UUID) -> Investment:
        investment = investment_repository.get_for_user(db, investment_id, user.id)
        if investment is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investment not found")
        return investment

    def create_investment(self, db: Session, user: User, payload: InvestmentCreate) -> Investment:
        data = payload.model_dump()
        data["user_id"] = user.id
        return investment_repository.create(db, data)

    def update_investment(
        self,
        db: Session,
        user: User,
        investment_id: UUID,
        payload: InvestmentUpdate,
    ) -> Investment:
        investment = self.get_investment(db, user, investment_id)
        data = payload.model_dump(exclude_unset=True)
        return investment_repository.update(db, investment, data)

    def delete_investment(self, db: Session, user: User, investment_id: UUID) -> None:
        investment = self.get_investment(db, user, investment_id)
        investment_repository.delete(db, investment.id)


investment_service = InvestmentService()

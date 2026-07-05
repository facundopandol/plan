from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.obligations.models import Obligation
from app.modules.obligations.repository import obligation_repository
from app.modules.obligations.schemas import ObligationCreate, ObligationUpdate
from app.modules.users.models import User


class ObligationService:
    def list_obligations(
        self,
        db: Session,
        user: User,
        *,
        month_id: UUID | None = None,
        is_fixed: bool | None = None,
        active: bool | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[Obligation], int]:
        return obligation_repository.list_for_user(
            db,
            user.id,
            month_id=month_id,
            is_fixed=is_fixed,
            active=active,
            skip=skip,
            limit=limit,
        )

    def get_obligation(self, db: Session, user: User, obligation_id: UUID) -> Obligation:
        obligation = obligation_repository.get_for_user(db, obligation_id, user.id)
        if obligation is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Obligation not found")
        return obligation

    def create_obligation(self, db: Session, user: User, payload: ObligationCreate) -> Obligation:
        data = payload.model_dump()
        data["user_id"] = user.id
        return obligation_repository.create(db, data)

    def update_obligation(
        self,
        db: Session,
        user: User,
        obligation_id: UUID,
        payload: ObligationUpdate,
    ) -> Obligation:
        obligation = self.get_obligation(db, user, obligation_id)
        data = payload.model_dump(exclude_unset=True)
        return obligation_repository.update(db, obligation, data)

    def delete_obligation(self, db: Session, user: User, obligation_id: UUID) -> None:
        obligation = self.get_obligation(db, user, obligation_id)
        obligation_repository.delete(db, obligation.id)


obligation_service = ObligationService()

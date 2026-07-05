from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.goals.models import Goal
from app.modules.goals.repository import goal_repository
from app.modules.goals.schemas import GoalCreate, GoalUpdate
from app.modules.users.models import User


class GoalService:
    def list_goals(
        self,
        db: Session,
        user: User,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[Goal], int]:
        return goal_repository.list_for_user(db, user.id, skip=skip, limit=limit)

    def get_goal(self, db: Session, user: User, goal_id: UUID) -> Goal:
        goal = goal_repository.get_for_user(db, goal_id, user.id)
        if goal is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
        return goal

    def create_goal(self, db: Session, user: User, payload: GoalCreate) -> Goal:
        data = payload.model_dump()
        data["user_id"] = user.id
        return goal_repository.create(db, data)

    def update_goal(
        self,
        db: Session,
        user: User,
        goal_id: UUID,
        payload: GoalUpdate,
    ) -> Goal:
        goal = self.get_goal(db, user, goal_id)
        data = payload.model_dump(exclude_unset=True)
        return goal_repository.update(db, goal, data)

    def delete_goal(self, db: Session, user: User, goal_id: UUID) -> None:
        goal = self.get_goal(db, user, goal_id)
        goal_repository.delete(db, goal.id)


goal_service = GoalService()

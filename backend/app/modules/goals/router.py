from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.schemas import MessageResponse, PaginatedResponse
from app.modules.goals.schemas import GoalCreate, GoalResponse, GoalUpdate
from app.modules.goals.service import goal_service
from app.modules.users.models import User

router = APIRouter(prefix="/goals", tags=["Goals"])


@router.get("", response_model=PaginatedResponse[GoalResponse])
def list_goals(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PaginatedResponse[GoalResponse]:
    items, total = goal_service.list_goals(db, current_user, skip=skip, limit=limit)
    return PaginatedResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(
    goal_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> GoalResponse:
    return goal_service.get_goal(db, current_user, goal_id)


@router.post("", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal(
    payload: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> GoalResponse:
    return goal_service.create_goal(db, current_user, payload)


@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(
    goal_id: UUID,
    payload: GoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> GoalResponse:
    return goal_service.update_goal(db, current_user, goal_id, payload)


@router.delete("/{goal_id}", response_model=MessageResponse)
def delete_goal(
    goal_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    goal_service.delete_goal(db, current_user, goal_id)
    return MessageResponse(message="Goal deleted successfully")

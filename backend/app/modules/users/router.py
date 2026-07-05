from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.schemas import MessageResponse, PaginatedResponse
from app.modules.users.schemas import UserCreate, UserResponse, UserUpdate
from app.modules.users.service import user_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=PaginatedResponse[UserResponse])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> PaginatedResponse[UserResponse]:
    users, total = user_service.list_users(db, skip=skip, limit=limit)
    return PaginatedResponse(items=users, total=total, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: UUID, db: Session = Depends(get_db)) -> UserResponse:
    return user_service.get_user(db, user_id)


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)) -> UserResponse:
    return user_service.create_user(db, payload)


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: UUID,
    payload: UserUpdate,
    db: Session = Depends(get_db),
) -> UserResponse:
    return user_service.update_user(db, user_id, payload)


@router.delete("/{user_id}", response_model=MessageResponse)
def delete_user(user_id: UUID, db: Session = Depends(get_db)) -> MessageResponse:
    user_service.delete_user(db, user_id)
    return MessageResponse(message="User deleted successfully")

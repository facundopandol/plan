from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.schemas import MessageResponse, PaginatedResponse
from app.modules.months.schemas import MonthCreate, MonthResponse, MonthUpdate
from app.modules.months.service import month_service
from app.modules.users.models import User

router = APIRouter(prefix="/months", tags=["Months"])


@router.get("", response_model=PaginatedResponse[MonthResponse])
def list_months(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PaginatedResponse[MonthResponse]:
    items, total = month_service.list_months(db, current_user, skip=skip, limit=limit)
    return PaginatedResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{month_id}", response_model=MonthResponse)
def get_month(
    month_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MonthResponse:
    return month_service.get_month(db, current_user, month_id)


@router.post("", response_model=MonthResponse, status_code=status.HTTP_201_CREATED)
def create_month(
    payload: MonthCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MonthResponse:
    return month_service.create_month(db, current_user, payload)


@router.put("/{month_id}", response_model=MonthResponse)
def update_month(
    month_id: UUID,
    payload: MonthUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MonthResponse:
    return month_service.update_month(db, current_user, month_id, payload)


@router.delete("/{month_id}", response_model=MessageResponse)
def delete_month(
    month_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    month_service.delete_month(db, current_user, month_id)
    return MessageResponse(message="Month deleted successfully")

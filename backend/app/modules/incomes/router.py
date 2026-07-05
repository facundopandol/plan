from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.schemas import MessageResponse, PaginatedResponse
from app.modules.incomes.schemas import IncomeCreate, IncomeResponse, IncomeUpdate
from app.modules.incomes.service import income_service
from app.modules.users.models import User

router = APIRouter(prefix="/incomes", tags=["Incomes"])


@router.get("", response_model=PaginatedResponse[IncomeResponse])
def list_incomes(
    month_id: UUID | None = Query(default=None),
    is_plan_item: bool | None = Query(default=None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PaginatedResponse[IncomeResponse]:
    items, total = income_service.list_incomes(
        db,
        current_user,
        month_id=month_id,
        is_plan_item=is_plan_item,
        skip=skip,
        limit=limit,
    )
    return PaginatedResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{income_id}", response_model=IncomeResponse)
def get_income(
    income_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> IncomeResponse:
    return income_service.get_income(db, current_user, income_id)


@router.post("", response_model=IncomeResponse, status_code=status.HTTP_201_CREATED)
def create_income(
    payload: IncomeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> IncomeResponse:
    return income_service.create_income(db, current_user, payload)


@router.put("/{income_id}", response_model=IncomeResponse)
def update_income(
    income_id: UUID,
    payload: IncomeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> IncomeResponse:
    return income_service.update_income(db, current_user, income_id, payload)


@router.delete("/{income_id}", response_model=MessageResponse)
def delete_income(
    income_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    income_service.delete_income(db, current_user, income_id)
    return MessageResponse(message="Income deleted successfully")

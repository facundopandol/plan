from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.schemas import MessageResponse, PaginatedResponse
from app.modules.investments.schemas import InvestmentCreate, InvestmentResponse, InvestmentUpdate
from app.modules.investments.service import investment_service
from app.modules.users.models import User

router = APIRouter(prefix="/investments", tags=["Investments"])


@router.get("", response_model=PaginatedResponse[InvestmentResponse])
def list_investments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PaginatedResponse[InvestmentResponse]:
    items, total = investment_service.list_investments(db, current_user, skip=skip, limit=limit)
    return PaginatedResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{investment_id}", response_model=InvestmentResponse)
def get_investment(
    investment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InvestmentResponse:
    return investment_service.get_investment(db, current_user, investment_id)


@router.post("", response_model=InvestmentResponse, status_code=status.HTTP_201_CREATED)
def create_investment(
    payload: InvestmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InvestmentResponse:
    return investment_service.create_investment(db, current_user, payload)


@router.put("/{investment_id}", response_model=InvestmentResponse)
def update_investment(
    investment_id: UUID,
    payload: InvestmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InvestmentResponse:
    return investment_service.update_investment(db, current_user, investment_id, payload)


@router.delete("/{investment_id}", response_model=MessageResponse)
def delete_investment(
    investment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    investment_service.delete_investment(db, current_user, investment_id)
    return MessageResponse(message="Investment deleted successfully")

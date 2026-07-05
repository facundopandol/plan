from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.schemas import MessageResponse, PaginatedResponse
from app.modules.obligations.schemas import ObligationCreate, ObligationResponse, ObligationUpdate
from app.modules.obligations.service import obligation_service
from app.modules.users.models import User

router = APIRouter(prefix="/obligations", tags=["Obligations"])


@router.get("", response_model=PaginatedResponse[ObligationResponse])
def list_obligations(
    month_id: UUID | None = Query(default=None),
    is_fixed: bool | None = Query(default=None),
    active: bool | None = Query(default=None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PaginatedResponse[ObligationResponse]:
    items, total = obligation_service.list_obligations(
        db,
        current_user,
        month_id=month_id,
        is_fixed=is_fixed,
        active=active,
        skip=skip,
        limit=limit,
    )
    return PaginatedResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{obligation_id}", response_model=ObligationResponse)
def get_obligation(
    obligation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ObligationResponse:
    return obligation_service.get_obligation(db, current_user, obligation_id)


@router.post("", response_model=ObligationResponse, status_code=status.HTTP_201_CREATED)
def create_obligation(
    payload: ObligationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ObligationResponse:
    return obligation_service.create_obligation(db, current_user, payload)


@router.put("/{obligation_id}", response_model=ObligationResponse)
def update_obligation(
    obligation_id: UUID,
    payload: ObligationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ObligationResponse:
    return obligation_service.update_obligation(db, current_user, obligation_id, payload)


@router.delete("/{obligation_id}", response_model=MessageResponse)
def delete_obligation(
    obligation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    obligation_service.delete_obligation(db, current_user, obligation_id)
    return MessageResponse(message="Obligation deleted successfully")

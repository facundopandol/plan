from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.schemas import MessageResponse, PaginatedResponse
from app.modules.categories.models import CategoryKind
from app.modules.categories.schemas import CategoryCreate, CategoryResponse, CategoryUpdate
from app.modules.categories.service import category_service
from app.modules.users.models import User

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=PaginatedResponse[CategoryResponse])
def list_categories(
    kind: CategoryKind | None = Query(default=None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PaginatedResponse[CategoryResponse]:
    items, total = category_service.list_categories(
        db, current_user, kind=kind, skip=skip, limit=limit
    )
    return PaginatedResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(
    category_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CategoryResponse:
    return category_service.get_category(db, current_user, category_id)


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CategoryResponse:
    return category_service.create_category(db, current_user, payload)


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: UUID,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CategoryResponse:
    return category_service.update_category(db, current_user, category_id, payload)


@router.delete("/{category_id}", response_model=MessageResponse)
def delete_category(
    category_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    category_service.delete_category(db, current_user, category_id)
    return MessageResponse(message="Category deleted successfully")

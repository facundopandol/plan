from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.users.models import User
from app.modules.users.repository import user_repository
from app.modules.users.schemas import UserCreate, UserUpdate


class UserService:
    def list_users(self, db: Session, *, skip: int = 0, limit: int = 100) -> tuple[list[User], int]:
        users = user_repository.get_multi(db, skip=skip, limit=limit)
        total = len(users)
        return users, total

    def get_user(self, db: Session, user_id: UUID) -> User:
        user = user_repository.get(db, user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    def create_user(self, db: Session, payload: UserCreate) -> User:
        if user_repository.get_by_email(db, payload.email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        return user_repository.create_user(db, payload.model_dump())

    def update_user(self, db: Session, user_id: UUID, payload: UserUpdate) -> User:
        user = self.get_user(db, user_id)
        data = payload.model_dump(exclude_unset=True)
        if "email" in data and data["email"] != user.email:
            existing = user_repository.get_by_email(db, data["email"])
            if existing:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        return user_repository.update_user(db, user, data)

    def delete_user(self, db: Session, user_id: UUID) -> None:
        if not user_repository.delete(db, user_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")


user_service = UserService()

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.repository import BaseRepository
from app.core.security import hash_password
from app.modules.users.models import User


class UserRepository(BaseRepository[User]):
    def get_by_email(self, db: Session, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        return db.scalars(stmt).first()

    def create_user(self, db: Session, data: dict) -> User:
        password = data.pop("password", None)
        if password:
            data["hashed_password"] = hash_password(password)
        return self.create(db, data)

    def update_user(self, db: Session, user: User, data: dict) -> User:
        password = data.pop("password", None)
        if password:
            data["hashed_password"] = hash_password(password)
        return self.update(db, user, data)


user_repository = UserRepository(User)

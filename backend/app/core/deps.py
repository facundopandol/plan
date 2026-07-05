from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.core.security import decode_access_token
from app.modules.users.models import User
from app.modules.users.repository import user_repository

settings = get_settings()

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.api_v1_prefix}/auth/token",
    auto_error=False,
)


def get_current_user(
    db: Session = Depends(get_db),
    token: str | None = Depends(oauth2_scheme),
) -> User:
    """
    Dependencia de usuario autenticado.

    Hasta que JWT esté activo, usa el usuario de desarrollo por defecto
    cuando no se envía token o el token no es válido.
    """
    if token:
        payload = decode_access_token(token)
        if payload and payload.get("sub"):
            user = user_repository.get(db, UUID(payload["sub"]))
            if user and user.is_active:
                return user

    user = user_repository.get_by_email(db, settings.default_user_email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No authenticated user. Run migrations and seed the default user.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

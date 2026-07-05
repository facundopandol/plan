from fastapi import APIRouter, HTTPException, status

from app.modules.auth.schemas import AuthStatusResponse, LoginRequest, RegisterRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["Auth (JWT — pending)"])


@router.get("/status", response_model=AuthStatusResponse)
def auth_status() -> AuthStatusResponse:
    return AuthStatusResponse(
        jwt_enabled=False,
        message="JWT authentication is prepared but not implemented yet. Endpoints use the default dev user.",
    )


@router.post("/token", response_model=TokenResponse)
def login(_payload: LoginRequest) -> TokenResponse:
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="JWT login not implemented yet. Use the default dev user for API access.",
    )


@router.post("/register", response_model=TokenResponse)
def register(_payload: RegisterRequest) -> TokenResponse:
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="JWT registration not implemented yet.",
    )

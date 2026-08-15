from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.database import SessionLocal
from app.core.schemas import ORMModel
from app.modules.users.repository import user_repository

settings = get_settings()


class HealthResponse(ORMModel):
    status: str
    app: str
    environment: str


def seed_default_user() -> None:
    db = SessionLocal()
    try:
        if user_repository.get_by_email(db, settings.default_user_email) is None:
            user_repository.create_user(
                db,
                {
                    "email": settings.default_user_email,
                    "name": "Usuario",
                    "currency": "ARS",
                    "locale": "es-AR",
                    "monthly_savings_goal": 200_000,
                    "monthly_investment_goal": 150_000,
                    "primary_color": "emerald",
                    "dark_mode": False,
                    "is_active": True,
                },
            )
    except Exception:
        # Las tablas pueden no existir aún; ejecutar `alembic upgrade head` primero.
        db.rollback()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    seed_default_user()
    yield


app = FastAPI(
    title=settings.app_name,
    description=(
        "API de planificación financiera mensual para la aplicación Plan. "
        "Documentación interactiva disponible en /docs (Swagger) y /redoc."
    ),
    version="1.0.0",
    debug=settings.debug,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    # En desarrollo Vite puede saltar de 5173 a 5174/5175 si el puerto está ocupado.
    allow_origin_regex=(
        r"http://(localhost|127\.0\.0\.1):\d+"
        if settings.app_env == "development" or settings.debug
        else None
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check() -> HealthResponse:
    return HealthResponse(
        status="ok",
        app=settings.app_name,
        environment=settings.app_env,
    )

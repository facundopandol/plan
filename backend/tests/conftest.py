import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.models  # noqa: F401 — registra tablas en metadata
from app.core.config import get_settings
from app.core.database import Base, get_db
from app.main import app
from app.modules.users.repository import user_repository

settings = get_settings()

SQLALCHEMY_DATABASE_URL = "sqlite+pysqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture()
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        user_repository.create_user(
            session,
            {
                "email": settings.default_user_email,
                "name": "Test User",
                "currency": "ARS",
                "locale": "es-AR",
                "monthly_savings_goal": 0,
                "monthly_investment_goal": 0,
                "primary_color": "emerald",
                "dark_mode": False,
                "is_active": True,
            },
        )
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

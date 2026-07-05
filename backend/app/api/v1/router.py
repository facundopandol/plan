from fastapi import APIRouter

from app.modules.auth.router import router as auth_router
from app.modules.categories.router import router as categories_router
from app.modules.goals.router import router as goals_router
from app.modules.incomes.router import router as incomes_router
from app.modules.investments.router import router as investments_router
from app.modules.months.router import router as months_router
from app.modules.obligations.router import router as obligations_router
from app.modules.users.router import router as users_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(categories_router)
api_router.include_router(months_router)
api_router.include_router(incomes_router)
api_router.include_router(obligations_router)
api_router.include_router(investments_router)
api_router.include_router(goals_router)

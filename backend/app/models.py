"""Import all models so SQLAlchemy metadata and Alembic detect them."""

from app.modules.users.models import User  # noqa: F401
from app.modules.categories.models import Category  # noqa: F401
from app.modules.months.models import Month  # noqa: F401
from app.modules.incomes.models import Income  # noqa: F401
from app.modules.obligations.models import Obligation  # noqa: F401
from app.modules.investments.models import Investment  # noqa: F401
from app.modules.goals.models import Goal  # noqa: F401

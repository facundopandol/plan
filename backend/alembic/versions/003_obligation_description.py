"""obligation description

Revision ID: 003_obligation_description
Revises: 002_investment_goal_link
Create Date: 2026-07-06

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "003_obligation_description"
down_revision: Union[str, None] = "002_investment_goal_link"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("obligations", sa.Column("description", sa.String(length=120), nullable=True))


def downgrade() -> None:
    op.drop_column("obligations", "description")

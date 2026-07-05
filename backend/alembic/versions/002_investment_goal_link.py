"""investment goal link

Revision ID: 002_investment_goal_link
Revises: 001_initial
Create Date: 2026-07-04

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "002_investment_goal_link"
down_revision: Union[str, None] = "001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("investments", sa.Column("goal_id", sa.Uuid(), nullable=True))
    op.add_column("investments", sa.Column("personal_destination_name", sa.String(length=120), nullable=True))
    op.create_foreign_key(
        "fk_investments_goal_id",
        "investments",
        "goals",
        ["goal_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_index(op.f("ix_investments_goal_id"), "investments", ["goal_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_investments_goal_id"), table_name="investments")
    op.drop_constraint("fk_investments_goal_id", "investments", type_="foreignkey")
    op.drop_column("investments", "personal_destination_name")
    op.drop_column("investments", "goal_id")

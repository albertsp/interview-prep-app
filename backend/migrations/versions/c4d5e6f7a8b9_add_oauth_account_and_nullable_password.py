"""add oauth account and nullable password

Revision ID: c4d5e6f7a8b9
Revises: e1297814b3c4
Create Date: 2026-06-18 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = "c4d5e6f7a8b9"
down_revision = "e1297814b3c4"
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column("user", "password", existing_type=sa.String(250), nullable=True)

    op.create_table(
        "oauth_account",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("user.user_id"), nullable=False),
        sa.Column("provider", sa.String(50), nullable=False),
        sa.Column("provider_user_id", sa.String(250), nullable=False),
        sa.UniqueConstraint("provider", "provider_user_id", name="uq_oauth_provider_user"),
    )


def downgrade():
    op.drop_table("oauth_account")
    op.alter_column("user", "password", existing_type=sa.String(250), nullable=False)
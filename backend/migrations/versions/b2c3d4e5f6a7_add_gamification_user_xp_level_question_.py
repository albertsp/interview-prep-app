"""add gamification fields: user total_xp/level, question result

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-06-08 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b2c3d4e5f6a7'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('total_xp', sa.Integer(), nullable=False, server_default='0'))
        batch_op.add_column(sa.Column('level', sa.Integer(), nullable=False, server_default='1'))

    with op.batch_alter_table('question', schema=None) as batch_op:
        batch_op.add_column(sa.Column('result', sa.String(length=20), nullable=True))


def downgrade():
    with op.batch_alter_table('question', schema=None) as batch_op:
        batch_op.drop_column('result')

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('level')
        batch_op.drop_column('total_xp')

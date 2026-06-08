"""enrich card model with definition, avoid_when, mnemonic, tags, difficulty

Revision ID: a1b2c3d4e5f6
Revises: e1297814b3c4
Create Date: 2026-06-08 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = 'e1297814b3c4'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('card', schema=None) as batch_op:
        batch_op.add_column(sa.Column('definition', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('avoid_when', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('mnemonic', sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column('tags', sa.JSON(), nullable=True))
        batch_op.add_column(sa.Column('difficulty', sa.Integer(), nullable=True))
        batch_op.alter_column('concept',
               existing_type=sa.String(length=250),
               type_=sa.String(length=120),
               existing_nullable=False)


def downgrade():
    with op.batch_alter_table('card', schema=None) as batch_op:
        batch_op.alter_column('concept',
               existing_type=sa.String(length=120),
               type_=sa.String(length=250),
               existing_nullable=False)
        batch_op.drop_column('difficulty')
        batch_op.drop_column('tags')
        batch_op.drop_column('mnemonic')
        batch_op.drop_column('avoid_when')
        batch_op.drop_column('definition')

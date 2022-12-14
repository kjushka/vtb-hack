"""init

Revision ID: 06f299bb7939
Revises: 
Create Date: 2022-10-08 04:38:26.704617

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '06f299bb7939'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        'auth_info',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('login', sa.String(), nullable=False),
        sa.Column('password', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('login')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('auth_info')
    # ### end Alembic commands ###

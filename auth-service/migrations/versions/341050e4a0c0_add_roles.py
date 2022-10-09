"""add roles

Revision ID: 341050e4a0c0
Revises: 06f299bb7939
Create Date: 2022-10-08 06:48:56.075187

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '341050e4a0c0'
down_revision = '06f299bb7939'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    role_table = op.create_table(
        'role',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('key', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('key')
    )
    op.create_table(
        'role_user',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('role_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['role_id'], ['role.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['auth_info.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.bulk_insert(role_table, [
        {'name': 'Хост', 'key': 'Admin'},
        {'name': 'Голова', 'key': 'Head'},
        {'name': 'Изменятор', 'key': 'Editor'},
        {'name': 'Работяга', 'key': 'User'},
    ])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('role_user')
    op.drop_table('role')
    # ### end Alembic commands ###

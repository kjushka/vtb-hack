"""
DB models of service
"""

from sqlalchemy import Column, Integer, String

from app.db import Base


class Wallet(Base):
    __tablename__ = 'wallet'

    # TODO: make private encrypt by additional password
    id = Column(Integer, primary_key=True)
    private_key = Column(String, nullable=False)
    public_key = Column(String, nullable=False)
    user_id = Column(Integer, nullable=False)

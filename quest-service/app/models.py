"""
Модели дб
"""

from datetime import datetime

from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.orm import relationship

from app.db import Base


class Quest(Base):
    __tablename__ = 'quest'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String)
    date_started = Column(TIMESTAMP, default=datetime.utcnow())
    date_finished = Column(TIMESTAMP)

    assigned_users = relationship('UserQuest')


class UserQuest(Base):
    __tablename__ = 'user_quest'

    quest_id = Column(Integer, ForeignKey('quest.id'), nullable=False)
    user_id = Column(Integer, nullable=False)

    __table_args__ = (PrimaryKeyConstraint(quest_id, user_id), {})

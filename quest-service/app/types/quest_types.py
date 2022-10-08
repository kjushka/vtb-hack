"""
Quest types
"""

from datetime import datetime
from typing import Optional, List, Type, Any

from pydantic import BaseModel, validator


class QuestInput(BaseModel):
    title: str
    description: Optional[str]
    date_started: Optional[datetime]
    date_finished: Optional[datetime]
    assigned_users: List[int]

    @validator('title')
    def title_not_empty(cls, v):
        if not v:
            raise ValueError('Title must be non empty string!')
        return v


class Quest(QuestInput):
    id: int

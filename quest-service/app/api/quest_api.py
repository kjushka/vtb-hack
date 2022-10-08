"""
Quest API
"""

from datetime import datetime
from typing import List

from fastapi import APIRouter
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import SessionLocal
from app.models import Quest as ORMQuest, UserQuest as ORMUserQuest
from app.types.quest_types import QuestInput, Quest


quest_router = APIRouter(prefix='/api/quest')


@quest_router.post('/create_quest')
async def create_quest(quest_input: QuestInput) -> Quest:
    async with SessionLocal() as s:
        s: AsyncSession
        async with s.begin():
            # FIXME: таймстампы надо починить, т.к. хранить время без таймзоны не вариант
            quest = ORMQuest(**quest_input.__dict__)
            s.add(quest)
        await s.refresh(quest)
    return Quest(**quest.__dict__)


@quest_router.get('/get_quests')
async def get_quests(
    quest_id: int | None = None,
    user_id: int | None = None,
    date_started: datetime | None = None,
    date_finished: datetime | None = None,
) -> List[Quest]:
    async with SessionLocal() as s:
        s: AsyncSession
        async with s.begin():
            query = select(ORMQuest)
            if user_id:
                query = query.join(ORMQuest.assigned_users).where(ORMUserQuest.user_id == user_id)
            if quest_id:
                query = query.where(ORMQuest.id == quest_id)
            if date_started:
                query = query.where(ORMQuest.date_started == date_started)
            if date_finished:
                query = query.where(ORMQuest.date_finished == date_finished)
            result = await s.execute(query)
            if quests := result.mappings().all():
                return quests

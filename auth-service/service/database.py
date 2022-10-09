from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy.orm import declarative_base

from config import Database


class DatabaseConnection:
    engine: AsyncEngine | None = None

    @classmethod
    async def open(cls):
        cls.engine = create_async_engine(
            await Database.get_connection_string()
        )


Base = declarative_base()

"""
Base config for SQLAlchemy
"""

from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from settings import Settings

service_settings = Settings()

SQLALCHEMY_DATABASE_URL = 'postgresql+asyncpg://{}:{}@{}:{}/{}'.format(
    service_settings.pg_user,
    service_settings.pg_password,
    service_settings.pg_host,
    service_settings.pg_port,
    service_settings.pg_database,
)

engine = create_async_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()
metadata = MetaData()

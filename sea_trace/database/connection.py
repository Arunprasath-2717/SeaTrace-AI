"""Database Connection & Session Management for SeaTrace AI.

Owned by M3: Nithish (GIS / Database)
Master Contract: v4.1
"""

from contextlib import contextmanager, asynccontextmanager
from typing import Generator, AsyncGenerator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from sea_trace.database.config import settings

# Synchronous Engine (psycopg v3) with robust connection pooling
engine = create_engine(
    settings.database_url,
    pool_size=settings.db_pool_size,
    max_overflow=settings.db_max_overflow,
    pool_timeout=settings.db_pool_timeout,
    pool_pre_ping=True,
    echo=settings.db_echo,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    class_=Session,
)

# Asynchronous Engine (asyncpg) for M2 FastAPI async endpoints
try:
    async_engine = create_async_engine(
        settings.async_database_url,
        pool_size=settings.db_pool_size,
        max_overflow=settings.db_max_overflow,
        pool_timeout=settings.db_pool_timeout,
        pool_pre_ping=True,
        echo=settings.db_echo,
    )
    AsyncSessionLocal = async_sessionmaker(
        bind=async_engine,
        autocommit=False,
        autoflush=False,
        expire_on_commit=False,
        class_=AsyncSession,
    )
except Exception:
    async_engine = None
    AsyncSessionLocal = None


@contextmanager
def get_db_session() -> Generator[Session, None, None]:
    """Provide a transactional synchronous database session scope."""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for FastAPI async route injection."""
    if AsyncSessionLocal is None:
        raise RuntimeError("Async engine is not initialized.")
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

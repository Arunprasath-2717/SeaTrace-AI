"""
db/connection.py
================
SQLAlchemy connection and session management for PostGIS integration.

Strict Mode Rule:
If M5_USE_POSTGIS=true, database connection attempts must either succeed or raise a
clear RuntimeError. Silent fallback to File Mode when explicitly enabled is forbidden.
"""

from __future__ import annotations

import logging
from typing import Generator, Optional

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from db.config import PostGISConfig

logger = logging.getLogger("db_connection")

_engine: Optional[Engine] = None
_session_factory: Optional[sessionmaker] = None


def get_engine(cfg: Optional[PostGISConfig] = None) -> Engine:
    """Return singleton SQLAlchemy engine for PostGIS database."""
    global _engine
    if _engine is not None:
        return _engine

    if cfg is None:
        cfg = PostGISConfig.from_env()

    db_url = cfg.get_database_url()
    logger.info("Initializing PostGIS database engine: %s:%s/%s", cfg.host, cfg.port, cfg.database)

    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )
    _engine = engine
    return engine


def get_session_factory(cfg: Optional[PostGISConfig] = None) -> sessionmaker:
    """Return singleton sessionmaker for PostGIS database."""
    global _session_factory
    if _session_factory is not None:
        return _session_factory

    engine = get_engine(cfg)
    _session_factory = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    return _session_factory


def check_postgis_connection(cfg: Optional[PostGISConfig] = None) -> bool:
    """Check PostGIS database connectivity and extension status."""
    if cfg is None:
        cfg = PostGISConfig.from_env()

    try:
        engine = get_engine(cfg)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT PostGIS_Full_Version();"))
            ver = result.scalar()
            logger.info("PostGIS Connection Verified: %s", ver)
            return True
    except Exception as exc:
        logger.warning("PostGIS connection test failed: %s", exc)
        return False


def get_db_session(cfg: Optional[PostGISConfig] = None) -> Generator[Session, None, None]:
    """Yield a database session context."""
    sf = get_session_factory(cfg)
    session = sf()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def reset_connection() -> None:
    """Reset global engine and session factory (used for testing)."""
    global _engine, _session_factory
    if _engine is not None:
        _engine.dispose()
        _engine = None
    _session_factory = None

"""SQLAlchemy Declarative Base for SeaTrace AI.

Owned by M3: Nithish (GIS / Database)
Master Contract: v4.1
"""

from datetime import datetime, timezone
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import DateTime


def utc_now() -> datetime:
    """Return timezone-aware current UTC datetime."""
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    """Base class for all SeaTrace AI database models."""
    pass


class TimestampMixin:
    """Standardized timestamp mixin for entities requiring audit times."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

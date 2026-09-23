"""
db/config.py
============
Environment-based PostGIS configuration for M5 AIS Intelligence.

Canonical flag:
  M5_USE_POSTGIS (true/1/yes vs false/0/no/unset)
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Optional


@dataclass
class PostGISConfig:
    """PostgreSQL / PostGIS connection configuration."""

    use_postgis: bool
    host: str
    port: int
    user: str
    password: str
    database: str
    custom_url: Optional[str] = None

    @classmethod
    def from_env(cls) -> PostGISConfig:
        raw_flag = os.environ.get("M5_USE_POSTGIS", "false").strip().lower()
        use_postgis = raw_flag in ("true", "1", "yes", "on")

        custom_url = os.environ.get("M5_DATABASE_URL")
        host = os.environ.get("POSTGRES_HOST", "localhost")
        port_raw = os.environ.get("POSTGRES_PORT", "5432")
        try:
            port = int(port_raw)
        except ValueError:
            port = 5432
        user = os.environ.get("POSTGRES_USER", "postgres")
        password = os.environ.get("POSTGRES_PASSWORD", "")
        database = os.environ.get("POSTGRES_DB", "seatrace_m5")

        return cls(
            use_postgis=use_postgis,
            host=host,
            port=port,
            user=user,
            password=password,
            database=database,
            custom_url=custom_url,
        )

    def get_database_url(self) -> str:
        """Return SQLAlchemy database connection URL."""
        if self.custom_url:
            return self.custom_url
        pwd_part = f":{self.password}" if self.password else ""
        return f"postgresql://{self.user}{pwd_part}@{self.host}:{self.port}/{self.database}"

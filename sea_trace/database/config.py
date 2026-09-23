"""SeaTrace AI Database & Storage Configuration.

Owned by M3: Nithish (GIS / Database)
Master Contract: v4.1
"""

from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class DatabaseSettings(BaseSettings):
    """Configuration settings for SeaTrace AI PostgreSQL/PostGIS, Redis, and Storage."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Database URLs
    # Uses psycopg (v3) sync driver for robust PostGIS and GeoAlchemy2 operations
    database_url: str = Field(
        default="postgresql+psycopg://seatrace:seatrace_password@localhost:5432/seatrace_db",
        alias="DATABASE_URL"
    )
    # Asyncpg URL for asynchronous endpoints in FastAPI (M2)
    async_database_url: str = Field(
        default="postgresql+asyncpg://seatrace:seatrace_password@localhost:5432/seatrace_db",
        alias="ASYNC_DATABASE_URL"
    )

    # Redis Queue & Cache (PRD M2 / orchestrator)
    redis_url: str = Field(
        default="redis://localhost:6379/0",
        alias="REDIS_URL"
    )

    # Connection Pool Settings
    db_pool_size: int = Field(default=20, alias="DB_POOL_SIZE")
    db_max_overflow: int = Field(default=10, alias="DB_MAX_OVERFLOW")
    db_pool_timeout: int = Field(default=30, alias="DB_POOL_TIMEOUT")
    db_echo: bool = Field(default=False, alias="DB_ECHO")

    # Storage Paths (GeoTIFF rasters, segmentation masks, NetCDF drift grids)
    # Master Contract Section 3: Rasters/NetCDF never travel through queue, file paths only in DB
    base_data_dir: Path = Field(
        default=Path(__file__).resolve().parent.parent / "data",
        alias="SEATRACE_DATA_DIR"
    )

    # Spatial Coordinate Reference System Standards
    storage_srid: int = 4326  # EPSG:4326 WGS84 for all stored geometry
    metric_srid: int = 3857   # EPSG:3857 Web Mercator for general projected distance calculations

    @property
    def rasters_dir(self) -> Path:
        return self.base_data_dir / "rasters"

    @property
    def masks_dir(self) -> Path:
        return self.base_data_dir / "masks"

    @property
    def netcdf_dir(self) -> Path:
        return self.base_data_dir / "netcdf"

    @property
    def reports_dir(self) -> Path:
        return self.base_data_dir / "reports"


settings = DatabaseSettings()

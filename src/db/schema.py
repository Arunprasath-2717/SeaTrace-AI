"""
db/schema.py
============
DDL Schema management for M5 PostGIS tables.

Creates tables, constraints, PostGIS extension, and spatial/B-tree indexes.
"""

from __future__ import annotations

import logging
from typing import Optional, cast

from sqlalchemy import Table, text
from sqlalchemy.dialects import postgresql
from sqlalchemy.engine import Engine
from sqlalchemy.schema import CreateIndex, CreateTable

from db.connection import get_engine
from db.models import (
    AISGapEvidenceTable,
    AISObservationTable,
    Base,
    CandidateFeaturesTable,
    GapOverlapCandidateTable,
    SpaceTimeFunnelTable,
    TrajectorySegmentTable,
)

logger = logging.getLogger("db_schema")


def create_schema(engine: Optional[Engine] = None) -> None:
    """Create PostGIS extension, tables, and indexes."""
    if engine is None:
        engine = get_engine()

    logger.info("Enabling PostGIS extension and creating tables...")
    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))

    Base.metadata.create_all(bind=engine)
    logger.info("PostGIS schema and tables created successfully.")


def drop_schema(engine: Optional[Engine] = None) -> None:
    """Drop all M5 PostGIS tables."""
    if engine is None:
        engine = get_engine()

    logger.info("Dropping M5 PostGIS tables...")
    Base.metadata.drop_all(bind=engine)
    logger.info("M5 PostGIS tables dropped.")


def generate_ddl_sql() -> str:
    """Generate raw DDL SQL script string for manual PostgreSQL setup."""
    sql_lines = [
        "-- M5 AIS Intelligence PostGIS DDL Schema",
        "-- Geometry SRID: EPSG:4326 (WGS 84)",
        "CREATE EXTENSION IF NOT EXISTS postgis;\n"
    ]
    dialect = postgresql.dialect()
    for table_obj in [
        AISObservationTable.__table__,
        TrajectorySegmentTable.__table__,
        AISGapEvidenceTable.__table__,
        CandidateFeaturesTable.__table__,
        SpaceTimeFunnelTable.__table__,
        GapOverlapCandidateTable.__table__,
    ]:
        table = cast(Table, table_obj)
        ddl = str(CreateTable(table).compile(dialect=dialect)).strip()
        sql_lines.append(ddl + ";\n")
        for idx in table.indexes:
            idx_ddl = str(CreateIndex(idx).compile(dialect=dialect)).strip()
            sql_lines.append(idx_ddl + ";\n")

    return "\n".join(sql_lines)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    print(generate_ddl_sql())

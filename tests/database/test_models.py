"""Test Suite for SQLAlchemy 2.0 ORM Models.

Validates that all tables and columns match Master Contract v4.1.
"""

import pytest
from sqlalchemy import inspect
from sea_trace.database.models import (
    Base,
    Incident,
    Scene,
    Spill,
    DriftRun,
    AISFix,
    Track,
    Candidate,
    Evidence,
    StageLog,
    Provenance,
    AOI,
)


def test_model_tables_exist():
    """Verify all 11 required tables are registered in the SQLAlchemy metadata."""
    table_names = Base.metadata.tables.keys()
    expected_tables = [
        "aoi",
        "incident",
        "scene",
        "spill",
        "drift_run",
        "ais_fix",
        "track",
        "candidate",
        "evidence",
        "stage_log",
        "provenance",
    ]
    for tbl in expected_tables:
        assert tbl in table_names, f"Table '{tbl}' is missing from metadata"


def test_incident_model_columns():
    """Verify incident columns match Section 4."""
    cols = {c.name: c for c in Incident.__table__.columns}
    assert "id" in cols
    assert "state" in cols
    assert "aoi_id" in cols
    assert "created_at" in cols
    assert "updated_at" in cols
    assert "versions" in cols


def test_evidence_model_composite_pk():
    """Verify evidence model has composite PK (incident_id, mmsi, version)."""
    pk_cols = [c.name for c in Evidence.__table__.primary_key.columns]
    assert set(pk_cols) == {"incident_id", "mmsi", "version"}


def test_ais_fix_model_pk_and_columns():
    """Verify ais_fix has (mmsi, ts) PK and proper partition structure."""
    pk_cols = [c.name for c in AISFix.__table__.primary_key.columns]
    assert set(pk_cols) == {"mmsi", "ts"}

    cols = {c.name: c for c in AISFix.__table__.columns}
    for field in ["geom", "sog", "cog", "heading", "quality"]:
        assert field in cols


def test_drift_run_columns():
    """Verify drift_run has required contours, time window, and age range."""
    cols = {c.name: c for c in DriftRun.__table__.columns}
    for field in ["id", "incident_id", "type", "params", "contours", "window_start", "window_end", "age_range_min_hours", "age_range_max_hours"]:
        assert field in cols

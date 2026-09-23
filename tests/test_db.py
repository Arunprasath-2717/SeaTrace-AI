"""
test_db.py
==========
Unit and integration tests for M5 PostGIS storage layer.
"""

from __future__ import annotations

import os
import pytest
from unittest.mock import patch

from db.config import PostGISConfig
from db.schema import generate_ddl_sql
from api.data_loader import M5DataLoader


def test_postgis_config_default():
    """Default configuration must have use_postgis=False when M5_USE_POSTGIS is unset."""
    with patch.dict(os.environ, {}, clear=True):
        cfg = PostGISConfig.from_env()
        assert cfg.use_postgis is False
        assert cfg.host == "localhost"
        assert cfg.port == 5432
        assert cfg.database == "seatrace_m5"


def test_postgis_config_enabled():
    """M5_USE_POSTGIS=true must set use_postgis=True."""
    with patch.dict(os.environ, {"M5_USE_POSTGIS": "true", "POSTGRES_HOST": "127.0.0.1"}, clear=True):
        cfg = PostGISConfig.from_env()
        assert cfg.use_postgis is True
        assert cfg.host == "127.0.0.1"


def test_postgis_mode_strict_connection_failure():
    """When M5_USE_POSTGIS=true and connection fails, M5DataLoader MUST raise RuntimeError."""
    with patch.dict(os.environ, {"M5_USE_POSTGIS": "true", "POSTGRES_HOST": "invalid_host_12345"}, clear=True):
        with pytest.raises(RuntimeError) as exc_info:
            M5DataLoader()
        assert "PostGIS Mode explicitly enabled" in str(exc_info.value)


def test_ddl_sql_generation():
    """generate_ddl_sql() must output PostGIS extension, 6 tables, and GiST indexes."""
    ddl = generate_ddl_sql()
    assert "CREATE EXTENSION IF NOT EXISTS postgis" in ddl
    assert "ais_observations" in ddl
    assert "trajectory_segments" in ddl
    assert "ais_gap_evidence" in ddl
    assert "candidate_features" in ddl
    assert "space_time_funnel" in ddl
    assert "gap_overlap_candidates" in ddl
    assert "USING gist" in ddl or "gist" in ddl.lower()


@pytest.mark.integration
def test_live_postgis_integration():
    """Live integration test against a running PostgreSQL/PostGIS server.

    Only executed when M5_USE_POSTGIS=true and live PostgreSQL is available.
    """
    if os.environ.get("M5_USE_POSTGIS", "false").lower() not in ("true", "1", "yes"):
        pytest.skip("M5_USE_POSTGIS is not enabled; skipping live PostGIS integration test.")

    from db.connection import check_postgis_connection
    assert check_postgis_connection() is True

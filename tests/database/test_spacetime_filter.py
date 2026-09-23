"""Test Suite for Space-Time Filter Query Builder."""

import pytest
from datetime import datetime, timezone
from sea_trace.database.queries.spacetime_filter import build_spacetime_ais_filter_sql


def test_build_spacetime_ais_filter_sql():
    """Verify SQL statement structure and parameter binding for space-time filtering."""
    contour_geojson = {
        "type": "Polygon",
        "coordinates": [[[80.0, 12.0], [80.5, 12.0], [80.5, 12.5], [80.0, 12.5], [80.0, 12.0]]]
    }
    t_start = datetime(2026, 9, 22, 0, 0, 0, tzinfo=timezone.utc)
    t_end = datetime(2026, 9, 22, 12, 0, 0, tzinfo=timezone.utc)

    sql, params = build_spacetime_ais_filter_sql(
        contour_geom=contour_geojson,
        window_start=t_start,
        window_end=t_end,
        mmsi_filter=[412345678, 412345679],
        limit=50,
    )

    # 1. Check partition pruning clause
    assert "a.ts >= :window_start AND a.ts <= :window_end" in sql

    # 2. Check bounding box GiST filter
    assert "a.geom && qc.bbox" in sql

    # 3. Check exact ST_Intersects
    assert "ST_Intersects(a.geom, qc.geom)" in sql

    # 4. Check MMSI filter and limit
    assert "AND mmsi = ANY(:mmsi_filter)" in sql
    assert "LIMIT 50" in sql

    # 5. Check bound parameters
    assert params["window_start"] == t_start
    assert params["window_end"] == t_end
    assert params["min_lon"] == 80.0
    assert params["min_lat"] == 12.0
    assert params["max_lon"] == 80.5
    assert params["max_lat"] == 12.5
    assert params["mmsi_filter"] == [412345678, 412345679]
    assert "POLYGON" in params["contour_wkt"]

"""Space-Time Filter Query Engine.

Owned by M3: Nithish (GIS / Database)
Master Contract: v4.1

High-performance spatial-temporal queries used by M5 (AIS Intelligence) to filter
vessels within the 50%/90% drift origin contour during the origin time window.
Engineered for sub-10s response SLA on partitioned AIS fixes using GiST and BRIN indexes.
"""

from datetime import datetime, timezone
from typing import List, Dict, Any, Optional, Union
import shapely
from sqlalchemy import text, Select
from sqlalchemy.orm import Session

from sea_trace.database.schemas.spatial import parse_geometry_to_wkb_or_wkt, compute_bounding_box


def build_spacetime_ais_filter_sql(
    contour_geom: Union[str, Dict[str, Any], shapely.Geometry],
    window_start: datetime,
    window_end: datetime,
    mmsi_filter: Optional[List[int]] = None,
    limit: Optional[int] = None,
) -> tuple[str, Dict[str, Any]]:
    """Build highly-optimized raw PostGIS SQL query for space-time AIS filtering.

    Key Performance Optimizations:
    1. Partition Pruning: Direct filter on partition key `ts` (window_start <= ts <= window_end).
    2. PostGIS Bounding Box Filter (&&): Uses GiST index bounding box test before exact polygon test.
    3. ST_Intersects: Exact topological intersection against origin contour (50%/90% confidence contour).
    4. Optional MMSI In-list filtering for counterfactual re-checks.
    """
    contour_wkt = parse_geometry_to_wkb_or_wkt(contour_geom)
    min_lon, min_lat, max_lon, max_lat = compute_bounding_box(contour_geom)

    # Ensure UTC timezones
    if window_start.tzinfo is None:
        window_start = window_start.replace(tzinfo=timezone.utc)
    if window_end.tzinfo is None:
        window_end = window_end.replace(tzinfo=timezone.utc)

    params: Dict[str, Any] = {
        "contour_wkt": contour_wkt,
        "window_start": window_start,
        "window_end": window_end,
        "min_lon": min_lon,
        "min_lat": min_lat,
        "max_lon": max_lon,
        "max_lat": max_lat,
    }

    mmsi_clause = ""
    if mmsi_filter:
        mmsi_clause = "AND mmsi = ANY(:mmsi_filter)"
        params["mmsi_filter"] = mmsi_filter

    limit_clause = f"LIMIT {int(limit)}" if limit is not None else ""

    sql = f"""
    WITH query_contour AS (
        SELECT ST_SetSRID(ST_GeomFromText(:contour_wkt), 4326) AS geom,
               ST_MakeEnvelope(:min_lon, :min_lat, :max_lon, :max_lat, 4326) AS bbox
    )
    SELECT
        a.mmsi,
        a.ts,
        ST_X(a.geom) AS lon,
        ST_Y(a.geom) AS lat,
        a.sog,
        a.cog,
        a.heading,
        a.quality,
        ST_Distance(a.geom::geography, ST_Centroid(qc.geom)::geography) AS dist_to_centroid_meters
    FROM ais_fix a
    CROSS JOIN query_contour qc
    WHERE
        -- 1. Temporal window (triggers partition pruning + BRIN index scan)
        a.ts >= :window_start AND a.ts <= :window_end
        -- 2. Fast Bounding Box test (GiST index acceleration)
        AND a.geom && qc.bbox
        -- 3. Exact topological intersection against contour
        AND ST_Intersects(a.geom, qc.geom)
        {mmsi_clause}
    ORDER BY a.ts ASC
    {limit_clause};
    """
    return sql, params


def query_candidate_vessels_in_spacetime(
    session: Session,
    contour_geom: Union[str, Dict[str, Any], shapely.Geometry],
    window_start: datetime,
    window_end: datetime,
) -> List[Dict[str, Any]]:
    """Shortlist unique candidate vessels (MMSIs) inside the origin space-time window.

    Returns aggregated summary features (fix count, time range, speed range, min distance)
    to feed M5's candidate feature extractor.
    """
    contour_wkt = parse_geometry_to_wkb_or_wkt(contour_geom)
    min_lon, min_lat, max_lon, max_lat = compute_bounding_box(contour_geom)

    if window_start.tzinfo is None:
        window_start = window_start.replace(tzinfo=timezone.utc)
    if window_end.tzinfo is None:
        window_end = window_end.replace(tzinfo=timezone.utc)

    params: Dict[str, Any] = {
        "contour_wkt": contour_wkt,
        "window_start": window_start,
        "window_end": window_end,
        "min_lon": min_lon,
        "min_lat": min_lat,
        "max_lon": max_lon,
        "max_lat": max_lat,
    }

    sql = """
    WITH query_contour AS (
        SELECT ST_SetSRID(ST_GeomFromText(:contour_wkt), 4326) AS geom,
               ST_MakeEnvelope(:min_lon, :min_lat, :max_lon, :max_lat, 4326) AS bbox
    )
    SELECT
        a.mmsi,
        COUNT(*) AS fix_count,
        MIN(a.ts) AS first_seen,
        MAX(a.ts) AS last_seen,
        AVG(a.sog) AS avg_sog,
        MAX(a.sog) AS max_sog,
        MIN(a.sog) AS min_sog,
        MIN(ST_Distance(a.geom::geography, ST_Centroid(qc.geom)::geography)) AS min_dist_to_center_m
    FROM ais_fix a
    CROSS JOIN query_contour qc
    WHERE
        a.ts >= :window_start AND a.ts <= :window_end
        AND a.geom && qc.bbox
        AND ST_Intersects(a.geom, qc.geom)
    GROUP BY a.mmsi
    ORDER BY fix_count DESC, min_dist_to_center_m ASC;
    """

    result = session.execute(text(sql), params)
    candidates = []
    for row in result.mappings():
        candidates.append(dict(row))
    return candidates


def query_tracks_in_spacetime(
    session: Session,
    contour_geom: Union[str, Dict[str, Any], shapely.Geometry],
    window_start: datetime,
    window_end: datetime,
) -> List[Dict[str, Any]]:
    """Query pre-built vessel tracks that intersect the origin contour within the time window."""
    contour_wkt = parse_geometry_to_wkb_or_wkt(contour_geom)
    min_lon, min_lat, max_lon, max_lat = compute_bounding_box(contour_geom)

    params: Dict[str, Any] = {
        "contour_wkt": contour_wkt,
        "window_start": window_start,
        "window_end": window_end,
        "min_lon": min_lon,
        "min_lat": min_lat,
        "max_lon": max_lon,
        "max_lat": max_lat,
    }

    sql = """
    WITH query_contour AS (
        SELECT ST_SetSRID(ST_GeomFromText(:contour_wkt), 4326) AS geom,
               ST_MakeEnvelope(:min_lon, :min_lat, :max_lon, :max_lat, 4326) AS bbox
    )
    SELECT
        t.id,
        t.mmsi,
        t.ts_start,
        t.ts_end,
        ST_AsGeoJSON(t.geom) AS geom_geojson,
        t.stats
    FROM track t
    CROSS JOIN query_contour qc
    WHERE
        t.ts_start <= :window_end AND t.ts_end >= :window_start
        AND t.geom && qc.bbox
        AND ST_Intersects(t.geom, qc.geom)
    ORDER BY t.mmsi, t.ts_start;
    """

    result = session.execute(text(sql), params)
    return [dict(row) for row in result.mappings()]

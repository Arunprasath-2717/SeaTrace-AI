"""M5 Phase 2 — Space-Time Candidate Filtering Implementation."""

import json
import logging
from typing import Any, Dict, List, Tuple, cast

import numpy as np
import pandas as pd
from matplotlib.path import Path

from space_time_models import (
    M4Fixture,
    ObservationMatchStatus,
    SpaceTimeFunnelReport,
    SpatialMatchLevel,
)

logger = logging.getLogger("space_time_filter")


def load_m4_fixture(fixture_path: str) -> M4Fixture:
    """Load and parse M4 origin contour and time window fixture JSON.

    Args:
        fixture_path: Path to m4_origin_fixture.json.

    Returns:
        M4Fixture instance with parsed datetime objects and GeoJSON contours.
    """
    logger.info("Loading M4 origin fixture: %s", fixture_path)
    with open(fixture_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    start_dt = pd.to_datetime(data["origin_time_start_utc"], utc=True).to_pydatetime()
    end_dt = pd.to_datetime(data["origin_time_end_utc"], utc=True).to_pydatetime()

    metadata = data.get("metadata", {})
    return M4Fixture(
        incident_id=str(data.get("incident_id", "UNKNOWN")),
        source=str(metadata.get("source", "TEST_FIXTURE")),
        not_real_m4_output=bool(metadata.get("not_real_m4_output", True)),
        origin_time_start_utc=start_dt,
        origin_time_end_utc=end_dt,
        origin_50_contour=data["origin_50_contour"],
        origin_90_contour=data["origin_90_contour"],
        forward_forecast_path=data.get("forward_forecast_path", {}),
        oil_age_min_hours=float(data.get("oil_age_min_hours", 0.0)),
        oil_age_max_hours=float(data.get("oil_age_max_hours", 0.0)),
        metadata=metadata,
    )


class SpatialContourEvaluator:
    """Evaluates AIS observation points against GeoJSON Polygon contours."""

    def __init__(self, contour_50: Dict[str, Any], contour_90: Dict[str, Any]) -> None:
        """Initialize Matplotlib Path objects for 50% and 90% contours."""
        self.path_50 = self._geojson_to_path(contour_50)
        self.path_90 = self._geojson_to_path(contour_90)
        self.bbox_90 = self._get_path_bbox(self.path_90)

    def _geojson_to_path(self, geojson_geom: Dict[str, Any]) -> Path:
        """Convert a GeoJSON Polygon geometry dict into a matplotlib Path."""
        gtype = geojson_geom.get("type", "")
        coords = geojson_geom.get("coordinates", [])
        if gtype == "Polygon" and coords:
            exterior = coords[0]
            return Path(np.array(exterior))
        elif gtype == "MultiPolygon" and coords:
            all_rings: List[List[float]] = []
            for poly in coords:
                if poly:
                    all_rings.extend(poly[0])
            return Path(np.array(all_rings))
        else:
            raise ValueError(f"Unsupported GeoJSON geometry type: {gtype}")

    def _get_path_bbox(self, path: Path) -> Tuple[float, float, float, float]:
        """Return (min_lon, min_lat, max_lon, max_lat) bounding box for a Path."""
        verts = cast(np.ndarray, path.vertices)
        min_lon = float(np.min(verts[:, 0]))
        max_lon = float(np.max(verts[:, 0]))
        min_lat = float(np.min(verts[:, 1]))
        max_lat = float(np.max(verts[:, 1]))
        return min_lon, min_lat, max_lon, max_lat

    def evaluate_points(
        self, lats: np.ndarray, lons: np.ndarray
    ) -> Tuple[np.ndarray, np.ndarray]:
        """Evaluate point containment for array of latitudes and longitudes."""
        if len(lats) == 0:
            return np.array([], dtype=bool), np.array([], dtype=bool)

        pts = np.column_stack((lons, lats))
        is_in_50 = cast(np.ndarray, self.path_50.contains_points(pts))
        is_in_90 = cast(np.ndarray, self.path_90.contains_points(pts))
        return is_in_50, is_in_90


def filter_space_time(
    df_cleaned: pd.DataFrame, fixture: M4Fixture
) -> pd.DataFrame:
    """Perform space-time filtering on clean AIS dataset against M4 fixture."""
    logger.info("Filtering %d AIS records against space-time window...", len(df_cleaned))
    df = df_cleaned.copy()

    df["BaseDateTime"] = pd.to_datetime(df["BaseDateTime"], utc=True)

    t_start = pd.Timestamp(fixture.origin_time_start_utc)
    t_end = pd.Timestamp(fixture.origin_time_end_utc)
    is_temporal = (df["BaseDateTime"] >= t_start) & (df["BaseDateTime"] <= t_end)
    df["is_temporal_match"] = is_temporal

    evaluator = SpatialContourEvaluator(
        fixture.origin_50_contour, fixture.origin_90_contour
    )
    lats = cast(np.ndarray, df["LAT"].to_numpy())
    lons = cast(np.ndarray, df["LON"].to_numpy())
    is_50, is_90 = evaluator.evaluate_points(lats, lons)

    df["is_inside_50"] = is_50
    df["is_inside_90"] = is_90
    df["is_spatial_match"] = is_50 | is_90

    conditions = [
        df["is_inside_50"] & df["is_temporal_match"],
        df["is_inside_90"] & df["is_temporal_match"],
        df["is_spatial_match"] & ~df["is_temporal_match"],
    ]
    choices = [
        ObservationMatchStatus.MATCH_50_PERCENT.value,
        ObservationMatchStatus.MATCH_90_PERCENT.value,
        ObservationMatchStatus.TEMPORAL_OUT_OF_BOUNDS.value,
    ]
    df["match_status"] = np.select(
        conditions, choices, default=ObservationMatchStatus.SPATIAL_OUT_OF_BOUNDS.value
    )

    logger.info(
        "Space-time filtering complete. Match 50: %d, Match 90: %d, Temporal Out of Bounds: %d",
        int((df["match_status"] == ObservationMatchStatus.MATCH_50_PERCENT.value).sum()),
        int((df["match_status"] == ObservationMatchStatus.MATCH_90_PERCENT.value).sum()),
        int((df["match_status"] == ObservationMatchStatus.TEMPORAL_OUT_OF_BOUNDS.value).sum()),
    )
    return df


def detect_gap_overlaps(
    df_gaps: pd.DataFrame, fixture: M4Fixture
) -> pd.DataFrame:
    """Identify AIS transmission gaps overlapping the spill origin time window."""
    if df_gaps.empty:
        return pd.DataFrame()

    gaps = df_gaps.copy()
    gaps["prev_timestamp"] = pd.to_datetime(gaps["prev_timestamp"], utc=True)
    gaps["next_timestamp"] = pd.to_datetime(gaps["next_timestamp"], utc=True)

    t_start = pd.Timestamp(fixture.origin_time_start_utc)
    t_end = pd.Timestamp(fixture.origin_time_end_utc)

    overlaps = (gaps["prev_timestamp"] <= t_end) & (gaps["next_timestamp"] >= t_start)
    overlapping_gaps = cast(pd.DataFrame, gaps[overlaps].copy())

    if len(overlapping_gaps) == 0:
        return pd.DataFrame()

    evaluator = SpatialContourEvaluator(
        fixture.origin_50_contour, fixture.origin_90_contour
    )
    min_lon, min_lat, max_lon, max_lat = evaluator.bbox_90

    buf = 0.05
    min_lon -= buf
    max_lon += buf
    min_lat -= buf
    max_lat += buf

    spatially_relevant: List[bool] = []
    for _, row in overlapping_gaps.iterrows():
        l_lat = float(row["last_lat"])
        l_lon = float(row["last_lon"])
        n_lat = float(row["next_lat"])
        n_lon = float(row["next_lon"])
        g_min_lat = min(l_lat, n_lat)
        g_max_lat = max(l_lat, n_lat)
        g_min_lon = min(l_lon, n_lon)
        g_max_lon = max(l_lon, n_lon)

        intersects_bbox = not (
            g_max_lat < min_lat
            or g_min_lat > max_lat
            or g_max_lon < min_lon
            or g_min_lon > max_lon
        )
        spatially_relevant.append(intersects_bbox)

    res_df = cast(pd.DataFrame, overlapping_gaps[spatially_relevant].copy())
    if len(res_df) == 0:
        return pd.DataFrame()

    res_df["overlap_status"] = "GAP_OVERLAP_CANDIDATE"
    res_df["evidence_note"] = (
        "AIS transmission gap overlaps spill origin time window. "
        "Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing."
    )

    logger.info("Detected %d gap overlap candidates.", len(res_df))
    return res_df


def aggregate_candidate_vessels(
    candidate_obs_df: pd.DataFrame
) -> pd.DataFrame:
    """Aggregate space-time matched observations into unique candidate vessels."""
    valid_matches = candidate_obs_df[
        candidate_obs_df["match_status"].isin(
            [
                ObservationMatchStatus.MATCH_50_PERCENT.value,
                ObservationMatchStatus.MATCH_90_PERCENT.value,
            ]
        )
    ]
    if len(valid_matches) == 0:
        return pd.DataFrame()

    candidates: List[Dict[str, Any]] = []
    for mmsi, grp in valid_matches.groupby("MMSI"):
        count_50 = int((grp["match_status"] == ObservationMatchStatus.MATCH_50_PERCENT.value).sum())
        count_90 = int((grp["match_status"] == ObservationMatchStatus.MATCH_90_PERCENT.value).sum())

        highest_match = (
            SpatialMatchLevel.MATCH_50_PERCENT.value
            if count_50 > 0
            else SpatialMatchLevel.MATCH_90_PERCENT.value
        )

        min_time = str(grp["BaseDateTime"].min())
        max_time = str(grp["BaseDateTime"].max())

        seg_ids: List[int] = []
        if "segment_id" in grp.columns:
            cleaned_segs = cast(pd.Series, grp["segment_id"]).dropna()
            seg_ids = sorted([int(s) for s in cleaned_segs.unique()])

        candidates.append(
            {
                "mmsi": str(mmsi),
                "highest_match_level": highest_match,
                "total_candidate_observations": int(len(grp)),
                "obs_count_50_percent": count_50,
                "obs_count_90_percent": count_90,
                "first_candidate_obs_utc": min_time,
                "last_candidate_obs_utc": max_time,
                "segment_ids": str(seg_ids),
            }
        )

    res = pd.DataFrame(candidates)
    return res.sort_values(
        by=["highest_match_level", "total_candidate_observations"],
        ascending=[True, False],
    ).reset_index(drop=True)


def compute_space_time_funnel(
    df_cleaned: pd.DataFrame,
    candidate_obs_df: pd.DataFrame,
    candidate_vessels_df: pd.DataFrame,
    gap_candidates_df: pd.DataFrame,
) -> SpaceTimeFunnelReport:
    """Compute progression funnel statistics for Phase 2 reporting."""
    total_records = len(df_cleaned)
    total_mmsis = int(df_cleaned["MMSI"].nunique())

    spatial_records = int(candidate_obs_df["is_spatial_match"].sum())
    temporal_records = int(candidate_obs_df["is_temporal_match"].sum())
    combined_records = int(
        candidate_obs_df["match_status"].isin(
            [
                ObservationMatchStatus.MATCH_50_PERCENT.value,
                ObservationMatchStatus.MATCH_90_PERCENT.value,
            ]
        ).sum()
    )
    final_candidates = len(candidate_vessels_df) if not candidate_vessels_df.empty else 0
    gap_candidates = len(gap_candidates_df) if not gap_candidates_df.empty else 0

    return SpaceTimeFunnelReport(
        total_input_records=total_records,
        total_unique_vessels=total_mmsis,
        spatial_matches_records=spatial_records,
        temporal_matches_records=temporal_records,
        combined_space_time_records=combined_records,
        final_candidate_vessels=final_candidates,
        gap_overlap_candidates=gap_candidates,
    )

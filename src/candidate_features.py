"""
candidate_features.py
=====================
M5 Phase 3 — Candidate AIS Feature Extraction.

Produces a CandidateFeatures record for each Phase 2 candidate MMSI.

SCOPE: Descriptive AIS measurements only.
       No attribution scoring, no responsibility determination.
"""
from __future__ import annotations

import logging
import math
from typing import Any, Dict, List, Optional, Tuple, cast

import numpy as np
import pandas as pd

from feature_models import CandidateFeatures, Phase3Config

logger = logging.getLogger("candidate_features")

# ---------------------------------------------------------------------------
# Geographic helpers (no third-party dependency)
# ---------------------------------------------------------------------------

def _haversine_m(lat1: float, lon1: float, lat2: float, lon2: float,
                 earth_radius_m: float = 6_371_000.0) -> float:
    """Haversine great-circle distance in metres between two WGS-84 points."""
    r = earth_radius_m
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def _contour_centroid(geojson_polygon: Dict[str, Any]) -> Tuple[float, float]:
    """Return the (lat, lon) arithmetic centroid of a GeoJSON Polygon exterior ring."""
    coords = geojson_polygon.get("coordinates", [[]])[0]  # [lon, lat] pairs
    lons = [c[0] for c in coords]
    lats = [c[1] for c in coords]
    return float(sum(lats) / len(lats)), float(sum(lons) / len(lons))


def _circular_diff(a: float, b: float) -> float:
    """Minimum absolute angular difference between two headings (degrees).

    Handles 359° -> 1° = 2°, NOT 358°.
    Both inputs must be in [0, 360).
    """
    diff = abs(a - b) % 360.0
    return diff if diff <= 180.0 else 360.0 - diff


def _vectorised_haversine_m(
    lat_series: pd.Series,
    lon_series: pd.Series,
    ref_lat: float,
    ref_lon: float,
    earth_radius_m: float,
) -> np.ndarray:
    """Vectorised Haversine distances from each (lat, lon) row to a reference point."""
    r = earth_radius_m
    lat1 = np.radians(lat_series.to_numpy(dtype=float))
    lon1 = np.radians(lon_series.to_numpy(dtype=float))
    lat2 = math.radians(ref_lat)
    lon2 = math.radians(ref_lon)
    dphi = lat2 - lat1
    dlambda = lon2 - lon1
    a = np.sin(dphi / 2) ** 2 + np.cos(lat1) * math.cos(lat2) * np.sin(dlambda / 2) ** 2
    return cast(np.ndarray, 2 * r * np.arcsin(np.sqrt(a)))


# ---------------------------------------------------------------------------
# Per-MMSI feature extraction
# ---------------------------------------------------------------------------

def _extract_features_for_mmsi(
    mmsi: str,
    obs: pd.DataFrame,
    centroid_50: Tuple[float, float],
    centroid_90: Tuple[float, float],
    cfg: Phase3Config,
) -> CandidateFeatures:
    """Compute all Phase 3 features for a single candidate vessel.

    Args:
        mmsi: MMSI string.
        obs: Sub-DataFrame of candidate observations for this MMSI (already
             filtered to space-time matched rows from Phase 2).
        centroid_50: (lat, lon) centroid of 50 % origin contour.
        centroid_90: (lat, lon) centroid of 90 % origin contour.
        cfg: Phase3Config thresholds.

    Returns:
        CandidateFeatures dataclass.
    """
    obs = obs.sort_values("BaseDateTime").reset_index(drop=True)

    # ---- Basic counts ---------------------------------------------------
    n = len(obs)
    obs_50 = int((obs["match_status"] == "MATCH_50_PERCENT").sum())
    obs_90 = int((obs["match_status"] == "MATCH_90_PERCENT").sum())

    # ---- Timestamps / duration ------------------------------------------
    obs["BaseDateTime"] = pd.to_datetime(obs["BaseDateTime"], utc=True)
    t_first = obs["BaseDateTime"].iloc[0]
    t_last = obs["BaseDateTime"].iloc[-1]
    first_ts = t_first.isoformat()
    last_ts = t_last.isoformat()
    track_duration_s = float((t_last - t_first).total_seconds())

    # ---- Segment count --------------------------------------------------
    seg_count = 0
    if "segment_id" in obs.columns:
        seg_count = int(obs["segment_id"].dropna().nunique())

    # ---- Distance to origin contours ------------------------------------
    lat_s = cast(pd.Series, obs["LAT"])
    lon_s = cast(pd.Series, obs["LON"])
    dists_50 = _vectorised_haversine_m(
        lat_s, lon_s, centroid_50[0], centroid_50[1], cfg.earth_radius_m
    )
    dists_90 = _vectorised_haversine_m(
        lat_s, lon_s, centroid_90[0], centroid_90[1], cfg.earth_radius_m
    )
    min_dist_50: Optional[float] = float(dists_50.min()) if n > 0 else None
    min_dist_90: Optional[float] = float(dists_90.min()) if n > 0 else None
    min_dist: Optional[float] = (
        min(min_dist_50 or float("inf"), min_dist_90 or float("inf")) if n > 0 else None
    )
    mean_dist: Optional[float] = float(dists_50.mean()) if n > 0 else None

    # ---- Dwell ----------------------------------------------------------
    dwell_s = 0.0
    if "time_delta_seconds" in obs.columns:
        td = obs["time_delta_seconds"].dropna()
        dwell_s = float(td[td > 0].sum())
    dwell_obs = n

    # ---- Stationary -----------------------------------------------------
    sog_col = obs["SOG"].dropna()
    stat_count = int((obs["SOG"] < cfg.stationary_speed_threshold_knots).sum())
    stat_frac = stat_count / n if n > 0 else 0.0

    # ---- Speed profile --------------------------------------------------
    min_sog: Optional[float] = float(sog_col.min()) if len(sog_col) > 0 else None
    max_sog: Optional[float] = float(sog_col.max()) if len(sog_col) > 0 else None
    mean_sog: Optional[float] = float(sog_col.mean()) if len(sog_col) > 0 else None
    median_sog: Optional[float] = float(sog_col.median()) if len(sog_col) > 0 else None
    sog_std: Optional[float] = float(sog_col.std()) if len(sog_col) > 1 else None

    spd_chg_count = 0
    sog_vals = obs["SOG"].to_numpy(dtype=float)
    for i in range(1, len(sog_vals)):
        if not (math.isnan(sog_vals[i]) or math.isnan(sog_vals[i - 1])):
            if abs(sog_vals[i] - sog_vals[i - 1]) >= cfg.speed_change_threshold_knots:
                spd_chg_count += 1

    spd_chg_rate: Optional[float] = None
    if track_duration_s > 0:
        spd_chg_rate = spd_chg_count / (track_duration_s / 3600.0)

    # ---- Heading / COG --------------------------------------------------
    cog_valid = obs["COG"].notna()
    cog_avail_frac = float(cog_valid.sum()) / n if n > 0 else 0.0

    heading_avail_frac = 0.0
    if "Heading" in obs.columns:
        h_valid = obs["Heading"].notna()
        heading_avail_frac = float(h_valid.sum()) / n if n > 0 else 0.0

    cog_vals = obs["COG"].to_numpy(dtype=float)
    hdg_chg_count = 0
    total_hdg_chg = 0.0
    all_hdg_chg: List[float] = []
    max_hdg_chg: Optional[float] = None

    for i in range(1, len(cog_vals)):
        v_prev, v_curr = cog_vals[i - 1], cog_vals[i]
        if math.isnan(v_prev) or math.isnan(v_curr):
            continue
        diff = _circular_diff(v_prev, v_curr)
        if diff >= cfg.heading_change_threshold_degrees:
            hdg_chg_count += 1
        total_hdg_chg += diff
        all_hdg_chg.append(diff)

    mean_hdg_chg: Optional[float] = None
    if all_hdg_chg:
        mean_hdg_chg = sum(all_hdg_chg) / len(all_hdg_chg)
        max_hdg_chg = max(all_hdg_chg)

    # ---- Vessel metadata ------------------------------------------------
    def _first_valid(col: str) -> Any:
        if col not in obs.columns:
            return None
        vals = obs[col].dropna()
        return vals.iloc[0] if len(vals) > 0 else None

    vessel_type_raw = _first_valid("VesselType")
    vessel_type: Optional[float] = float(vessel_type_raw) if vessel_type_raw is not None else None
    nav_status_raw = _first_valid("Status")
    nav_status: Optional[float] = float(nav_status_raw) if nav_status_raw is not None else None
    imo_raw = _first_valid("IMO")
    imo_val: Optional[str] = str(imo_raw) if imo_raw is not None else None
    draft_raw = _first_valid("Draft")
    draft_val: Optional[float] = float(draft_raw) if draft_raw is not None else None
    cargo_raw = _first_valid("Cargo")
    cargo_val: Optional[float] = float(cargo_raw) if cargo_raw is not None else None

    return CandidateFeatures(
        mmsi=mmsi,
        distance_to_origin_50m=min_dist_50,
        distance_to_origin_90m=min_dist_90,
        min_distance_to_origin=min_dist,
        mean_distance_to_origin=mean_dist,
        observation_count=n,
        observation_count_50_percent=obs_50,
        observation_count_90_percent=obs_90,
        first_candidate_timestamp=first_ts,
        last_candidate_timestamp=last_ts,
        track_duration_seconds=track_duration_s,
        segment_count=seg_count,
        dwell_duration_seconds=dwell_s,
        dwell_observation_count=dwell_obs,
        stationary_observation_count=stat_count,
        stationary_fraction=stat_frac,
        min_sog=min_sog,
        max_sog=max_sog,
        mean_sog=mean_sog,
        median_sog=median_sog,
        sog_stddev=sog_std,
        speed_change_count=spd_chg_count,
        speed_change_rate=spd_chg_rate,
        heading_change_count=hdg_chg_count,
        total_heading_change_degrees=total_hdg_chg,
        mean_heading_change_degrees=mean_hdg_chg,
        max_heading_change_degrees=max_hdg_chg,
        cog_available_fraction=cog_avail_frac,
        heading_available_fraction=heading_avail_frac,
        vessel_type=vessel_type,
        navigation_status=nav_status,
        imo=imo_val,
        draft=draft_val,
        cargo=cargo_val,
    )


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def extract_candidate_features(
    candidate_obs_df: pd.DataFrame,
    contour_50_geojson: Dict[str, Any],
    contour_90_geojson: Dict[str, Any],
    cfg: Optional[Phase3Config] = None,
) -> pd.DataFrame:
    """Extract Phase 3 feature vectors for all candidate vessels.

    Args:
        candidate_obs_df: Phase 2 candidate observations DataFrame.  Must
            contain MMSI, BaseDateTime, LAT, LON, SOG, COG, match_status.
        contour_50_geojson: GeoJSON Polygon dict for 50 % origin contour.
        contour_90_geojson: GeoJSON Polygon dict for 90 % origin contour.
        cfg: Optional Phase3Config; defaults used if None.

    Returns:
        DataFrame with one row per candidate MMSI, columns matching
        CandidateFeatures fields.
    """
    if cfg is None:
        cfg = Phase3Config()

    if candidate_obs_df.empty:
        logger.warning("No candidate observations provided; returning empty feature table.")
        return pd.DataFrame()

    centroid_50 = _contour_centroid(contour_50_geojson)
    centroid_90 = _contour_centroid(contour_90_geojson)

    candidate_obs_df = candidate_obs_df.copy()
    candidate_obs_df["BaseDateTime"] = pd.to_datetime(
        candidate_obs_df["BaseDateTime"], utc=True
    )

    records: List[Dict[str, Any]] = []
    for mmsi_raw, grp in candidate_obs_df.groupby("MMSI"):
        mmsi_str = str(mmsi_raw)
        logger.debug("Extracting features for MMSI %s (%d observations)", mmsi_str, len(grp))
        feat = _extract_features_for_mmsi(mmsi_str, grp.copy(), centroid_50, centroid_90, cfg)
        records.append(feat.to_dict())

    df = pd.DataFrame(records)
    logger.info("Phase 3: extracted features for %d candidate vessels.", len(df))
    return df

"""
gap_evidence.py
===============
M5 Phase 3 — AIS Gap Evidence Extraction for Candidate Vessels.

Produces a GapEvidenceRecord for each AIS gap associated with a candidate
MMSI.  Records include the kinematic displacement estimate (observed vs.
expected based on last known speed) and a quality flag.

SCOPE STATEMENT
---------------
AIS gaps are data-quality observations.  They do NOT constitute proof of
wrongdoing.  The displacement calculations are descriptive kinematic
estimates only — they are NOT anomaly scores, suspiciousness ratings, or
attribution conclusions.
"""

from __future__ import annotations

import logging
import math
from datetime import datetime
from typing import Any, Dict, List, Optional, cast

import pandas as pd

from feature_models import GapEvidenceRecord, Phase3Config

logger = logging.getLogger("gap_evidence")

_KNOTS_TO_MPS = 0.514444  # 1 knot = 0.514444 m/s


# ---------------------------------------------------------------------------
# Geographic helper (duplicated from candidate_features to keep module
# self-contained; both are pure-Python stdlib)
# ---------------------------------------------------------------------------

def _haversine_m(lat1: float, lon1: float, lat2: float, lon2: float,
                 earth_radius_m: float = 6_371_000.0) -> float:
    """Haversine great-circle distance in metres."""
    r = earth_radius_m
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


# ---------------------------------------------------------------------------
# Per-gap evidence extraction
# ---------------------------------------------------------------------------

def _build_gap_evidence(
    row: pd.Series,
    origin_start: datetime,
    origin_end: datetime,
    cfg: Phase3Config,
) -> GapEvidenceRecord:
    """Build a GapEvidenceRecord from a single gap record row."""

    prev_ts_raw = cast(pd.Timestamp, pd.to_datetime(str(row["prev_timestamp"]), utc=True))
    next_ts_raw = cast(pd.Timestamp, pd.to_datetime(str(row["next_timestamp"]), utc=True))
    gap_dur_s = float((next_ts_raw - prev_ts_raw).total_seconds())
    gap_class = str(row.get("gap_class", "UNKNOWN"))

    origin_start_ts = pd.Timestamp(origin_start.isoformat())
    origin_end_ts = pd.Timestamp(origin_end.isoformat())
    overlaps = (prev_ts_raw <= origin_end_ts) and (next_ts_raw >= origin_start_ts)

    def _opt_float(val: Any) -> Optional[float]:
        try:
            f = float(val)
            return None if math.isnan(f) else f
        except (TypeError, ValueError):
            return None

    def _opt_int(val: Any) -> Optional[int]:
        try:
            f = float(val)
            return None if math.isnan(f) else int(f)
        except (TypeError, ValueError):
            return None

    l_lat = _opt_float(row.get("last_lat"))
    l_lon = _opt_float(row.get("last_lon"))
    l_sog = _opt_float(row.get("last_sog"))
    l_cog = _opt_float(row.get("last_cog"))
    l_hdg = _opt_float(row.get("last_heading"))
    n_lat = _opt_float(row.get("next_lat"))
    n_lon = _opt_float(row.get("next_lon"))
    n_sog = _opt_float(row.get("next_sog"))
    n_cog: Optional[float] = None   # not stored in Phase 1 gap records
    n_hdg: Optional[float] = None   # not stored in Phase 1 gap records

    # Observed displacement (Haversine between last and reappearance)
    observed_disp: Optional[float] = None
    if l_lat is not None and l_lon is not None and n_lat is not None and n_lon is not None:
        observed_disp = _haversine_m(l_lat, l_lon, n_lat, n_lon, cfg.earth_radius_m)

    # Expected displacement: straight-line kinematic estimate
    expected_disp: Optional[float] = None
    if l_sog is not None:
        expected_disp = l_sog * _KNOTS_TO_MPS * gap_dur_s

    # Displacement difference
    disp_diff: Optional[float] = None
    if observed_disp is not None and expected_disp is not None:
        disp_diff = observed_disp - expected_disp

    # Data quality flag
    if observed_disp is not None and expected_disp is not None:
        quality = "FULL"
    elif observed_disp is not None and expected_disp is None:
        quality = "PARTIAL_NO_SOG"
    elif observed_disp is None and (l_lat is None or n_lat is None):
        quality = "PARTIAL_NO_POSITION"
    else:
        quality = "INSUFFICIENT"

    seg_before = _opt_int(row.get("prev_segment_id"))
    seg_after = _opt_int(row.get("next_segment_id"))

    evidence_note = (
        "AIS transmission gap overlaps spill origin time window. "
        "Treated as contextual evidence requiring further investigation, "
        "NOT proof of wrongdoing."
        if overlaps
        else (
            "AIS transmission gap does not directly overlap origin time window. "
            "Included for completeness as part of candidate vessel trajectory."
        )
    )

    return GapEvidenceRecord(
        mmsi=str(row["mmsi"]),
        gap_start=str(prev_ts_raw),
        gap_end=str(next_ts_raw),
        gap_duration_seconds=gap_dur_s,
        gap_class=gap_class,
        overlaps_origin_window=overlaps,
        last_known_lat=l_lat,
        last_known_lon=l_lon,
        last_known_sog=l_sog,
        last_known_cog=l_cog,
        last_known_heading=l_hdg,
        first_reappearance_lat=n_lat,
        first_reappearance_lon=n_lon,
        first_reappearance_sog=n_sog,
        first_reappearance_cog=n_cog,
        first_reappearance_heading=n_hdg,
        observed_gap_displacement_m=observed_disp,
        expected_displacement_m=expected_disp,
        displacement_difference_m=disp_diff,
        displacement_quality=quality,
        segment_before_gap=seg_before,
        segment_after_gap=seg_after,
        evidence_note=evidence_note,
    )


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def extract_gap_evidence(
    candidate_mmsis: List[str],
    gap_records_df: pd.DataFrame,
    origin_start: datetime,
    origin_end: datetime,
    cfg: Optional[Phase3Config] = None,
) -> pd.DataFrame:
    """Extract AIS gap evidence records for all candidate MMSIs.

    For each candidate MMSI, all of its gap records (from Phase 1) are
    included — not just those overlapping the origin window — so that
    analysts have full trajectory-gap context.

    Args:
        candidate_mmsis: List of MMSI strings (Phase 2 candidate vessels).
        gap_records_df: Phase 1 AIS gap records DataFrame
            (outputs/ais_gap_records.csv).
        origin_start: UTC Timestamp for origin window start.
        origin_end: UTC Timestamp for origin window end.
        cfg: Optional Phase3Config; defaults used if None.

    Returns:
        DataFrame with one row per gap record, columns matching
        GapEvidenceRecord fields.
    """
    if cfg is None:
        cfg = Phase3Config()

    if gap_records_df.empty:
        logger.warning("No gap records provided; returning empty gap evidence table.")
        return pd.DataFrame()

    gaps = gap_records_df.copy()
    gaps["prev_timestamp"] = pd.to_datetime(gaps["prev_timestamp"], utc=True)
    gaps["next_timestamp"] = pd.to_datetime(gaps["next_timestamp"], utc=True)

    # Normalise MMSI dtype so string comparison works regardless of source type
    gaps["mmsi"] = gaps["mmsi"].astype(str)
    candidate_mmsis_list = [str(m) for m in candidate_mmsis]

    relevant = cast(pd.DataFrame, gaps[gaps["mmsi"].isin(candidate_mmsis_list)].copy())

    if len(relevant) == 0:
        logger.info("No gap records found for any candidate MMSI.")
        return pd.DataFrame()

    records: List[Dict[str, Any]] = []
    for _, row in relevant.iterrows():
        evidence = _build_gap_evidence(row, origin_start, origin_end, cfg)
        records.append(evidence.to_dict())

    df = pd.DataFrame(records)
    logger.info(
        "Phase 3 gap evidence: %d records for %d candidate MMSIs (%d overlap origin window).",
        len(df),
        len(df["mmsi"].unique()),
        int(df["overlaps_origin_window"].sum()),
    )
    return df

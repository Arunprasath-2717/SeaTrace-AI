"""
db/importer.py
==============
Bulk-importer CLI tool to ingest M5 Phase 1, Phase 2, and Phase 3 output
artifacts into PostGIS tables.

Usage:
  python -m db.importer [--output-dir outputs/] [--truncate]
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import sys
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple, cast

import pandas as pd
from geoalchemy2.shape import from_shape
from shapely.geometry import LineString, Point
from sqlalchemy import text
from sqlalchemy.orm import Session

# Add src to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from db.connection import get_db_session, get_engine
from db.models import (
    AISGapEvidenceTable,
    AISObservationTable,
    CandidateFeaturesTable,
    GapOverlapCandidateTable,
    SpaceTimeFunnelTable,
    TrajectorySegmentTable,
)
from db.schema import create_schema, drop_schema

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger("postgis_importer")


def _to_dt(val: Any) -> Optional[datetime]:
    """Safely convert a pandas timestamp or string value to a Python datetime."""
    if val is None or pd.isna(val):
        return None
    dt = pd.to_datetime(val, utc=True)
    if isinstance(dt, pd.Timestamp):
        return dt.to_pydatetime()
    return None


def import_artifacts_to_postgis(
    base_output_dir: str,
    truncate_existing: bool = True,
    session: Optional[Session] = None,
) -> Dict[str, int]:
    """Import M5 output artifacts into PostGIS database.

    Args:
        base_output_dir: Path to outputs/ directory containing CSVs.
        truncate_existing: If True, clear tables before loading (idempotent).
        session: Optional SQLAlchemy Session.

    Returns:
        Summary dict of imported row counts per table.
    """
    engine = get_engine()
    create_schema(engine)

    phase2_dir = os.path.join(base_output_dir, "phase2")
    phase3_dir = os.path.join(base_output_dir, "phase3")

    cleaned_csv = os.path.join(base_output_dir, "ais_cleaned.csv")
    gap_evidence_csv = os.path.join(phase3_dir, "candidate_gap_evidence.csv")
    candidate_features_csv = os.path.join(phase3_dir, "candidate_features.csv")
    candidate_vessels_csv = os.path.join(phase2_dir, "candidate_vessels.csv")
    space_time_report_json = os.path.join(phase2_dir, "space_time_report.json")
    gap_overlap_csv = os.path.join(phase2_dir, "gap_overlap_candidates.csv")

    close_session = False
    if session is None:
        close_session = True
        session = next(get_db_session())

    counts = {
        "space_time_funnel": 0,
        "gap_overlap_candidates": 0,
        "candidate_features": 0,
        "ais_observations": 0,
        "trajectory_segments": 0,
        "ais_gap_evidence": 0,
    }

    try:
        if truncate_existing:
            logger.info("Dropping and recreating M5 PostGIS tables for idempotent import...")
            drop_schema(engine)
            create_schema(engine)

        # 1. Import Candidate Features & Candidate Vessels
        cand_map: Dict[str, Dict[str, Any]] = {}

        if os.path.exists(candidate_vessels_csv) and os.path.getsize(candidate_vessels_csv) > 0:
            df_cand = pd.read_csv(candidate_vessels_csv, dtype={"mmsi": str})
            for _, row in df_cand.iterrows():
                r = cast(Dict[str, Any], row.to_dict())
                m = str(r["mmsi"])
                cand_map[m] = {
                    "mmsi": m,
                    "highest_match_level": str(r.get("highest_match_level") or "NONE"),
                    "total_candidate_observations": int(r.get("total_candidate_observations") or 0),
                    "obs_count_50_percent": int(r.get("obs_count_50_percent") or 0),
                    "obs_count_90_percent": int(r.get("obs_count_90_percent") or 0),
                    "first_candidate_timestamp": str(r.get("first_candidate_obs_utc") or ""),
                    "last_candidate_timestamp": str(r.get("last_candidate_obs_utc") or ""),
                    "is_gap_overlap_candidate": False,
                }

        if os.path.exists(gap_overlap_csv) and os.path.getsize(gap_overlap_csv) > 0:
            df_g_cand = pd.read_csv(gap_overlap_csv, dtype={"mmsi": str})
            if not df_g_cand.empty and "mmsi" in df_g_cand.columns:
                for _, row in df_g_cand.iterrows():
                    r = cast(Dict[str, Any], row.to_dict())
                    m = str(r["mmsi"])
                    if m in cand_map:
                        cand_map[m]["is_gap_overlap_candidate"] = True
                    else:
                        cand_map[m] = {
                            "mmsi": m,
                            "highest_match_level": "NONE",
                            "total_candidate_observations": 0,
                            "obs_count_50_percent": 0,
                            "obs_count_90_percent": 0,
                            "first_candidate_timestamp": str(r.get("prev_timestamp") or r.get("prev_timestamp_utc") or ""),
                            "last_candidate_timestamp": str(r.get("next_timestamp") or r.get("next_timestamp_utc") or ""),
                            "is_gap_overlap_candidate": True,
                        }

        if os.path.exists(candidate_features_csv) and os.path.getsize(candidate_features_csv) > 0:
            df_feat = pd.read_csv(candidate_features_csv, dtype={"mmsi": str})
            for _, row in df_feat.iterrows():
                rdict = cast(Dict[str, Any], row.to_dict())
                m = str(rdict["mmsi"])

                def _v(k: str) -> Any:
                    val = rdict.get(k)
                    if val is None or pd.isna(val):
                        return None
                    return val

                base_c = cand_map.get(m, {"mmsi": m, "highest_match_level": "NONE", "is_gap_overlap_candidate": False})
                cf_obj = CandidateFeaturesTable(
                    mmsi=m,
                    highest_match_level=str(base_c.get("highest_match_level") or "NONE"),
                    total_candidate_observations=int(_v("observation_count") or base_c.get("total_candidate_observations") or 0),
                    obs_count_50_percent=int(_v("observation_count_50_percent") or base_c.get("obs_count_50_percent") or 0),
                    obs_count_90_percent=int(_v("observation_count_90_percent") or base_c.get("obs_count_90_percent") or 0),
                    first_candidate_timestamp=str(_v("first_candidate_timestamp") or base_c.get("first_candidate_timestamp") or ""),
                    last_candidate_timestamp=str(_v("last_candidate_timestamp") or base_c.get("last_candidate_timestamp") or ""),
                    track_duration_seconds=_v("track_duration_seconds"),
                    segment_count=_v("segment_count"),
                    distance_to_origin_50m=_v("distance_to_origin_50m"),
                    distance_to_origin_90m=_v("distance_to_origin_90m"),
                    min_distance_to_origin=_v("min_distance_to_origin"),
                    mean_distance_to_origin=_v("mean_distance_to_origin"),
                    dwell_duration_seconds=_v("dwell_duration_seconds"),
                    dwell_observation_count=_v("dwell_observation_count"),
                    stationary_observation_count=_v("stationary_observation_count"),
                    stationary_fraction=_v("stationary_fraction"),
                    min_sog=_v("min_sog"),
                    max_sog=_v("max_sog"),
                    mean_sog=_v("mean_sog"),
                    median_sog=_v("median_sog"),
                    sog_stddev=_v("sog_stddev"),
                    speed_change_count=_v("speed_change_count"),
                    speed_change_rate=_v("speed_change_rate"),
                    heading_change_count=_v("heading_change_count"),
                    total_heading_change_degrees=_v("total_heading_change_degrees"),
                    mean_heading_change_degrees=_v("mean_heading_change_degrees"),
                    max_heading_change_degrees=_v("max_heading_change_degrees"),
                    cog_available_fraction=_v("cog_available_fraction"),
                    heading_available_fraction=_v("heading_available_fraction"),
                    is_gap_overlap_candidate=bool(base_c.get("is_gap_overlap_candidate") or False),
                    vessel_type=_v("vessel_type"),
                    navigation_status=_v("navigation_status"),
                    imo=str(_v("imo")) if _v("imo") is not None else None,
                    draft=_v("draft"),
                    cargo=_v("cargo"),
                )
                session.merge(cf_obj)
                counts["candidate_features"] += 1

        # 1b. Import Space-Time Funnel Metrics
        if os.path.exists(space_time_report_json) and os.path.getsize(space_time_report_json) > 0:
            with open(space_time_report_json, "r", encoding="utf-8") as f:
                report_data = json.load(f)
            funnel = report_data.get("funnel_metrics", {})
            if funnel:
                funnel_obj = SpaceTimeFunnelTable(
                    total_input_records=int(funnel.get("total_input_records") or 0),
                    total_unique_vessels=int(funnel.get("total_unique_vessels") or 0),
                    spatial_matches_records=int(funnel.get("spatial_matches_records") or 0),
                    temporal_matches_records=int(funnel.get("temporal_matches_records") or 0),
                    combined_space_time_records=int(funnel.get("combined_space_time_records") or 0),
                    final_candidate_vessels=int(funnel.get("final_candidate_vessels") or 0),
                    gap_overlap_candidates=int(funnel.get("gap_overlap_candidates") or 0),
                )
                session.add(funnel_obj)
                session.commit()
                counts["space_time_funnel"] += 1

        # 1c. Import Gap-Overlap Candidates Table
        if os.path.exists(gap_overlap_csv) and os.path.getsize(gap_overlap_csv) > 0:
            df_g_cand = pd.read_csv(gap_overlap_csv, dtype={"mmsi": str})
            if not df_g_cand.empty and "mmsi" in df_g_cand.columns:
                gap_cand_objs: List[GapOverlapCandidateTable] = []
                for _, row in df_g_cand.iterrows():
                    r = cast(Dict[str, Any], row.to_dict())
                    m = str(r["mmsi"])

                    def _gv(k: str) -> Any:
                        val = r.get(k)
                        if val is None or pd.isna(val):
                            return None
                        return val

                    p_ts = _to_dt(_gv("prev_timestamp"))
                    n_ts = _to_dt(_gv("next_timestamp"))
                    prev_seg = _gv("prev_segment_id")
                    next_seg = _gv("next_segment_id")

                    gap_cand_objs.append(GapOverlapCandidateTable(
                        mmsi=m,
                        prev_timestamp=p_ts,
                        next_timestamp=n_ts,
                        gap_duration_minutes=_gv("gap_duration_minutes"),
                        gap_duration_hours=_gv("gap_duration_hours"),
                        last_lat=_gv("last_lat"),
                        last_lon=_gv("last_lon"),
                        last_sog=_gv("last_sog"),
                        last_cog=_gv("last_cog"),
                        last_heading=_gv("last_heading"),
                        next_lat=_gv("next_lat"),
                        next_lon=_gv("next_lon"),
                        next_sog=_gv("next_sog"),
                        prev_segment_id=int(prev_seg) if prev_seg is not None else None,
                        next_segment_id=int(next_seg) if next_seg is not None else None,
                        gap_class=str(_gv("gap_class") or "LONG_GAP"),
                        overlap_status=str(_gv("overlap_status") or "GAP_OVERLAP_CANDIDATE"),
                        evidence_note=str(_gv("evidence_note") or ""),
                    ))
                if gap_cand_objs:
                    session.bulk_save_objects(gap_cand_objs)
                    session.commit()
                    counts["gap_overlap_candidates"] += len(gap_cand_objs)

        # 2. Import AIS Observations & Trajectory Segments
        if os.path.exists(cleaned_csv) and os.path.getsize(cleaned_csv) > 0:
            logger.info("Importing AIS Observations into PostGIS...")
            df_obs = pd.read_csv(cleaned_csv, dtype={"MMSI": str})
            df_obs["BaseDateTime"] = pd.to_datetime(df_obs["BaseDateTime"], utc=True)

            obs_objects: List[AISObservationTable] = []
            for _, row in df_obs.iterrows():
                r = cast(Dict[str, Any], row.to_dict())
                lat, lon = float(r["LAT"]), float(r["LON"])

                def _v(k: str) -> Any:
                    val = r.get(k)
                    if val is None or pd.isna(val):
                        return None
                    return val

                ts = _to_dt(r["BaseDateTime"])
                if ts is not None:
                    obs_objects.append(AISObservationTable(
                        mmsi=str(r["MMSI"]),
                        timestamp=ts,
                        lat=lat,
                        lon=lon,
                        sog=_v("SOG"),
                        cog=_v("COG"),
                        heading=_v("Heading"),
                        vessel_type=_v("VesselType"),
                        navigation_status=_v("Status"),
                        imo=str(_v("IMO")) if _v("IMO") is not None else None,
                        draft=_v("Draft"),
                        cargo=_v("Cargo"),
                        segment_id=_v("segment_id"),
                        gap_flag=bool(_v("gap_flag")) if _v("gap_flag") is not None else False,
                        geom=from_shape(Point(lon, lat), srid=4326),
                    ))

                if len(obs_objects) >= 5000:
                    session.bulk_save_objects(obs_objects)
                    session.commit()
                    counts["ais_observations"] += len(obs_objects)
                    obs_objects.clear()

            if obs_objects:
                session.bulk_save_objects(obs_objects)
                session.commit()
                counts["ais_observations"] += len(obs_objects)
                obs_objects.clear()

            # Construct trajectory segment LineStrings
            logger.info("Constructing Trajectory LineString segments in PostGIS...")
            seg_objects: List[TrajectorySegmentTable] = []
            if "segment_id" in df_obs.columns:
                grouped = df_obs.groupby(["MMSI", "segment_id"])
                for group_key, group in grouped:
                    mmsi_val, seg_id_val = cast(Tuple[Any, Any], group_key)
                    if len(group) >= 2:
                        coords = [(float(r["LON"]), float(r["LAT"])) for _, r in group.iterrows()]
                        line = LineString(coords)
                        s_time = _to_dt(group["BaseDateTime"].iloc[0])
                        e_time = _to_dt(group["BaseDateTime"].iloc[-1])
                        seg_objects.append(TrajectorySegmentTable(
                            mmsi=str(mmsi_val),
                            segment_id=int(seg_id_val),
                            start_time=s_time,
                            end_time=e_time,
                            point_count=len(group),
                            track_geom=from_shape(line, srid=4326),
                        ))

            if seg_objects:
                session.bulk_save_objects(seg_objects)
                session.commit()
                counts["trajectory_segments"] += len(seg_objects)
                seg_objects.clear()

        # 3. Import Gap Evidence
        if os.path.exists(gap_evidence_csv) and os.path.getsize(gap_evidence_csv) > 0:
            df_gaps = pd.read_csv(gap_evidence_csv, dtype={"mmsi": str})
            gap_objects: List[AISGapEvidenceTable] = []
            for _, row in df_gaps.iterrows():
                rdict = cast(Dict[str, Any], row.to_dict())

                def _v(k: str) -> Any:
                    val = rdict.get(k)
                    if val is None or pd.isna(val):
                        return None
                    return val

                g_start = _to_dt(rdict.get("gap_start"))
                g_end = _to_dt(rdict.get("gap_end"))

                if g_start is not None and g_end is not None:
                    gap_objects.append(AISGapEvidenceTable(
                        mmsi=str(rdict["mmsi"]),
                        gap_start=g_start,
                        gap_end=g_end,
                        gap_duration_seconds=float(_v("gap_duration_seconds") or 0.0),
                        gap_class=str(_v("gap_class") or "UNKNOWN"),
                        overlaps_origin_window=bool(_v("overlaps_origin_window") or False),
                        last_known_lat=_v("last_known_lat"),
                        last_known_lon=_v("last_known_lon"),
                        last_known_sog=_v("last_known_sog"),
                        last_known_cog=_v("last_known_cog"),
                        last_known_heading=_v("last_known_heading"),
                        first_reappearance_lat=_v("first_reappearance_lat"),
                        first_reappearance_lon=_v("first_reappearance_lon"),
                        first_reappearance_sog=_v("first_reappearance_sog"),
                        first_reappearance_cog=_v("first_reappearance_cog"),
                        first_reappearance_heading=_v("first_reappearance_heading"),
                        observed_gap_displacement_m=_v("observed_gap_displacement_m"),
                        expected_displacement_m=_v("expected_displacement_m"),
                        displacement_difference_m=_v("displacement_difference_m"),
                        displacement_quality=str(_v("displacement_quality") or "INSUFFICIENT"),
                        segment_before_gap=int(_v("segment_before_gap")) if _v("segment_before_gap") is not None else None,
                        segment_after_gap=int(_v("segment_after_gap")) if _v("segment_after_gap") is not None else None,
                        evidence_note=str(_v("evidence_note") or ""),
                    ))

            if gap_objects:
                session.bulk_save_objects(gap_objects)
                session.commit()
                counts["ais_gap_evidence"] += len(gap_objects)

        logger.info("PostGIS import completed successfully: %s", counts)
        return counts

    finally:
        if close_session and session:
            session.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="M5 PostGIS Artifact Importer CLI")
    parser.add_argument("--output-dir", default="outputs", help="Directory containing Phase 1/2/3 output artifacts")
    parser.add_argument("--no-truncate", action="store_true", help="Do not truncate tables before loading")
    args = parser.parse_args()

    base_dir = os.path.abspath(args.output_dir)
    res = import_artifacts_to_postgis(base_dir, truncate_existing=not args.no_truncate)
    print("Import Summary:", json.dumps(res, indent=2))


if __name__ == "__main__":
    main()

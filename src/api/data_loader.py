"""
api/data_loader.py
==================
Data access module for reading generated M5 outputs.

Supports two operational modes:
1. File Mode (Default when M5_USE_POSTGIS is unset or false):
   Reads CSV/JSON output artifacts from outputs/ directory.
2. PostGIS Mode (Enabled when M5_USE_POSTGIS=true):
   Queries PostGIS spatial database tables.

Strict Error Handling Rule:
If M5_USE_POSTGIS=true, database connection attempts must either succeed or raise a
clear RuntimeError. Silent fallback to File Mode when PostGIS is explicitly enabled is forbidden.
"""

from __future__ import annotations

import json
import os
from typing import Any, Dict, List, Optional, Tuple, cast

import pandas as pd

from db.config import PostGISConfig
from db.connection import check_postgis_connection, get_db_session
from db.repository import PostGISRepository
from pipeline import M5Pipeline
from pipeline_phase2 import run_phase2_pipeline
from pipeline_phase3 import run_phase3_pipeline
from trajectory import TrajectoryReconstructor


def _to_float(val: Any, default: float = 0.0) -> float:
    if val is None or pd.isna(val):
        return default
    try:
        return float(val)
    except (ValueError, TypeError):
        return default


def _to_int(val: Any, default: int = 0) -> int:
    if val is None or pd.isna(val):
        return default
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return default


def _to_opt_float(val: Any) -> Optional[float]:
    if val is None or pd.isna(val):
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def _to_opt_int(val: Any) -> Optional[int]:
    if val is None or pd.isna(val):
        return None
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return None


class M5DataLoader:
    """Data loader supporting File Mode (default) and PostGIS Mode."""

    def __init__(self, base_output_dir: Optional[str] = None):
        if base_output_dir is None:
            base_output_dir = os.path.abspath(
                os.path.join(os.path.dirname(__file__), "..", "..", "outputs")
            )
        self.base_output_dir = base_output_dir
        self.phase2_dir = os.path.join(base_output_dir, "phase2")
        self.phase3_dir = os.path.join(base_output_dir, "phase3")

        # Check PostGIS configuration
        self.db_config = PostGISConfig.from_env()
        self.use_postgis = self.db_config.use_postgis

        if self.use_postgis:
            # Strict mode: verify connection or raise RuntimeError. NO silent fallback!
            if not check_postgis_connection(self.db_config):
                raise RuntimeError(
                    f"PostGIS Mode explicitly enabled (M5_USE_POSTGIS=true), "
                    f"but connection to PostgreSQL/PostGIS at {self.db_config.host}:{self.db_config.port} failed."
                )

    def _ensure_pipelines_run(self) -> None:
        """Run Phase 1, Phase 2, and Phase 3 pipelines if outputs are missing (File Mode)."""
        cleaned_csv = os.path.join(self.base_output_dir, "ais_cleaned.csv")
        p2_report = os.path.join(self.phase2_dir, "space_time_report.json")
        p3_features = os.path.join(self.phase3_dir, "candidate_features.csv")

        if os.path.exists(cleaned_csv) and os.path.exists(p2_report) and os.path.exists(p3_features):
            return

        root_dir = os.path.abspath(os.path.join(self.base_output_dir, ".."))
        csv_path = os.path.join(root_dir, "..", "data", "ais_data.csv")
        fixture_path = os.path.join(root_dir, "data", "m4_origin_fixture.json")

        if not os.path.exists(cleaned_csv):
            M5Pipeline().run(csv_path=csv_path, output_dir=self.base_output_dir)

        gaps_csv = os.path.join(self.base_output_dir, "ais_gap_records.csv")
        if not os.path.exists(p2_report):
            run_phase2_pipeline(
                fixture_path=fixture_path,
                cleaned_csv_path=cleaned_csv,
                gaps_csv_path=gaps_csv,
                output_dir=self.phase2_dir,
            )

        if not os.path.exists(p3_features):
            p2_obs = os.path.join(self.phase2_dir, "candidate_observations.csv")
            run_phase3_pipeline(
                fixture_path=fixture_path,
                candidate_obs_path=p2_obs,
                gap_records_path=gaps_csv,
                output_dir=self.phase3_dir,
            )

    # ------------------------------------------------------------------
    # Query methods
    # ------------------------------------------------------------------

    def get_funnel_metrics(self) -> Dict[str, Any]:
        """Return Phase 2 space-time funnel metrics."""
        if self.use_postgis:
            session = next(get_db_session(self.db_config))
            try:
                repo = PostGISRepository(session)
                return repo.get_funnel_metrics()
            finally:
                session.close()

        self._ensure_pipelines_run()
        report_path = os.path.join(self.phase2_dir, "space_time_report.json")
        if not os.path.exists(report_path):
            raise FileNotFoundError("Phase 2 space-time report not found.")

        with open(report_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return cast(Dict[str, Any], data.get("funnel_metrics", {}))

    def get_candidate_list(self) -> List[Dict[str, Any]]:
        """Return list of Phase 2 candidate vessels with overlap status."""
        if self.use_postgis:
            session = next(get_db_session(self.db_config))
            try:
                repo = PostGISRepository(session)
                return repo.get_candidate_list()
            finally:
                session.close()

        self._ensure_pipelines_run()
        cand_csv = os.path.join(self.phase2_dir, "candidate_vessels.csv")
        gap_cand_csv = os.path.join(self.phase2_dir, "gap_overlap_candidates.csv")

        candidates: List[Dict[str, Any]] = []
        seen_mmsis: set[str] = set()

        if os.path.exists(cand_csv) and os.path.getsize(cand_csv) > 0:
            df_cand = pd.read_csv(cand_csv, dtype={"mmsi": str})
            for _, row in df_cand.iterrows():
                mmsi = str(row["mmsi"])
                seen_mmsis.add(mmsi)
                candidates.append({
                    "mmsi": mmsi,
                    "highest_match_level": str(row.get("highest_match_level", "NONE")),
                    "total_candidate_observations": _to_int(row.get("total_candidate_observations"), 0),
                    "obs_count_50_percent": _to_int(row.get("obs_count_50_percent"), 0),
                    "obs_count_90_percent": _to_int(row.get("obs_count_90_percent"), 0),
                    "first_candidate_obs_utc": str(row.get("first_candidate_obs_utc", "")),
                    "last_candidate_obs_utc": str(row.get("last_candidate_obs_utc", "")),
                    "is_gap_overlap_candidate": False,
                })

        if os.path.exists(gap_cand_csv) and os.path.getsize(gap_cand_csv) > 0:
            df_gap = pd.read_csv(gap_cand_csv, dtype={"mmsi": str})
            if not df_gap.empty and "mmsi" in df_gap.columns:
                gap_mmsis = set(df_gap["mmsi"].astype(str).tolist())
                for c in candidates:
                    if c["mmsi"] in gap_mmsis:
                        c["is_gap_overlap_candidate"] = True

                for _, g_row in df_gap.iterrows():
                    g_mmsi = str(g_row["mmsi"])
                    if g_mmsi not in seen_mmsis:
                        seen_mmsis.add(g_mmsi)
                        p_ts = str(g_row.get("prev_timestamp", g_row.get("prev_timestamp_utc", "")))
                        n_ts = str(g_row.get("next_timestamp", g_row.get("next_timestamp_utc", "")))
                        candidates.append({
                            "mmsi": g_mmsi,
                            "highest_match_level": "NONE",
                            "total_candidate_observations": 0,
                            "obs_count_50_percent": 0,
                            "obs_count_90_percent": 0,
                            "first_candidate_obs_utc": p_ts,
                            "last_candidate_obs_utc": n_ts,
                            "is_gap_overlap_candidate": True,
                        })

        return candidates

    def get_candidate_detail(self, mmsi: str) -> Optional[Dict[str, Any]]:
        """Return detail record for a specific candidate MMSI."""
        if self.use_postgis:
            session = next(get_db_session(self.db_config))
            try:
                repo = PostGISRepository(session)
                return repo.get_candidate_detail(mmsi)
            finally:
                session.close()

        self._ensure_pipelines_run()
        cand_csv = os.path.join(self.phase2_dir, "candidate_vessels.csv")
        gap_cand_csv = os.path.join(self.phase2_dir, "gap_overlap_candidates.csv")
        target_mmsi = str(mmsi)

        row_spatial: Optional[pd.Series] = None
        if os.path.exists(cand_csv) and os.path.getsize(cand_csv) > 0:
            df_cand = pd.read_csv(cand_csv, dtype={"mmsi": str})
            v_match = df_cand[df_cand["mmsi"] == target_mmsi]
            if not v_match.empty:
                row_spatial = v_match.iloc[0]

        row_gap: Optional[pd.Series] = None
        if os.path.exists(gap_cand_csv) and os.path.getsize(gap_cand_csv) > 0:
            df_gap = pd.read_csv(gap_cand_csv, dtype={"mmsi": str})
            if not df_gap.empty and "mmsi" in df_gap.columns:
                g_match = df_gap[df_gap["mmsi"] == target_mmsi]
                if not g_match.empty:
                    row_gap = g_match.iloc[0]

        if row_spatial is None and row_gap is None:
            return None

        # Build gap details if present
        gap_details: Optional[Dict[str, Any]] = None
        if row_gap is not None:
            p_ts = str(row_gap.get("prev_timestamp", row_gap.get("prev_timestamp_utc", "")))
            n_ts = str(row_gap.get("next_timestamp", row_gap.get("next_timestamp_utc", "")))
            gap_details = {
                "prev_timestamp_utc": p_ts,
                "next_timestamp_utc": n_ts,
                "gap_duration_hours": _to_float(row_gap.get("gap_duration_hours")),
                "gap_class": str(row_gap.get("gap_class", "")),
                "last_lat": _to_float(row_gap.get("last_lat")),
                "last_lon": _to_float(row_gap.get("last_lon")),
                "next_lat": _to_float(row_gap.get("next_lat")),
                "next_lon": _to_float(row_gap.get("next_lon")),
                "evidence_note": str(row_gap.get("evidence_note", "")),
            }

        if row_spatial is not None:
            raw_segs = row_spatial.get("segment_ids", "[]")
            if isinstance(raw_segs, str):
                try:
                    segment_ids = [int(s) for s in json.loads(raw_segs)]
                except (json.JSONDecodeError, TypeError):
                    segment_ids = []
            elif isinstance(raw_segs, list):
                segment_ids = [int(s) for s in raw_segs]
            else:
                segment_ids = []

            return {
                "mmsi": target_mmsi,
                "highest_match_level": str(row_spatial.get("highest_match_level", "NONE")),
                "total_candidate_observations": _to_int(row_spatial.get("total_candidate_observations")),
                "obs_count_50_percent": _to_int(row_spatial.get("obs_count_50_percent")),
                "obs_count_90_percent": _to_int(row_spatial.get("obs_count_90_percent")),
                "first_candidate_obs_utc": str(row_spatial.get("first_candidate_obs_utc", "")),
                "last_candidate_obs_utc": str(row_spatial.get("last_candidate_obs_utc", "")),
                "segment_ids": segment_ids,
                "is_gap_overlap_candidate": row_gap is not None,
                "gap_overlap_details": gap_details,
            }
        else:
            assert row_gap is not None
            p_ts = str(row_gap.get("prev_timestamp", row_gap.get("prev_timestamp_utc", "")))
            n_ts = str(row_gap.get("next_timestamp", row_gap.get("next_timestamp_utc", "")))
            seg_ids: List[int] = []
            for k in ["prev_segment_id", "next_segment_id"]:
                val = row_gap.get(k)
                opt_s = _to_opt_int(val)
                if opt_s is not None:
                    seg_ids.append(opt_s)

            return {
                "mmsi": target_mmsi,
                "highest_match_level": "NONE",
                "total_candidate_observations": 0,
                "obs_count_50_percent": 0,
                "obs_count_90_percent": 0,
                "first_candidate_obs_utc": p_ts,
                "last_candidate_obs_utc": n_ts,
                "segment_ids": seg_ids,
                "is_gap_overlap_candidate": True,
                "gap_overlap_details": gap_details,
            }

    def get_candidate_features(self, mmsi: str) -> Optional[Dict[str, Any]]:
        """Return Phase 3 candidate feature record for a specific MMSI."""
        if self.use_postgis:
            session = next(get_db_session(self.db_config))
            try:
                repo = PostGISRepository(session)
                return repo.get_candidate_features(mmsi)
            finally:
                session.close()

        self._ensure_pipelines_run()
        feat_csv = os.path.join(self.phase3_dir, "candidate_features.csv")

        if not os.path.exists(feat_csv):
            return None

        df_feat = pd.read_csv(feat_csv, dtype={"mmsi": str})
        vessel_rows = df_feat[df_feat["mmsi"] == str(mmsi)]

        if vessel_rows.empty:
            return None

        row = vessel_rows.iloc[0].to_dict()

        def _v(k: str) -> Any:
            val = row.get(k)
            if val is None or pd.isna(val):
                return None
            return val

        imo_val = _v("imo")
        imo_str = str(imo_val) if imo_val is not None else None

        return {
            "mmsi": str(mmsi),
            "distance_to_origin_50m": _to_opt_float(_v("distance_to_origin_50m")),
            "distance_to_origin_90m": _to_opt_float(_v("distance_to_origin_90m")),
            "min_distance_to_origin": _to_opt_float(_v("min_distance_to_origin")),
            "mean_distance_to_origin": _to_opt_float(_v("mean_distance_to_origin")),
            "observation_count": _to_int(_v("observation_count")),
            "observation_count_50_percent": _to_int(_v("observation_count_50_percent")),
            "observation_count_90_percent": _to_int(_v("observation_count_90_percent")),
            "first_candidate_timestamp": str(_v("first_candidate_timestamp") or ""),
            "last_candidate_timestamp": str(_v("last_candidate_timestamp") or ""),
            "track_duration_seconds": _to_float(_v("track_duration_seconds")),
            "segment_count": _to_int(_v("segment_count")),
            "dwell_duration_seconds": _to_float(_v("dwell_duration_seconds")),
            "dwell_observation_count": _to_int(_v("dwell_observation_count")),
            "stationary_observation_count": _to_int(_v("stationary_observation_count")),
            "stationary_fraction": _to_float(_v("stationary_fraction")),
            "min_sog": _to_opt_float(_v("min_sog")),
            "max_sog": _to_opt_float(_v("max_sog")),
            "mean_sog": _to_opt_float(_v("mean_sog")),
            "median_sog": _to_opt_float(_v("median_sog")),
            "sog_stddev": _to_opt_float(_v("sog_stddev")),
            "speed_change_count": _to_int(_v("speed_change_count")),
            "speed_change_rate": _to_opt_float(_v("speed_change_rate")),
            "heading_change_count": _to_int(_v("heading_change_count")),
            "total_heading_change_degrees": _to_float(_v("total_heading_change_degrees")),
            "mean_heading_change_degrees": _to_opt_float(_v("mean_heading_change_degrees")),
            "max_heading_change_degrees": _to_opt_float(_v("max_heading_change_degrees")),
            "cog_available_fraction": _to_float(_v("cog_available_fraction")),
            "heading_available_fraction": _to_float(_v("heading_available_fraction")),
            "vessel_type": _to_opt_float(_v("vessel_type")),
            "navigation_status": _to_opt_float(_v("navigation_status")),
            "imo": imo_str,
            "draft": _to_opt_float(_v("draft")),
            "cargo": _to_opt_float(_v("cargo")),
        }

    def get_candidate_gap_evidence(self, mmsi: str) -> Tuple[bool, List[Dict[str, Any]]]:
        """Return AIS gap evidence records for a specific candidate MMSI."""
        if self.use_postgis:
            session = next(get_db_session(self.db_config))
            try:
                repo = PostGISRepository(session)
                return repo.get_candidate_gap_evidence(mmsi)
            finally:
                session.close()

        self._ensure_pipelines_run()

        # Verify vessel is a candidate
        cand_detail = self.get_candidate_detail(mmsi)
        if cand_detail is None:
            return False, []

        gap_csv = os.path.join(self.phase3_dir, "candidate_gap_evidence.csv")
        if not os.path.exists(gap_csv):
            return True, []

        df_gap = pd.read_csv(gap_csv, dtype={"mmsi": str})
        if df_gap.empty or "mmsi" not in df_gap.columns:
            return True, []

        vessel_gaps = df_gap[df_gap["mmsi"] == str(mmsi)]
        gaps: List[Dict[str, Any]] = []

        for _, row in vessel_gaps.iterrows():
            rdict = row.to_dict()

            def _v(k: str) -> Any:
                val = rdict.get(k)
                if val is None or pd.isna(val):
                    return None
                return val

            gaps.append({
                "mmsi": str(mmsi),
                "gap_start": str(_v("gap_start") or ""),
                "gap_end": str(_v("gap_end") or ""),
                "gap_duration_seconds": _to_float(_v("gap_duration_seconds")),
                "gap_class": str(_v("gap_class") or "UNKNOWN"),
                "overlaps_origin_window": bool(_v("overlaps_origin_window") or False),
                "last_known_lat": _to_opt_float(_v("last_known_lat")),
                "last_known_lon": _to_opt_float(_v("last_known_lon")),
                "last_known_sog": _to_opt_float(_v("last_known_sog")),
                "last_known_cog": _to_opt_float(_v("last_known_cog")),
                "last_known_heading": _to_opt_float(_v("last_known_heading")),
                "first_reappearance_lat": _to_opt_float(_v("first_reappearance_lat")),
                "first_reappearance_lon": _to_opt_float(_v("first_reappearance_lon")),
                "first_reappearance_sog": _to_opt_float(_v("first_reappearance_sog")),
                "first_reappearance_cog": _to_opt_float(_v("first_reappearance_cog")),
                "first_reappearance_heading": _to_opt_float(_v("first_reappearance_heading")),
                "observed_gap_displacement_m": _to_opt_float(_v("observed_gap_displacement_m")),
                "expected_displacement_m": _to_opt_float(_v("expected_displacement_m")),
                "displacement_difference_m": _to_opt_float(_v("displacement_difference_m")),
                "displacement_quality": str(_v("displacement_quality") or "INSUFFICIENT"),
                "segment_before_gap": _to_opt_int(_v("segment_before_gap")),
                "segment_after_gap": _to_opt_int(_v("segment_after_gap")),
                "evidence_note": str(_v("evidence_note") or (
                    "AIS transmission gap overlaps spill origin time window. "
                    "Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing."
                )),
            })

        return True, gaps

    def get_trajectory_geojson(self, mmsi: str) -> Optional[Dict[str, Any]]:
        """Return valid GeoJSON representation of vessel trajectory."""
        if self.use_postgis:
            session = next(get_db_session(self.db_config))
            try:
                repo = PostGISRepository(session)
                return repo.get_trajectory_geojson(mmsi)
            finally:
                session.close()

        self._ensure_pipelines_run()
        cleaned_csv = os.path.join(self.base_output_dir, "ais_cleaned.csv")
        if not os.path.exists(cleaned_csv):
            return None

        df = pd.read_csv(cleaned_csv, dtype={"MMSI": str})
        vessel_df = df[df["MMSI"] == str(mmsi)]

        if vessel_df.empty:
            return None

        tr = TrajectoryReconstructor()
        geojson = tr.to_geojson(df, str(mmsi))
        return cast(Dict[str, Any], geojson)

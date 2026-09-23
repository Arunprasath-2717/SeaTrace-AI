"""
db/repository.py
================
PostGIS Repository layer for querying M5 spatial datasets.

Provides clean database queries matching the API data loader contracts.
Does NOT compute attribution scores or alter M5 Phase 1/2/3 logic.
"""

from __future__ import annotations

import json
import logging
from typing import Any, Dict, List, Optional, Tuple, cast

from sqlalchemy import func, select, text
from sqlalchemy.orm import Session

from db.models import (
    AISGapEvidenceTable,
    AISObservationTable,
    CandidateFeaturesTable,
    GapOverlapCandidateTable,
    SpaceTimeFunnelTable,
    TrajectorySegmentTable,
)

logger = logging.getLogger("postgis_repository")


class PostGISRepository:
    """PostGIS data access repository for M5 datasets."""

    def __init__(self, session: Session):
        self.session = session

    def get_funnel_metrics(self) -> Dict[str, Any]:
        """Return funnel metrics from SpaceTimeFunnelTable in PostGIS."""
        stmt = select(SpaceTimeFunnelTable).order_by(SpaceTimeFunnelTable.id.desc())
        funnel_row = self.session.scalars(stmt).first()

        if funnel_row is not None:
            return {
                "total_input_records": int(funnel_row.total_input_records),
                "total_unique_vessels": int(funnel_row.total_unique_vessels),
                "spatial_matches_records": int(funnel_row.spatial_matches_records),
                "temporal_matches_records": int(funnel_row.temporal_matches_records),
                "combined_space_time_records": int(funnel_row.combined_space_time_records),
                "final_candidate_vessels": int(funnel_row.final_candidate_vessels),
                "gap_overlap_candidates": int(funnel_row.gap_overlap_candidates),
            }

        # Fallback to dynamic counts if space_time_funnel table is empty
        total_obs = self.session.query(func.count(AISObservationTable.id)).scalar() or 0
        total_vessels = self.session.query(func.count(func.distinct(AISObservationTable.mmsi))).scalar() or 0
        candidates_count = self.session.query(func.count(CandidateFeaturesTable.mmsi)).scalar() or 0
        gap_overlaps_count = self.session.query(func.count(GapOverlapCandidateTable.mmsi)).scalar() or 0
        spatial_matches = self.session.query(
            func.coalesce(func.sum(CandidateFeaturesTable.total_candidate_observations), 0)
        ).scalar() or 0

        return {
            "total_input_records": int(total_obs),
            "total_unique_vessels": int(total_vessels),
            "spatial_matches_records": int(spatial_matches),
            "temporal_matches_records": int(spatial_matches),
            "combined_space_time_records": int(spatial_matches),
            "final_candidate_vessels": int(candidates_count),
            "gap_overlap_candidates": int(gap_overlaps_count),
        }

    def get_candidate_list(self) -> List[Dict[str, Any]]:
        """Return list of space-time and gap-overlap candidates from PostGIS."""
        cf_stmt = select(CandidateFeaturesTable)
        cf_rows = self.session.scalars(cf_stmt).all()

        gap_stmt = select(GapOverlapCandidateTable)
        gap_rows = self.session.scalars(gap_stmt).all()
        gap_mmsis = {str(g.mmsi) for g in gap_rows}

        candidates: List[Dict[str, Any]] = []
        seen_mmsis: set[str] = set()

        for r in cf_rows:
            m = str(r.mmsi)
            seen_mmsis.add(m)
            candidates.append({
                "mmsi": m,
                "highest_match_level": str(r.highest_match_level or "NONE"),
                "total_candidate_observations": int(r.total_candidate_observations or 0),
                "obs_count_50_percent": int(r.obs_count_50_percent or 0),
                "obs_count_90_percent": int(r.obs_count_90_percent or 0),
                "first_candidate_obs_utc": str(r.first_candidate_timestamp or ""),
                "last_candidate_obs_utc": str(r.last_candidate_timestamp or ""),
                "is_gap_overlap_candidate": m in gap_mmsis or bool(r.is_gap_overlap_candidate),
            })

        for g_row in gap_rows:
            g_mmsi = str(g_row.mmsi)
            if g_mmsi not in seen_mmsis:
                seen_mmsis.add(g_mmsi)
                p_ts = g_row.prev_timestamp.isoformat() if g_row.prev_timestamp else ""
                n_ts = g_row.next_timestamp.isoformat() if g_row.next_timestamp else ""
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
        """Return candidate vessel detail from PostGIS by MMSI."""
        target_mmsi = str(mmsi)
        stmt = select(CandidateFeaturesTable).where(CandidateFeaturesTable.mmsi == target_mmsi)
        r = self.session.scalars(stmt).first()

        gap_stmt = select(GapOverlapCandidateTable).where(GapOverlapCandidateTable.mmsi == target_mmsi)
        g_row = self.session.scalars(gap_stmt).first()

        if r is None and g_row is None:
            return None

        gap_details: Optional[Dict[str, Any]] = None
        if g_row is not None:
            gap_details = {
                "prev_timestamp_utc": g_row.prev_timestamp.isoformat() if g_row.prev_timestamp else "",
                "next_timestamp_utc": g_row.next_timestamp.isoformat() if g_row.next_timestamp else "",
                "gap_duration_hours": float(g_row.gap_duration_hours or 0.0),
                "gap_class": str(g_row.gap_class),
                "last_lat": g_row.last_lat,
                "last_lon": g_row.last_lon,
                "next_lat": g_row.next_lat,
                "next_lon": g_row.next_lon,
                "evidence_note": str(g_row.evidence_note),
            }

        if r is not None:
            seg_stmt = select(TrajectorySegmentTable.segment_id).where(TrajectorySegmentTable.mmsi == target_mmsi)
            segment_ids = [int(s) for s in self.session.scalars(seg_stmt).all()]

            return {
                "mmsi": str(r.mmsi),
                "highest_match_level": str(r.highest_match_level or "NONE"),
                "total_candidate_observations": int(r.total_candidate_observations or 0),
                "obs_count_50_percent": int(r.obs_count_50_percent or 0),
                "obs_count_90_percent": int(r.obs_count_90_percent or 0),
                "first_candidate_obs_utc": str(r.first_candidate_timestamp or ""),
                "last_candidate_obs_utc": str(r.last_candidate_timestamp or ""),
                "segment_ids": segment_ids,
                "is_gap_overlap_candidate": g_row is not None or bool(r.is_gap_overlap_candidate),
                "gap_overlap_details": gap_details,
            }
        else:
            assert g_row is not None
            p_ts = g_row.prev_timestamp.isoformat() if g_row.prev_timestamp else ""
            n_ts = g_row.next_timestamp.isoformat() if g_row.next_timestamp else ""
            seg_ids: List[int] = []
            if g_row.prev_segment_id is not None:
                seg_ids.append(int(g_row.prev_segment_id))
            if g_row.next_segment_id is not None:
                seg_ids.append(int(g_row.next_segment_id))

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
        """Return candidate feature record from PostGIS by MMSI."""
        stmt = select(CandidateFeaturesTable).where(CandidateFeaturesTable.mmsi == str(mmsi))
        r = self.session.scalars(stmt).first()

        if r is None:
            return None

        def _v(attr: str) -> Any:
            return getattr(r, attr, None)

        imo_val = _v("imo")
        imo_str = str(imo_val) if imo_val is not None else None

        return {
            "mmsi": str(r.mmsi),
            "distance_to_origin_50m": _v("distance_to_origin_50m"),
            "distance_to_origin_90m": _v("distance_to_origin_90m"),
            "min_distance_to_origin": _v("min_distance_to_origin"),
            "mean_distance_to_origin": _v("mean_distance_to_origin"),
            "observation_count": int(_v("total_candidate_observations") or 0),
            "observation_count_50_percent": int(_v("obs_count_50_percent") or 0),
            "observation_count_90_percent": int(_v("obs_count_90_percent") or 0),
            "first_candidate_timestamp": str(_v("first_candidate_timestamp") or ""),
            "last_candidate_timestamp": str(_v("last_candidate_timestamp") or ""),
            "track_duration_seconds": float(_v("track_duration_seconds") or 0.0),
            "segment_count": int(_v("segment_count") or 0),
            "dwell_duration_seconds": float(_v("dwell_duration_seconds") or 0.0),
            "dwell_observation_count": int(_v("dwell_observation_count") or 0),
            "stationary_observation_count": int(_v("stationary_observation_count") or 0),
            "stationary_fraction": float(_v("stationary_fraction") or 0.0),
            "min_sog": _v("min_sog"),
            "max_sog": _v("max_sog"),
            "mean_sog": _v("mean_sog"),
            "median_sog": _v("median_sog"),
            "sog_stddev": _v("sog_stddev"),
            "speed_change_count": int(_v("speed_change_count") or 0),
            "speed_change_rate": _v("speed_change_rate"),
            "heading_change_count": int(_v("heading_change_count") or 0),
            "total_heading_change_degrees": float(_v("total_heading_change_degrees") or 0.0),
            "mean_heading_change_degrees": _v("mean_heading_change_degrees"),
            "max_heading_change_degrees": _v("max_heading_change_degrees"),
            "cog_available_fraction": float(_v("cog_available_fraction") or 0.0),
            "heading_available_fraction": float(_v("heading_available_fraction") or 0.0),
            "vessel_type": _v("vessel_type"),
            "navigation_status": _v("navigation_status"),
            "imo": imo_str,
            "draft": _v("draft"),
            "cargo": _v("cargo"),
        }

    def get_candidate_gap_evidence(self, mmsi: str) -> Tuple[bool, List[Dict[str, Any]]]:
        """Return AIS gap evidence records from PostGIS for a specific MMSI."""
        target_mmsi = str(mmsi)
        cf_stmt = select(CandidateFeaturesTable.mmsi).where(CandidateFeaturesTable.mmsi == target_mmsi)
        gap_cand_stmt = select(GapOverlapCandidateTable.mmsi).where(GapOverlapCandidateTable.mmsi == target_mmsi)

        if self.session.scalars(cf_stmt).first() is None and self.session.scalars(gap_cand_stmt).first() is None:
            return False, []

        stmt = select(AISGapEvidenceTable).where(AISGapEvidenceTable.mmsi == target_mmsi)
        rows = self.session.scalars(stmt).all()

        gaps: List[Dict[str, Any]] = []
        for r in rows:
            gaps.append({
                "mmsi": str(r.mmsi),
                "gap_start": r.gap_start.isoformat() if r.gap_start else "",
                "gap_end": r.gap_end.isoformat() if r.gap_end else "",
                "gap_duration_seconds": float(r.gap_duration_seconds),
                "gap_class": str(r.gap_class),
                "overlaps_origin_window": bool(r.overlaps_origin_window),
                "last_known_lat": r.last_known_lat,
                "last_known_lon": r.last_known_lon,
                "last_known_sog": r.last_known_sog,
                "last_known_cog": r.last_known_cog,
                "last_known_heading": r.last_known_heading,
                "first_reappearance_lat": r.first_reappearance_lat,
                "first_reappearance_lon": r.first_reappearance_lon,
                "first_reappearance_sog": r.first_reappearance_sog,
                "first_reappearance_cog": r.first_reappearance_cog,
                "first_reappearance_heading": r.first_reappearance_heading,
                "observed_gap_displacement_m": r.observed_gap_displacement_m,
                "expected_displacement_m": r.expected_displacement_m,
                "displacement_difference_m": r.displacement_difference_m,
                "displacement_quality": str(r.displacement_quality),
                "segment_before_gap": r.segment_before_gap,
                "segment_after_gap": r.segment_after_gap,
                "evidence_note": str(r.evidence_note),
            })
        return True, gaps

    def get_trajectory_geojson(self, mmsi: str) -> Optional[Dict[str, Any]]:
        """Return GeoJSON FeatureCollection generated directly via PostGIS ST_AsGeoJSON."""
        # Query trajectory segments first
        seg_sql = text("""
            SELECT segment_id, ST_AsGeoJSON(track_geom) as geom_json, point_count, start_time, end_time
            FROM trajectory_segments
            WHERE mmsi = :mmsi
            ORDER BY segment_id;
        """)
        results = self.session.execute(seg_sql, {"mmsi": str(mmsi)}).fetchall()

        if not results:
            # Check observations fallback
            obs_sql = text("""
                SELECT ST_AsGeoJSON(geom) as geom_json, timestamp
                FROM ais_observations
                WHERE mmsi = :mmsi
                ORDER BY timestamp;
            """)
            obs_results = self.session.execute(obs_sql, {"mmsi": str(mmsi)}).fetchall()
            if not obs_results:
                return None

            coords = [json.loads(row[0])["coordinates"] for row in obs_results]
            features = [{
                "type": "Feature",
                "geometry": {
                    "type": "LineString" if len(coords) >= 2 else "Point",
                    "coordinates": coords if len(coords) >= 2 else coords[0],
                },
                "properties": {"mmsi": str(mmsi)},
            }]
            return {"type": "FeatureCollection", "features": features}

        features: List[Dict[str, Any]] = []
        for row in results:
            seg_id = row[0]
            geom_dict = json.loads(row[1])
            start_str = row[3].isoformat() if row[3] else ""
            end_str = row[4].isoformat() if row[4] else ""
            features.append({
                "type": "Feature",
                "geometry": geom_dict,
                "properties": {
                    "mmsi": str(mmsi),
                    "segment_id": seg_id,
                    "point_count": row[2],
                    "start_time": start_str,
                    "end_time": end_str,
                },
            })

        return {"type": "FeatureCollection", "features": features}

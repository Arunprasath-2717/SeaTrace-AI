"""Data models for M5 Phase 2 — Space-Time Candidate Filtering."""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional


class SpatialMatchLevel(str, Enum):
    """Spatial contour match classification levels."""
    MATCH_50_PERCENT = "MATCH_50_PERCENT"
    MATCH_90_PERCENT = "MATCH_90_PERCENT"
    NONE = "NONE"


class ObservationMatchStatus(str, Enum):
    """Observation-level match status combining spatial containment and temporal window."""
    MATCH_50_PERCENT = "MATCH_50_PERCENT"
    MATCH_90_PERCENT = "MATCH_90_PERCENT"
    TEMPORAL_OUT_OF_BOUNDS = "TEMPORAL_OUT_OF_BOUNDS"
    SPATIAL_OUT_OF_BOUNDS = "SPATIAL_OUT_OF_BOUNDS"


@dataclass
class M4Fixture:
    """M4 spill origin contour and time window dataset model."""
    incident_id: str
    source: str
    not_real_m4_output: bool
    origin_time_start_utc: datetime
    origin_time_end_utc: datetime
    origin_50_contour: Dict[str, Any]
    origin_90_contour: Dict[str, Any]
    forward_forecast_path: Dict[str, Any]
    oil_age_min_hours: float = 0.0
    oil_age_max_hours: float = 0.0
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class CandidateVessel:
    """Aggregated candidate vessel record satisfying space-time origin constraints."""
    mmsi: str
    highest_match_level: SpatialMatchLevel
    total_candidate_observations: int
    obs_count_50_percent: int
    obs_count_90_percent: int
    first_candidate_obs_utc: str
    last_candidate_obs_utc: str
    segment_ids: List[int]


@dataclass
class GapOverlapCandidate:
    """Vessel candidate whose AIS gap overlaps the spill origin time window."""
    mmsi: str
    prev_timestamp_utc: str
    next_timestamp_utc: str
    gap_duration_hours: float
    gap_class: str
    last_lat: float
    last_lon: float
    next_lat: float
    next_lon: float
    prev_segment_id: Optional[int]
    next_segment_id: Optional[int]
    overlap_status: str
    evidence_note: str = (
        "AIS transmission gap overlaps spill origin time window. "
        "Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing."
    )


@dataclass
class SpaceTimeFunnelReport:
    """Funnel counts tracking progression through space-time filtering."""
    total_input_records: int
    total_unique_vessels: int
    spatial_matches_records: int
    temporal_matches_records: int
    combined_space_time_records: int
    final_candidate_vessels: int
    gap_overlap_candidates: int

    def to_dict(self) -> Dict[str, Any]:
        """Return dictionary representation for JSON serialization."""
        return {
            "total_input_records": self.total_input_records,
            "total_unique_vessels": self.total_unique_vessels,
            "spatial_matches_records": self.spatial_matches_records,
            "temporal_matches_records": self.temporal_matches_records,
            "combined_space_time_records": self.combined_space_time_records,
            "final_candidate_vessels": self.final_candidate_vessels,
            "gap_overlap_candidates": self.gap_overlap_candidates,
        }

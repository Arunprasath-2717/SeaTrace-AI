"""
api/models.py
=============
Pydantic schemas for the M5 AIS Intelligence FastAPI integration layer.

M5 Scope Reminder:
All responses represent descriptive AIS trajectory measurements, candidate features,
and contextual gap evidence. M5 does NOT compute attribution or responsibility scores.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Service health response."""
    status: str = Field(default="ok", description="Service status")
    service: str = Field(default="M5 AIS Intelligence API", description="Service name")
    version: str = Field(default="0.1.0", description="API version")


class CandidateSummary(BaseModel):
    """Summary record for a candidate vessel identified during space-time filtering."""
    mmsi: str = Field(description="Vessel MMSI")
    highest_match_level: str = Field(description="Highest spatial match level (MATCH_50_PERCENT, MATCH_90_PERCENT, NONE)")
    total_candidate_observations: int = Field(description="Total observations within space-time origin window")
    obs_count_50_percent: int = Field(description="Candidate observations inside 50% contour")
    obs_count_90_percent: int = Field(description="Candidate observations inside 90% (outside 50%) contour")
    first_candidate_obs_utc: str = Field(description="First candidate observation timestamp (UTC)")
    last_candidate_obs_utc: str = Field(description="Last candidate observation timestamp (UTC)")
    is_gap_overlap_candidate: bool = Field(description="True if vessel has an AIS gap overlapping the origin window")


class CandidateDetailResponse(BaseModel):
    """Detailed record for a candidate vessel."""
    mmsi: str = Field(description="Vessel MMSI")
    highest_match_level: str = Field(description="Highest spatial match level")
    total_candidate_observations: int = Field(description="Total observations within space-time origin window")
    obs_count_50_percent: int = Field(description="Observations inside 50% contour")
    obs_count_90_percent: int = Field(description="Observations inside 90% contour")
    first_candidate_obs_utc: str = Field(description="First candidate observation timestamp (UTC)")
    last_candidate_obs_utc: str = Field(description="Last candidate observation timestamp (UTC)")
    segment_ids: List[int] = Field(description="Phase 1 trajectory segment IDs represented in candidate observations")
    is_gap_overlap_candidate: bool = Field(description="True if vessel has an AIS gap overlapping the origin window")
    gap_overlap_details: Optional[Dict[str, Any]] = Field(default=None, description="Gap overlap details if applicable")


class CandidateFeaturesResponse(BaseModel):
    """Descriptive feature vector for a candidate vessel (Phase 3)."""
    mmsi: str = Field(description="Vessel MMSI")
    distance_to_origin_50m: Optional[float] = Field(default=None, description="Min distance (m) to 50% contour centroid")
    distance_to_origin_90m: Optional[float] = Field(default=None, description="Min distance (m) to 90% contour centroid")
    min_distance_to_origin: Optional[float] = Field(default=None, description="Min distance (m) across both contours")
    mean_distance_to_origin: Optional[float] = Field(default=None, description="Mean distance (m) to 50% contour centroid")
    observation_count: int = Field(description="Total candidate observations")
    observation_count_50_percent: int = Field(description="Observations inside 50% contour")
    observation_count_90_percent: int = Field(description="Observations inside 90% contour")
    first_candidate_timestamp: str = Field(description="First candidate observation timestamp")
    last_candidate_timestamp: str = Field(description="Last candidate observation timestamp")
    track_duration_seconds: float = Field(description="Track duration in seconds")
    segment_count: int = Field(description="Distinct trajectory segments count")
    dwell_duration_seconds: float = Field(description="Dwell duration in seconds")
    dwell_observation_count: int = Field(description="Observations in dwell period")
    stationary_observation_count: int = Field(description="Observations where SOG < 0.5 knots")
    stationary_fraction: float = Field(description="Stationary observation fraction (0.0 to 1.0)")
    min_sog: Optional[float] = Field(default=None, description="Min speed over ground (knots)")
    max_sog: Optional[float] = Field(default=None, description="Max speed over ground (knots)")
    mean_sog: Optional[float] = Field(default=None, description="Mean speed over ground (knots)")
    median_sog: Optional[float] = Field(default=None, description="Median speed over ground (knots)")
    sog_stddev: Optional[float] = Field(default=None, description="Speed over ground standard deviation")
    speed_change_count: int = Field(description="Speed change events count")
    speed_change_rate: Optional[float] = Field(default=None, description="Speed change events per hour")
    heading_change_count: int = Field(description="Heading change events count")
    total_heading_change_degrees: float = Field(description="Total cumulative heading change in degrees")
    mean_heading_change_degrees: Optional[float] = Field(default=None, description="Mean heading change in degrees")
    max_heading_change_degrees: Optional[float] = Field(default=None, description="Max heading change in degrees")
    cog_available_fraction: float = Field(description="COG availability ratio (0.0 to 1.0)")
    heading_available_fraction: float = Field(description="Heading availability ratio (0.0 to 1.0)")
    vessel_type: Optional[float] = Field(default=None, description="Vessel type code")
    navigation_status: Optional[float] = Field(default=None, description="Navigation status code")
    imo: Optional[str] = Field(default=None, description="IMO number")
    draft: Optional[float] = Field(default=None, description="Draft in metres")
    cargo: Optional[float] = Field(default=None, description="Cargo type code")


class GapEvidenceItem(BaseModel):
    """Descriptive evidence item for a single AIS gap."""
    mmsi: str = Field(description="Vessel MMSI")
    gap_start: str = Field(description="Gap start timestamp (UTC)")
    gap_end: str = Field(description="Gap end timestamp (UTC)")
    gap_duration_seconds: float = Field(description="Gap duration in seconds")
    gap_class: str = Field(description="Gap class (SHORT_GAP, SIGNIFICANT_GAP, LONG_GAP)")
    overlaps_origin_window: bool = Field(description="True if gap overlaps origin window")
    last_known_lat: Optional[float] = Field(default=None, description="Last known latitude")
    last_known_lon: Optional[float] = Field(default=None, description="Last known longitude")
    last_known_sog: Optional[float] = Field(default=None, description="Last known SOG (knots)")
    last_known_cog: Optional[float] = Field(default=None, description="Last known COG (degrees)")
    last_known_heading: Optional[float] = Field(default=None, description="Last known Heading (degrees)")
    first_reappearance_lat: Optional[float] = Field(default=None, description="First reappearance latitude")
    first_reappearance_lon: Optional[float] = Field(default=None, description="First reappearance longitude")
    first_reappearance_sog: Optional[float] = Field(default=None, description="First reappearance SOG (knots)")
    first_reappearance_cog: Optional[float] = Field(default=None, description="First reappearance COG (degrees)")
    first_reappearance_heading: Optional[float] = Field(default=None, description="First reappearance Heading (degrees)")
    observed_gap_displacement_m: Optional[float] = Field(default=None, description="Observed displacement (metres)")
    expected_displacement_m: Optional[float] = Field(default=None, description="Expected kinematic displacement (metres)")
    displacement_difference_m: Optional[float] = Field(default=None, description="Displacement difference (metres)")
    displacement_quality: str = Field(description="Quality flag (FULL, PARTIAL_NO_SOG, PARTIAL_NO_POSITION, INSUFFICIENT)")
    segment_before_gap: Optional[int] = Field(default=None, description="Segment ID before gap")
    segment_after_gap: Optional[int] = Field(default=None, description="Segment ID after gap")
    evidence_note: str = Field(
        default="AIS transmission gap overlaps spill origin time window. "
                "Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing.",
        description="Contextual disclaimer note"
    )


class GapEvidenceResponse(BaseModel):
    """Gap evidence response for a vessel."""
    mmsi: str = Field(description="Vessel MMSI")
    total_gaps: int = Field(description="Total gap records count for this vessel")
    disclaimer: str = Field(
        default="AIS transmission gaps are data-quality and coverage observations. "
                "They are treated as contextual evidence requiring further investigation, NOT proof of wrongdoing.",
        description="Global M5 gap evidence disclaimer"
    )
    gaps: List[GapEvidenceItem] = Field(description="List of gap evidence records")


class FunnelResponse(BaseModel):
    """Space-time candidate filtering funnel metrics."""
    total_input_records: int = Field(description="Total input AIS records processed in Phase 1")
    total_unique_vessels: int = Field(description="Total unique MMSIs in input dataset")
    spatial_matches_records: int = Field(description="Records matching 50% or 90% spatial contours")
    temporal_matches_records: int = Field(description="Records within temporal origin window")
    combined_space_time_records: int = Field(description="Records matching both spatial and temporal bounds")
    final_candidate_vessels: int = Field(description="Total candidate vessels identified")
    gap_overlap_candidates: int = Field(description="Candidates with AIS gaps overlapping origin window")


class GeoJSONFeature(BaseModel):
    """GeoJSON Feature model."""
    type: str = Field(default="Feature")
    geometry: Dict[str, Any]
    properties: Dict[str, Any]


class GeoJSONFeatureCollection(BaseModel):
    """GeoJSON FeatureCollection model."""
    type: str = Field(default="FeatureCollection")
    features: List[GeoJSONFeature]

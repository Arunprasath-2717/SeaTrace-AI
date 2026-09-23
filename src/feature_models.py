"""
feature_models.py
=================
Pure-Python dataclasses and configuration for M5 Phase 3 — Candidate Feature
Extraction and AIS Gap Evidence.

SCOPE STATEMENT
---------------
Phase 3 provides descriptive AIS trajectory measurements and candidate feature
vectors.  It does NOT determine vessel responsibility or perform final
attribution.  All gap evidence is contextual — it does not imply wrongdoing.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


# ---------------------------------------------------------------------------
# Phase 3 configuration
# ---------------------------------------------------------------------------

@dataclass
class Phase3Config:
    """All configurable thresholds for Phase 3 feature extraction.

    Every parameter is documented with its meaning and units.
    No threshold is hard-coded inside algorithm functions.
    """

    # --- Stationary threshold ---
    stationary_speed_threshold_knots: float = 0.5
    """Speed-over-ground (knots) below which a vessel is considered
    stationary / drifting.  A vessel broadcasting SOG < this value
    across multiple observations has a high likelihood of being at anchor
    or moored.  Default 0.5 kn is a common AIS data-quality threshold;
    update for open-sea analysis where noise levels differ."""

    # --- Heading / COG change threshold ---
    heading_change_threshold_degrees: float = 5.0
    """Minimum absolute angular change (degrees, circular) between two
    consecutive observations to be counted as a heading change event.
    Below this value the change is treated as measurement noise.
    Units: degrees (0 – 360 wrap-around handled via circular difference)."""

    # --- Speed change threshold ---
    speed_change_threshold_knots: float = 1.0
    """Minimum absolute SOG difference (knots) between consecutive
    observations to be counted as a speed change event.
    Units: knots."""

    # --- Minimum dwell duration ---
    minimum_dwell_seconds: float = 60.0
    """Minimum duration (seconds) within the origin contour region for
    the period to be reported as a dwell.
    Units: seconds."""

    # --- Distance calculation ---
    earth_radius_m: float = 6_371_000.0
    """Mean Earth radius used for Haversine distance calculations.
    Units: metres.  WGS-84 mean radius = 6 371 009 m; 6 371 000 m is the
    standard rounded approximation, adequate for distances < 500 km."""


# ---------------------------------------------------------------------------
# Candidate feature record
# ---------------------------------------------------------------------------

@dataclass
class CandidateFeatures:
    """Descriptive AIS-derived feature vector for a single candidate vessel.

    All fields are observation-derived measurements.  None represent
    responsibility scores or suspiciousness ratings.
    """

    mmsi: str

    # Spatial / trajectory
    distance_to_origin_50m: Optional[float]
    """Minimum Haversine distance (metres) from any candidate observation
    to the centroid of the 50 % origin contour polygon.
    null if no candidate observations exist."""

    distance_to_origin_90m: Optional[float]
    """Minimum Haversine distance (metres) to the centroid of the 90 %
    origin contour polygon."""

    min_distance_to_origin: Optional[float]
    """Minimum of (distance_to_origin_50m, distance_to_origin_90m).
    Units: metres."""

    mean_distance_to_origin: Optional[float]
    """Mean Haversine distance across all candidate observations to
    the 50 % contour centroid.  Units: metres."""

    observation_count: int
    """Total candidate observations (inside 50 % or 90 % contour AND
    within the origin time window)."""

    observation_count_50_percent: int
    """Observations inside the 50 % contour during the origin window."""

    observation_count_90_percent: int
    """Observations inside the 90 % but outside the 50 % contour
    during the origin window."""

    first_candidate_timestamp: str
    """ISO-8601 UTC timestamp of the first candidate observation."""

    last_candidate_timestamp: str
    """ISO-8601 UTC timestamp of the last candidate observation."""

    track_duration_seconds: float
    """Elapsed seconds between first and last candidate observation.
    Units: seconds."""

    segment_count: int
    """Number of distinct Phase 1 trajectory segments represented
    across all candidate observations."""

    # Dwell
    dwell_duration_seconds: float
    """Total duration (seconds) covered by candidate observations.
    Approximated as the sum of time_delta_seconds across observations
    within the origin region.  Units: seconds."""

    dwell_observation_count: int
    """Number of observations contributing to the dwell period."""

    stationary_observation_count: int
    """Observations where SOG < stationary_speed_threshold_knots."""

    stationary_fraction: float
    """stationary_observation_count / observation_count (0.0 – 1.0).
    null-safe: returns 0.0 when observation_count == 0."""

    # Speed profile
    min_sog: Optional[float]
    """Minimum SOG across candidate observations.  Units: knots."""

    max_sog: Optional[float]
    """Maximum SOG across candidate observations.  Units: knots."""

    mean_sog: Optional[float]
    """Mean SOG.  Units: knots."""

    median_sog: Optional[float]
    """Median SOG.  Units: knots."""

    sog_stddev: Optional[float]
    """SOG standard deviation.  Units: knots."""

    speed_change_count: int
    """Number of consecutive observation pairs where |ΔSOG| >=
    speed_change_threshold_knots."""

    speed_change_rate: Optional[float]
    """speed_change_count / (track_duration_seconds / 3600).
    Events per hour.  null if track_duration_seconds == 0."""

    # Heading / COG
    heading_change_count: int
    """Number of consecutive observation pairs with circular |ΔCOG| >=
    heading_change_threshold_degrees.  Computed on COG (not raw Heading)
    because COG is always present after Phase 1 cleaning."""

    total_heading_change_degrees: float
    """Sum of all circular |ΔCOG| values across candidate observations.
    Units: degrees."""

    mean_heading_change_degrees: Optional[float]
    """Mean circular |ΔCOG| per change event.  Units: degrees."""

    max_heading_change_degrees: Optional[float]
    """Maximum single circular |ΔCOG| across all consecutive pairs.
    Units: degrees."""

    cog_available_fraction: float
    """Fraction of candidate observations where COG is not null.
    Range 0.0 – 1.0."""

    heading_available_fraction: float
    """Fraction of candidate observations where Heading is not null.
    Range 0.0 – 1.0."""

    # Vessel metadata (preserved as-is; null if absent in AIS data)
    vessel_type: Optional[float]
    navigation_status: Optional[float]
    imo: Optional[str]
    draft: Optional[float]
    cargo: Optional[float]

    def to_dict(self) -> Dict[str, Any]:
        """Return a flat dictionary for CSV / JSON serialisation."""
        return {k: v for k, v in self.__dict__.items()}


# ---------------------------------------------------------------------------
# Gap evidence record
# ---------------------------------------------------------------------------

@dataclass
class GapEvidenceRecord:
    """Descriptive evidence record for a single AIS transmission gap
    associated with a candidate vessel.

    IMPORTANT: A gap is a data-quality / coverage observation.
    It does NOT constitute proof of wrongdoing.  The wording of every
    field must reflect this; use the evidence_note field to communicate
    context clearly.
    """

    mmsi: str
    gap_start: str                        # ISO-8601 UTC
    gap_end: str                          # ISO-8601 UTC
    gap_duration_seconds: float           # seconds
    gap_class: str                        # Phase 1 classification
    overlaps_origin_window: bool

    # Last known position before gap
    last_known_lat: Optional[float]
    last_known_lon: Optional[float]
    last_known_sog: Optional[float]       # knots; null if unavailable
    last_known_cog: Optional[float]       # degrees; null if unavailable
    last_known_heading: Optional[float]   # degrees; null if unavailable

    # First reappearance after gap
    first_reappearance_lat: Optional[float]
    first_reappearance_lon: Optional[float]
    first_reappearance_sog: Optional[float]
    first_reappearance_cog: Optional[float]
    first_reappearance_heading: Optional[float]

    # Kinematic displacement
    observed_gap_displacement_m: Optional[float]
    """Haversine distance (metres) between last known and first
    reappearance positions.  null if either position is missing."""

    expected_displacement_m: Optional[float]
    """Descriptive kinematic estimate: last_known_sog (converted to m/s)
    multiplied by gap_duration_seconds.  This is a straight-line
    projection assuming constant speed and heading — used as a rough
    plausibility reference, NOT a physics simulation.
    null if last_known_sog is null."""

    displacement_difference_m: Optional[float]
    """observed_gap_displacement_m minus expected_displacement_m.
    Positive value = vessel reappeared farther than kinematic projection.
    Negative = reappeared closer.  null if either estimate is null.
    This is a raw measurement for downstream analysis, NOT an anomaly score."""

    displacement_quality: str
    """Data quality flag: 'FULL' (both positions present and SOG known),
    'PARTIAL_NO_SOG' (positions present, SOG absent),
    'PARTIAL_NO_POSITION' (missing last or reappearance position),
    'INSUFFICIENT' (both positions missing)."""

    segment_before_gap: Optional[int]     # Phase 1 segment_id
    segment_after_gap: Optional[int]      # Phase 1 segment_id

    evidence_note: str = (
        "AIS transmission gap overlaps spill origin time window. "
        "Treated as contextual evidence requiring further investigation, "
        "NOT proof of wrongdoing."
    )

    def to_dict(self) -> Dict[str, Any]:
        """Return a flat dictionary for CSV / JSON serialisation."""
        return {k: v for k, v in self.__dict__.items()}


# ---------------------------------------------------------------------------
# Phase 3 report summary
# ---------------------------------------------------------------------------

@dataclass
class Phase3Report:
    """Summary statistics for the Phase 3 feature extraction run."""

    incident_id: str
    fixture_source: str
    candidate_count: int
    feature_row_count: int
    gap_evidence_row_count: int
    gaps_overlapping_window: int

    # Missing data statistics (per field)
    missing_sog_count: int
    missing_cog_count: int
    missing_heading_count: int
    missing_vessel_type_count: int
    missing_imo_count: int

    # Configuration snapshot
    config: Dict[str, Any] = field(default_factory=dict)

    # Output file paths
    output_paths: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        """Return dictionary for JSON serialisation."""
        return {k: v for k, v in self.__dict__.items()}

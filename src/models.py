"""
m5-ais-intelligence/src/models.py
==================================
Pure-Python dataclasses and enums that define the M5 data model.

No third-party dependencies here — only stdlib so these remain importable
even before the full requirements.txt is installed.

M5 does not determine vessel responsibility.
It produces cleaned AIS trajectories, candidate-related features,
and evidence for downstream attribution.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional


# ---------------------------------------------------------------------------
# Gap classification
# ---------------------------------------------------------------------------

class GapClass(str, Enum):
    """
    Classification of an AIS temporal gap.

    IMPORTANT: A gap classification alone does NOT indicate suspicious
    behaviour. The gap classes are purely temporal descriptors.
    Behavioural analysis (speed-plausibility, reappearance position,
    AIS coverage) is deferred to a later M5 phase.
    """
    NORMAL = "NORMAL"                     # <= normal_gap_max_minutes
    SHORT_GAP = "SHORT_GAP"              # (normal_max, short_max]
    SIGNIFICANT_GAP = "SIGNIFICANT_GAP" # (short_max, significant_max]
    LONG_GAP = "LONG_GAP"               # > significant_max


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

@dataclass
class CleaningConfig:
    """
    All configurable thresholds for the M5 pipeline.

    Keep thresholds here rather than scattered across modules so that
    downstream callers (CLI, tests, future API) have a single place to
    override.
    """

    # ---- Gap detection ----
    # gap_flag is set to True when time_delta > normal_gap_max_minutes.
    # Every flagged gap is then classified into one of the four GapClass
    # categories below.
    normal_gap_max_minutes: float = 15.0
    """Gaps > this are flagged and classified as at least SHORT_GAP."""

    short_gap_max_minutes: float = 60.0
    """Gaps > normal_max and <= this are classified SHORT_GAP."""

    significant_gap_max_minutes: float = 360.0
    """Gaps > short_max and <= this are classified SIGNIFICANT_GAP.
    Gaps > this are classified LONG_GAP."""

    # ---- Interpolation boundary (Phase 1: NOT implemented) ----
    max_gap_minutes: float = 60.0
    """If interpolation is added in a later phase, do NOT interpolate
    across gaps larger than this. Has no effect in Phase 1."""

    # ---- SOG sanity ----
    impossible_sog_max: float = 102.3
    """AIS SOG values above this knot threshold are physically impossible
    for any surface vessel and are flagged (but the row is NOT deleted)."""

    # ---- Required columns ----
    required_columns: List[str] = field(default_factory=lambda: [
        "MMSI", "BaseDateTime", "LAT", "LON", "SOG", "COG"
    ])

    # ---- Optional columns to preserve ----
    optional_columns: List[str] = field(default_factory=lambda: [
        "Heading", "VesselName", "IMO", "CallSign",
        "VesselType", "Status", "Length", "Width", "Draft",
        "Cargo", "TransceiverClass",
    ])


# ---------------------------------------------------------------------------
# Quality report
# ---------------------------------------------------------------------------

@dataclass
class QualityReport:
    """
    Aggregated statistics produced by the M5 pipeline run.
    Serialised to JSON and Markdown in the outputs directory.
    """
    # Input
    input_row_count: int = 0
    input_column_count: int = 0
    unique_mmsi_input: int = 0
    timestamp_range_start: str = ""
    timestamp_range_end: str = ""

    # Cleaning removals
    null_mmsi_removed: int = 0
    invalid_coordinate_count: int = 0
    exact_duplicates_removed: int = 0
    mmsi_timestamp_duplicates_removed: int = 0

    # Normalisation (rows NOT removed)
    cog_360_normalised: int = 0
    heading_511_normalised: int = 0
    impossible_sog_flagged: int = 0

    # Output
    output_row_count: int = 0
    output_unique_mmsi: int = 0

    # Missing values (per column, optional fields — expected)
    missing_value_summary: Dict[str, int] = field(default_factory=dict)

    # Gap statistics
    total_gaps_detected: int = 0
    gap_class_counts: Dict[str, int] = field(default_factory=dict)
    max_gap_minutes: float = 0.0
    mean_gap_minutes: float = 0.0

    # Config snapshot
    cleaning_config: Dict[str, Any] = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Lightweight record types (for type-hinting; DataFrames are primary store)
# ---------------------------------------------------------------------------

@dataclass
class GapRecord:
    """Single AIS gap between two consecutive observations of the same vessel."""
    mmsi: str
    prev_timestamp: str
    next_timestamp: str
    gap_duration_minutes: float
    last_lat: Optional[float]
    last_lon: Optional[float]
    last_sog: Optional[float]
    last_cog: Optional[float]
    next_lat: Optional[float]
    next_lon: Optional[float]
    gap_class: GapClass

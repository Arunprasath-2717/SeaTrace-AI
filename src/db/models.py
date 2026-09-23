"""
db/models.py
============
SQLAlchemy + GeoAlchemy2 ORM models for M5 AIS Intelligence.

Geometry SRID: EPSG:4326 (WGS 84 geographic)
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from geoalchemy2 import Geometry
from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    Float,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class AISObservationTable(Base):
    """Cleaned AIS observations table with PostGIS POINT geometry."""

    __tablename__ = "ais_observations"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    mmsi: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lon: Mapped[float] = mapped_column(Float, nullable=False)
    sog: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    cog: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    heading: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    vessel_type: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    navigation_status: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    imo: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    draft: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    cargo: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    segment_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    gap_flag: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    geom: Mapped[str] = mapped_column(Geometry("POINT", srid=4326), nullable=False)

    __table_args__ = (
        Index("idx_obs_mmsi_ts", "mmsi", "timestamp"),
        Index("idx_obs_geom", "geom", postgresql_using="gist"),
    )


class TrajectorySegmentTable(Base):
    """Vessel trajectory segments with PostGIS LINESTRING geometry."""

    __tablename__ = "trajectory_segments"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    mmsi: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    segment_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    start_time: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    end_time: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    point_count: Mapped[int] = mapped_column(Integer, nullable=False)
    track_geom: Mapped[str] = mapped_column(Geometry("LINESTRING", srid=4326), nullable=False)

    __table_args__ = (
        Index("idx_seg_mmsi_segid", "mmsi", "segment_id"),
        Index("idx_seg_geom", "track_geom", postgresql_using="gist"),
    )


class AISGapEvidenceTable(Base):
    """Descriptive AIS gap evidence records table."""

    __tablename__ = "ais_gap_evidence"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    mmsi: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    gap_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    gap_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    gap_duration_seconds: Mapped[float] = mapped_column(Float, nullable=False)
    gap_class: Mapped[str] = mapped_column(String(32), nullable=False)
    overlaps_origin_window: Mapped[bool] = mapped_column(Boolean, nullable=False, index=True)
    last_known_lat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    last_known_lon: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    last_known_sog: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    last_known_cog: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    last_known_heading: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    first_reappearance_lat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    first_reappearance_lon: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    first_reappearance_sog: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    first_reappearance_cog: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    first_reappearance_heading: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    observed_gap_displacement_m: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    expected_displacement_m: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    displacement_difference_m: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    displacement_quality: Mapped[str] = mapped_column(String(32), nullable=False)
    segment_before_gap: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    segment_after_gap: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    evidence_note: Mapped[str] = mapped_column(Text, nullable=False)

    __table_args__ = (
        Index("idx_gap_mmsi_overlap", "mmsi", "overlaps_origin_window"),
    )


class CandidateFeaturesTable(Base):
    """Candidate vessel features table combining Phase 2 and Phase 3 data."""

    __tablename__ = "candidate_features"

    mmsi: Mapped[str] = mapped_column(String(32), primary_key=True)
    highest_match_level: Mapped[str] = mapped_column(String(32), nullable=False)
    total_candidate_observations: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    obs_count_50_percent: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    obs_count_90_percent: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    first_candidate_timestamp: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    last_candidate_timestamp: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    track_duration_seconds: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    segment_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    distance_to_origin_50m: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    distance_to_origin_90m: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    min_distance_to_origin: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    mean_distance_to_origin: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    dwell_duration_seconds: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    dwell_observation_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    stationary_observation_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    stationary_fraction: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    min_sog: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    max_sog: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    mean_sog: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    median_sog: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    sog_stddev: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    speed_change_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    speed_change_rate: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    heading_change_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    total_heading_change_degrees: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    mean_heading_change_degrees: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    max_heading_change_degrees: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    cog_available_fraction: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    heading_available_fraction: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    is_gap_overlap_candidate: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    vessel_type: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    navigation_status: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    imo: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    draft: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    cargo: Mapped[Optional[float]] = mapped_column(Float, nullable=True)


class SpaceTimeFunnelTable(Base):
    """Phase 2 space-time funnel metrics table."""

    __tablename__ = "space_time_funnel"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    total_input_records: Mapped[int] = mapped_column(Integer, nullable=False)
    total_unique_vessels: Mapped[int] = mapped_column(Integer, nullable=False)
    spatial_matches_records: Mapped[int] = mapped_column(Integer, nullable=False)
    temporal_matches_records: Mapped[int] = mapped_column(Integer, nullable=False)
    combined_space_time_records: Mapped[int] = mapped_column(Integer, nullable=False)
    final_candidate_vessels: Mapped[int] = mapped_column(Integer, nullable=False)
    gap_overlap_candidates: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)


class GapOverlapCandidateTable(Base):
    """Gap-overlap candidate vessels table preserving Phase 2 gap-overlap records."""

    __tablename__ = "gap_overlap_candidates"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    mmsi: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    prev_timestamp: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    next_timestamp: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    gap_duration_minutes: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    gap_duration_hours: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    last_lat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    last_lon: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    last_sog: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    last_cog: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    last_heading: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    next_lat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    next_lon: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    next_sog: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    prev_segment_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    next_segment_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    gap_class: Mapped[str] = mapped_column(String(32), nullable=False)
    overlap_status: Mapped[str] = mapped_column(String(64), nullable=False)
    evidence_note: Mapped[str] = mapped_column(Text, nullable=False)

    __table_args__ = (
        Index("idx_gap_cand_mmsi", "mmsi"),
    )


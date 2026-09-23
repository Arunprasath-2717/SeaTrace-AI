"""SeaTrace AI Core Database Entities (SQLAlchemy 2.0 ORM + GeoAlchemy2).

Owned by M3: Nithish (GIS / Database)
Master Contract: v4.1
Single source of truth for database entities:
  - incident
  - scene
  - spill
  - drift_run
  - ais_fix
  - track
  - candidate
  - evidence
  - stage_log
  - provenance
  - aoi (validation boundary for FR-1)
"""

import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any

from sqlalchemy import (
    String,
    Integer,
    BigInteger,
    Float,
    Text,
    DateTime,
    ForeignKey,
    Index,
    UniqueConstraint,
    CheckConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry

from sea_trace.database.models.base import Base, TimestampMixin, utc_now


def generate_uuid() -> str:
    """Generate a 36-character canonical UUID string."""
    return str(uuid.uuid4())


class AOI(Base, TimestampMixin):
    """Area of Interest boundary for scene ingestion validation (FR-1)."""

    __tablename__ = "aoi"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    geom: Mapped[Any] = mapped_column(
        Geometry(geometry_type="MULTIPOLYGON", srid=4326, spatial_index=True),
        nullable=False,
    )
    properties: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)

    # Relationships
    incidents: Mapped[List["Incident"]] = relationship(back_populates="aoi")
    scenes: Mapped[List["Scene"]] = relationship(back_populates="aoi")


class Incident(Base, TimestampMixin):
    """Core Incident tracking the state machine progression across stages.

    State Machine:
      CREATED -> DETECTED -> DRIFT_DONE -> AIS_FILTERED -> SCORED -> REPORT_READY
      (Can also transition to DEGRADED or FAILED)
    Written by: M2 (Pranav)
    """

    __tablename__ = "incident"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    state: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="CREATED",
        index=True,
    )
    aoi_id: Mapped[Optional[str]] = mapped_column(
        String(64),
        ForeignKey("aoi.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    versions: Mapped[List[Dict[str, Any]]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
        nullable=False,
    )

    __table_args__ = (
        CheckConstraint(
            "state IN ('CREATED', 'DETECTED', 'DRIFT_DONE', 'AIS_FILTERED', 'SCORED', 'REPORT_READY', 'DEGRADED', 'FAILED')",
            name="chk_incident_state",
        ),
    )

    # Relationships
    aoi: Mapped[Optional["AOI"]] = relationship(back_populates="incidents")
    spills: Mapped[List["Spill"]] = relationship(back_populates="incident", cascade="all, delete-orphan")
    drift_runs: Mapped[List["DriftRun"]] = relationship(back_populates="incident", cascade="all, delete-orphan")
    candidates: Mapped[List["Candidate"]] = relationship(back_populates="incident", cascade="all, delete-orphan")
    evidence_records: Mapped[List["Evidence"]] = relationship(back_populates="incident", cascade="all, delete-orphan")
    stage_logs: Mapped[List["StageLog"]] = relationship(back_populates="incident", cascade="all, delete-orphan")


class Scene(Base, TimestampMixin):
    """Satellite scene metadata and acquisition footprint.

    Written by: M1 (Akshaya)
    GiST index on footprint
    """

    __tablename__ = "scene"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    path: Mapped[str] = mapped_column(Text, nullable=False)
    acquired_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    aoi_id: Mapped[Optional[str]] = mapped_column(
        String(64),
        ForeignKey("aoi.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    footprint: Mapped[Any] = mapped_column(
        Geometry(geometry_type="GEOMETRY", srid=4326, spatial_index=True),
        nullable=False,
    )
    metadata_: Mapped[Dict[str, Any]] = mapped_column("metadata", JSONB, nullable=False, default=dict)

    aoi: Mapped[Optional["AOI"]] = relationship(back_populates="scenes")


class Spill(Base, TimestampMixin):
    """Detected oil spill multi-polygon and characterization metrics.

    Written by: M1 (Akshaya)
    GiST index on geom
    """

    __tablename__ = "spill"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    incident_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("incident.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    geom: Mapped[Any] = mapped_column(
        Geometry(geometry_type="MULTIPOLYGON", srid=4326, spatial_index=True),
        nullable=False,
    )
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    metrics: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    lookalike: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)

    __table_args__ = (
        CheckConstraint("confidence >= 0.0 AND confidence <= 1.0", name="chk_spill_confidence"),
    )

    incident: Mapped["Incident"] = relationship(back_populates="spills")


class DriftRun(Base, TimestampMixin):
    """Ocean physics simulation output: reverse hindcast contours or forward forecast path.

    Written by: M4 (Arun)
    GiST index on contours
    """

    __tablename__ = "drift_run"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    incident_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("incident.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    type: Mapped[str] = mapped_column(String(16), nullable=False)  # 'hind', 'fore', 'hindcast', 'forecast'
    params: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    contours: Mapped[Any] = mapped_column(
        Geometry(geometry_type="GEOMETRY", srid=4326, spatial_index=True),
        nullable=False,
    )
    window_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    window_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    age_range_min_hours: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    age_range_max_hours: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    __table_args__ = (
        CheckConstraint("type IN ('hind', 'fore', 'hindcast', 'forecast')", name="chk_drift_type"),
        CheckConstraint("window_end >= window_start", name="chk_drift_window"),
        Index("idx_drift_run_window", "window_start", "window_end"),
    )

    incident: Mapped["Incident"] = relationship(back_populates="drift_runs")


class AISFix(Base):
    """Raw AIS vessel observation, daily partitioned with GiST and BRIN indexes.

    Written by: M5 (Divakar)
    Storage: Partitioned by range on ts
    """

    __tablename__ = "ais_fix"

    mmsi: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    ts: Mapped[datetime] = mapped_column(DateTime(timezone=True), primary_key=True)
    geom: Mapped[Any] = mapped_column(
        Geometry(geometry_type="POINT", srid=4326, spatial_index=True),
        nullable=False,
    )
    sog: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    cog: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    heading: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    quality: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)

    __table_args__ = (
        # In PostgreSQL DDL, partitioned by RANGE (ts); BRIN on ts and GiST on geom
        Index("idx_ais_fix_mmsi_ts", "mmsi", "ts"),
        {"postgresql_partition_by": "RANGE (ts)"},
    )


class Track(Base, TimestampMixin):
    """Reconstructed vessel trajectory linestrings.

    Written by: M5 (Divakar)
    GiST index on geom
    """

    __tablename__ = "track"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    mmsi: Mapped[int] = mapped_column(BigInteger, nullable=False, index=True)
    ts_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    ts_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    geom: Mapped[Any] = mapped_column(
        Geometry(geometry_type="GEOMETRY", srid=4326, spatial_index=True),
        nullable=False,
    )
    stats: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)

    __table_args__ = (
        CheckConstraint("ts_end >= ts_start", name="chk_track_time"),
        Index("idx_track_mmsi_time", "mmsi", "ts_start", "ts_end"),
    )


class Candidate(Base, TimestampMixin):
    """Funnel candidate vessel shortlisted for attribution scoring.

    Written by: M5 (Divakar)
    """

    __tablename__ = "candidate"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    incident_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("incident.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    mmsi: Mapped[int] = mapped_column(BigInteger, nullable=False, index=True)
    features: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    gap: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)

    __table_args__ = (
        UniqueConstraint("incident_id", "mmsi", name="uq_candidate_incident_mmsi"),
    )

    incident: Mapped["Incident"] = relationship(back_populates="candidates")


class Evidence(Base, TimestampMixin):
    """Ranked suspects and immutable evidence records.

    Written by: Joint M2 / M4 / M5 (FR-9)
    Strictly immutable once written; re-runs increment version.
    """

    __tablename__ = "evidence"

    incident_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("incident.id", ondelete="CASCADE"),
        primary_key=True,
    )
    mmsi: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    rank: Mapped[int] = mapped_column(Integer, nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    record: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    version: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)

    __table_args__ = (
        CheckConstraint("rank >= 1", name="chk_evidence_rank"),
        CheckConstraint("score >= 0.0 AND score <= 1.0", name="chk_evidence_score"),
        CheckConstraint("version >= 1", name="chk_evidence_version"),
        Index("idx_evidence_incident_rank", "incident_id", "version", "rank"),
    )

    incident: Mapped["Incident"] = relationship(back_populates="evidence_records")


class StageLog(Base):
    """Stage transitions and status tracking for the state machine.

    Written by: M2 (Pranav)
    """

    __tablename__ = "stage_log"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    incident_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("incident.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    stage: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    engine_version: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    started: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
    ended: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint(
            "stage IN ('CREATED', 'DETECTED', 'DRIFT_DONE', 'AIS_FILTERED', 'SCORED', 'REPORT_READY')",
            name="chk_stage_name",
        ),
        CheckConstraint(
            "status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'DEGRADED')",
            name="chk_stage_status",
        ),
        Index("idx_stage_log_incident", "incident_id", "started"),
        Index("idx_stage_log_stage_status", "stage", "status"),
    )

    incident: Mapped["Incident"] = relationship(back_populates="stage_logs")


class Provenance(Base, TimestampMixin):
    """Audit provenance tracking models, weights hash, and configuration.

    Written by: Each engine on its own run
    """

    __tablename__ = "provenance"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    run_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    stage: Mapped[str] = mapped_column(String(32), nullable=False)
    model: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    weights_hash: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    dataset: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    config_hash: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    metadata_: Mapped[Dict[str, Any]] = mapped_column("metadata", JSONB, nullable=False, default=dict)

    __table_args__ = (
        Index("idx_provenance_stage_model", "stage", "model"),
    )

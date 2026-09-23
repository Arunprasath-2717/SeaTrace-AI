"""SeaTrace AI Master Contract Pydantic Validation Schemas.

Owned by M3: Nithish (GIS / Database)
Master Contract: v4.1
Single source of truth for runtime validation and serialization across modules.
"""

from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field, ConfigDict, field_validator


class IncidentState(str, Enum):
    CREATED = "CREATED"
    DETECTED = "DETECTED"
    DRIFT_DONE = "DRIFT_DONE"
    AIS_FILTERED = "AIS_FILTERED"
    SCORED = "SCORED"
    REPORT_READY = "REPORT_READY"
    DEGRADED = "DEGRADED"
    FAILED = "FAILED"


class StageName(str, Enum):
    CREATED = "CREATED"
    DETECTED = "DETECTED"
    DRIFT_DONE = "DRIFT_DONE"
    AIS_FILTERED = "AIS_FILTERED"
    SCORED = "SCORED"
    REPORT_READY = "REPORT_READY"


class StageStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    DEGRADED = "DEGRADED"


class DriftType(str, Enum):
    HIND = "hind"
    FORE = "fore"
    HINDCAST = "hindcast"
    FORECAST = "forecast"


# -----------------------------------------------------------------------------
# Standard Error Object (Master Contract Section 2)
# Rule: Errors are a consistent object: { code, message } — never bare string or stack trace
# -----------------------------------------------------------------------------
class ErrorResponse(BaseModel):
    code: str = Field(..., description="Machine-readable error code, e.g. OUT_OF_AOI, VALIDATION_ERROR")
    message: str = Field(..., description="Human-readable error explanation")
    details: Optional[Dict[str, Any]] = None


# -----------------------------------------------------------------------------
# AOI Schemas (FR-1)
# -----------------------------------------------------------------------------
class AOIBase(BaseModel):
    name: str
    geom: Dict[str, Any] = Field(..., description="GeoJSON MultiPolygon in EPSG:4326")
    properties: Dict[str, Any] = Field(default_factory=dict)


class AOICreate(AOIBase):
    id: Optional[str] = None


class AOIResponse(AOIBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -----------------------------------------------------------------------------
# Incident Schemas (M2)
# -----------------------------------------------------------------------------
class IncidentBase(BaseModel):
    state: IncidentState = IncidentState.CREATED
    aoi_id: Optional[str] = None
    versions: List[Dict[str, Any]] = Field(default_factory=list)


class IncidentCreate(IncidentBase):
    id: Optional[str] = None


class IncidentResponse(IncidentBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -----------------------------------------------------------------------------
# Scene Schemas (M1)
# -----------------------------------------------------------------------------
class SceneBase(BaseModel):
    path: str
    acquired_at: datetime
    aoi_id: Optional[str] = None
    footprint: Dict[str, Any] = Field(..., description="GeoJSON Polygon/MultiPolygon in EPSG:4326")
    metadata: Dict[str, Any] = Field(default_factory=dict)


class SceneCreate(SceneBase):
    id: str


class SceneResponse(SceneBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -----------------------------------------------------------------------------
# Spill Schemas (M1)
# -----------------------------------------------------------------------------
class SpillBase(BaseModel):
    incident_id: str
    geom: Dict[str, Any] = Field(..., description="GeoJSON MultiPolygon in EPSG:4326")
    confidence: float = Field(..., ge=0.0, le=1.0)
    metrics: Dict[str, Any] = Field(default_factory=dict)
    lookalike: Dict[str, Any] = Field(default_factory=dict)


class SpillCreate(SpillBase):
    id: Optional[str] = None


class SpillResponse(SpillBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -----------------------------------------------------------------------------
# Drift Run Schemas (M4)
# -----------------------------------------------------------------------------
class DriftRunBase(BaseModel):
    incident_id: str
    type: DriftType
    params: Dict[str, Any] = Field(default_factory=dict)
    contours: Dict[str, Any] = Field(..., description="GeoJSON MultiPolygon representing 50% and 90% contours")
    window_start: datetime
    window_end: datetime
    age_range_min_hours: Optional[float] = None
    age_range_max_hours: Optional[float] = None

    @field_validator("window_end")
    @classmethod
    def validate_window(cls, v: datetime, values: Any) -> datetime:
        return v


class DriftRunCreate(DriftRunBase):
    id: Optional[str] = None


class DriftRunResponse(DriftRunBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -----------------------------------------------------------------------------
# AIS Fix Schemas (M5)
# -----------------------------------------------------------------------------
class AISFixBase(BaseModel):
    mmsi: int
    ts: datetime
    geom: Dict[str, Any] = Field(..., description="GeoJSON Point in EPSG:4326")
    sog: Optional[float] = None
    cog: Optional[float] = None
    heading: Optional[float] = None
    quality: Dict[str, Any] = Field(default_factory=dict)


class AISFixCreate(AISFixBase):
    pass


class AISFixResponse(AISFixBase):
    model_config = ConfigDict(from_attributes=True)


# -----------------------------------------------------------------------------
# Track Schemas (M5)
# -----------------------------------------------------------------------------
class TrackBase(BaseModel):
    mmsi: int
    ts_start: datetime
    ts_end: datetime
    geom: Dict[str, Any] = Field(..., description="GeoJSON LineString/MultiLineString in EPSG:4326")
    stats: Dict[str, Any] = Field(default_factory=dict)


class TrackCreate(TrackBase):
    id: Optional[str] = None


class TrackResponse(TrackBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -----------------------------------------------------------------------------
# Candidate Schemas (M5)
# -----------------------------------------------------------------------------
class CandidateBase(BaseModel):
    incident_id: str
    mmsi: int
    features: Dict[str, Any] = Field(default_factory=dict)
    gap: Dict[str, Any] = Field(default_factory=dict)


class CandidateCreate(CandidateBase):
    id: Optional[str] = None


class CandidateResponse(CandidateBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -----------------------------------------------------------------------------
# Evidence Schemas (Joint M2 / M4 / M5)
# Master Contract Section 2 rule: Evidence records are immutable once a run completes;
# a re-run creates a new version, never an overwrite.
# -----------------------------------------------------------------------------
class EvidenceBase(BaseModel):
    incident_id: str
    mmsi: int
    rank: int = Field(..., ge=1)
    score: float = Field(..., ge=0.0, le=1.0)
    record: Dict[str, Any] = Field(default_factory=dict)
    version: int = Field(default=1, ge=1)


class EvidenceCreate(EvidenceBase):
    pass


class EvidenceResponse(EvidenceBase):
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -----------------------------------------------------------------------------
# Stage Log Schemas (M2)
# -----------------------------------------------------------------------------
class StageLogBase(BaseModel):
    incident_id: str
    stage: StageName
    status: StageStatus
    engine_version: Optional[str] = None
    started: datetime
    ended: Optional[datetime] = None
    reason: Optional[str] = None


class StageLogCreate(StageLogBase):
    id: Optional[str] = None


class StageLogResponse(StageLogBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


# -----------------------------------------------------------------------------
# Provenance Schemas (Each Engine)
# -----------------------------------------------------------------------------
class ProvenanceBase(BaseModel):
    run_id: str
    stage: str
    model: Optional[str] = None
    weights_hash: Optional[str] = None
    dataset: Optional[str] = None
    config_hash: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ProvenanceCreate(ProvenanceBase):
    id: Optional[str] = None


class ProvenanceResponse(ProvenanceBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

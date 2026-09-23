from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from backend.core.state_machine import IncidentState


class IncidentCreate(BaseModel):
    name: str = Field(...)
    description: Optional[str] = Field(None)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    detected_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    source_type: Optional[str] = Field("SAR_SENTINEL_1")


class IncidentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    status: IncidentState
    detected_at: datetime
    source_type: str
    created_at: datetime
    updated_at: datetime


class IncidentListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    status: IncidentState
    latitude: float
    longitude: float
    detected_at: datetime
    top_candidate_name: Optional[str] = None
    top_attribution_score: Optional[float] = None
    created_at: datetime


class IncidentAnalyzeRequest(BaseModel):
    drift_hours: Optional[int] = Field(24, ge=1, le=168, description="Reverse drift duration in hours")
    ais_search_radius_km: Optional[float] = Field(50.0, ge=1.0, le=500.0, description="AIS search radius around origin")
    force_recompute: Optional[bool] = Field(False, description="Force re-running completed analysis")


class IncidentAnalyzeResponse(BaseModel):
    task_id: str
    incident_id: str
    status: str
    message: str

from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict


class CandidateVesselResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    incident_id: str
    vessel_name: str
    mmsi: str
    imo: Optional[str] = None
    vessel_type: str
    flag: Optional[str] = None
    destination: Optional[str] = None
    has_ais_gap: bool
    ais_gap_duration_minutes: int
    ais_gap_start: Optional[datetime] = None
    ais_gap_end: Optional[datetime] = None
    min_distance_to_drift_center_km: Optional[float] = None
    speed_knots_avg: Optional[float] = None
    speed_anomaly_detected: bool
    trajectory_geojson: Dict[str, Any]
    raw_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime


class CandidateListResponse(BaseModel):
    incident_id: str
    total_candidates: int
    candidates: List[CandidateVesselResponse]

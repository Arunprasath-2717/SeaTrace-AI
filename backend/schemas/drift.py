from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel, ConfigDict


class DriftRunResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    incident_id: str
    simulation_hours: int
    release_window_start: datetime
    release_window_end: datetime
    origin_center_lat: float
    origin_center_lon: float
    contours_geojson: Dict[str, Any]
    metocean_conditions: Optional[Dict[str, Any]] = None
    created_at: datetime

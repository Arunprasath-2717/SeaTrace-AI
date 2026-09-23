from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel, ConfigDict


class SpillResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    incident_id: str
    confidence: float
    estimated_area_km2: float
    thickness_estimate: Optional[str] = "MEDIUM_SLICK"
    polygon_geojson: Dict[str, Any]
    sar_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime

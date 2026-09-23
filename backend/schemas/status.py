from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
from backend.core.state_machine import IncidentState


class StageLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    stage: str
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    elapsed_seconds: Optional[float] = None
    message: Optional[str] = None
    extra_metadata: Optional[Dict[str, Any]] = None


class PipelineStatusResponse(BaseModel):
    incident_id: str
    current_status: IncidentState
    progress_percentage: int
    stages: List[StageLogResponse]

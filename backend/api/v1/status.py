from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.core.state_machine import IncidentStateMachine
from backend.models.incident import Incident
from backend.models.user import User
from backend.schemas.status import PipelineStatusResponse, StageLogResponse
from backend.services.incident_service import IncidentService
from backend.api.deps import get_current_user

router = APIRouter(prefix="/incidents", tags=["Pipeline Status"])


@router.get("/{incident_id}/status", response_model=PipelineStatusResponse)
def get_incident_status(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    Get the active pipeline state, stage transition logs, and progress percentage.
    """
    incident = IncidentService.get_incident(db, incident_id)
    progress = IncidentStateMachine.get_progress_percentage(incident.status)

    stage_responses = [
        StageLogResponse(
            stage=log.stage,
            status=log.status,
            started_at=log.started_at,
            completed_at=log.completed_at,
            elapsed_seconds=log.elapsed_seconds,
            message=log.message,
            extra_metadata=log.extra_metadata,
        )
        for log in incident.stage_logs
    ]

    return PipelineStatusResponse(
        incident_id=incident.id,
        current_status=incident.status,
        progress_percentage=progress,
        stages=stage_responses,
    )

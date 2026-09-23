import uuid
from typing import Optional
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.core.state_machine import IncidentState
from backend.models.incident import Incident
from backend.models.user import User
from backend.schemas.common import PaginatedResponse
from backend.schemas.incident import (
    IncidentCreate,
    IncidentResponse,
    IncidentListItem,
    IncidentAnalyzeRequest,
    IncidentAnalyzeResponse,
)
from backend.services.incident_service import IncidentService
from backend.services.orchestrator import OrchestratorService
from backend.tasks.pipeline import run_incident_pipeline_task
from backend.api.deps import get_current_user
from backend.core.config import settings

router = APIRouter(prefix="/incidents", tags=["Incidents"])


@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def create_incident(
    payload: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    Create a new oil spill incident record.
    """
    incident = IncidentService.create_incident(db, payload)
    return incident


@router.get("", response_model=PaginatedResponse[IncidentListItem])
def list_incidents(
    status_filter: Optional[IncidentState] = Query(None, alias="status"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    List incidents with optional status filter and pagination.
    """
    total, items = IncidentService.list_incidents(
        db, status_filter=status_filter, limit=limit, offset=offset
    )
    return PaginatedResponse(
        total=total,
        items=items,
        limit=limit,
        offset=offset,
    )


@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    Retrieve incident metadata and lifecycle state.
    """
    return IncidentService.get_incident(db, incident_id)


@router.post("/{incident_id}/analyze", response_model=IncidentAnalyzeResponse, status_code=status.HTTP_202_ACCEPTED)
def analyze_incident(
    incident_id: str,
    params: IncidentAnalyzeRequest = IncidentAnalyzeRequest(),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    Triggers end-to-end attribution pipeline for an incident.
    Runs via Celery / synchronous worker and updates state from M1 -> M4 -> M5 -> M2 -> Report.
    """
    incident = IncidentService.get_incident(db, incident_id)

    if settings.CELERY_TASK_ALWAYS_EAGER:
        # Run synchronously for eager / dev execution
        orchestrator = OrchestratorService()
        orchestrator.run_pipeline(
            db=db,
            incident_id=incident.id,
            drift_hours=params.drift_hours or 24,
            search_radius_km=params.ais_search_radius_km or 50.0,
            force_recompute=params.force_recompute or False,
        )
        task_id = f"task_{uuid.uuid4().hex[:12]}"
    else:
        # Send to Celery worker queue
        async_result = run_incident_pipeline_task.delay(
            incident_id=incident.id,
            drift_hours=params.drift_hours or 24,
            search_radius_km=params.ais_search_radius_km or 50.0,
            force_recompute=params.force_recompute or False,
        )
        task_id = async_result.id

    return IncidentAnalyzeResponse(
        task_id=task_id,
        incident_id=incident.id,
        status="ACCEPTED",
        message="Analysis pipeline triggered successfully.",
    )

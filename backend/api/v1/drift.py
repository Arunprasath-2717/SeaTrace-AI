from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.models.user import User
from backend.schemas.drift import DriftRunResponse
from backend.services.incident_service import IncidentService
from backend.api.deps import get_current_user

router = APIRouter(prefix="/incidents", tags=["Drift Analysis (M4)"])


@router.get("/{incident_id}/drift", response_model=DriftRunResponse)
def get_drift_data(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    Returns M4 Reverse Drift simulation data (contours GeoJSON, temporal release window, origin).
    """
    incident = IncidentService.get_incident(db, incident_id)
    if not incident.drift_run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Drift simulation data has not been generated for this incident yet. Trigger /analyze first."
        )

    return incident.drift_run

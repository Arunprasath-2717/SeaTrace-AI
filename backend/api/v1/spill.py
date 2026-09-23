from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.models.user import User
from backend.schemas.spill import SpillResponse
from backend.services.incident_service import IncidentService
from backend.api.deps import get_current_user

router = APIRouter(prefix="/incidents", tags=["Spill Detection (M1)"])


@router.get("/{incident_id}/spill", response_model=SpillResponse)
def get_spill_data(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    Returns M1 Spill Detection data (SAR polygon GeoJSON, estimated area, confidence).
    """
    incident = IncidentService.get_incident(db, incident_id)
    if not incident.spill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Spill detection data has not been generated for this incident yet. Trigger /analyze first."
        )

    return incident.spill

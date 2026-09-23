from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.models.user import User
from backend.schemas.candidate import CandidateListResponse, CandidateVesselResponse
from backend.services.incident_service import IncidentService
from backend.api.deps import get_current_user

router = APIRouter(prefix="/incidents", tags=["Candidate Vessels (M5)"])


@router.get("/{incident_id}/candidates", response_model=CandidateListResponse)
def get_candidate_vessels(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    Returns M5 AIS candidate vessels matched within the release window and drift envelope.
    """
    incident = IncidentService.get_incident(db, incident_id)
    candidates = incident.candidates or []

    return CandidateListResponse(
        incident_id=incident.id,
        total_candidates=len(candidates),
        candidates=[CandidateVesselResponse.model_validate(c) for c in candidates]
    )

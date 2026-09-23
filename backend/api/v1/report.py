from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.models.user import User
from backend.schemas.report import IncidentReportResponse
from backend.services.incident_service import IncidentService
from backend.services.report_service import ReportService
from backend.api.deps import get_current_user

router = APIRouter(prefix="/incidents", tags=["Summary Report"])


@router.get("/{incident_id}/report", response_model=IncidentReportResponse)
def get_incident_report(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    Returns complete summary report ready for M6 dashboard rendering and export.
    """
    incident = IncidentService.get_incident(db, incident_id)
    if not incident.evidences:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Investigation report has not been assembled for this incident yet. Trigger /analyze first."
        )

    report_service = ReportService()
    return report_service.generate_report(db, incident)

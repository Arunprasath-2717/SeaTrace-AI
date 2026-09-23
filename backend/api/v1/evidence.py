from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.models.user import User
from backend.schemas.evidence import (
    EvidencePackageResponse,
    AttributionDetail,
    FactorScores,
)
from backend.services.incident_service import IncidentService
from backend.api.deps import get_current_user

router = APIRouter(prefix="/incidents", tags=["Attribution Evidence (M2)"])


@router.get("/{incident_id}/evidence", response_model=EvidencePackageResponse)
def get_attribution_evidence(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    Returns frozen M2 Attribution evidence packages and individual factor scores for all candidates.
    """
    incident = IncidentService.get_incident(db, incident_id)
    if not incident.evidences:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attribution evidence has not been generated for this incident yet. Trigger /analyze first."
        )

    scoring_ver = incident.evidences[0].scoring_version if incident.evidences else "1.0"
    weights = incident.evidences[0].weights_applied if incident.evidences else {}

    attributions: List[AttributionDetail] = []
    for evi in incident.evidences:
        cand = evi.candidate
        if not cand:
            continue

        factors = FactorScores(
            spatial_proximity=evi.spatial_proximity,
            temporal_overlap=evi.temporal_overlap,
            drift_compatibility=evi.drift_compatibility,
            trajectory=evi.trajectory,
            behaviour_anomaly=evi.behaviour_anomaly,
            ais_gap_evidence=evi.ais_gap_evidence,
        )

        attributions.append(
            AttributionDetail(
                candidate_id=cand.id,
                vessel_name=cand.vessel_name,
                mmsi=cand.mmsi,
                vessel_type=cand.vessel_type,
                final_score=evi.final_score,
                rank=evi.rank,
                confidence_level=evi.confidence_level,
                factor_scores=factors,
                findings_summary=evi.findings_summary or [],
            )
        )

    return EvidencePackageResponse(
        incident_id=incident.id,
        scoring_version=scoring_ver,
        weights_used=weights,
        attributions=attributions,
        generated_at=incident.evidences[0].created_at if incident.evidences else datetime.now(timezone.utc),
    )

from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.models.incident import Incident
from backend.models.evidence import AttributionEvidence
from backend.models.user import User
from backend.schemas.incident import IncidentCreate, IncidentListItem
from backend.core.errors import IncidentNotFoundError
from backend.core.state_machine import IncidentState


class IncidentService:
    """
    CRUD and orchestration trigger management for Incidents.
    """

    @staticmethod
    def create_incident(db: Session, data: IncidentCreate) -> Incident:
        detected_at = data.detected_at or datetime.now(timezone.utc)
        incident = Incident(
            name=data.name,
            description=data.description,
            latitude=data.latitude,
            longitude=data.longitude,
            status=IncidentState.CREATED,
            detected_at=detected_at,
            source_type=data.source_type or "SAR_SENTINEL_1"
        )
        db.add(incident)
        db.commit()
        db.refresh(incident)
        return incident

    @staticmethod
    def get_incident(db: Session, incident_id: str) -> Incident:
        incident = db.query(Incident).filter(Incident.id == incident_id).first()
        if not incident:
            raise IncidentNotFoundError(incident_id)
        return incident

    @staticmethod
    def list_incidents(
        db: Session,
        status_filter: Optional[IncidentState] = None,
        limit: int = 20,
        offset: int = 0
    ) -> Tuple[int, List[IncidentListItem]]:
        query = db.query(Incident)
        if status_filter:
            query = query.filter(Incident.status == status_filter)

        total = query.count()
        incidents = query.order_by(desc(Incident.created_at)).offset(offset).limit(limit).all()

        items: List[IncidentListItem] = []
        for inc in incidents:
            top_evi = (
                db.query(AttributionEvidence)
                .filter(AttributionEvidence.incident_id == inc.id, AttributionEvidence.rank == 1)
                .first()
            )
            top_name = top_evi.candidate.vessel_name if top_evi and top_evi.candidate else None
            top_score = top_evi.final_score if top_evi else None

            items.append(
                IncidentListItem(
                    id=inc.id,
                    name=inc.name,
                    status=inc.status,
                    latitude=inc.latitude,
                    longitude=inc.longitude,
                    detected_at=inc.detected_at,
                    top_candidate_name=top_name,
                    top_attribution_score=top_score,
                    created_at=inc.created_at
                )
            )

        return total, items

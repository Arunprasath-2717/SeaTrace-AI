from typing import List
from sqlalchemy.orm import Session
from backend.models.incident import Incident
from backend.models.candidate import CandidateVessel
from backend.models.evidence import AttributionEvidence
from backend.services.scoring_service import ScoringService


class EvidenceService:
    """
    Manages generation and storage of immutable attribution evidence records.
    """

    def __init__(self, scoring_service: ScoringService = None):
        self.scoring_service = scoring_service or ScoringService()

    def generate_incident_evidence(
        self,
        db: Session,
        incident: Incident
    ) -> List[AttributionEvidence]:
        """
        Evaluates all candidate vessels for the incident, creates AttributionEvidence records,
        ranks them by final score, and commits changes.
        """
        if not incident.drift_run:
            raise ValueError(f"Incident {incident.id} has no drift run data for evidence scoring.")

        if not incident.candidates:
            return []

        # Clear existing evidence if re-running
        db.query(AttributionEvidence).filter(
            AttributionEvidence.incident_id == incident.id
        ).delete()
        db.flush()

        scored_records = []
        for candidate in incident.candidates:
            final_score, factors, confidence, findings = self.scoring_service.score_candidate(
                candidate=candidate,
                drift_run=incident.drift_run
            )

            evidence = AttributionEvidence(
                incident_id=incident.id,
                candidate_id=candidate.id,
                scoring_version="1.0",
                spatial_proximity=factors["spatial_proximity"],
                temporal_overlap=factors["temporal_overlap"],
                drift_compatibility=factors["drift_compatibility"],
                trajectory=factors["trajectory"],
                behaviour_anomaly=factors["behaviour_anomaly"],
                ais_gap_evidence=factors["ais_gap_evidence"],
                final_score=final_score,
                confidence_level=confidence,
                weights_applied=self.scoring_service.weights,
                findings_summary=findings
            )
            scored_records.append(evidence)

        # Sort descending by final score
        scored_records.sort(key=lambda x: x.final_score, reverse=True)

        # Assign ranks
        for rank_idx, record in enumerate(scored_records, start=1):
            record.rank = rank_idx
            db.add(record)

        db.commit()
        return scored_records

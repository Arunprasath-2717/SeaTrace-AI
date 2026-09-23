from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.models.incident import Incident
from backend.models.evidence import AttributionEvidence
from backend.models.candidate import CandidateVessel
from backend.schemas.report import (
    IncidentReportResponse,
    IncidentSummary,
    PrimarySuspectSummary,
    CandidateRankingSummary,
)


class ReportService:
    """
    Assembles comprehensive incident summary reports from stored evidence.
    """

    def generate_report(self, db: Session, incident: Incident) -> IncidentReportResponse:
        spill_area = incident.spill.estimated_area_km2 if incident.spill else None
        spill_conf = incident.spill.confidence if incident.spill else None

        summary = IncidentSummary(
            id=incident.id,
            name=incident.name,
            latitude=incident.latitude,
            longitude=incident.longitude,
            detected_at=incident.detected_at,
            spill_area_km2=spill_area,
            confidence=spill_conf,
        )

        # Retrieve ranked evidences
        evidences = (
            db.query(AttributionEvidence)
            .filter(AttributionEvidence.incident_id == incident.id)
            .order_by(AttributionEvidence.rank.asc())
            .all()
        )

        primary_suspect: Optional[PrimarySuspectSummary] = None
        ranking_list = []

        for evi in evidences:
            cand: CandidateVessel = evi.candidate
            if not cand:
                continue

            ranking_list.append(
                CandidateRankingSummary(
                    rank=evi.rank,
                    candidate_id=cand.id,
                    vessel_name=cand.vessel_name,
                    mmsi=cand.mmsi,
                    vessel_type=cand.vessel_type,
                    score=evi.final_score,
                    confidence=evi.confidence_level,
                )
            )

            # First ranked item becomes primary suspect if score is significant
            if evi.rank == 1 and not primary_suspect:
                primary_suspect = PrimarySuspectSummary(
                    candidate_id=cand.id,
                    vessel_name=cand.vessel_name,
                    mmsi=cand.mmsi,
                    imo=cand.imo,
                    vessel_type=cand.vessel_type,
                    flag=cand.flag,
                    attribution_score=evi.final_score,
                    confidence_level=evi.confidence_level,
                    key_findings=evi.findings_summary or [],
                )

        return IncidentReportResponse(
            incident_id=incident.id,
            status="FINAL" if incident.status.value == "REPORT_READY" else incident.status.value,
            generated_at=datetime.now(timezone.utc),
            incident_summary=summary,
            primary_suspect=primary_suspect,
            candidate_ranking=ranking_list,
        )

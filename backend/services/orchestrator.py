import time
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session

from backend.core.state_machine import IncidentStateMachine, IncidentState
from backend.core.errors import IncidentNotFoundError, PipelineExecutionError
from backend.models.incident import Incident
from backend.models.stage_log import StageLog
from backend.models.spill import Spill
from backend.models.drift_run import DriftRun
from backend.models.candidate import CandidateVessel
from backend.integrations.m1_adapter import M1SpillDetectionAdapter
from backend.integrations.m4_adapter import M4DriftAnalysisAdapter
from backend.integrations.m5_adapter import M5AISAttributionAdapter
from backend.integrations.mocks import (
    MockM1SpillDetectionAdapter,
    MockM4DriftAnalysisAdapter,
    MockM5AISAttributionAdapter,
)
from backend.services.evidence_service import EvidenceService


class OrchestratorService:
    """
    Coordinates the multi-stage investigation pipeline across M1, M4, M5, and M2 scoring.
    """

    def __init__(
        self,
        m1_adapter: Optional[M1SpillDetectionAdapter] = None,
        m4_adapter: Optional[M4DriftAnalysisAdapter] = None,
        m5_adapter: Optional[M5AISAttributionAdapter] = None,
        evidence_service: Optional[EvidenceService] = None,
    ):
        self.m1 = m1_adapter or MockM1SpillDetectionAdapter()
        self.m4 = m4_adapter or MockM4DriftAnalysisAdapter()
        self.m5 = m5_adapter or MockM5AISAttributionAdapter()
        self.evidence_service = evidence_service or EvidenceService()

    def _log_stage_start(self, db: Session, incident_id: str, stage_name: str) -> StageLog:
        log = StageLog(
            incident_id=incident_id,
            stage=stage_name,
            status="RUNNING",
            started_at=datetime.now(timezone.utc),
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

    def _log_stage_complete(
        self,
        db: Session,
        log: StageLog,
        status: str,
        message: str,
        extra: Optional[dict] = None
    ) -> None:
        now = datetime.now(timezone.utc)
        elapsed = (now - log.started_at.replace(tzinfo=timezone.utc if log.started_at.tzinfo is None else log.started_at.tzinfo)).total_seconds()
        log.status = status
        log.completed_at = now
        log.elapsed_seconds = round(elapsed, 3)
        log.message = message
        log.extra_metadata = extra
        db.commit()

    def run_pipeline(
        self,
        db: Session,
        incident_id: str,
        drift_hours: int = 24,
        search_radius_km: float = 50.0,
        force_recompute: bool = False
    ) -> Incident:
        """
        Executes the entire investigation lifecycle sequentially and idempotently.
        """
        incident = db.query(Incident).filter(Incident.id == incident_id).first()
        if not incident:
            raise IncidentNotFoundError(incident_id)

        # Idempotency check
        if incident.status == IncidentState.REPORT_READY and not force_recompute:
            return incident

        try:
            # ----------------------------------------------------
            # STAGE 1: M1 Spill Detection
            # ----------------------------------------------------
            if incident.status in (IncidentState.CREATED, IncidentState.FAILED) or force_recompute:
                log_m1 = self._log_stage_start(db, incident.id, "DETECTION_M1")
                t0 = time.time()
                m1_data = self.m1.detect_spill(
                    incident_id=incident.id,
                    lat=incident.latitude,
                    lon=incident.longitude,
                    detected_at=incident.detected_at
                )
                
                # Save or update spill
                if incident.spill:
                    incident.spill.confidence = m1_data["confidence"]
                    incident.spill.estimated_area_km2 = m1_data["estimated_area_km2"]
                    incident.spill.thickness_estimate = m1_data.get("thickness_estimate", "MEDIUM_SLICK")
                    incident.spill.polygon_geojson = m1_data["polygon_geojson"]
                    incident.spill.sar_metadata = m1_data.get("sar_metadata")
                else:
                    spill = Spill(
                        incident_id=incident.id,
                        confidence=m1_data["confidence"],
                        estimated_area_km2=m1_data["estimated_area_km2"],
                        thickness_estimate=m1_data.get("thickness_estimate", "MEDIUM_SLICK"),
                        polygon_geojson=m1_data["polygon_geojson"],
                        sar_metadata=m1_data.get("sar_metadata")
                    )
                    db.add(spill)

                incident.status = IncidentStateMachine.transition(
                    current=incident.status,
                    target=IncidentState.DETECTED,
                    allow_force=force_recompute
                )
                db.commit()
                self._log_stage_complete(
                    db, log_m1, "SUCCESS",
                    f"Spill detected ({m1_data['estimated_area_km2']} km², confidence {m1_data['confidence']:.2f}).",
                    extra={"area_km2": m1_data["estimated_area_km2"]}
                )

            # ----------------------------------------------------
            # STAGE 2: M4 Reverse Drift Simulation
            # ----------------------------------------------------
            if incident.status == IncidentState.DETECTED or force_recompute:
                log_m4 = self._log_stage_start(db, incident.id, "DRIFT_SIMULATION_M4")
                m4_data = self.m4.run_drift_simulation(
                    incident_id=incident.id,
                    spill_lat=incident.latitude,
                    spill_lon=incident.longitude,
                    spill_time=incident.detected_at,
                    simulation_hours=drift_hours
                )

                if incident.drift_run:
                    incident.drift_run.simulation_hours = m4_data["simulation_hours"]
                    incident.drift_run.release_window_start = m4_data["release_window_start"]
                    incident.drift_run.release_window_end = m4_data["release_window_end"]
                    incident.drift_run.origin_center_lat = m4_data["origin_center_lat"]
                    incident.drift_run.origin_center_lon = m4_data["origin_center_lon"]
                    incident.drift_run.contours_geojson = m4_data["contours_geojson"]
                    incident.drift_run.metocean_conditions = m4_data.get("metocean_conditions")
                else:
                    drift_run = DriftRun(
                        incident_id=incident.id,
                        simulation_hours=m4_data["simulation_hours"],
                        release_window_start=m4_data["release_window_start"],
                        release_window_end=m4_data["release_window_end"],
                        origin_center_lat=m4_data["origin_center_lat"],
                        origin_center_lon=m4_data["origin_center_lon"],
                        contours_geojson=m4_data["contours_geojson"],
                        metocean_conditions=m4_data.get("metocean_conditions")
                    )
                    db.add(drift_run)

                incident.status = IncidentStateMachine.transition(
                    current=incident.status,
                    target=IncidentState.DRIFT_DONE,
                    allow_force=force_recompute
                )
                db.commit()
                self._log_stage_complete(
                    db, log_m4, "SUCCESS",
                    f"Drift simulation generated {len(m4_data['contours_geojson']['features'])} contour envelopes.",
                    extra={"origin_lat": m4_data["origin_center_lat"], "origin_lon": m4_data["origin_center_lon"]}
                )

            # ----------------------------------------------------
            # STAGE 3: M5 AIS Vessel Filtering
            # ----------------------------------------------------
            if incident.status == IncidentState.DRIFT_DONE or force_recompute:
                log_m5 = self._log_stage_start(db, incident.id, "AIS_FILTERING_M5")
                candidates_data = self.m5.find_candidate_vessels(
                    incident_id=incident.id,
                    origin_lat=incident.drift_run.origin_center_lat,
                    origin_lon=incident.drift_run.origin_center_lon,
                    window_start=incident.drift_run.release_window_start,
                    window_end=incident.drift_run.release_window_end,
                    search_radius_km=search_radius_km
                )

                # Clear old candidate records if re-running
                db.query(CandidateVessel).filter(CandidateVessel.incident_id == incident.id).delete()
                db.flush()

                for cdata in candidates_data:
                    cand = CandidateVessel(
                        incident_id=incident.id,
                        vessel_name=cdata["vessel_name"],
                        mmsi=cdata["mmsi"],
                        imo=cdata.get("imo"),
                        vessel_type=cdata.get("vessel_type", "Cargo/Tanker"),
                        flag=cdata.get("flag"),
                        destination=cdata.get("destination"),
                        has_ais_gap=cdata.get("has_ais_gap", False),
                        ais_gap_duration_minutes=cdata.get("ais_gap_duration_minutes", 0),
                        ais_gap_start=cdata.get("ais_gap_start"),
                        ais_gap_end=cdata.get("ais_gap_end"),
                        min_distance_to_drift_center_km=cdata.get("min_distance_to_drift_center_km"),
                        speed_knots_avg=cdata.get("speed_knots_avg"),
                        speed_anomaly_detected=cdata.get("speed_anomaly_detected", False),
                        trajectory_geojson=cdata["trajectory_geojson"],
                        raw_metadata=cdata.get("raw_metadata")
                    )
                    db.add(cand)

                incident.status = IncidentStateMachine.transition(
                    current=incident.status,
                    target=IncidentState.AIS_FILTERED,
                    allow_force=force_recompute
                )
                db.commit()
                self._log_stage_complete(
                    db, log_m5, "SUCCESS",
                    f"Filtered {len(candidates_data)} candidate vessels within spatiotemporal release window."
                )

            # ----------------------------------------------------
            # STAGE 4: M2 Attribution Scoring
            # ----------------------------------------------------
            if incident.status == IncidentState.AIS_FILTERED or force_recompute:
                log_m2 = self._log_stage_start(db, incident.id, "ATTRIBUTION_SCORING_M2")
                evidences = self.evidence_service.generate_incident_evidence(db=db, incident=incident)

                incident.status = IncidentStateMachine.transition(
                    current=incident.status,
                    target=IncidentState.SCORED,
                    allow_force=force_recompute
                )
                db.commit()
                self._log_stage_complete(
                    db, log_m2, "SUCCESS",
                    f"Attribution scores computed for {len(evidences)} candidates with scoring config v1.0."
                )

            # ----------------------------------------------------
            # STAGE 5: Final Report Assembly
            # ----------------------------------------------------
            if incident.status == IncidentState.SCORED or force_recompute:
                log_rep = self._log_stage_start(db, incident.id, "REPORT_ASSEMBLY")
                incident.status = IncidentStateMachine.transition(
                    current=incident.status,
                    target=IncidentState.REPORT_READY,
                    allow_force=force_recompute
                )
                db.commit()
                self._log_stage_complete(
                    db, log_rep, "SUCCESS",
                    "Final investigation report assembled and signed."
                )

            db.refresh(incident)
            return incident

        except Exception as e:
            db.rollback()
            # Mark incident as failed
            try:
                incident = db.query(Incident).filter(Incident.id == incident_id).first()
                if incident:
                    incident.status = IncidentState.FAILED
                    fail_log = StageLog(
                        incident_id=incident.id,
                        stage="PIPELINE_ERROR",
                        status="FAILED",
                        started_at=datetime.now(timezone.utc),
                        completed_at=datetime.now(timezone.utc),
                        message=str(e)
                    )
                    db.add(fail_log)
                    db.commit()
            except Exception:
                pass
            raise PipelineExecutionError(stage="ORCHESTRATOR", reason=str(e))

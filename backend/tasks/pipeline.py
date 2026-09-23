from backend.tasks.celery_app import celery_app
from backend.core.database import SessionLocal
from backend.services.orchestrator import OrchestratorService


@celery_app.task(bind=True, name="tasks.run_incident_pipeline")
def run_incident_pipeline_task(
    self,
    incident_id: str,
    drift_hours: int = 24,
    search_radius_km: float = 50.0,
    force_recompute: bool = False
):
    """
    Celery background worker task for running an incident's analysis pipeline.
    Passes only simple identifiers and parameters.
    """
    db = SessionLocal()
    try:
        orchestrator = OrchestratorService()
        incident = orchestrator.run_pipeline(
            db=db,
            incident_id=incident_id,
            drift_hours=drift_hours,
            search_radius_km=search_radius_km,
            force_recompute=force_recompute
        )
        return {
            "incident_id": incident.id,
            "status": incident.status.value,
            "success": True
        }
    finally:
        db.close()

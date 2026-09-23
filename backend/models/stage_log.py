import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.core.database import Base


def generate_log_id() -> str:
    return f"log_{uuid.uuid4().hex[:12]}"


class StageLog(Base):
    __tablename__ = "stage_logs"

    id = Column(String(36), primary_key=True, default=generate_log_id)
    incident_id = Column(String(36), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False, index=True)
    stage = Column(String(50), nullable=False)  # e.g., DETECTION_M1, DRIFT_SIMULATION_M4
    status = Column(String(20), nullable=False) # SUCCESS, FAILED, RUNNING
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime, nullable=True)
    elapsed_seconds = Column(Float, nullable=True)
    message = Column(String(500), nullable=True)
    extra_metadata = Column(JSON, nullable=True)

    incident = relationship("Incident", back_populates="stage_logs")

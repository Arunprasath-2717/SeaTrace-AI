import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.core.database import Base


def generate_evi_id() -> str:
    return f"evi_{uuid.uuid4().hex[:12]}"


class AttributionEvidence(Base):
    __tablename__ = "attribution_evidence"

    id = Column(String(36), primary_key=True, default=generate_evi_id)
    incident_id = Column(String(36), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False, index=True)
    candidate_id = Column(String(36), ForeignKey("candidate_vessels.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    scoring_version = Column(String(20), nullable=False, default="1.0")
    
    # 6 Individual factor scores [0.0 - 1.0]
    spatial_proximity = Column(Float, nullable=False, default=0.0)
    temporal_overlap = Column(Float, nullable=False, default=0.0)
    drift_compatibility = Column(Float, nullable=False, default=0.0)
    trajectory = Column(Float, nullable=False, default=0.0)
    behaviour_anomaly = Column(Float, nullable=False, default=0.0)
    ais_gap_evidence = Column(Float, nullable=False, default=0.0)
    
    # Final attribution score & ranking
    final_score = Column(Float, nullable=False, default=0.0)
    rank = Column(Integer, nullable=False, default=1)
    confidence_level = Column(String(20), nullable=False, default="LOW") # LOW, MEDIUM, HIGH
    
    # Frozen snapshot of weights applied
    weights_applied = Column(JSON, nullable=False)
    findings_summary = Column(JSON, nullable=True) # List of qualitative strings
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    incident = relationship("Incident", back_populates="evidences")
    candidate = relationship("CandidateVessel", back_populates="evidence")

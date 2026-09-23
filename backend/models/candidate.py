import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.core.database import Base


def generate_cand_id() -> str:
    return f"cnd_{uuid.uuid4().hex[:12]}"


class CandidateVessel(Base):
    __tablename__ = "candidate_vessels"

    id = Column(String(36), primary_key=True, default=generate_cand_id)
    incident_id = Column(String(36), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False, index=True)
    vessel_name = Column(String(150), nullable=False)
    mmsi = Column(String(20), nullable=False, index=True)
    imo = Column(String(20), nullable=True)
    vessel_type = Column(String(80), nullable=False, default="Cargo/Tanker")
    flag = Column(String(80), nullable=True)
    destination = Column(String(150), nullable=True)
    has_ais_gap = Column(Boolean, default=False, nullable=False)
    ais_gap_duration_minutes = Column(Integer, default=0, nullable=False)
    ais_gap_start = Column(DateTime, nullable=True)
    ais_gap_end = Column(DateTime, nullable=True)
    min_distance_to_drift_center_km = Column(Float, nullable=True)
    speed_knots_avg = Column(Float, nullable=True)
    speed_anomaly_detected = Column(Boolean, default=False, nullable=False)
    trajectory_geojson = Column(JSON, nullable=False)  # GeoJSON LineString
    raw_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    incident = relationship("Incident", back_populates="candidates")
    evidence = relationship("AttributionEvidence", back_populates="candidate", uselist=False, cascade="all, delete-orphan")

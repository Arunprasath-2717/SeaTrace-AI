import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.core.database import Base


def generate_drift_id() -> str:
    return f"drf_{uuid.uuid4().hex[:12]}"


class DriftRun(Base):
    __tablename__ = "drift_runs"

    id = Column(String(36), primary_key=True, default=generate_drift_id)
    incident_id = Column(String(36), ForeignKey("incidents.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    simulation_hours = Column(Integer, nullable=False, default=24)
    release_window_start = Column(DateTime, nullable=False)
    release_window_end = Column(DateTime, nullable=False)
    origin_center_lat = Column(Float, nullable=False)
    origin_center_lon = Column(Float, nullable=False)
    contours_geojson = Column(JSON, nullable=False)  # GeoJSON FeatureCollection of contours
    metocean_conditions = Column(JSON, nullable=True) # wind, currents, waves
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    incident = relationship("Incident", back_populates="drift_run")

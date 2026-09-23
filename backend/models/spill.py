import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.core.database import Base


def generate_spill_id() -> str:
    return f"spl_{uuid.uuid4().hex[:12]}"


class Spill(Base):
    __tablename__ = "spills"

    id = Column(String(36), primary_key=True, default=generate_spill_id)
    incident_id = Column(String(36), ForeignKey("incidents.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    confidence = Column(Float, nullable=False)
    estimated_area_km2 = Column(Float, nullable=False)
    thickness_estimate = Column(String(50), nullable=True, default="MEDIUM_SLICK")
    polygon_geojson = Column(JSON, nullable=False)  # GeoJSON Polygon / MultiPolygon
    sar_metadata = Column(JSON, nullable=True)     # satellite, pass_direction, sensor info
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    incident = relationship("Incident", back_populates="spill")

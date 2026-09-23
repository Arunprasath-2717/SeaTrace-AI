import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from backend.core.database import Base
from backend.core.state_machine import IncidentState


def generate_inc_id() -> str:
    return f"inc_{uuid.uuid4().hex[:12]}"


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(36), primary_key=True, default=generate_inc_id)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(SQLEnum(IncidentState), default=IncidentState.CREATED, nullable=False, index=True)
    detected_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    source_type = Column(String(50), default="SAR_SENTINEL_1", nullable=False)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    stage_logs = relationship("StageLog", back_populates="incident", cascade="all, delete-orphan", order_by="StageLog.started_at")
    spill = relationship("Spill", back_populates="incident", uselist=False, cascade="all, delete-orphan")
    drift_run = relationship("DriftRun", back_populates="incident", uselist=False, cascade="all, delete-orphan")
    candidates = relationship("CandidateVessel", back_populates="incident", cascade="all, delete-orphan")
    evidences = relationship("AttributionEvidence", back_populates="incident", cascade="all, delete-orphan", order_by="AttributionEvidence.rank")

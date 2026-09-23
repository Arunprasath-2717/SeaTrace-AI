from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class IncidentSummary(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    detected_at: datetime
    spill_area_km2: Optional[float] = None
    confidence: Optional[float] = None


class PrimarySuspectSummary(BaseModel):
    candidate_id: str
    vessel_name: str
    mmsi: str
    imo: Optional[str] = None
    vessel_type: str
    flag: Optional[str] = None
    attribution_score: float
    confidence_level: str
    key_findings: List[str]


class CandidateRankingSummary(BaseModel):
    rank: int
    candidate_id: str
    vessel_name: str
    mmsi: str
    vessel_type: str
    score: float
    confidence: str


class IncidentReportResponse(BaseModel):
    incident_id: str
    status: str
    generated_at: datetime
    incident_summary: IncidentSummary
    primary_suspect: Optional[PrimarySuspectSummary] = None
    candidate_ranking: List[CandidateRankingSummary]

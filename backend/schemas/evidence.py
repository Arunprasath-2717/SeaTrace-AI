from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class FactorScores(BaseModel):
    spatial_proximity: float
    temporal_overlap: float
    drift_compatibility: float
    trajectory: float
    behaviour_anomaly: float
    ais_gap_evidence: float


class AttributionDetail(BaseModel):
    candidate_id: str
    vessel_name: str
    mmsi: str
    vessel_type: str
    final_score: float
    rank: int
    confidence_level: str
    factor_scores: FactorScores
    findings_summary: Optional[List[str]] = None


class EvidencePackageResponse(BaseModel):
    incident_id: str
    scoring_version: str
    weights_used: Dict[str, float]
    attributions: List[AttributionDetail]
    generated_at: datetime

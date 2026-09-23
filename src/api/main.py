"""
api/main.py
===========
FastAPI integration application for M5 AIS Intelligence Module.

Exposes processed Phase 1, Phase 2, and Phase 3 outputs via typed REST endpoints.

M5 Scope Statement:
------------------
M5 produces cleaned AIS trajectories, candidate-related features, and gap evidence.
M5 does NOT compute attribution or responsibility scores.
All gap evidence represents data-quality/coverage observations and does NOT imply wrongdoing.
"""

from __future__ import annotations

from typing import List, Optional

from fastapi import FastAPI, HTTPException, Path
from fastapi.responses import JSONResponse

from api.data_loader import M5DataLoader
from api.models import (
    CandidateDetailResponse,
    CandidateFeaturesResponse,
    CandidateSummary,
    FunnelResponse,
    GapEvidenceItem,
    GapEvidenceResponse,
    HealthResponse,
)

app = FastAPI(
    title="M5 AIS Intelligence API",
    description="SeaTrace AI (Sagar Dhristi) — AIS Intelligence Module REST API",
    version="0.1.0",
)

data_loader = M5DataLoader()


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def get_health() -> HealthResponse:
    """Return health status of M5 AIS Intelligence API."""
    return HealthResponse()


@app.get("/funnel", response_model=FunnelResponse, tags=["Funnel"])
def get_funnel() -> FunnelResponse:
    """Return space-time candidate filtering funnel metrics (Phase 2)."""
    try:
        metrics = data_loader.get_funnel_metrics()
        return FunnelResponse(**metrics)
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Failed to load funnel metrics: {err}")


@app.get("/candidates", response_model=List[CandidateSummary], tags=["Candidates"])
def list_candidates() -> List[CandidateSummary]:
    """Expose space-time candidate vessel list (Phase 2)."""
    candidates = data_loader.get_candidate_list()
    return [CandidateSummary(**c) for c in candidates]


@app.get("/candidates/{mmsi}", response_model=CandidateDetailResponse, tags=["Candidates"])
def get_candidate_detail(
    mmsi: str = Path(..., description="Vessel MMSI string", examples=["367611250"])
) -> CandidateDetailResponse:
    """Expose candidate vessel detail record by MMSI."""
    cand = data_loader.get_candidate_detail(mmsi)
    if cand is None:
        raise HTTPException(
            status_code=404,
            detail=f"Candidate vessel with MMSI '{mmsi}' not found."
        )
    return CandidateDetailResponse(**cand)


@app.get("/candidates/{mmsi}/features", response_model=CandidateFeaturesResponse, tags=["Candidate Features"])
def get_candidate_features(
    mmsi: str = Path(..., description="Vessel MMSI string", examples=["367611250"])
) -> CandidateFeaturesResponse:
    """Expose Phase 3 candidate trajectory feature metrics for a vessel."""
    features = data_loader.get_candidate_features(mmsi)
    if features is None:
        raise HTTPException(
            status_code=404,
            detail=f"Candidate features for MMSI '{mmsi}' not found."
        )
    return CandidateFeaturesResponse(**features)


@app.get("/candidates/{mmsi}/gap-evidence", response_model=GapEvidenceResponse, tags=["Gap Evidence"])
def get_candidate_gap_evidence(
    mmsi: str = Path(..., description="Vessel MMSI string", examples=["367606390"])
) -> GapEvidenceResponse:
    """Expose descriptive AIS gap evidence for a candidate vessel.

    Note: AIS transmission gaps are data-quality / coverage observations.
    They are treated as contextual evidence requiring further investigation, NOT proof of wrongdoing.
    """
    is_candidate, gaps = data_loader.get_candidate_gap_evidence(mmsi)
    if not is_candidate:
        raise HTTPException(
            status_code=404,
            detail=f"Candidate vessel with MMSI '{mmsi}' not found."
        )
    gap_items = [GapEvidenceItem(**g) for g in gaps]
    return GapEvidenceResponse(
        mmsi=str(mmsi),
        total_gaps=len(gap_items),
        gaps=gap_items,
    )


@app.get("/trajectories/{mmsi}/geojson", tags=["Trajectories"])
def get_trajectory_geojson(
    mmsi: str = Path(..., description="Vessel MMSI string", examples=["367611250"])
) -> JSONResponse:
    """Return valid GeoJSON LineString representation of vessel trajectory."""
    geojson = data_loader.get_trajectory_geojson(mmsi)
    if geojson is None:
        raise HTTPException(
            status_code=404,
            detail=f"Trajectory for MMSI '{mmsi}' not found."
        )
    return JSONResponse(content=geojson)

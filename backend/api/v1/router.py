from fastapi import APIRouter
from backend.api.v1.auth import router as auth_router
from backend.api.v1.incidents import router as incidents_router
from backend.api.v1.status import router as status_router
from backend.api.v1.spill import router as spill_router
from backend.api.v1.drift import router as drift_router
from backend.api.v1.candidates import router as candidates_router
from backend.api.v1.evidence import router as evidence_router
from backend.api.v1.report import router as report_router

api_v1_router = APIRouter()

# Include all sub-routers
api_v1_router.include_router(auth_router)
api_v1_router.include_router(incidents_router)
api_v1_router.include_router(status_router)
api_v1_router.include_router(spill_router)
api_v1_router.include_router(drift_router)
api_v1_router.include_router(candidates_router)
api_v1_router.include_router(evidence_router)
api_v1_router.include_router(report_router)

# M2 BACKEND — IMPLEMENTATION PLAN

## A. Existing Architecture

Inspection Results (Phase 0):
- **Root Directory**: `c:\Users\PRANAV KARTHIK S\Desktop\Ocean trace`
- **Current State**: The repository is currently empty and uninitialized (no existing backend, frontend, database, or submodule files).
- **Environment**: Python 3.13 & Python 3.14 available, Docker available. Native Redis is not installed in Windows PATH; Celery will be configured to use Redis broker/backend with optional synchronous/eager fallback (`CELERY_TASK_ALWAYS_EAGER=True` in test/standalone mode) to ensure 100% testability and reliability.
- **Architectural Role**: The M2 Backend serves as the central orchestration, state-management, scoring, and API engine bridging:
  - **M1**: Spill Detection (satellite/SAR polygon, confidence)
  - **M3**: Relational Database & Schemas (SQLAlchemy with SQLite / PostgreSQL)
  - **M4**: Drift Analysis (reverse drift contours, candidate spatiotemporal window)
  - **M5**: AIS & Vessel Attribution (vessel trajectories, AIS gaps, candidate vessels)
  - **M6**: Frontend Dashboard (consuming REST APIs via strict contract)

```text
               +----------------------------------+
               |        M6 Frontend Dashboard     |
               +-----------------+----------------+
                                 | REST / HTTP
                                 v
               +----------------------------------+
               |           M2 Backend             |
               |  FastAPI + State Machine + Auth  |
               +--------+----------------+--------+
                        |                |
             Async Task |                | Orchestration
                        v                v
          +-----------------+    +-------------------------+
          | Celery + Redis  |    | M1 / M4 / M5 Adapters   |
          | Background Jobs |    | (Production & Mocked)   |
          +-----------------+    +-------------------------+
                        |                |
                        +--------+-------+
                                 |
                                 v
               +----------------------------------+
               |           M3 Database            |
               | (Incidents, Spills, Drift, AIS,  |
               |  Evidence, Stage Logs, Users)    |
               +----------------------------------+
```

---

## B. Existing Files Table

| File / Folder | Existing Purpose | M2 Action |
| :--- | :--- | :--- |
| `.` (Workspace Root) | Empty workspace folder | Initialize project structure, documentation, configuration, requirements |

---

## C. Files We Will Create

| File Path | Purpose |
| :--- | :--- |
| `docs/M2_IMPLEMENTATION_PLAN.md` | Implementation plan and architecture breakdown |
| `docs/API_CONTRACT.md` | Complete M6 API contract documentation with requests, responses, status codes, examples |
| `config/scoring.yaml` | Versioned weights configuration for the 6 attribution factors (sum = 1.0) |
| `.env.example` | Template for environment variables (DB URL, JWT Secret, Celery/Redis, Scoring path) |
| `.gitignore` | Standard Python/Git ignore patterns (.venv, __pycache__, .env, *.db) |
| `requirements.txt` | Core dependencies: FastAPI, Uvicorn, SQLAlchemy, Pydantic, PyYAML, PyJWT, passlib/bcrypt, Celery, Redis, Pytest, HTTPX |
| `backend/__init__.py` | Backend package marker |
| `backend/main.py` | FastAPI application entry point, lifecycle events, global error handlers, route registration |
| `backend/core/__init__.py` | Core module marker |
| `backend/core/config.py` | Pydantic-settings configuration loader & scoring YAML validator |
| `backend/core/database.py` | SQLAlchemy database engine, session factory, declarative base, `get_db` dependency |
| `backend/core/security.py` | Password hashing (bcrypt) and JWT token generation/validation |
| `backend/core/state_machine.py` | Incident lifecycle state machine (CREATED -> DETECTED -> DRIFT_DONE -> AIS_FILTERED -> SCORED -> REPORT_READY) with stage logging and transition validation |
| `backend/core/errors.py` | Custom domain exceptions and standard error response formatting |
| `backend/models/__init__.py` | Models module marker and exports |
| `backend/models/user.py` | User model for authentication |
| `backend/models/incident.py` | Incident table tracking lifecycle state, metadata, and timestamps |
| `backend/models/stage_log.py` | StageLog table recording state transitions, elapsed time, errors, and metadata |
| `backend/models/spill.py` | M1 Spill detection table (spill polygon, area, confidence, SAR metadata) |
| `backend/models/drift_run.py` | M4 Drift simulation table (backward drift contours, window, age range, sensitivity) |
| `backend/models/candidate.py` | M5 AIS candidate vessels table (vessel identity, features, AIS gaps) |
| `backend/models/evidence.py` | Attribution evidence table (immutable scoring factors, weights, final score) |
| `backend/schemas/__init__.py` | Schemas module marker |
| `backend/schemas/common.py` | Standard response wrappers and error schemas |
| `backend/schemas/auth.py` | Login request, token response, user schemas |
| `backend/schemas/incident.py` | Incident creation, response, analyze trigger schemas |
| `backend/schemas/status.py` | Incident pipeline status and stage transition history schemas |
| `backend/schemas/spill.py` | M1 Spill detection API schemas |
| `backend/schemas/drift.py` | M4 Drift analysis API schemas |
| `backend/schemas/candidate.py` | M5 Candidate vessel API schemas |
| `backend/schemas/evidence.py` | Attribution evidence and factor breakdown schemas |
| `backend/schemas/report.py` | Final summary report API schemas |
| `backend/services/__init__.py` | Services module marker |
| `backend/services/incident_service.py` | Incident management and pipeline trigger coordination |
| `backend/services/scoring_service.py` | Attribution scoring engine calculating weighted sum based on `config/scoring.yaml` |
| `backend/services/evidence_service.py` | Immutable evidence compilation combining M4 + M5 + M2 scoring |
| `backend/services/report_service.py` | Summary report generation from stored evidence |
| `backend/services/orchestrator.py` | End-to-end pipeline coordinator driving state transitions and adapter calls |
| `backend/integrations/__init__.py` | Integrations module marker |
| `backend/integrations/m1_adapter.py` | Abstract interface and adapter for M1 Spill Detection |
| `backend/integrations/m4_adapter.py` | Abstract interface and adapter for M4 Drift Analysis |
| `backend/integrations/m5_adapter.py` | Abstract interface and adapter for M5 AIS / Vessel Attribution |
| `backend/integrations/mocks/__init__.py` | Mock adapters package marker |
| `backend/integrations/mocks/mock_m1.py` | Synthetic spill polygon, confidence, and SAR metadata generation |
| `backend/integrations/mocks/mock_m4.py` | Synthetic backward drift simulation contours and temporal window |
| `backend/integrations/mocks/mock_m5.py` | Synthetic candidate vessel trajectories, AIS gaps, and behavioral anomaly data |
| `backend/tasks/__init__.py` | Background tasks package marker |
| `backend/tasks/celery_app.py` | Celery application instance configuration |
| `backend/tasks/pipeline.py` | Lightweight Celery tasks executing pipeline stages with IDs only |
| `backend/api/__init__.py` | API package marker |
| `backend/api/v1/__init__.py` | API v1 package marker |
| `backend/api/v1/router.py` | Combined API v1 router mounting all sub-routes |
| `backend/api/v1/auth.py` | `POST /auth/login` endpoint |
| `backend/api/v1/incidents.py` | `POST /incidents`, `POST /incidents/{id}/analyze`, `GET /incidents` |
| `backend/api/v1/status.py` | `GET /incidents/{id}/status` |
| `backend/api/v1/spill.py` | `GET /incidents/{id}/spill` |
| `backend/api/v1/drift.py` | `GET /incidents/{id}/drift` |
| `backend/api/v1/candidates.py` | `GET /incidents/{id}/candidates` |
| `backend/api/v1/evidence.py` | `GET /incidents/{id}/evidence` |
| `backend/api/v1/report.py` | `GET /incidents/{id}/report` |
| `backend/tests/__init__.py` | Test package marker |
| `backend/tests/conftest.py` | Pytest fixtures (isolated SQLite DB, TestClient, test auth tokens) |
| `backend/tests/test_auth.py` | Authentication unit & integration tests |
| `backend/tests/test_incidents.py` | Incident creation, retrieval, and analyze idempotency tests |
| `backend/tests/test_state_machine.py` | State machine valid transitions and illegal transition rejection tests |
| `backend/tests/test_scoring.py` | Scoring factor calculation, weight validation, edge cases (all 0, all 1) |
| `backend/tests/test_api_v1.py` | All `/api/v1` endpoints response validation tests |
| `backend/tests/test_golden_flow.py` | Complete end-to-end golden path workflow test |
| `README.md` | Quickstart instructions, setup commands, architecture overview |

---

## D. State Machine Execution Lifecycle

```text
    CREATED
       │ (M1 Detection executed / verified)
       ▼
   DETECTED
       │ (M4 Drift simulation executed)
       ▼
   DRIFT_DONE
       │ (M5 AIS vessel filtering executed)
       ▼
  AIS_FILTERED
       │ (M2 Attribution scoring applied)
       ▼
    SCORED
       │ (Evidence & Report assembled)
       ▼
  REPORT_READY
```

Each transition is recorded in `stage_logs` with timestamps, status (`SUCCESS`, `FAILED`, `DEGRADED`), and diagnostic messages.

---

## E. Scoring Weights Formula (`config/scoring.yaml`)

```yaml
version: "1.0"
weights:
  spatial_proximity: 0.25
  temporal_overlap: 0.20
  drift_compatibility: 0.25
  trajectory: 0.15
  behaviour_anomaly: 0.10
  ais_gap_evidence: 0.05
```

Formula:
```text
final_score = (spatial_proximity * 0.25) +
              (temporal_overlap * 0.20) +
              (drift_compatibility * 0.25) +
              (trajectory * 0.15) +
              (behaviour_anomaly * 0.10) +
              (ais_gap_evidence * 0.05)
```
Scoring Service enforces `sum(weights) == 1.0` and ensures all factors are clamped in `[0.0, 1.0]`.

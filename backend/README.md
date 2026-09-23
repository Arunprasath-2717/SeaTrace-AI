# Ocean Trace — M2 Backend

> **Oil Spill Attribution & Orchestration Engine**  
> Central orchestration, state-machine lifecycle tracking, attribution scoring, and REST API bridging M1 (SAR Detection), M3 (Relational DB), M4 (Reverse Drift Analysis), M5 (AIS Vessel Tracking), and M6 (Dashboard).

---

## 🌊 Architecture Overview

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

## 🚀 Key Capabilities

1. **Deterministic Lifecycle State Machine**:
   - `CREATED` ➔ `DETECTED` ➔ `DRIFT_DONE` ➔ `AIS_FILTERED` ➔ `SCORED` ➔ `REPORT_READY` (with `FAILED` recovery).
   - Validated state transitions and stage duration logs with microsecond resolution.

2. **Multi-Factor Attribution Scoring Engine**:
   - Computes weighted suspect scores based on 6 configurable factors (`config/scoring.yaml`):
     - `spatial_proximity` (0.25)
     - `drift_compatibility` (0.25)
     - `temporal_overlap` (0.20)
     - `trajectory` (0.15)
     - `behaviour_anomaly` (0.10)
     - `ais_gap_evidence` (0.05)
   - Automatically validates `sum(weights) == 1.0` and clamps all factor scores into `[0.0, 1.0]`.

3. **Asynchronous & Synchronous Execution**:
   - Celery background job orchestration with Redis broker support.
   - Built-in `CELERY_TASK_ALWAYS_EAGER=True` mode for instant local testing and standalone environments.

4. **Interactive OpenAPI / Swagger Documentation**:
   - Auto-generated schemas, interactive test console at `/docs` and ReDoc at `/redoc`.

---

## ⚙️ Quick Start

### 1. Prerequisites
- Python 3.11+
- Virtual environment (`.venv`)

### 2. Setup Virtual Environment & Dependencies
```bash
# Create and activate virtualenv
python -m venv .venv
.venv\Scripts\activate   # On Windows
# source .venv/bin/activate  # On Linux/macOS

# Install requirements
pip install -r requirements.txt
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Run the API Server
```bash
.venv\Scripts\uvicorn.exe backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Navigate to:
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/healthz](http://localhost:8000/healthz)

---

## 🧪 Running the Test Suite

Run the full automated pytest suite:
```bash
.venv\Scripts\pytest.exe -v backend/tests
```

---

## 📡 REST API Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user & obtain JWT token |
| `POST` | `/api/v1/incidents` | Create a new oil spill incident record |
| `GET` | `/api/v1/incidents` | List incidents with filtering & pagination |
| `GET` | `/api/v1/incidents/{id}` | Get incident metadata and state |
| `POST` | `/api/v1/incidents/{id}/analyze` | Trigger end-to-end pipeline execution |
| `GET` | `/api/v1/incidents/{id}/status` | Query pipeline progress & stage timeline |
| `GET` | `/api/v1/incidents/{id}/spill` | Get M1 SAR detection polygon (GeoJSON) |
| `GET` | `/api/v1/incidents/{id}/drift` | Get M4 reverse drift simulation contours |
| `GET` | `/api/v1/incidents/{id}/candidates` | Get M5 AIS candidate vessel trajectories |
| `GET` | `/api/v1/incidents/{id}/evidence` | Get M2 frozen scoring factors & ranking |
| `GET` | `/api/v1/incidents/{id}/report` | Get comprehensive final investigation report |

---

## 📜 Default Credentials (Development)
- **Username**: `operator@oceantrace.io`
- **Password**: `SecurePassword123!`

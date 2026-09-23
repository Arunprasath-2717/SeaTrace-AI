# Ocean Trace M2 Backend — API Contract & Specification

This document details the REST API specifications exposed by the Ocean Trace M2 Backend for consumption by the M6 Frontend Dashboard and external integrations.

---

## 1. Authentication

All protected endpoints require an `Authorization` header formatted as:
`Authorization: Bearer <jwt_token>`

### `POST /api/v1/auth/login`
- **Description**: Authenticate user and receive a JWT access token.
- **Request Body** (`application/json` or `application/x-www-form-urlencoded`):
```json
{
  "username": "operator@oceantrace.io",
  "password": "SecurePassword123!"
}
```
- **Response `200 OK`**:
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "usr_98a72b",
    "username": "operator@oceantrace.io",
    "role": "operator"
  }
}
```
- **Response `401 Unauthorized`**:
```json
{
  "detail": "Invalid username or password"
}
```

---

## 2. Incidents Management

### `POST /api/v1/incidents`
- **Description**: Create a new oil spill detection incident record.
- **Request Body**:
```json
{
  "name": "Gulf of Guinea Spill Alpha",
  "description": "Synthetic SAR detection in Bight of Bonny",
  "latitude": 4.125,
  "longitude": 6.842,
  "detected_at": "2026-09-22T14:30:00Z",
  "source_type": "SAR_SENTINEL_1"
}
```
- **Response `201 Created`**:
```json
{
  "id": "inc_01j8m48...",
  "name": "Gulf of Guinea Spill Alpha",
  "description": "Synthetic SAR detection in Bight of Bonny",
  "latitude": 4.125,
  "longitude": 6.842,
  "status": "CREATED",
  "detected_at": "2026-09-22T14:30:00Z",
  "source_type": "SAR_SENTINEL_1",
  "created_at": "2026-09-23T08:00:00Z",
  "updated_at": "2026-09-23T08:00:00Z"
}
```

### `GET /api/v1/incidents`
- **Description**: List all incidents with optional status filtering and pagination.
- **Query Parameters**:
  - `status` (optional): Filter by state (`CREATED`, `DETECTED`, `DRIFT_DONE`, `AIS_FILTERED`, `SCORED`, `REPORT_READY`, `FAILED`)
  - `limit` (default: 20, max: 100)
  - `offset` (default: 0)
- **Response `200 OK`**:
```json
{
  "total": 1,
  "items": [
    {
      "id": "inc_01j8m48...",
      "name": "Gulf of Guinea Spill Alpha",
      "status": "REPORT_READY",
      "latitude": 4.125,
      "longitude": 6.842,
      "detected_at": "2026-09-22T14:30:00Z",
      "top_candidate_name": "MT PACIFIC VOYAGER",
      "top_attribution_score": 0.884,
      "created_at": "2026-09-23T08:00:00Z"
    }
  ]
}
```

### `GET /api/v1/incidents/{incident_id}`
- **Description**: Fetch incident details and metadata.
- **Response `200 OK`**:
```json
{
  "id": "inc_01j8m48...",
  "name": "Gulf of Guinea Spill Alpha",
  "description": "Synthetic SAR detection in Bight of Bonny",
  "latitude": 4.125,
  "longitude": 6.842,
  "status": "REPORT_READY",
  "detected_at": "2026-09-22T14:30:00Z",
  "source_type": "SAR_SENTINEL_1",
  "created_at": "2026-09-23T08:00:00Z",
  "updated_at": "2026-09-23T08:02:15Z"
}
```

### `POST /api/v1/incidents/{incident_id}/analyze`
- **Description**: Trigger the full orchestration pipeline for an incident (idempotent, transitions through M1 -> M4 -> M5 -> M2 -> Report).
- **Request Body** (optional configuration parameters):
```json
{
  "drift_hours": 24,
  "ais_search_radius_km": 50.0,
  "force_recompute": false
}
```
- **Response `202 Accepted`**:
```json
{
  "task_id": "task_orchestrate_01j8...",
  "incident_id": "inc_01j8m48...",
  "status": "RUNNING",
  "message": "Analysis pipeline triggered successfully."
}
```

---

## 3. Pipeline Status & Diagnostics

### `GET /api/v1/incidents/{incident_id}/status`
- **Description**: Query the active pipeline state and full stage transition timeline.
- **Response `200 OK`**:
```json
{
  "incident_id": "inc_01j8m48...",
  "current_status": "REPORT_READY",
  "progress_percentage": 100,
  "stages": [
    {
      "stage": "DETECTION_M1",
      "status": "SUCCESS",
      "started_at": "2026-09-23T08:00:05Z",
      "completed_at": "2026-09-23T08:00:08Z",
      "elapsed_seconds": 3.2,
      "message": "Spill polygon segmented with 0.94 confidence."
    },
    {
      "stage": "DRIFT_SIMULATION_M4",
      "status": "SUCCESS",
      "started_at": "2026-09-23T08:00:08Z",
      "completed_at": "2026-09-23T08:00:15Z",
      "elapsed_seconds": 7.1,
      "message": "Reverse drift simulation generated 5 probability contours."
    },
    {
      "stage": "AIS_FILTERING_M5",
      "status": "SUCCESS",
      "started_at": "2026-09-23T08:00:15Z",
      "completed_at": "2026-09-23T08:00:22Z",
      "elapsed_seconds": 7.0,
      "message": "Filtered 3 candidate vessels within spatiotemporal release window."
    },
    {
      "stage": "ATTRIBUTION_SCORING_M2",
      "status": "SUCCESS",
      "started_at": "2026-09-23T08:00:22Z",
      "completed_at": "2026-09-23T08:00:23Z",
      "elapsed_seconds": 0.8,
      "message": "Scoring factors calculated with config v1.0."
    },
    {
      "stage": "REPORT_ASSEMBLY",
      "status": "SUCCESS",
      "started_at": "2026-09-23T08:00:23Z",
      "completed_at": "2026-09-23T08:00:24Z",
      "elapsed_seconds": 0.5,
      "message": "Evidence package and summary report sealed."
    }
  ]
}
```

---

## 4. Module-Specific Data Payloads

### `GET /api/v1/incidents/{incident_id}/spill`
- **Description**: Returns M1 Spill Detection polygon (GeoJSON), estimated area, and SAR attributes.
- **Response `200 OK`**:
```json
{
  "incident_id": "inc_01j8m48...",
  "confidence": 0.942,
  "estimated_area_km2": 4.85,
  "thickness_estimate": "MEDIUM_SLICK",
  "polygon_geojson": {
    "type": "Polygon",
    "coordinates": [
      [
        [6.835, 4.120],
        [6.850, 4.122],
        [6.855, 4.135],
        [6.840, 4.130],
        [6.835, 4.120]
      ]
    ]
  },
  "sar_metadata": {
    "satellite": "Sentinel-1A",
    "polarization": "VV/VH",
    "pass_direction": "ASCENDING"
  }
}
```

### `GET /api/v1/incidents/{incident_id}/drift`
- **Description**: Returns M4 Reverse Drift Simulation contours, origin probability heatmap polygons, and release time window.
- **Response `200 OK`**:
```json
{
  "incident_id": "inc_01j8m48...",
  "simulation_hours": 24,
  "release_window_start": "2026-09-21T14:30:00Z",
  "release_window_end": "2026-09-22T10:00:00Z",
  "contours_geojson": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "time_offset_hours": -6, "probability_density": 0.85 },
        "geometry": { "type": "Polygon", "coordinates": [...] }
      }
    ]
  },
  "origin_center_lat": 4.095,
  "origin_center_lon": 6.812
}
```

### `GET /api/v1/incidents/{incident_id}/candidates`
- **Description**: Returns M5 AIS candidate vessels matched within the release window and drift envelope.
- **Response `200 OK`**:
```json
{
  "incident_id": "inc_01j8m48...",
  "candidates": [
    {
      "candidate_id": "cand_01",
      "vessel_name": "MT PACIFIC VOYAGER",
      "mmsi": "352001928",
      "imo": "9384729",
      "vessel_type": "Oil Tanker",
      "flag": "Panama",
      "has_ais_gap": true,
      "ais_gap_duration_minutes": 140,
      "trajectory_geojson": {
        "type": "LineString",
        "coordinates": [[6.75, 4.05], [6.81, 4.10], [6.92, 4.18]]
      }
    }
  ]
}
```

### `GET /api/v1/incidents/{incident_id}/evidence`
- **Description**: Returns immutable M2 Attribution evidence factor breakdown for candidate vessels.
- **Response `200 OK`**:
```json
{
  "incident_id": "inc_01j8m48...",
  "scoring_version": "1.0",
  "weights_used": {
    "spatial_proximity": 0.25,
    "temporal_overlap": 0.20,
    "drift_compatibility": 0.25,
    "trajectory": 0.15,
    "behaviour_anomaly": 0.10,
    "ais_gap_evidence": 0.05
  },
  "attributions": [
    {
      "candidate_id": "cand_01",
      "vessel_name": "MT PACIFIC VOYAGER",
      "mmsi": "352001928",
      "final_score": 0.884,
      "rank": 1,
      "factor_scores": {
        "spatial_proximity": 0.92,
        "temporal_overlap": 0.88,
        "drift_compatibility": 0.95,
        "trajectory": 0.80,
        "behaviour_anomaly": 0.75,
        "ais_gap_evidence": 1.00
      },
      "confidence_level": "HIGH"
    }
  ]
}
```

### `GET /api/v1/incidents/{incident_id}/report`
- **Description**: Returns the comprehensive investigation report ready for M6 Dashboard rendering or PDF export.
- **Response `200 OK`**:
```json
{
  "incident_id": "inc_01j8m48...",
  "generated_at": "2026-09-23T08:02:15Z",
  "status": "FINAL",
  "incident_summary": {
    "name": "Gulf of Guinea Spill Alpha",
    "location": [4.125, 6.842],
    "detected_at": "2026-09-22T14:30:00Z",
    "spill_area_km2": 4.85
  },
  "primary_suspect": {
    "vessel_name": "MT PACIFIC VOYAGER",
    "mmsi": "352001928",
    "vessel_type": "Oil Tanker",
    "flag": "Panama",
    "attribution_score": 0.884,
    "confidence_level": "HIGH",
    "key_findings": [
      "Vessel path intersects reverse drift origin envelope within release timeframe (-8h).",
      "AIS transponder gap of 140 minutes observed while traversing the high-probability origin area.",
      "Speed reduction anomaly from 14.2 knots to 3.1 knots during the estimated release window."
    ]
  },
  "candidate_ranking": [
    {
      "rank": 1,
      "vessel_name": "MT PACIFIC VOYAGER",
      "score": 0.884,
      "confidence": "HIGH"
    },
    {
      "rank": 2,
      "vessel_name": "CARGO HORIZON",
      "score": 0.312,
      "confidence": "LOW"
    }
  ]
}
```

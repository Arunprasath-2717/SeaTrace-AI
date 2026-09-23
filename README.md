# M5 — AIS Intelligence Module
## SeaTrace AI (Sagar Dhristi) · SIH 2026 · Problem 26143

> ⚠️ **IMPORTANT BOUNDARY DISCLAIMER**  
> **M5 does NOT determine vessel responsibility, assign guilt, identify culprits, or compute attribution scores.**  
> M5 is strictly the foundational AIS intelligence and data storage layer. It ingests, cleans, reconstructs trajectories, performs space-time filtering against M4 origin contours, extracts objective behavioral/kinematic features, and records AIS gap evidence. **Attribution and responsibility scoring belong strictly to M6.**

---

## 1. M5 Purpose and Scope

The **M5 AIS Intelligence Module** provides the complete AIS processing pipeline and spatial database integration for SeaTrace AI. It processes raw AIS broadcasts into structured vessel trajectories, filters vessels spatially and temporally against M4 oil spill origin predictions, extracts descriptive kinematic features, documents AIS transmission gaps, and exposes a FastAPI integration layer backed by PostGIS spatial database storage.

---

## 2. Candidate Taxonomy

M5 explicitly distinguishes between two distinct candidate classes:

```
                          Phase 2 Candidates (72 Total)
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
 Space-Time Candidates (3 Vessels)                    Gap-Overlap Candidates (72 Vessels)
 ─────────────────────────────────                    ───────────────────────────────────
 • Active AIS observations inside M4                   • AIS transmission gap overlaps M4
   origin contour during origin window                   origin time window
 • Have Phase 3 candidate feature records              • 69 are gap-only (no active AIS inside
 • Present in candidate_features.csv                     origin contour during origin window)
 • Present in candidate_vessels.csv                    • Present in gap_overlap_candidates.csv
```

1. **Space-Time Candidates** (3 vessels): Vessels with active AIS observations inside the M4 50% or 90% spatial origin contour during the spill origin time window. These vessels possess Phase 3 candidate feature records.
2. **Gap-Overlap Candidates** (72 vessels total, 69 gap-only): Vessels whose AIS transmission gaps overlap the spill origin time window. Gap-only vessels did not transmit active AIS inside the origin contour window; therefore, they do **not** have fabricated Phase 3 feature records.

---

## 3. Architecture & Data Flow

```
Raw AIS CSV (AccessAIS) + M4 Origin Fixture
                    │
                    ▼
     ┌─────────────────────────────┐
     │  Phase 1: Ingestion & Prep  │
     │  • Validation & Cleaning    │
     │  • Trajectory Reconstruction│
     │  • Gap Analysis & Classif.  │
     └──────────────┬──────────────┘
                    │ ais_cleaned.csv / ais_gap_records.csv
                    ▼
     ┌─────────────────────────────┐
     │  Phase 2: Space-Time Filter │
     │  • 50%/90% Contour Check    │
     │  • Time Window Overlap      │
     │  • Funnel Metrics Calc.     │
     └──────────────┬──────────────┘
                    │ space_time_report.json / gap_overlap_candidates.csv
                    ▼
     ┌─────────────────────────────┐
     │ Phase 3: Features & Evidence│
     │  • 28 Kinematic Features    │
     │  • Gap Kinematic Evidences  │
     └──────────────┬──────────────┘
                    │ candidate_features.csv / candidate_gap_evidence.csv
                    ▼
  ┌───────────────────────────────────┐
  │  FastAPI Layer & PostGIS Storage  │
  │  • File Mode / PostGIS Mode       │
  │  • 6 PostGIS Tables (EPSG:4326)   │
  └───────────────────────────────────┘
```

---

## 4. Phase 1 — Ingestion, Cleaning & Trajectory Reconstruction

### Data Cleaning Rules

| Rule | Action |
|---|---|
| Null / empty MMSI | Row removed; count logged |
| Unparseable BaseDateTime | Row removed; count logged |
| LAT not in [-90, 90] | Row removed; count logged |
| LON not in [-180, 180] | Row removed; count logged |
| Exact duplicate rows | Row removed; count logged |
| Duplicate MMSI + BaseDateTime | First kept; rest removed; count logged |
| COG = 360 | Value → NaN; **row kept** |
| Heading = 511 | Value → NaN; **row kept** |
| SOG < 0 or > 102.3 knots | Flagged with `_sog_impossible=True`; **row kept** |
| Missing optional fields | **No action** — expected; never causes row removal |

### Trajectory Reconstruction & Gap Classification

1. AIS records are sorted chronologically per MMSI.
2. `time_delta_seconds` is calculated between consecutive observations.
3. `gap_flag = True` when `time_delta_seconds > 15 minutes`.
4. `segment_id` increments at each gap. Discontinuities are preserved without artificial interpolation across gaps.

**Gap Categories (purely temporal):**
- `NORMAL`: 0 – 15 minutes
- `SHORT_GAP`: 15 – 60 minutes
- `SIGNIFICANT_GAP`: 1 – 6 hours
- `LONG_GAP`: > 6 hours

---

## 5. Phase 2 — Space-Time Candidate Filtering

Phase 2 evaluates vessel trajectories against M4 spill origin predictions:
- **Spatial Matching Levels**:
  - `MATCH_50_PERCENT`: AIS observation falls within the M4 50% origin probability contour.
  - `MATCH_90_PERCENT`: AIS observation falls within the M4 90% origin probability contour (outside 50%).
- **Gap-Overlap Matching**: Detects vessels whose AIS transmission gaps overlap the M4 origin time window, recording them as `GAP_OVERLAP_CANDIDATE`.
- **Funnel Metrics**: Preserves the complete Phase 2 reduction statistics (`spatial_matches_records=12135`, `temporal_matches_records=95`, `combined_space_time_records=71`, `gap_overlap_candidates=72`).

---

## 6. Phase 3 — Candidate Features & AIS Gap Evidence

### Objective Descriptive Features Scope (28 Features)
Phase 3 computes descriptive, non-judgmental features for space-time candidates:
- **Spatial & Proximity**: `distance_to_origin_50m`, `distance_to_origin_90m`, `min_distance_to_origin`, `mean_distance_to_origin`.
- **Observation & Dwell**: `observation_count`, `obs_count_50_percent`, `obs_count_90_percent`, `track_duration_seconds`, `dwell_duration_seconds`, `dwell_observation_count`, `stationary_observation_count`, `stationary_fraction`.
- **Kinematic Statistics**: `min_sog`, `max_sog`, `mean_sog`, `median_sog`, `sog_stddev`, `speed_change_count`, `speed_change_rate`, `heading_change_count`, `total_heading_change_degrees`, `mean_heading_change_degrees`, `max_heading_change_degrees`, `cog_available_fraction`, `heading_available_fraction`.
- **Vessel Metadata**: `vessel_type`, `navigation_status`, `imo`, `draft`, `cargo`.

### AIS Gap Evidence & Disclaimer
For gaps overlapping the spill origin window, Phase 3 calculates objective gap kinematics:
- `observed_gap_displacement_m`: Haversine distance between gap start and end coordinates.
- `expected_displacement_m`: Kinematic displacement derived from SOG at gap entry/exit.
- `displacement_difference_m`: Difference between observed and expected displacement.
- `displacement_quality`: Quality indicator (`FULL`, `PARTIAL_NO_SOG`, `PARTIAL_NO_POSITION`, `INSUFFICIENT`).

> 📢 **Contextual Evidence Disclaimer**  
> Every gap evidence record includes the mandatory disclaimer:  
> *"AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing."*

---

## 7. M4 Input Contract & Downstream Output Contract

### M4 → M5 Input Contract
M4 provides origin estimates consumed via `data/m4_origin_fixture.json`:
- `origin_time_start_utc` / `origin_time_end_utc`: Time window of plausible oil discharge.
- `contours`: GeoJSON MultiPolygon geometries for 50% and 90% confidence origin areas.

> ⚠️ **TEST_FIXTURE Limitation Notice**  
> `data/m4_origin_fixture.json` is a synthetic test fixture created for independent M5 development and testing. It is **NOT** real M4 oil spill detection output.

### M5 → Downstream Output Artifacts
- `outputs/ais_cleaned.csv`: Cleaned AIS observations with segment identifiers.
- `outputs/ais_gap_records.csv`: Classified AIS gap events.
- `outputs/phase2/space_time_report.json`: Funnel metrics and candidate summaries.
- `outputs/phase2/candidate_vessels.csv`: Summary of space-time candidate vessels.
- `outputs/phase2/gap_overlap_candidates.csv`: Gap-overlap candidate vessel records.
- `outputs/phase3/candidate_features.csv`: 28 objective candidate feature metrics.
- `outputs/phase3/candidate_gap_evidence.csv`: Gap evidence records with kinematic displacement.

---

## 8. PostGIS Architecture & Database Schema

M5 supports a dual operational mode architecture:
- **File Mode** (Default when `M5_USE_POSTGIS` is false/unset): Reads CSV/JSON artifacts from `outputs/`.
- **PostGIS Mode** (Enabled when `M5_USE_POSTGIS=true`): Queries PostgreSQL/PostGIS tables directly.

Both modes expose identical candidate taxonomy, funnel metrics, and API response contracts.

### PostGIS Database Schema (EPSG:4326 WGS 84)

The PostGIS database comprises **six tables**:

1. **`ais_observations`**: Cleaned AIS observations with PostGIS `POINT` geometry (`geom`).
2. **`trajectory_segments`**: Vessel track LineStrings with PostGIS `LINESTRING` geometry (`track_geom`).
3. **`ais_gap_evidence`**: Descriptive AIS gap evidence records.
4. **`candidate_features`**: Phase 3 feature records for space-time candidate vessels.
5. **`space_time_funnel`**: Preserved Phase 2 space-time funnel reduction metrics.
6. **`gap_overlap_candidates`**: Phase 2 gap-overlap candidate records (Primary Key: `id` autoincrement, index on `mmsi`).

### Spatial & B-Tree Indexing
- **GiST Spatial Indexes**: `idx_obs_geom` on `ais_observations(geom)` and `idx_seg_geom` on `trajectory_segments(track_geom)`.
- **B-Tree Indexes**: Created on `mmsi`, `timestamp`, `segment_id`, `overlaps_origin_window`, and foreign candidate identifiers.

---

## 9. FastAPI Endpoint Reference

When running the FastAPI server (`uvicorn api.main:app --port 8000`), the following REST endpoints are available:

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Health status and module metadata |
| `/funnel` | GET | Phase 2 space-time funnel metrics |
| `/candidates` | GET | Complete candidate vessel list (72 candidates) |
| `/candidates/{mmsi}` | GET | Candidate vessel details and gap overlap info |
| `/candidates/{mmsi}/features` | GET | 28 descriptive Phase 3 features (404 for gap-only vessels) |
| `/candidates/{mmsi}/gap-evidence` | GET | AIS gap evidence records and contextual disclaimer |
| `/trajectories/{mmsi}/geojson` | GET | Valid GeoJSON FeatureCollection of vessel tracks |

---

## 10. Configuration & Execution Guide

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `M5_USE_POSTGIS` | `false` | Set to `true` to enable PostGIS Mode |
| `POSTGRES_HOST` | `localhost` | PostgreSQL host |
| `POSTGRES_PORT` | `5432` | PostgreSQL port |
| `POSTGRES_DB` | `seatrace_m5` | Database name |
| `POSTGRES_USER` | `postgres` | Database user |
| `POSTGRES_PASSWORD` | `postgres` | Database password |

> 🔒 **Strict Connection Rule**: If `M5_USE_POSTGIS=true`, database connection failures raise a explicit `RuntimeError`. Silent fallback to File Mode when PostGIS is requested is forbidden.

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Artifact Importer to Populate PostGIS
```bash
# Populate PostGIS tables from outputs/ directory
$env:PYTHONPATH='src'; $env:M5_USE_POSTGIS='true'; python -m db.importer --output-dir outputs
```

### 3. Run FastAPI Application
```bash
# Start server in File Mode
python -m uvicorn api.main:app --app-dir src --port 8000

# Start server in PostGIS Mode
$env:PYTHONPATH='src'; $env:M5_USE_POSTGIS='true'; python -m uvicorn api.main:app --app-dir src --port 8000
```

### 4. Run Pytest & Pyright
```bash
# Run pytest test suite
$env:PYTHONPATH='src'; pytest tests/ -v

# Run Pyright static type checker
npx pyright
```

---

## 11. Current Verification Results

| Metric | Result | Status |
|---|---|---|
| **pytest suite** | 139 passed, 1 skipped | ✅ PASSED |
| **Pyright type check** | 0 errors, 0 warnings, 0 informations | ✅ PASSED |
| **PostgreSQL / PostGIS** | PostgreSQL 15 + PostGIS 3.3.4 (Container `seatrace_m2_db`) | ✅ VERIFIED |
| **PostGIS `/funnel`** | `spatial=12135`, `temporal=95`, `combined=71`, `gap_overlap=72` | ✅ VERIFIED |
| **Candidate Count** | File Mode: 72 / PostGIS Mode: 72 | ✅ VERIFIED |

---

## 12. Known Limitations

1. **Single AIS Source**: Fusion across multiple AIS providers (e.g., terrestrial vs satellite AIS provider reconciliation) is not yet implemented.
2. **No Satellite Coverage Correction**: Spatial satellite coverage dropouts (e.g. low orbital pass density) are not yet modeled; gaps in low-coverage regions are reported strictly as temporal transmission gaps.
3. **In-Memory Ingestion for Large Files**: Phase 1 trajectory sorting operates in-memory; extremely large multi-gigabyte AIS exports may require chunked database loading.
4. **Boundary with M6**: M5 intentionally stops at objective candidate data retrieval, feature extraction, and PostGIS storage. Culprit identification, guilt assignment, and responsibility scoring are handled exclusively by M6.

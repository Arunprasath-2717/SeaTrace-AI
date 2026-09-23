# SeaTrace AI — M3: GIS / Database (Nithish)

**Owner**: Nithish (GIS / Database)  
**Contract Version**: v4.1  
**Deliverable**: PostgreSQL 16 + PostGIS 3.4 Schema, Daily Partitioned AIS Storage, Space-Time Query Engine, AOI Validation Boundary, Local File Store Wiring, and Docker Deployment.

---

## 1. System Overview & Architecture

Module M3 is the earliest critical-path foundation for the SeaTrace AI system. All modules interface with M3:
- **M1 (Akshaya - Satellite)**: Writes to `scene` and `spill`.
- **M2 (Pranav - Backend)**: Reads all entities; writes to `incident`, `stage_log`, and `evidence`.
- **M4 (Arun - Ocean Physics)**: Writes to `drift_run`.
- **M5 (Divakar - AIS Intelligence)**: Writes to `ais_fix`, `track`, and `candidate`; executes space-time queries against `drift_run` contours.
- **M6 (Prathiksha - Frontend)**: Reads via M2 API; consumes GeoJSON geometries and evidence records.

---

## 2. Core Entities & PostGIS Schema (EPSG:4326)

All spatial columns are stored in **EPSG:4326 (WGS 84)**. Projected coordinate systems (such as UTM or Web Mercator) are used dynamically for metric calculations (e.g. distance in meters, area in sq km).

| Entity | Primary Key | Key Fields & Types | Indexes | Written By |
|---|---|---|---|---|
| `aoi` | `id` (VARCHAR) | `name` (VARCHAR), `geom` (MultiPolygon, 4326), `properties` (JSONB) | GiST (`geom`) | M3 / Ingestion |
| `incident` | `id` (VARCHAR) | `state` (VARCHAR), `aoi_id` (FK), `versions` (JSONB), `created_at`, `updated_at` | BTree (`state`), BTree (`created_at`) | M2 |
| `scene` | `id` (VARCHAR) | `path` (TEXT), `acquired_at` (TIMESTAMPTZ), `aoi_id` (FK), `footprint` (Geometry, 4326), `metadata` (JSONB) | GiST (`footprint`), BTree (`acquired_at`) | M1 |
| `spill` | `id` (VARCHAR) | `incident_id` (FK), `geom` (MultiPolygon, 4326), `confidence` (REAL 0..1), `metrics` (JSONB), `lookalike` (JSONB) | GiST (`geom`), BTree (`incident_id`) | M1 |
| `drift_run` | `id` (VARCHAR) | `incident_id` (FK), `type` (hind/fore), `params` (JSONB), `contours` (Geometry, 4326), `window_start`, `window_end`, `age_range_min_hours`, `age_range_max_hours` | GiST (`contours`), BTree (`incident_id`), BTree (`window_start, window_end`) | M4 |
| `ais_fix` | `(mmsi, ts)` | `mmsi` (BIGINT), `ts` (TIMESTAMPTZ), `geom` (Point, 4326), `sog` (REAL), `cog` (REAL), `heading` (REAL), `quality` (JSONB) | **Daily Range Partition**, BRIN (`ts`), GiST (`geom`), BTree (`mmsi, ts`) | M5 |
| `track` | `id` (VARCHAR) | `mmsi` (BIGINT), `ts_start`, `ts_end`, `geom` (LineString, 4326), `stats` (JSONB) | GiST (`geom`), BTree (`mmsi, ts_start, ts_end`) | M5 |
| `candidate` | `id` (VARCHAR) | `incident_id` (FK), `mmsi` (BIGINT), `features` (JSONB), `gap` (JSONB) | UNIQUE (`incident_id, mmsi`) | M5 |
| `evidence` | `(incident_id, mmsi, version)` | `rank` (INT >= 1), `score` (REAL 0..1), `record` (JSONB), `created_at` | BTree (`incident_id, version, rank`), BTree (`mmsi`) | Joint M2/M4/M5 |
| `stage_log` | `id` (VARCHAR) | `incident_id` (FK), `stage`, `status`, `engine_version`, `started`, `ended`, `reason` | BTree (`incident_id, started`), BTree (`stage, status`) | M2 |
| `provenance` | `id` (VARCHAR) | `run_id` (VARCHAR), `stage`, `model`, `weights_hash`, `dataset`, `config_hash`, `metadata` (JSONB) | BTree (`run_id`), BTree (`stage, model`) | Each engine |

---

## 3. High-Performance Partitioning & Space-Time Filter (M5 Support)

### Declarative Range Partitioning by Day
`ais_fix` is partitioned daily:
```sql
CREATE TABLE ais_fix (
    mmsi BIGINT NOT NULL,
    ts TIMESTAMPTZ NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL,
    sog REAL,
    cog REAL,
    heading REAL,
    quality JSONB NOT NULL DEFAULT '{}'::jsonb,
    PRIMARY KEY (mmsi, ts)
) PARTITION BY RANGE (ts);
```

Each daily partition (`ais_fix_YYYY_MM_DD`) is managed idempotently using:
```sql
SELECT create_ais_partition_for_date('2026-09-22');
```
Or in Python:
```python
from sea_trace.database.queries import ensure_partitions_for_range

ensure_partitions_for_range(session, start_ts, end_ts)
```

### Space-Time Query Performance (< 10s SLA)
The space-time filter combines:
1. **Partition Pruning**: Direct timestamp filter on the partition key (`a.ts >= :window_start AND a.ts <= :window_end`).
2. **BRIN Index Scan**: Rapid physical block pruning within target partitions.
3. **Bounding Box Pre-filtering**: PostGIS `&&` operator against `ST_MakeEnvelope(min_lon, min_lat, max_lon, max_lat, 4326)`.
4. **Exact Topological Check**: `ST_Intersects(a.geom, qc.geom)` against the 50%/90% drift origin contour.

Example Python usage for M5:
```python
from sea_trace.database.queries import query_candidate_vessels_in_spacetime

candidates = query_candidate_vessels_in_spacetime(
    session=db_session,
    contour_geom=drift_run.contours,
    window_start=drift_run.window_start,
    window_end=drift_run.window_end,
)
```

---

## 4. AOI Ingestion Validation (FR-1)

In accordance with requirement **FR-1**, scenes whose acquisition footprints do not intersect the designated AOI boundary are strictly rejected at the ingestion boundary with the standard error response:

```json
{
  "code": "OUT_OF_AOI",
  "message": "Scene 'S1A_...' footprint does not intersect the target AOI boundary 'aoi-bob-1' (FR-1 violation).",
  "details": {
    "aoi_id": "aoi-bob-1",
    "scene_id": "S1A_..."
  }
}
```

Python usage:
```python
from sea_trace.database.aoi import validate_and_register_scene, OutOfAOIError

try:
    scene = validate_and_register_scene(session, scene_create_schema)
except OutOfAOIError as e:
    return e.to_error_response()
```

---

## 5. Local File Store Wiring & Redis

Per Section 3 of the Master Contract:
- **Rasters and NetCDF files never travel through Redis or Postgres.**
- Only relative/absolute filesystem paths and SHA-256 hashes are persisted in the database.

Directory convention:
- GeoTIFF Rasters: `data/rasters/{scene_id}.tif`
- Spill Masks: `data/masks/{incident_id}/{spill_id}_mask.tif`
- NetCDF Grids: `data/netcdf/{run_id}.nc`
- Final Reports: `data/reports/incident_{incident_id}_report.pdf`

Python helper:
```python
from sea_trace.database.storage import filestore

raster_path = filestore.get_raster_path("S1A_20260922")
file_hash = filestore.compute_file_hash(raster_path)
```

---

## 6. Evidence Immutability (FR-9)

Per Master Contract Section 2:
- Evidence records are **immutable** once a run completes.
- Re-running attribution creates a new version (`version = max_version + 1`), never an overwrite.
- A PostgreSQL database trigger `prevent_evidence_mutation()` blocks any `UPDATE` statements on the `evidence` table.

---

## 7. Running Infrastructure with Docker Compose

To start the database, PostGIS extensions, and Redis stack:

```bash
docker-compose up -d
```

To run schema migrations manually:
```bash
python -m sea_trace.database.init_db
```

To execute the full test suite:
```bash
python -m pytest tests/database/ -v
```

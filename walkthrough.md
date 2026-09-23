# M5 PostGIS Inconsistencies Correction - Walkthrough

## Summary of Completed Work

All three identified PostGIS Mode inconsistencies were addressed without modifying Phase 1/2/3 algorithms, output CSV/JSON formats, or FastAPI endpoint contracts.

---

## 1. Files Changed

- [`pyproject.toml`](file:///c:/Users/Divakar/Desktop/SeaTrace-AI/m5-ais-intelligence/pyproject.toml): Added missing `shapely>=2.0.0` dependency under `[project].dependencies`.
- [`requirements.txt`](file:///c:/Users/Divakar/Desktop/SeaTrace-AI/m5-ais-intelligence/requirements.txt): Added missing `shapely>=2.0.0` dependency.
- [`src/db/models.py`](file:///c:/Users/Divakar/Desktop/SeaTrace-AI/m5-ais-intelligence/src/db/models.py): Added `SpaceTimeFunnelTable` and `GapOverlapCandidateTable` SQLAlchemy ORM models.
- [`src/db/schema.py`](file:///c:/Users/Divakar/Desktop/SeaTrace-AI/m5-ais-intelligence/src/db/schema.py): Updated DDL generator and metadata creation to include new tables.
- [`src/db/importer.py`](file:///c:/Users/Divakar/Desktop/SeaTrace-AI/m5-ais-intelligence/src/db/importer.py): Updated importer to load `space_time_report.json` into `space_time_funnel` and `gap_overlap_candidates.csv` into `gap_overlap_candidates`.
- [`src/db/repository.py`](file:///c:/Users/Divakar/Desktop/SeaTrace-AI/m5-ais-intelligence/src/db/repository.py): Updated `get_funnel_metrics()`, `get_candidate_list()`, `get_candidate_detail()`, `get_candidate_features()`, and `get_candidate_gap_evidence()` to query the dedicated tables.
- [`tests/test_db.py`](file:///c:/Users/Divakar/Desktop/SeaTrace-AI/m5-ais-intelligence/tests/test_db.py): Updated DDL test assertions to check for all 6 tables.
- [`dev/audit/verify_postgis_corrections.py`](file:///c:/Users/Divakar/Desktop/SeaTrace-AI/m5-ais-intelligence/dev/audit/verify_postgis_corrections.py): End-to-end verification script for live API testing.

---

## 2. New Database Tables

### `space_time_funnel`
Stores actual Phase 2 funnel metrics from `outputs/phase2/space_time_report.json`.

| Column | Type | Description |
|---|---|---|
| `id` | `INTEGER` (PK) | Auto-incrementing primary key |
| `total_input_records` | `INTEGER` | Total raw AIS observations (45,237) |
| `total_unique_vessels` | `INTEGER` | Total unique MMSIs in raw input (207) |
| `spatial_matches_records` | `INTEGER` | Observations in spatial contour (12,135) |
| `temporal_matches_records` | `INTEGER` | Observations in temporal window (95) |
| `combined_space_time_records` | `INTEGER` | Space-time candidate observations (71) |
| `final_candidate_vessels` | `INTEGER` | Space-time candidate vessels (3) |
| `gap_overlap_candidates` | `INTEGER` | Vessels with gaps overlapping window (72) |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | Import timestamp |

### `gap_overlap_candidates`
Stores Phase 2 gap-overlap candidates from `outputs/phase2/gap_overlap_candidates.csv`.

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT` (PK) | Auto-incrementing primary key |
| `mmsi` | `VARCHAR(32)` (Index) | Vessel MMSI |
| `prev_timestamp` | `TIMESTAMP WITH TIME ZONE` | Gap start timestamp |
| `next_timestamp` | `TIMESTAMP WITH TIME ZONE` | Gap end timestamp |
| `gap_duration_minutes` | `FLOAT` | Duration in minutes |
| `gap_duration_hours` | `FLOAT` | Duration in hours |
| `last_lat` / `last_lon` | `FLOAT` | Position before gap |
| `last_sog` / `last_cog` / `last_heading` | `FLOAT` | Kinematics before gap |
| `next_lat` / `next_lon` / `next_sog` | `FLOAT` | Reappearance position & speed |
| `prev_segment_id` / `next_segment_id` | `INTEGER` | Surrounding segment IDs |
| `gap_class` | `VARCHAR(32)` | Gap classification (`LONG_GAP`) |
| `overlap_status` | `VARCHAR(64)` | Status (`GAP_OVERLAP_CANDIDATE`) |
| `evidence_note` | `TEXT` | Descriptive disclaimer note |

---

## 3. Corrected PostGIS `/funnel` Values

```json
{
  "total_input_records": 45237,
  "total_unique_vessels": 207,
  "spatial_matches_records": 12135,
  "temporal_matches_records": 95,
  "combined_space_time_records": 71,
  "final_candidate_vessels": 3,
  "gap_overlap_candidates": 72
}
```

---

## 4. Verification Results Summary

1. **File Mode Candidate Count**: 72 logical candidates
2. **PostGIS Mode Candidate Count**: 72 logical candidates
3. **Phase 3 Feature Candidates**: 3 space-time candidates (`367611250`, `338173000`, `367659780`)
4. **Gap-Only Candidate Behavior**:
   - `GET /candidates`: Includes all 69 gap-only candidates (total 72)
   - `GET /candidates/{mmsi}`: Returns detail with `gap_overlap_details`
   - `GET /candidates/{mmsi}/features`: Returns `404 Not Found` (no fake features fabricated)
   - `GET /candidates/{mmsi}/gap-evidence`: Returns `200 OK` with gap evidence list
5. **pytest result**: 139 PASSED, 1 SKIPPED
6. **Pyright result**: 0 errors, 0 warnings, 0 informations
7. **Live PostGIS verification**: Verified against live PostgreSQL 15 + PostGIS 3.3 container `seatrace_m2_db`.
8. **Remaining issues**: None.

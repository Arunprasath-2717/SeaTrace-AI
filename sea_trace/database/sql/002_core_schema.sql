-- SeaTrace AI Core PostGIS Schema
-- Owned by M3: Nithish (GIS / Database)
-- Master Contract: v4.1
-- Storage CRS: EPSG:4326 (WGS 84)

-- -----------------------------------------------------------------------------
-- 1. Area of Interest (AOI)
-- Ingestion boundary validation (FR-1)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS aoi (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    geom GEOMETRY(MultiPolygon, 4326) NOT NULL,
    properties JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aoi_geom ON aoi USING GIST (geom);

-- -----------------------------------------------------------------------------
-- 2. Incident
-- State machine: CREATED -> DETECTED -> DRIFT_DONE -> AIS_FILTERED -> SCORED -> REPORT_READY
-- Written by: M2
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS incident (
    id VARCHAR(64) PRIMARY KEY,
    state VARCHAR(32) NOT NULL DEFAULT 'CREATED',
    aoi_id VARCHAR(64) REFERENCES aoi(id) ON DELETE SET NULL,
    versions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_incident_state CHECK (
        state IN ('CREATED', 'DETECTED', 'DRIFT_DONE', 'AIS_FILTERED', 'SCORED', 'REPORT_READY', 'DEGRADED', 'FAILED')
    )
);

CREATE INDEX IF NOT EXISTS idx_incident_state ON incident (state);
CREATE INDEX IF NOT EXISTS idx_incident_created_at ON incident (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incident_aoi_id ON incident (aoi_id);

-- -----------------------------------------------------------------------------
-- 3. Scene
-- Satellite imagery metadata and acquisition footprint
-- Written by: M1 (Akshaya)
-- GiST index on footprint
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scene (
    id VARCHAR(128) PRIMARY KEY,
    path TEXT NOT NULL,
    acquired_at TIMESTAMPTZ NOT NULL,
    aoi_id VARCHAR(64) REFERENCES aoi(id) ON DELETE SET NULL,
    footprint GEOMETRY(Geometry, 4326) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scene_footprint ON scene USING GIST (footprint);
CREATE INDEX IF NOT EXISTS idx_scene_acquired_at ON scene (acquired_at DESC);
CREATE INDEX IF NOT EXISTS idx_scene_aoi_id ON scene (aoi_id);

-- -----------------------------------------------------------------------------
-- 4. Spill
-- Multi-polygon oil spill detection masks with confidence and lookalike classification
-- Written by: M1 (Akshaya)
-- GiST index on geom
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS spill (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64) NOT NULL REFERENCES incident(id) ON DELETE CASCADE,
    geom GEOMETRY(MultiPolygon, 4326) NOT NULL,
    confidence REAL NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    lookalike JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spill_geom ON spill USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_spill_incident_id ON spill (incident_id);

-- -----------------------------------------------------------------------------
-- 5. Drift Run
-- Ocean physics hindcast / forecast drift simulation outputs
-- Written by: M4 (Arun)
-- GiST index on contours
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS drift_run (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64) NOT NULL REFERENCES incident(id) ON DELETE CASCADE,
    type VARCHAR(16) NOT NULL CHECK (type IN ('hind', 'fore', 'hindcast', 'forecast')),
    params JSONB NOT NULL DEFAULT '{}'::jsonb,
    contours GEOMETRY(Geometry, 4326) NOT NULL,
    window_start TIMESTAMPTZ NOT NULL,
    window_end TIMESTAMPTZ NOT NULL,
    age_range_min_hours REAL,
    age_range_max_hours REAL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_drift_window CHECK (window_end >= window_start)
);

CREATE INDEX IF NOT EXISTS idx_drift_run_contours ON drift_run USING GIST (contours);
CREATE INDEX IF NOT EXISTS idx_drift_run_incident_id ON drift_run (incident_id);
CREATE INDEX IF NOT EXISTS idx_drift_run_window ON drift_run (window_start, window_end);

-- -----------------------------------------------------------------------------
-- 6. AIS Fix
-- Raw AIS observations partitioned daily
-- Partition by day on ts, BRIN on ts, GiST on geom
-- Written by: M5 (Divakar)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ais_fix (
    mmsi BIGINT NOT NULL,
    ts TIMESTAMPTZ NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL,
    sog REAL,
    cog REAL,
    heading REAL,
    quality JSONB NOT NULL DEFAULT '{}'::jsonb,
    PRIMARY KEY (mmsi, ts)
) PARTITION BY RANGE (ts);

-- Global/Partition Template Indexes for ais_fix
CREATE INDEX IF NOT EXISTS idx_ais_fix_ts_brin ON ais_fix USING BRIN (ts);
CREATE INDEX IF NOT EXISTS idx_ais_fix_geom_gist ON ais_fix USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_ais_fix_mmsi_ts ON ais_fix (mmsi, ts);

-- -----------------------------------------------------------------------------
-- 7. Track
-- Reconstructed vessel tracks (LineStrings)
-- Written by: M5 (Divakar)
-- GiST on geom, composite index on (mmsi, ts_start, ts_end)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS track (
    id VARCHAR(64) PRIMARY KEY,
    mmsi BIGINT NOT NULL,
    ts_start TIMESTAMPTZ NOT NULL,
    ts_end TIMESTAMPTZ NOT NULL,
    geom GEOMETRY(Geometry, 4326) NOT NULL,
    stats JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_track_time CHECK (ts_end >= ts_start)
);

CREATE INDEX IF NOT EXISTS idx_track_geom ON track USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_track_mmsi_time ON track (mmsi, ts_start, ts_end);

-- -----------------------------------------------------------------------------
-- 8. Candidate
-- Funnel shortlisted candidate vessels with extracted feature vectors
-- Written by: M5 (Divakar)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS candidate (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64) NOT NULL REFERENCES incident(id) ON DELETE CASCADE,
    mmsi BIGINT NOT NULL,
    features JSONB NOT NULL DEFAULT '{}'::jsonb,
    gap JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_candidate_incident_mmsi UNIQUE (incident_id, mmsi)
);

CREATE INDEX IF NOT EXISTS idx_candidate_incident_id ON candidate (incident_id);
CREATE INDEX IF NOT EXISTS idx_candidate_mmsi ON candidate (mmsi);

-- -----------------------------------------------------------------------------
-- 9. Evidence
-- Ranked suspects and attribution evidence records (IMMUTABLE per run)
-- Written by: Joint M2 / M4 / M5
-- Composite PK: (incident_id, mmsi, version)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS evidence (
    incident_id VARCHAR(64) NOT NULL REFERENCES incident(id) ON DELETE CASCADE,
    mmsi BIGINT NOT NULL,
    rank INTEGER NOT NULL CHECK (rank >= 1),
    score REAL NOT NULL CHECK (score >= 0.0 AND score <= 1.0),
    record JSONB NOT NULL DEFAULT '{}'::jsonb,
    version INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (incident_id, mmsi, version)
);

CREATE INDEX IF NOT EXISTS idx_evidence_incident_rank ON evidence (incident_id, version, rank ASC);
CREATE INDEX IF NOT EXISTS idx_evidence_mmsi ON evidence (mmsi);

-- Evidence Immutability Protection Trigger Function
CREATE OR REPLACE FUNCTION prevent_evidence_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Evidence records are immutable once written. Increment version instead of updating.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_evidence_update ON evidence;
CREATE TRIGGER trg_prevent_evidence_update
    BEFORE UPDATE ON evidence
    FOR EACH ROW
    EXECUTE FUNCTION prevent_evidence_mutation();

-- -----------------------------------------------------------------------------
-- 10. Stage Log
-- State machine transitions and engine progress
-- Written by: M2 (Pranav)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stage_log (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64) NOT NULL REFERENCES incident(id) ON DELETE CASCADE,
    stage VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL,
    engine_version VARCHAR(64),
    started TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended TIMESTAMPTZ,
    reason TEXT,
    CONSTRAINT chk_stage_name CHECK (
        stage IN ('CREATED', 'DETECTED', 'DRIFT_DONE', 'AIS_FILTERED', 'SCORED', 'REPORT_READY')
    ),
    CONSTRAINT chk_stage_status CHECK (
        status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'DEGRADED')
    )
);

CREATE INDEX IF NOT EXISTS idx_stage_log_incident ON stage_log (incident_id, started ASC);
CREATE INDEX IF NOT EXISTS idx_stage_log_stage_status ON stage_log (stage, status);

-- -----------------------------------------------------------------------------
-- 11. Provenance
-- Audit trail for model weights, config hashes, and datasets per engine run
-- Written by: Each engine on its own run
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS provenance (
    id VARCHAR(64) PRIMARY KEY,
    run_id VARCHAR(64) NOT NULL,
    stage VARCHAR(32) NOT NULL,
    model VARCHAR(128),
    weights_hash VARCHAR(128),
    dataset VARCHAR(128),
    config_hash VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_provenance_run_id ON provenance (run_id);
CREATE INDEX IF NOT EXISTS idx_provenance_stage_model ON provenance (stage, model);

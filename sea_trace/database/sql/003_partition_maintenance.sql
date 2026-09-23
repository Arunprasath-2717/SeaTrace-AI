-- SeaTrace AI Daily Partition Maintenance for ais_fix
-- Owned by M3: Nithish (GIS / Database)
-- Master Contract: v4.1

-- -----------------------------------------------------------------------------
-- Function: create_ais_partition_for_date
-- Creates a single day's partition for ais_fix idempotently
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION create_ais_partition_for_date(target_date DATE)
RETURNS TEXT AS $$
DECLARE
    partition_name TEXT;
    start_ts TIMESTAMPTZ;
    end_ts TIMESTAMPTZ;
    sql_stmt TEXT;
BEGIN
    partition_name := 'ais_fix_' || to_char(target_date, 'YYYY_MM_DD');
    start_ts := target_date::TIMESTAMPTZ;
    end_ts := (target_date + INTERVAL '1 day')::TIMESTAMPTZ;

    -- Check if partition already exists in pg_class
    IF EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = partition_name
    ) THEN
        RETURN partition_name;
    END IF;

    -- Create partition table
    sql_stmt := format(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF ais_fix FOR VALUES FROM (%L) TO (%L);',
        partition_name, start_ts, end_ts
    );
    EXECUTE sql_stmt;

    -- Explicit partition indexes (Postgres 11+ inherits, but explicit names improve maintainability)
    sql_stmt := format(
        'CREATE INDEX IF NOT EXISTS %I ON %I USING BRIN (ts);',
        'idx_' || partition_name || '_ts_brin', partition_name
    );
    EXECUTE sql_stmt;

    sql_stmt := format(
        'CREATE INDEX IF NOT EXISTS %I ON %I USING GIST (geom);',
        'idx_' || partition_name || '_geom_gist', partition_name
    );
    EXECUTE sql_stmt;

    RAISE NOTICE 'Created partition % for range % to %', partition_name, start_ts, end_ts;
    RETURN partition_name;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- Function: ensure_ais_partitions_for_range
-- Ensures all day partitions exist between start_ts and end_ts (inclusive)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION ensure_ais_partitions_for_range(start_ts TIMESTAMPTZ, end_ts TIMESTAMPTZ)
RETURNS TABLE (partition_created TEXT) AS $$
DECLARE
    curr_date DATE;
    last_date DATE;
    p_name TEXT;
BEGIN
    curr_date := (start_ts AT TIME ZONE 'UTC')::DATE;
    last_date := (end_ts AT TIME ZONE 'UTC')::DATE;

    WHILE curr_date <= last_date LOOP
        p_name := create_ais_partition_for_date(curr_date);
        partition_created := p_name;
        RETURN NEXT;
        curr_date := curr_date + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

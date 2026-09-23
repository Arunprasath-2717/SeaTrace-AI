-- SeaTrace AI PostGIS Schema Initializer
-- Owned by M3: Nithish (GIS / Database)
-- Master Contract: v4.1

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Verify PostGIS installation
DO $$
BEGIN
    RAISE NOTICE 'SeaTrace AI PostGIS initialized with version: %', PostGIS_Full_Version();
END $$;

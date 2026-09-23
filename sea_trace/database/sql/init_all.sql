-- SeaTrace AI - Consolidated Database Initializer
-- Owned by M3: Nithish (GIS / Database)
-- Master Contract: v4.1

\echo 'Installing PostGIS extensions...'
\ir 001_init_postgis.sql

\echo 'Creating Core Schema Tables and Indexes...'
\ir 002_core_schema.sql

\echo 'Installing Partition Maintenance Functions...'
\ir 003_partition_maintenance.sql

\echo 'SeaTrace AI Database initialization completed successfully.'

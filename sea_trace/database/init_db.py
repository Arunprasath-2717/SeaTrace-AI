"""Database Migration & Schema Initializer CLI.

Owned by M3: Nithish (GIS / Database)
Master Contract: v4.1
"""

import sys
from pathlib import Path
from sqlalchemy import text
from sea_trace.database.connection import engine
from sea_trace.database.storage.filestore import filestore


def init_database() -> None:
    """Initialize database tables, PostGIS extensions, and file storage directories."""
    print("Starting SeaTrace AI Database Initialization...")

    # 1. Ensure local file store directories exist
    filestore.ensure_directories()
    print(f"Ensured storage directories at: {filestore.base_dir}")

    # 2. Locate SQL scripts
    sql_dir = Path(__file__).resolve().parent / "sql"
    scripts = [
        "001_init_postgis.sql",
        "002_core_schema.sql",
        "003_partition_maintenance.sql",
    ]

    with engine.connect() as connection:
        for script_name in scripts:
            script_path = sql_dir / script_name
            if not script_path.is_file():
                raise FileNotFoundError(f"Missing SQL migration: {script_path}")

            print(f"Applying migration: {script_name}...")
            sql_content = script_path.read_text(encoding="utf-8")

            # Execute multi-statement SQL migration scripts (including PL/pgSQL triggers and functions)
            try:
                dbapi_conn = getattr(connection.connection, "dbapi_connection", connection.connection)
                with dbapi_conn.cursor() as cur:
                    cur.execute(sql_content)
                if hasattr(dbapi_conn, "commit"):
                    dbapi_conn.commit()
            except Exception:
                connection.execute(text(sql_content))
                connection.commit()
            print(f"Successfully applied: {script_name}")

    print("SeaTrace AI Database Schema initialization complete!")


if __name__ == "__main__":
    try:
        init_database()
    except Exception as e:
        print(f"Database initialization failed: {e}", file=sys.stderr)
        sys.exit(1)

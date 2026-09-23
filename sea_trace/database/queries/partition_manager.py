"""Daily Partition Manager for ais_fix.

Owned by M3: Nithish (GIS / Database)
Master Contract: v4.1
"""

from datetime import datetime, date, timedelta, timezone
from typing import List
from sqlalchemy import text
from sqlalchemy.orm import Session


def format_partition_name(d: date) -> str:
    """Format daily partition table name: ais_fix_YYYY_MM_DD."""
    return f"ais_fix_{d.strftime('%Y_%m_%d')}"


def get_partition_dates_for_range(start_ts: datetime, end_ts: datetime) -> List[date]:
    """Calculate list of UTC calendar dates covering the time range [start_ts, end_ts]."""
    if start_ts.tzinfo is None:
        start_ts = start_ts.replace(tzinfo=timezone.utc)
    if end_ts.tzinfo is None:
        end_ts = end_ts.replace(tzinfo=timezone.utc)

    start_date = start_ts.astimezone(timezone.utc).date()
    end_date = end_ts.astimezone(timezone.utc).date()

    if end_date < start_date:
        raise ValueError(f"end_ts ({end_ts}) cannot be before start_ts ({start_ts})")

    dates: List[date] = []
    curr = start_date
    while curr <= end_date:
        dates.append(curr)
        curr += timedelta(days=1)
    return dates


def get_partition_names_for_range(start_ts: datetime, end_ts: datetime) -> List[str]:
    """Return partition table names covering the time range."""
    return [format_partition_name(d) for d in get_partition_dates_for_range(start_ts, end_ts)]


def ensure_partitions_for_range(session: Session, start_ts: datetime, end_ts: datetime) -> List[str]:
    """Ensure that all daily partitions for the given range exist in PostgreSQL.

    Invokes stored database procedure `create_ais_partition_for_date` idempotently.
    """
    dates = get_partition_dates_for_range(start_ts, end_ts)
    created: List[str] = []

    for d in dates:
        stmt = text("SELECT create_ais_partition_for_date(:target_date);")
        result = session.execute(stmt, {"target_date": d})
        part_name = result.scalar()
        if part_name:
            created.append(str(part_name))

    session.commit()
    return created

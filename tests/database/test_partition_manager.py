"""Test Suite for ais_fix Daily Partition Manager."""

import pytest
from datetime import datetime, date, timezone
from sea_trace.database.queries.partition_manager import (
    format_partition_name,
    get_partition_dates_for_range,
    get_partition_names_for_range,
)


def test_format_partition_name():
    """Verify partition name follows ais_fix_YYYY_MM_DD format."""
    d = date(2026, 9, 22)
    name = format_partition_name(d)
    assert name == "ais_fix_2026_09_22"


def test_partition_dates_same_day():
    """Verify single day range yields one partition date."""
    start = datetime(2026, 9, 22, 10, 0, 0, tzinfo=timezone.utc)
    end = datetime(2026, 9, 22, 18, 0, 0, tzinfo=timezone.utc)
    dates = get_partition_dates_for_range(start, end)
    assert dates == [date(2026, 9, 22)]
    names = get_partition_names_for_range(start, end)
    assert names == ["ais_fix_2026_09_22"]


def test_partition_dates_cross_day_and_month():
    """Verify partition date range spanning across month end."""
    start = datetime(2026, 9, 29, 12, 0, 0, tzinfo=timezone.utc)
    end = datetime(2026, 10, 2, 8, 0, 0, tzinfo=timezone.utc)
    dates = get_partition_dates_for_range(start, end)
    expected_dates = [
        date(2026, 9, 29),
        date(2026, 9, 30),
        date(2026, 10, 1),
        date(2026, 10, 2),
    ]
    assert dates == expected_dates
    names = get_partition_names_for_range(start, end)
    assert names == [
        "ais_fix_2026_09_29",
        "ais_fix_2026_09_30",
        "ais_fix_2026_10_01",
        "ais_fix_2026_10_02",
    ]


def test_partition_dates_invalid_order():
    """Verify error raised if end time is before start time."""
    start = datetime(2026, 9, 22, 10, 0, 0, tzinfo=timezone.utc)
    end = datetime(2026, 9, 21, 10, 0, 0, tzinfo=timezone.utc)
    with pytest.raises(ValueError):
        get_partition_dates_for_range(start, end)

"""
tests/conftest.py
==================
Shared pytest fixtures for M5 test suite.

All fixtures use synthetic DataFrames — they do NOT require the real CSV.
Each fixture is designed to cover a specific edge case or happy-path scenario.
"""

from __future__ import annotations

from io import StringIO
from pathlib import Path

import pandas as pd
import pytest

# ---------------------------------------------------------------------------
# Minimal valid CSV string (in-memory)
# ---------------------------------------------------------------------------
MINIMAL_CSV = """MMSI,BaseDateTime,LAT,LON,SOG,COG,Heading,VesselName,IMO,CallSign,VesselType,Status,Length,Width,Draft,Cargo,TransceiverClass
123456789,2024-01-15T10:00:00,12.345,76.543,5.2,180.0,180,VESSEL_A,IMO123,CALLA,70,0,200,30,6.5,70,A
123456789,2024-01-15T10:10:00,12.350,76.548,5.5,182.0,182,VESSEL_A,IMO123,CALLA,70,0,200,30,6.5,70,A
123456789,2024-01-15T10:20:00,12.355,76.553,5.1,179.0,179,VESSEL_A,IMO123,CALLA,70,0,200,30,6.5,70,A
987654321,2024-01-15T10:00:00,13.100,77.200,3.0,090.0,90,VESSEL_B,,,80,,,,,,B
987654321,2024-01-15T11:30:00,13.200,77.300,3.5,092.0,92,VESSEL_B,,,80,,,,,,B
"""

# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def minimal_df() -> pd.DataFrame:
    """Minimal valid AIS DataFrame with two vessels."""
    df = pd.read_csv(StringIO(MINIMAL_CSV), dtype={"MMSI": str})
    df["BaseDateTime"] = pd.to_datetime(df["BaseDateTime"], utc=True)
    return df


@pytest.fixture
def df_with_null_mmsi(minimal_df) -> pd.DataFrame:
    """DataFrame containing one row with a null MMSI."""
    extra = minimal_df.iloc[[0]].copy()
    extra["MMSI"] = None
    return pd.concat([minimal_df, extra], ignore_index=True)


@pytest.fixture
def df_with_invalid_coords(minimal_df) -> pd.DataFrame:
    """DataFrame containing rows with out-of-range coordinates."""
    df = minimal_df.copy()
    df.loc[0, "LAT"] = 999.0    # invalid latitude
    df.loc[1, "LON"] = -200.0   # invalid longitude
    return df


@pytest.fixture
def df_with_exact_duplicates(minimal_df) -> pd.DataFrame:
    """DataFrame containing exact duplicate rows."""
    dup_row = minimal_df.iloc[[0]]
    return pd.concat([minimal_df, dup_row, dup_row], ignore_index=True)


@pytest.fixture
def df_with_mmsi_ts_duplicates(minimal_df) -> pd.DataFrame:
    """DataFrame with same MMSI+timestamp but different other fields."""
    df = minimal_df.copy()
    dup_row = df.iloc[[0]].copy()
    dup_row["SOG"] = 99.9  # different SOG but same MMSI+time → dup
    return pd.concat([df, dup_row], ignore_index=True)


@pytest.fixture
def df_with_cog_360(minimal_df) -> pd.DataFrame:
    """DataFrame containing COG=360 (AIS unavailable marker)."""
    df = minimal_df.copy()
    df.loc[0, "COG"] = 360.0
    df.loc[2, "COG"] = 360.0
    return df


@pytest.fixture
def df_with_heading_511(minimal_df) -> pd.DataFrame:
    """DataFrame containing Heading=511 (AIS not-available marker)."""
    df = minimal_df.copy()
    df.loc[1, "Heading"] = 511.0
    df.loc[3, "Heading"] = 511.0
    return df


@pytest.fixture
def df_with_impossible_sog(minimal_df) -> pd.DataFrame:
    """DataFrame with physically impossible SOG values."""
    df = minimal_df.copy()
    df.loc[0, "SOG"] = -1.0    # negative speed
    df.loc[1, "SOG"] = 200.0   # impossibly fast
    return df


@pytest.fixture
def df_missing_optional_cols(minimal_df) -> pd.DataFrame:
    """DataFrame with all optional columns entirely absent — rows must not be dropped."""
    return minimal_df[["MMSI", "BaseDateTime", "LAT", "LON", "SOG", "COG"]].copy()


@pytest.fixture
def sample_csv_path(tmp_path, minimal_df) -> Path:
    """Write the minimal DataFrame to a temp CSV and return its path."""
    csv_path = tmp_path / "test_ais.csv"
    minimal_df.to_csv(csv_path, index=False)
    return csv_path


@pytest.fixture
def csv_missing_required_col(tmp_path, minimal_df) -> Path:
    """CSV that is missing the required 'SOG' column."""
    df = minimal_df.drop(columns=["SOG"])
    path = tmp_path / "missing_sog.csv"
    df.to_csv(path, index=False)
    return path


@pytest.fixture
def large_gap_df() -> pd.DataFrame:
    """
    DataFrame with a 2-hour gap between two records for VESSEL_C.
    Useful for testing SIGNIFICANT_GAP detection.
    """
    rows = [
        {"MMSI": "111111111", "BaseDateTime": pd.Timestamp("2024-01-15 08:00:00", tz="UTC"),
         "LAT": 10.0, "LON": 75.0, "SOG": 5.0, "COG": 90.0, "Heading": 90.0},
        {"MMSI": "111111111", "BaseDateTime": pd.Timestamp("2024-01-15 10:00:00", tz="UTC"),
         "LAT": 10.5, "LON": 75.5, "SOG": 5.2, "COG": 91.0, "Heading": 91.0},  # 120-min gap
    ]
    return pd.DataFrame(rows)

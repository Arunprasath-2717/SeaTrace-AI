"""
tests/test_cleaning.py
=======================
Tests for src/cleaning.py — AIS data cleaning rules.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd
import pytest



from cleaning import AISCleaner
from models import CleaningConfig


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def make_cleaner(**kwargs) -> AISCleaner:
    config = CleaningConfig(**kwargs)
    return AISCleaner(config)


# ---------------------------------------------------------------------------
# 1. Null MMSI removal
# ---------------------------------------------------------------------------

class TestNullMMSIRemoval:
    def test_null_mmsi_row_removed(self, df_with_null_mmsi):
        cleaner = make_cleaner()
        cleaned, report = cleaner.clean(df_with_null_mmsi)
        assert report["null_mmsi_removed"] == 1
        assert cleaned["MMSI"].isna().sum() == 0

    def test_valid_mmsi_rows_preserved(self, df_with_null_mmsi, minimal_df):
        cleaner = make_cleaner()
        cleaned, _ = cleaner.clean(df_with_null_mmsi)
        assert len(cleaned) == len(minimal_df)

    def test_no_null_mmsi_zero_removed(self, minimal_df):
        cleaner = make_cleaner()
        _, report = cleaner.clean(minimal_df)
        assert report["null_mmsi_removed"] == 0


# ---------------------------------------------------------------------------
# 2. Invalid coordinate removal
# ---------------------------------------------------------------------------

class TestInvalidCoordinates:
    def test_invalid_lat_row_removed(self, df_with_invalid_coords):
        cleaner = make_cleaner()
        cleaned, report = cleaner.clean(df_with_invalid_coords)
        assert report["invalid_coordinate_rows_removed"] == 2
        assert cleaned["LAT"].between(-90, 90).all()
        assert cleaned["LON"].between(-180, 180).all()

    def test_valid_coords_untouched(self, minimal_df):
        cleaner = make_cleaner()
        _, report = cleaner.clean(minimal_df)
        assert report["invalid_coordinate_rows_removed"] == 0

    def test_record_not_removed_for_other_reason(self, df_with_invalid_coords, minimal_df):
        """Rows with valid coords but missing optional fields must survive."""
        cleaner = make_cleaner()
        cleaned, report = cleaner.clean(df_with_invalid_coords)
        # Only the 2 invalid-coord rows should be gone
        assert len(cleaned) == len(minimal_df) - 2


# ---------------------------------------------------------------------------
# 3. Exact duplicate removal
# ---------------------------------------------------------------------------

class TestExactDuplicates:
    def test_exact_duplicates_removed(self, df_with_exact_duplicates, minimal_df):
        cleaner = make_cleaner()
        cleaned, report = cleaner.clean(df_with_exact_duplicates)
        assert report["exact_duplicates_removed"] == 2
        assert len(cleaned) == len(minimal_df)

    def test_no_duplicates_zero_removed(self, minimal_df):
        cleaner = make_cleaner()
        _, report = cleaner.clean(minimal_df)
        assert report["exact_duplicates_removed"] == 0


# ---------------------------------------------------------------------------
# 4. MMSI + timestamp duplicates
# ---------------------------------------------------------------------------

class TestMMSITimestampDuplicates:
    def test_mmsi_ts_dup_removed(self, df_with_mmsi_ts_duplicates, minimal_df):
        cleaner = make_cleaner()
        cleaned, report = cleaner.clean(df_with_mmsi_ts_duplicates)
        assert report["mmsi_timestamp_duplicates_removed"] >= 1

    def test_no_mmsi_ts_dup_zero_removed(self, minimal_df):
        cleaner = make_cleaner()
        _, report = cleaner.clean(minimal_df)
        assert report["mmsi_timestamp_duplicates_removed"] == 0


# ---------------------------------------------------------------------------
# 5. COG = 360 handling
# ---------------------------------------------------------------------------

class TestCOG360:
    def test_cog_360_replaced_with_nan(self, df_with_cog_360):
        cleaner = make_cleaner()
        cleaned, report = cleaner.clean(df_with_cog_360)
        assert report["cog_360_normalised"] == 2
        # No remaining 360.0 values
        assert (cleaned["COG"] == 360.0).sum() == 0

    def test_cog_360_row_not_deleted(self, df_with_cog_360, minimal_df):
        """The row must be kept; only the COG value becomes NaN."""
        cleaner = make_cleaner()
        cleaned, report = cleaner.clean(df_with_cog_360)
        assert report["cog_360_normalised"] == 2
        # All rows still present (COG=360 rows not deleted)
        assert len(cleaned) == len(minimal_df)

    def test_cog_nan_in_replaced_rows(self, df_with_cog_360):
        cleaner = make_cleaner()
        cleaned, _ = cleaner.clean(df_with_cog_360)
        # Originally-360 rows: verify NaN
        nan_cog = cleaned["COG"].isna().sum()
        assert nan_cog >= 2

    def test_no_cog_360_zero_normalised(self, minimal_df):
        cleaner = make_cleaner()
        _, report = cleaner.clean(minimal_df)
        assert report["cog_360_normalised"] == 0


# ---------------------------------------------------------------------------
# 6. Heading = 511 handling
# ---------------------------------------------------------------------------

class TestHeading511:
    def test_heading_511_replaced_with_nan(self, df_with_heading_511):
        cleaner = make_cleaner()
        cleaned, report = cleaner.clean(df_with_heading_511)
        assert report["heading_511_normalised"] == 2
        assert (cleaned["Heading"] == 511.0).sum() == 0

    def test_heading_511_row_not_deleted(self, df_with_heading_511, minimal_df):
        """Row must be preserved; only Heading becomes NaN."""
        cleaner = make_cleaner()
        cleaned, report = cleaner.clean(df_with_heading_511)
        assert report["heading_511_normalised"] == 2
        assert len(cleaned) == len(minimal_df)

    def test_no_heading_511_zero_normalised(self, minimal_df):
        cleaner = make_cleaner()
        _, report = cleaner.clean(minimal_df)
        assert report["heading_511_normalised"] == 0


# ---------------------------------------------------------------------------
# 7. SOG flagging
# ---------------------------------------------------------------------------

class TestSOGFlagging:
    def test_impossible_sog_flagged(self, df_with_impossible_sog):
        cleaner = make_cleaner()
        cleaned, report = cleaner.clean(df_with_impossible_sog)
        assert report["impossible_sog_flagged"] == 2

    def test_impossible_sog_row_not_deleted(self, df_with_impossible_sog, minimal_df):
        cleaner = make_cleaner()
        cleaned, _ = cleaner.clean(df_with_impossible_sog)
        assert len(cleaned) == len(minimal_df)

    def test_sog_flag_column_added(self, df_with_impossible_sog):
        cleaner = make_cleaner()
        cleaned, _ = cleaner.clean(df_with_impossible_sog)
        assert "_sog_impossible" in cleaned.columns


# ---------------------------------------------------------------------------
# 8. Optional fields missing — rows must not be dropped
# ---------------------------------------------------------------------------

class TestOptionalFieldsMissing:
    def test_rows_preserved_when_optional_cols_absent(self, df_missing_optional_cols):
        cleaner = make_cleaner()
        cleaned, report = cleaner.clean(df_missing_optional_cols)
        assert len(cleaned) == len(df_missing_optional_cols)
        assert report["null_mmsi_removed"] == 0
        assert report["invalid_coordinate_rows_removed"] == 0


# ---------------------------------------------------------------------------
# 9. Sort order after cleaning
# ---------------------------------------------------------------------------

class TestSortOrder:
    def test_sorted_by_mmsi_then_time(self, minimal_df):
        # Shuffle the dataframe first
        shuffled = minimal_df.sample(frac=1, random_state=42).reset_index(drop=True)
        cleaner = make_cleaner()
        cleaned, _ = cleaner.clean(shuffled)
        for mmsi, grp in cleaned.groupby("MMSI"):
            times = grp["BaseDateTime"].tolist()
            assert times == sorted(times), f"MMSI {mmsi} not sorted by time"

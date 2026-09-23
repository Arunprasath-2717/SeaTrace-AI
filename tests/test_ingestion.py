"""
tests/test_ingestion.py
========================
Tests for src/ingestion.py — AIS CSV ingestion adapter.
"""

from __future__ import annotations

from io import StringIO
from pathlib import Path

import pandas as pd
import pytest



from ingestion import AISIngestionAdapter, ColumnValidationError, AISIngestionError
from models import CleaningConfig


# ---------------------------------------------------------------------------
# 1. CSV load
# ---------------------------------------------------------------------------

class TestCSVLoad:
    def test_load_returns_dataframe(self, sample_csv_path):
        adapter = AISIngestionAdapter()
        df, report = adapter.load_and_validate(sample_csv_path)
        assert isinstance(df, pd.DataFrame)
        assert len(df) > 0

    def test_missing_file_raises(self, tmp_path):
        adapter = AISIngestionAdapter()
        with pytest.raises(AISIngestionError, match="not found"):
            adapter.load_and_validate(tmp_path / "nonexistent.csv")

    def test_mmsi_is_string_after_load(self, sample_csv_path):
        """MMSI must never be cast to float/int."""
        adapter = AISIngestionAdapter()
        df, _ = adapter.load_and_validate(sample_csv_path)
        assert df["MMSI"].dtype == object, "MMSI should be string (object) dtype"
        # Ensure no trailing '.0' artefact
        assert not df["MMSI"].str.endswith(".0").any()

    def test_row_count_matches(self, sample_csv_path, minimal_df):
        adapter = AISIngestionAdapter()
        df, report = adapter.load_and_validate(sample_csv_path)
        assert report["row_count"] == len(minimal_df)

    def test_column_names_stripped(self, tmp_path):
        """Column names with leading/trailing spaces must be stripped."""
        csv_content = " MMSI , BaseDateTime , LAT , LON , SOG , COG \n123456789,2024-01-15T10:00:00,12.0,76.0,5.0,180.0\n"
        path = tmp_path / "spaces.csv"
        path.write_text(csv_content)
        adapter = AISIngestionAdapter()
        df, _ = adapter.load_and_validate(path)
        assert "MMSI" in df.columns
        assert " MMSI " not in df.columns


# ---------------------------------------------------------------------------
# 2. Column validation
# ---------------------------------------------------------------------------

class TestColumnValidation:
    def test_valid_columns_pass(self, sample_csv_path):
        adapter = AISIngestionAdapter()
        # Should not raise
        df, _ = adapter.load_and_validate(sample_csv_path)
        assert "MMSI" in df.columns

    def test_missing_required_column_raises(self, csv_missing_required_col):
        adapter = AISIngestionAdapter()
        with pytest.raises(ColumnValidationError, match="SOG"):
            adapter.load_and_validate(csv_missing_required_col)

    def test_all_required_columns_checked(self, tmp_path):
        """A CSV with only one column should mention ALL missing required columns."""
        csv_content = "MMSI\n123456789\n"
        path = tmp_path / "only_mmsi.csv"
        path.write_text(csv_content)
        adapter = AISIngestionAdapter()
        with pytest.raises(ColumnValidationError) as exc_info:
            adapter.load_and_validate(path)
        msg = str(exc_info.value)
        for col in ["BaseDateTime", "LAT", "LON", "SOG", "COG"]:
            assert col in msg


# ---------------------------------------------------------------------------
# 3. Timestamp parsing
# ---------------------------------------------------------------------------

class TestTimestampParsing:
    def test_timestamps_are_utc_aware(self, sample_csv_path):
        adapter = AISIngestionAdapter()
        df, _ = adapter.load_and_validate(sample_csv_path)
        assert df["BaseDateTime"].dtype == "datetime64[ns, UTC]"

    def test_nat_produced_for_bad_timestamps(self, tmp_path):
        csv_content = (
            "MMSI,BaseDateTime,LAT,LON,SOG,COG\n"
            "111111111,NOT_A_DATE,12.0,76.0,5.0,180.0\n"
            "222222222,2024-01-15T10:00:00,12.0,76.0,5.0,180.0\n"
        )
        path = tmp_path / "bad_ts.csv"
        path.write_text(csv_content)
        adapter = AISIngestionAdapter()
        df, _ = adapter.load_and_validate(path)
        nat_count = df["BaseDateTime"].isna().sum()
        assert nat_count == 1, f"Expected 1 NaT, got {nat_count}"


# ---------------------------------------------------------------------------
# 4. Numeric coercion
# ---------------------------------------------------------------------------

class TestNumericCoercion:
    def test_numeric_columns_are_float(self, sample_csv_path):
        adapter = AISIngestionAdapter()
        df, _ = adapter.load_and_validate(sample_csv_path)
        for col in ["LAT", "LON", "SOG", "COG"]:
            assert pd.api.types.is_float_dtype(df[col]), f"{col} should be float"

    def test_non_numeric_coerced_to_nan(self, tmp_path):
        csv_content = (
            "MMSI,BaseDateTime,LAT,LON,SOG,COG\n"
            "111111111,2024-01-15T10:00:00,BAD,76.0,5.0,180.0\n"
        )
        path = tmp_path / "bad_lat.csv"
        path.write_text(csv_content)
        adapter = AISIngestionAdapter()
        df, _ = adapter.load_and_validate(path)
        assert pd.isna(df.loc[0, "LAT"])


# ---------------------------------------------------------------------------
# 5. Raw report
# ---------------------------------------------------------------------------

class TestRawReport:
    def test_report_keys_present(self, sample_csv_path):
        adapter = AISIngestionAdapter()
        _, report = adapter.load_and_validate(sample_csv_path)
        for key in ["row_count", "column_count", "unique_mmsi",
                    "timestamp_range_start", "timestamp_range_end",
                    "missing_values_per_column"]:
            assert key in report, f"Missing key: {key}"

    def test_unique_mmsi_count(self, sample_csv_path):
        adapter = AISIngestionAdapter()
        _, report = adapter.load_and_validate(sample_csv_path)
        assert report["unique_mmsi"] == 2  # VESSEL_A and VESSEL_B

    def test_timestamp_range_populated(self, sample_csv_path):
        adapter = AISIngestionAdapter()
        _, report = adapter.load_and_validate(sample_csv_path)
        assert report["timestamp_range_start"] is not None
        assert report["timestamp_range_end"] is not None

    def test_missing_optional_fields_reported(self, sample_csv_path, minimal_df):
        """Optional fields missing in the data should appear in missing_values_per_column."""
        adapter = AISIngestionAdapter()
        _, report = adapter.load_and_validate(sample_csv_path)
        mv = report["missing_values_per_column"]
        # VESSEL_B has no IMO, CallSign etc in the fixture
        assert "IMO" in mv
        assert mv["IMO"] > 0

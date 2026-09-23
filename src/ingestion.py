"""
m5-ais-intelligence/src/ingestion.py
======================================
AIS CSV ingestion adapter for M5.

Responsibilities
----------------
* Read the AccessAIS CSV without modifying the source file.
* Validate that required columns are present (raise ColumnValidationError if not).
* Report row count, column count, unique MMSI, timestamp range, missing values.
* Parse BaseDateTime to UTC-aware timestamps where possible.
* Coerce numeric AIS fields; do NOT silently discard malformed data.
* Preserve MMSI as a string identifier (never float).

M5 does not determine vessel responsibility.
It produces cleaned AIS trajectories, candidate-related features,
and evidence for downstream attribution.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Dict, List, Tuple

import pandas as pd

from models import CleaningConfig

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Custom exceptions
# ---------------------------------------------------------------------------

class ColumnValidationError(ValueError):
    """Raised when required AIS columns are absent from the source CSV."""


class AISIngestionError(RuntimeError):
    """Raised for unrecoverable ingestion failures."""


# ---------------------------------------------------------------------------
# Ingestion adapter
# ---------------------------------------------------------------------------

class AISIngestionAdapter:
    """
    Reads and validates an AccessAIS-format CSV.

    Usage
    -----
    adapter = AISIngestionAdapter(config)
    df, raw_report = adapter.load_and_validate(csv_path)
    """

    def __init__(self, config: CleaningConfig | None = None) -> None:
        self.config = config or CleaningConfig()

    # ------------------------------------------------------------------
    # Public interface
    # ------------------------------------------------------------------

    def load_and_validate(
        self, csv_path: str | Path
    ) -> Tuple[pd.DataFrame, Dict]:
        """
        Full ingestion pipeline: read → validate columns → parse types → report.

        Returns
        -------
        df : pd.DataFrame
            Raw (pre-cleaning) dataframe with MMSI as str, timestamps parsed,
            and numeric fields coerced.
        raw_report : dict
            Summary statistics on the raw input.
        """
        csv_path = Path(csv_path)
        if not csv_path.exists():
            raise AISIngestionError(
                f"AIS CSV not found: {csv_path}\n"
                "Place the AccessAIS export at the expected path and retry."
            )

        logger.info("Loading AIS CSV: %s", csv_path)
        df = self._load_raw(csv_path)
        logger.info("Raw shape: %d rows x %d columns", *df.shape)

        self._validate_columns(df)
        df = self._coerce_mmsi(df)
        df = self._parse_timestamps(df)
        df = self._coerce_numerics(df)

        raw_report = self._generate_raw_report(df)
        self._log_raw_report(raw_report)

        return df, raw_report

    # ------------------------------------------------------------------
    # Internal steps
    # ------------------------------------------------------------------

    def _load_raw(self, csv_path: Path) -> pd.DataFrame:
        """Read CSV; keep all columns as-is; do not infer MMSI as int/float."""
        try:
            df = pd.read_csv(
                csv_path,
                dtype={"MMSI": str},   # preserve leading zeros and prevent float cast
                low_memory=False,
            )
        except Exception as exc:
            raise AISIngestionError(f"Failed to read CSV: {exc}") from exc

        # Strip whitespace from column names (common AccessAIS artefact)
        df.columns = [c.strip() for c in df.columns]
        return df

    def _validate_columns(self, df: pd.DataFrame) -> None:
        """Raise ColumnValidationError if any required column is missing."""
        missing = [c for c in self.config.required_columns if c not in df.columns]
        if missing:
            raise ColumnValidationError(
                f"Required AIS columns missing from CSV: {missing}\n"
                f"Found columns: {list(df.columns)}"
            )
        logger.info(
            "Column validation passed. Required columns present: %s",
            self.config.required_columns,
        )

    def _coerce_mmsi(self, df: pd.DataFrame) -> pd.DataFrame:
        """Ensure MMSI is stored as string, never float."""
        if "MMSI" in df.columns:
            df["MMSI"] = df["MMSI"].astype(str).str.strip()
            # Replace float artefacts like "123456789.0" with "123456789"
            df["MMSI"] = df["MMSI"].str.replace(r"\.0$", "", regex=True)
        return df

    def _parse_timestamps(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Convert BaseDateTime to pandas Timestamp (UTC-aware).

        If timezone information is absent in the CSV (typical for AccessAIS),
        we assume UTC and localise accordingly.  Rows with unparseable
        timestamps are kept but the field is set to NaT so they are visible
        in cleaning.
        """
        if "BaseDateTime" not in df.columns:
            return df

        original_count = len(df)
        try:
            df["BaseDateTime"] = pd.to_datetime(df["BaseDateTime"], errors="coerce", utc=True, format="ISO8601")
        except Exception:
            df["BaseDateTime"] = pd.to_datetime(df["BaseDateTime"], errors="coerce", utc=True)

        nat_count = df["BaseDateTime"].isna().sum()
        if nat_count:
            logger.warning(
                "%d of %d BaseDateTime values could not be parsed → set to NaT "
                "(they will be removed during cleaning).",
                nat_count,
                original_count,
            )
        else:
            logger.info("All %d BaseDateTime values parsed successfully.", original_count)

        return df

    def _coerce_numerics(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Convert numeric AIS fields to float.

        Uses errors='coerce' so that non-numeric strings become NaN rather
        than crashing the pipeline.  The original column is never silently
        overwritten with garbage — all conversions are logged.
        """
        numeric_cols = ["LAT", "LON", "SOG", "COG", "Heading",
                        "Length", "Width", "Draft"]
        for col in numeric_cols:
            if col not in df.columns:
                continue
            before_na = df[col].isna().sum()
            df[col] = pd.to_numeric(df[col], errors="coerce")
            after_na = df[col].isna().sum()
            new_na = after_na - before_na
            if new_na:
                logger.warning(
                    "Column '%s': %d non-numeric value(s) coerced to NaN.",
                    col, new_na,
                )
        return df

    # ------------------------------------------------------------------
    # Reporting
    # ------------------------------------------------------------------

    def _generate_raw_report(self, df: pd.DataFrame) -> Dict:
        """
        Return a dictionary of raw-input statistics.

        All values computed directly from the dataframe — nothing hardcoded.
        """
        mmsi_count = df["MMSI"].nunique() if "MMSI" in df.columns else None

        ts_min = ts_max = None
        if "BaseDateTime" in df.columns:
            valid_ts = df["BaseDateTime"].dropna()
            if not valid_ts.empty:
                ts_min = str(valid_ts.min())
                ts_max = str(valid_ts.max())

        missing_per_col: Dict[str, int] = {
            col: int(df[col].isna().sum())
            for col in df.columns
        }

        return {
            "row_count": int(len(df)),
            "column_count": int(len(df.columns)),
            "column_names": list(df.columns),
            "unique_mmsi": int(mmsi_count) if mmsi_count is not None else None,
            "timestamp_range_start": ts_min,
            "timestamp_range_end": ts_max,
            "missing_values_per_column": missing_per_col,
        }

    def _log_raw_report(self, report: Dict) -> None:
        logger.info("=== RAW AIS INGESTION REPORT ===")
        logger.info("  Rows            : %d", report["row_count"])
        logger.info("  Columns         : %d", report["column_count"])
        logger.info("  Unique MMSIs    : %s", report["unique_mmsi"])
        logger.info("  Timestamp range : %s -> %s",
                    report["timestamp_range_start"],
                    report["timestamp_range_end"])
        logger.info("  Missing values:")
        for col, n in report["missing_values_per_column"].items():
            if n:
                logger.info("    %-20s  %d missing", col, n)
        logger.info("=================================")

    # ------------------------------------------------------------------
    # Convenience helpers for tests / exploratory use
    # ------------------------------------------------------------------

    def inspect_csv(self, csv_path: str | Path) -> Dict:
        """
        Return column names and dtypes without full ingestion.
        Useful for verifying a new CSV before running the pipeline.
        """
        csv_path = Path(csv_path)
        df_head = pd.read_csv(csv_path, nrows=5, dtype={"MMSI": str})
        df_head.columns = [c.strip() for c in df_head.columns]
        return {
            "columns": list(df_head.columns),
            "dtypes": {c: str(t) for c, t in df_head.dtypes.items()},
            "sample_row": df_head.iloc[0].to_dict() if len(df_head) else {},
        }

"""
m5-ais-intelligence/src/cleaning.py
======================================
AIS data cleaning rules for M5.

Design principles
-----------------
* No silent data deletion — every removal is logged and counted.
* COG = 360  → NaN  (AIS spec: unavailable).  Row is KEPT.
* Heading = 511 → NaN (AIS spec: not available). Row is KEPT.
* Impossible SOG → flagged with a boolean column.  Row is KEPT.
* Rows are only removed for: null MMSI, invalid coordinates,
  exact duplicates, MMSI+timestamp duplicates, and unparseable
  BaseDateTime (NaT).
* Optional fields (IMO, CallSign, Status, Draft, Cargo …) may be missing;
  this is EXPECTED and never causes row removal.

M5 does not determine vessel responsibility.
It produces cleaned AIS trajectories, candidate-related features,
and evidence for downstream attribution.
"""

from __future__ import annotations

import logging
from typing import Dict, Tuple, cast

import numpy as np
import pandas as pd

from models import CleaningConfig

logger = logging.getLogger(__name__)


class AISCleaner:
    """
    Applies all M5 cleaning rules to a raw AIS DataFrame.

    Usage
    -----
    cleaner = AISCleaner(config)
    cleaned_df, cleaning_report = cleaner.clean(raw_df)
    """

    def __init__(self, config: CleaningConfig | None = None) -> None:
        self.config = config or CleaningConfig()

    # ------------------------------------------------------------------
    # Public interface
    # ------------------------------------------------------------------

    def clean(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict]:
        """
        Run the full cleaning pipeline in the correct order.

        Returns
        -------
        cleaned_df : pd.DataFrame
            Cleaned records.  Columns that have been normalised in-place
            (COG, Heading, SOG) retain their original column names.
        report : dict
            Counts of every cleaning action taken.
        """
        report: Dict = {}
        df = df.copy()

        # --- Step 1: Remove null MMSI ---
        df, report["null_mmsi_removed"] = self._remove_null_mmsi(df)

        # --- Step 2: Remove unparseable timestamps (NaT) ---
        df, report["unparseable_timestamp_removed"] = self._remove_nat_timestamps(df)

        # --- Step 3: Flag + remove invalid coordinates ---
        df = self._flag_invalid_coordinates(df)
        df, report["invalid_coordinate_rows_removed"] = self._remove_invalid_coordinates(df)

        # --- Step 4: Sort by MMSI then timestamp (ensures deterministic deduplication) ---
        df = self._sort_by_mmsi_time(df)

        # --- Step 5: Exact duplicate removal ---
        df, report["exact_duplicates_removed"] = self._remove_exact_duplicates(df)

        # --- Step 6: MMSI + timestamp duplicates ---
        df, report["mmsi_timestamp_duplicates_removed"] = self._remove_mmsi_timestamp_duplicates(df)

        # --- Step 7: Normalise COG = 360 → NaN (keep row) ---
        df, report["cog_360_normalised"] = self._normalise_cog(df)

        # --- Step 8: Normalise Heading = 511 → NaN (keep row) ---
        df, report["heading_511_normalised"] = self._normalise_heading(df)

        # --- Step 9: Flag impossible SOG (keep row) ---
        df, report["impossible_sog_flagged"] = self._flag_impossible_sog(df)

        # --- Summary ---
        report["output_row_count"] = int(len(df))
        report["output_unique_mmsi"] = int(df["MMSI"].nunique()) if "MMSI" in df.columns else 0

        logger.info("=== CLEANING REPORT ===")
        for key, val in report.items():
            logger.info("  %-45s %s", key, val)
        logger.info("=======================")

        return df, report

    # ------------------------------------------------------------------
    # Individual cleaning steps
    # ------------------------------------------------------------------

    def _remove_null_mmsi(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, int]:
        """
        Remove rows where MMSI is null or the string 'nan'/'None'.
        MMSI is the vessel identifier — without it the record is unusable.
        """
        null_mask = df["MMSI"].isna() | df["MMSI"].isin(["nan", "None", ""])
        count = int(null_mask.sum())
        if count:
            logger.warning("Removing %d rows with null/empty MMSI.", count)
            df = cast(pd.DataFrame, df[~null_mask]).reset_index(drop=True)
        else:
            logger.info("No null MMSI rows found.")
        return df, count

    def _remove_nat_timestamps(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, int]:
        """
        Remove rows where BaseDateTime could not be parsed (NaT).
        Without a valid timestamp the record cannot be placed in a trajectory.
        """
        if "BaseDateTime" not in df.columns:
            return df, 0
        nat_mask = df["BaseDateTime"].isna()
        count = int(nat_mask.sum())
        if count:
            logger.warning(
                "Removing %d rows with unparseable BaseDateTime (NaT).", count
            )
            df = cast(pd.DataFrame, df[~nat_mask]).reset_index(drop=True)
        else:
            logger.info("All BaseDateTime values are valid.")
        return df, count

    def _flag_invalid_coordinates(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Add boolean column '_coord_invalid' without removing any rows yet.
        Latitude must be in [-90, 90]; Longitude in [-180, 180].
        """
        lat_invalid = df["LAT"].isna() | ~df["LAT"].between(-90.0, 90.0)
        lon_invalid = df["LON"].isna() | ~df["LON"].between(-180.0, 180.0)
        df["_coord_invalid"] = lat_invalid | lon_invalid

        n_invalid = int(df["_coord_invalid"].sum())
        if n_invalid:
            logger.warning(
                "Flagged %d rows with invalid/missing coordinates "
                "(LAT not in [-90,90] or LON not in [-180,180]).",
                n_invalid,
            )
        else:
            logger.info("All coordinates are within valid ranges.")
        return df

    def _remove_invalid_coordinates(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, int]:
        """Remove previously flagged invalid-coordinate rows."""
        if "_coord_invalid" not in df.columns:
            return df, 0
        count = int(df["_coord_invalid"].sum())
        if count:
            logger.warning(
                "Removing %d rows with invalid coordinates from trajectory dataset.",
                count,
            )
            valid_df = cast(pd.DataFrame, df[~df["_coord_invalid"]])
            df = valid_df.drop(columns=["_coord_invalid"]).reset_index(drop=True)
        else:
            df = df.drop(columns=["_coord_invalid"])
        return df, count

    def _remove_exact_duplicates(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, int]:
        """
        Remove rows that are exact duplicates across ALL columns.
        Reports count before removing.
        """
        before = len(df)
        df = df.drop_duplicates().reset_index(drop=True)
        removed = before - len(df)
        if removed:
            logger.warning(
                "Removed %d exact duplicate rows (all columns identical).", removed
            )
        else:
            logger.info("No exact duplicate rows found.")
        return df, removed

    def _remove_mmsi_timestamp_duplicates(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, int]:
        """
        Remove rows where (MMSI, BaseDateTime) is duplicated.
        Keeps the first occurrence; logs which are removed.
        """
        if "BaseDateTime" not in df.columns:
            return df, 0
        before = len(df)
        df = df.drop_duplicates(subset=["MMSI", "BaseDateTime"], keep="first").reset_index(drop=True)
        removed = before - len(df)
        if removed:
            logger.warning(
                "Removed %d MMSI+timestamp duplicate rows (kept first occurrence).",
                removed,
            )
        else:
            logger.info("No MMSI+timestamp duplicate rows found.")
        return df, removed

    def _sort_by_mmsi_time(self, df: pd.DataFrame) -> pd.DataFrame:
        """Sort the dataframe by MMSI then BaseDateTime ascending."""
        sort_cols = []
        if "MMSI" in df.columns:
            sort_cols.append("MMSI")
        if "BaseDateTime" in df.columns:
            sort_cols.append("BaseDateTime")
        if sort_cols:
            df = df.sort_values(sort_cols).reset_index(drop=True)
            logger.info("Sorted by: %s", sort_cols)
        return df

    def _normalise_cog(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, int]:
        """
        AIS COG = 360 means 'course not available' (ITU-R M.1371).
        Replace with NaN so downstream code does not treat it as a valid course.
        The row is KEPT.
        """
        if "COG" not in df.columns:
            return df, 0
        mask = (df["COG"] == 360.0) | (df["COG"] == 360)
        count = int(mask.sum())
        if count:
            df.loc[mask, "COG"] = np.nan
            logger.info(
                "COG=360 (unavailable) replaced with NaN in %d records. "
                "Rows are preserved.",
                count,
            )
        else:
            logger.info("No COG=360 values found.")
        return df, count

    def _normalise_heading(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, int]:
        """
        AIS Heading = 511 means 'heading not available' (ITU-R M.1371).
        Replace with NaN. Row is KEPT.
        """
        if "Heading" not in df.columns:
            return df, 0
        mask = (df["Heading"] == 511.0) | (df["Heading"] == 511)
        count = int(mask.sum())
        if count:
            df.loc[mask, "Heading"] = np.nan
            logger.info(
                "Heading=511 (not available) replaced with NaN in %d records. "
                "Rows are preserved.",
                count,
            )
        else:
            logger.info("No Heading=511 values found.")
        return df, count

    def _flag_impossible_sog(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, int]:
        """
        Flag SOG values that are physically impossible.
        Criterion: SOG < 0  or  SOG > impossible_sog_max (default 102.3 knots).
        Adds boolean column '_sog_impossible'. Row is KEPT.
        """
        if "SOG" not in df.columns:
            return df, 0
        mask = (df["SOG"] < 0) | (df["SOG"] > self.config.impossible_sog_max)
        count = int(mask.sum())
        df["_sog_impossible"] = mask
        if count:
            logger.warning(
                "Flagged %d rows with impossible SOG (< 0 or > %.1f knots). "
                "Rows are preserved; flag column '_sog_impossible' added.",
                count,
                self.config.impossible_sog_max,
            )
        else:
            logger.info("All SOG values are within plausible range.")
        return df, count

    # ------------------------------------------------------------------
    # Public helpers (used in tests and reporting)
    # ------------------------------------------------------------------

    def missing_value_summary(self, df: pd.DataFrame) -> Dict[str, int]:
        """Return per-column missing value counts for the given dataframe."""
        return {col: int(df[col].isna().sum()) for col in df.columns}

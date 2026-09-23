"""
m5-ais-intelligence/src/gap_analysis.py
==========================================
AIS gap detection and classification for M5.

What this module does
---------------------
* Iterates over every pair of consecutive AIS records for the same vessel
  where gap_flag = True (time_delta > normal_gap_max_minutes).
* Records the kinematic state at the last-known position and the
  first-known position after the gap.
* Classifies each gap using configurable time thresholds.

What this module does NOT do
-----------------------------
* It does NOT label a vessel as a "dark ship".
* It does NOT evaluate whether a gap is behaviourally suspicious.
* It does NOT compute origin contours or time windows.
  That is M4's responsibility; M4 provides those outputs to M5 in a
  later phase for space-time AIS filtering.

Gap classes (purely temporal — no attribution implied)
------------------------------------------------------
NORMAL           : 0 < gap ≤ normal_gap_max_minutes      (e.g. ≤ 15 min)
SHORT_GAP        : normal_max < gap ≤ short_gap_max       (e.g. 15–60 min)
SIGNIFICANT_GAP  : short_max < gap ≤ significant_gap_max  (e.g. 1–6 h)
LONG_GAP         : gap > significant_gap_max              (e.g. > 6 h)

M5 does not determine vessel responsibility.
It produces cleaned AIS trajectories, candidate-related features,
and evidence for downstream attribution.
"""

from __future__ import annotations

import logging
from typing import Dict, List

import pandas as pd

from models import CleaningConfig, GapClass, GapRecord

logger = logging.getLogger(__name__)


class GapAnalyzer:
    """
    Detects and classifies AIS temporal gaps from a reconstructed trajectory.

    Usage
    -----
    analyzer = GapAnalyzer(config)
    gap_df = analyzer.detect_gaps(trajectory_df)
    summary = analyzer.gap_summary(gap_df)
    """

    def __init__(self, config: CleaningConfig | None = None) -> None:
        self.config = config or CleaningConfig()

    # ------------------------------------------------------------------
    # Public interface
    # ------------------------------------------------------------------

    def detect_gaps(self, trajectory_df: pd.DataFrame) -> pd.DataFrame:
        """
        Build a gap records DataFrame from the trajectory.

        Extracts every row where gap_flag = True and captures the kinematic
        context of the previous (last-known) and current (next-known) record.

        Returns a DataFrame with one row per gap event.
        """
        if trajectory_df.empty or "gap_flag" not in trajectory_df.columns:
            logger.warning(
                "detect_gaps() called on empty or trajectory-less dataframe. "
                "Ensure reconstruct() has been run first."
            )
            return pd.DataFrame()

        records: List[Dict] = []

        for mmsi, grp in trajectory_df.groupby("MMSI", sort=False):
            grp = grp.sort_values("BaseDateTime").reset_index(drop=True)
            gap_indices = grp.index[grp["gap_flag"]].tolist()

            for idx in gap_indices:
                if idx == 0:
                    # Defensive: first record cannot have a gap (delta is NaN)
                    continue
                prev_row = grp.iloc[idx - 1]
                curr_row = grp.iloc[idx]

                gap_minutes = float(curr_row["time_delta_seconds"]) / 60.0
                gap_cls = self.classify_gap(gap_minutes)

                records.append({
                    "mmsi": str(mmsi),
                    "prev_timestamp": str(prev_row["BaseDateTime"]),
                    "next_timestamp": str(curr_row["BaseDateTime"]),
                    "gap_duration_minutes": round(gap_minutes, 4),
                    "gap_duration_hours": round(gap_minutes / 60.0, 4),
                    "last_lat": self._safe_float(prev_row, "LAT"),
                    "last_lon": self._safe_float(prev_row, "LON"),
                    "last_sog": self._safe_float(prev_row, "SOG"),
                    "last_cog": self._safe_float(prev_row, "COG"),
                    "last_heading": self._safe_float(prev_row, "Heading"),
                    "next_lat": self._safe_float(curr_row, "LAT"),
                    "next_lon": self._safe_float(curr_row, "LON"),
                    "next_sog": self._safe_float(curr_row, "SOG"),
                    "prev_segment_id": int(prev_row.get("segment_id", 0)),
                    "next_segment_id": int(curr_row.get("segment_id", 0)),
                    "gap_class": gap_cls.value,
                })

        gap_df = pd.DataFrame(records)

        if gap_df.empty:
            logger.info("No gaps detected above the %.0f-minute threshold.",
                        self.config.normal_gap_max_minutes)
        else:
            logger.info(
                "Detected %d AIS gaps across %d vessels.",
                len(gap_df),
                gap_df["mmsi"].nunique(),
            )
            class_counts = gap_df["gap_class"].value_counts().to_dict()
            for cls, cnt in class_counts.items():
                logger.info("  %-20s : %d", cls, cnt)

        return gap_df

    def classify_gap(self, gap_duration_minutes: float) -> GapClass:
        """
        Classify a gap by duration.

        Thresholds are all sourced from CleaningConfig — never hardcoded here.
        """
        if gap_duration_minutes <= self.config.normal_gap_max_minutes:
            return GapClass.NORMAL
        if gap_duration_minutes <= self.config.short_gap_max_minutes:
            return GapClass.SHORT_GAP
        if gap_duration_minutes <= self.config.significant_gap_max_minutes:
            return GapClass.SIGNIFICANT_GAP
        return GapClass.LONG_GAP

    def gap_summary(self, gap_df: pd.DataFrame) -> Dict:
        """
        Aggregate statistics over all detected gaps.

        Returns a dict suitable for inclusion in the quality report.
        """
        if gap_df.empty:
            return {
                "total_gaps": 0,
                "gap_class_counts": {c.value: 0 for c in GapClass},
                "vessels_with_gaps": 0,
                "max_gap_minutes": None,
                "min_gap_minutes": None,
                "mean_gap_minutes": None,
                "median_gap_minutes": None,
            }

        class_counts = {c.value: 0 for c in GapClass}
        class_counts.update(gap_df["gap_class"].value_counts().to_dict())

        return {
            "total_gaps": int(len(gap_df)),
            "gap_class_counts": class_counts,
            "vessels_with_gaps": int(gap_df["mmsi"].nunique()),
            "max_gap_minutes": float(gap_df["gap_duration_minutes"].max()),
            "min_gap_minutes": float(gap_df["gap_duration_minutes"].min()),
            "mean_gap_minutes": float(gap_df["gap_duration_minutes"].mean()),
            "median_gap_minutes": float(gap_df["gap_duration_minutes"].median()),
        }

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _safe_float(row: pd.Series, col: str):
        """Return float value or None if column absent or NaN."""
        if col not in row.index:
            return None
        val = row[col]
        if bool(pd.isna(val)):
            return None
        return float(val)

"""
m5-ais-intelligence/src/trajectory.py
========================================
Vessel trajectory reconstruction for M5.

For each MMSI:
  1. Sort AIS records chronologically.
  2. Compute time_delta_seconds to the previous record of the same vessel.
  3. Set gap_flag = True when time_delta > normal_gap_max_minutes (default 15 min).
  4. Assign a monotonically increasing segment_id that resets at each gap,
     so discontinuities are explicitly represented — not interpolated over.

Interpolation across gaps is intentionally NOT performed in Phase 1.
The configurable max_gap_minutes parameter is reserved for a later phase.

M5 does not determine vessel responsibility.
It produces cleaned AIS trajectories, candidate-related features,
and evidence for downstream attribution.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional, cast

import numpy as np
import pandas as pd

from models import CleaningConfig

logger = logging.getLogger(__name__)


class TrajectoryReconstructor:
    """
    Reconstructs per-vessel trajectories from a cleaned AIS DataFrame.

    Usage
    -----
    reconstructor = TrajectoryReconstructor(config)
    trajectory_df = reconstructor.reconstruct(cleaned_df)
    """

    def __init__(self, config: CleaningConfig | None = None) -> None:
        self.config = config or CleaningConfig()

    # ------------------------------------------------------------------
    # Public interface
    # ------------------------------------------------------------------

    def reconstruct(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Add trajectory columns to the cleaned dataframe.

        Added columns
        -------------
        time_delta_seconds : float
            Seconds elapsed since the previous AIS record for the same vessel.
            NaN for the first record of each vessel.
        gap_flag : bool
            True when time_delta_seconds > normal_gap_max_minutes * 60.
        segment_id : int
            Integer starting at 0 for each vessel; incremented by 1 at every
            gap.  Records within the same segment are contiguous (no gap).
        """
        if df.empty:
            logger.warning("reconstruct() called on an empty dataframe.")
            return df

        logger.info(
            "Reconstructing trajectories for %d unique MMSIs ...",
            df["MMSI"].nunique(),
        )

        gap_threshold_seconds = self.config.normal_gap_max_minutes * 60.0

        # Work per-MMSI then re-assemble to avoid cross-vessel delta errors
        groups: List[pd.DataFrame] = []

        for mmsi, grp in df.groupby("MMSI", sort=False):
            grp = grp.sort_values("BaseDateTime").copy()
            grp = self._add_time_delta(grp)
            grp = self._add_gap_flag(grp, gap_threshold_seconds)
            grp = self._add_segment_id(grp)
            groups.append(grp)

        trajectory_df = pd.concat(groups, ignore_index=True)

        n_gaps = int(trajectory_df["gap_flag"].sum())
        n_vessels = int(trajectory_df["MMSI"].nunique())
        logger.info(
            "Trajectory reconstruction complete: %d vessels, %d gap transitions flagged "
            "(time_delta > %.0f min).",
            n_vessels,
            n_gaps,
            self.config.normal_gap_max_minutes,
        )

        return trajectory_df

    # ------------------------------------------------------------------
    # Per-group helpers
    # ------------------------------------------------------------------

    def _add_time_delta(self, grp: pd.DataFrame) -> pd.DataFrame:
        """
        Compute time difference in seconds between consecutive records.
        First record of each vessel → NaN.
        """
        grp["time_delta_seconds"] = (
            # pyrefly: ignore [no-matching-overload]
            grp["BaseDateTime"].diff().dt.total_seconds()
        )
        return grp

    def _add_gap_flag(
        self, grp: pd.DataFrame, gap_threshold_seconds: float
    ) -> pd.DataFrame:
        """
        Flag rows where time_delta_seconds exceeds the gap threshold.
        First record of each vessel is never flagged (time_delta is NaN).
        """
        grp["gap_flag"] = (
            grp["time_delta_seconds"].notna()
            & (grp["time_delta_seconds"] > gap_threshold_seconds)
        )
        return grp

    def _add_segment_id(self, grp: pd.DataFrame) -> pd.DataFrame:
        """
        Assign a segment_id within the vessel's trajectory.
        Increments at each gap_flag=True row.  First segment is 0.
        """
        grp["segment_id"] = grp["gap_flag"].cumsum().astype(int)
        return grp

    # ------------------------------------------------------------------
    # GeoJSON export helper (for later M4-driven filtering phases)
    # ------------------------------------------------------------------

    def to_geojson(
        self,
        trajectory_df: pd.DataFrame,
        mmsi: str,
        include_segments: bool = True,
    ) -> Dict[str, Any]:
        """
        Build a GeoJSON FeatureCollection for a single vessel.

        Each segment becomes a separate LineString Feature if include_segments=True,
        preserving gap discontinuities.  When include_segments=False, a single
        MultiLineString is returned.

        Suitable for direct serialisation via json.dumps().
        """
        vessel_df = trajectory_df[trajectory_df["MMSI"] == mmsi].copy()
        if vessel_df.empty:
            return {"type": "FeatureCollection", "features": []}

        features: List[Dict] = []

        if include_segments and "segment_id" in vessel_df.columns:
            for raw_seg_id, raw_seg_df in vessel_df.groupby("segment_id"):
                seg_df = cast(pd.DataFrame, raw_seg_df)
                seg_id = int(str(raw_seg_id))
                coords = list(zip(seg_df["LON"], seg_df["LAT"]))
                if len(coords) < 2:
                    # Single point — emit as Point Feature
                    feature: Dict = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": list(coords[0]),
                        },
                        "properties": {
                            "mmsi": mmsi,
                            "segment_id": seg_id,
                            "point_count": len(coords),
                        },
                    }
                else:
                    feature = {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [list(c) for c in coords],
                        },
                        "properties": {
                            "mmsi": mmsi,
                            "segment_id": seg_id,
                            "point_count": len(coords),
                            "start_time": str(seg_df["BaseDateTime"].iloc[0]),
                            "end_time": str(seg_df["BaseDateTime"].iloc[-1]),
                        },
                    }
                features.append(feature)
        else:
            coords = list(zip(vessel_df["LON"], vessel_df["LAT"]))
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [list(c) for c in coords],
                },
                "properties": {"mmsi": mmsi},
            })

        return {"type": "FeatureCollection", "features": features}

    # ------------------------------------------------------------------
    # Summary
    # ------------------------------------------------------------------

    def trajectory_summary(self, trajectory_df: pd.DataFrame) -> Dict:
        """Return aggregate statistics for the full trajectory dataset."""
        if trajectory_df.empty:
            return {}
        summary: Dict = {
            "total_records": int(len(trajectory_df)),
            "unique_mmsi": int(trajectory_df["MMSI"].nunique()),
        }
        if "segment_id" in trajectory_df.columns:
            # Segments per vessel
            max_segs = cast(pd.Series, trajectory_df.groupby("MMSI")["segment_id"].max())
            segs_per_vessel = max_segs + 1
            summary["total_segments"] = int(segs_per_vessel.sum())
            summary["mean_segments_per_vessel"] = float(segs_per_vessel.mean())
        if "gap_flag" in trajectory_df.columns:
            summary["total_gap_transitions"] = int(trajectory_df["gap_flag"].sum())
        return summary

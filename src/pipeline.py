"""
m5-ais-intelligence/src/pipeline.py
======================================
M5 AIS Intelligence pipeline orchestrator.

Orchestration order
-------------------
1.  Ingest CSV  →  validate columns  →  raw report
2.  Clean       →  cleaning report
3.  Reconstruct trajectories
4.  Analyse gaps
5.  Write outputs:
    • outputs/ais_cleaned.csv
    • outputs/ais_gap_records.csv
    • outputs/ais_quality_report.json
    • outputs/ais_quality_report.md

CLI usage
---------
    python src/pipeline.py --csv ../data/ais_data.csv --output outputs/

M5 does not determine vessel responsibility.
It produces cleaned AIS trajectories, candidate-related features,
and evidence for downstream attribution.
"""

from __future__ import annotations

import argparse
import dataclasses
import json
import logging
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Optional, Tuple

import pandas as pd

from cleaning import AISCleaner
from gap_analysis import GapAnalyzer
from ingestion import AISIngestionAdapter
from models import CleaningConfig, QualityReport
from trajectory import TrajectoryReconstructor

# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------

def _setup_logging(level: int = logging.INFO) -> None:
    logging.basicConfig(
        level=level,
        format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
        handlers=[logging.StreamHandler(sys.stdout)],
    )


# ---------------------------------------------------------------------------
# Pipeline class
# ---------------------------------------------------------------------------

class M5Pipeline:
    """
    Orchestrates the full M5 Phase 1 pipeline.

    Parameters
    ----------
    config : CleaningConfig, optional
        Override any threshold.  Defaults to CleaningConfig() defaults.
    """

    def __init__(self, config: Optional[CleaningConfig] = None) -> None:
        self.config = config or CleaningConfig()
        self.adapter = AISIngestionAdapter(self.config)
        self.cleaner = AISCleaner(self.config)
        self.reconstructor = TrajectoryReconstructor(self.config)
        self.analyzer = GapAnalyzer(self.config)
        self.logger = logging.getLogger(self.__class__.__name__)

    # ------------------------------------------------------------------
    # Main run
    # ------------------------------------------------------------------

    def run(
        self,
        csv_path: str | Path,
        output_dir: str | Path,
    ) -> QualityReport:
        """
        Execute the full pipeline and write all output files.

        Returns the populated QualityReport.
        """
        csv_path = Path(csv_path)
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        report = QualityReport()
        report.cleaning_config = dataclasses.asdict(self.config)

        # ---- Step 1: Ingest ----
        self.logger.info("-- STEP 1: Ingestion ------------------------------")
        raw_df, raw_report = self.adapter.load_and_validate(csv_path)

        report.input_row_count = raw_report["row_count"]
        report.input_column_count = raw_report["column_count"]
        report.unique_mmsi_input = raw_report["unique_mmsi"] or 0
        report.timestamp_range_start = raw_report["timestamp_range_start"] or ""
        report.timestamp_range_end = raw_report["timestamp_range_end"] or ""

        # ---- Step 2: Clean ----
        self.logger.info("-- STEP 2: Cleaning -------------------------------")
        cleaned_df, cleaning_report = self.cleaner.clean(raw_df)

        report.null_mmsi_removed = cleaning_report.get("null_mmsi_removed", 0)
        report.invalid_coordinate_count = cleaning_report.get("invalid_coordinate_rows_removed", 0)
        report.exact_duplicates_removed = cleaning_report.get("exact_duplicates_removed", 0)
        report.mmsi_timestamp_duplicates_removed = cleaning_report.get("mmsi_timestamp_duplicates_removed", 0)
        report.cog_360_normalised = cleaning_report.get("cog_360_normalised", 0)
        report.heading_511_normalised = cleaning_report.get("heading_511_normalised", 0)
        report.impossible_sog_flagged = cleaning_report.get("impossible_sog_flagged", 0)
        report.output_row_count = cleaning_report.get("output_row_count", len(cleaned_df))
        report.missing_value_summary = self.cleaner.missing_value_summary(cleaned_df)

        # ---- Step 3: Trajectory reconstruction ----
        self.logger.info("-- STEP 3: Trajectory Reconstruction --------------")
        trajectory_df = self.reconstructor.reconstruct(cleaned_df)
        report.output_unique_mmsi = int(trajectory_df["MMSI"].nunique())

        # ---- Step 4: Gap analysis ----
        self.logger.info("-- STEP 4: Gap Analysis ---------------------------")
        gap_df = self.analyzer.detect_gaps(trajectory_df)
        gap_stats = self.analyzer.gap_summary(gap_df)

        report.total_gaps_detected = gap_stats.get("total_gaps", 0)
        report.gap_class_counts = gap_stats.get("gap_class_counts", {})
        report.max_gap_minutes = gap_stats.get("max_gap_minutes") or 0.0
        report.mean_gap_minutes = gap_stats.get("mean_gap_minutes") or 0.0

        # ---- Step 5: Write outputs ----
        self.logger.info("-- STEP 5: Writing Outputs ------------------------")
        self._write_cleaned_csv(trajectory_df, output_dir)
        self._write_gap_csv(gap_df, output_dir)
        self._write_json_report(report, output_dir)
        self._write_markdown_report(report, raw_report, gap_stats, output_dir)

        self.logger.info("-- M5 PIPELINE COMPLETE ---------------------------")
        self._print_summary(report)

        return report

    # ------------------------------------------------------------------
    # Output writers
    # ------------------------------------------------------------------

    def _write_cleaned_csv(self, trajectory_df: pd.DataFrame, output_dir: Path) -> None:
        path = output_dir / "ais_cleaned.csv"
        trajectory_df.to_csv(path, index=False)
        self.logger.info("Wrote cleaned AIS records -> %s  (%d rows)", path, len(trajectory_df))

    def _write_gap_csv(self, gap_df: pd.DataFrame, output_dir: Path) -> None:
        path = output_dir / "ais_gap_records.csv"
        if gap_df.empty:
            pd.DataFrame().to_csv(path, index=False)
            self.logger.info("No gaps detected; wrote empty -> %s", path)
        else:
            gap_df.to_csv(path, index=False)
            self.logger.info("Wrote gap records -> %s  (%d gaps)", path, len(gap_df))

    def _write_json_report(self, report: QualityReport, output_dir: Path) -> None:
        path = output_dir / "ais_quality_report.json"
        data = dataclasses.asdict(report)
        data["generated_at"] = datetime.now(tz=timezone.utc).isoformat()
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
        self.logger.info("Wrote quality report (JSON) -> %s", path)

    def _write_markdown_report(
        self,
        report: QualityReport,
        raw_report: Dict,
        gap_stats: Dict,
        output_dir: Path,
    ) -> None:
        path = output_dir / "ais_quality_report.md"
        lines = [
            "# M5 AIS Quality Report",
            f"\n_Generated: {datetime.now(tz=timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}_",
            "\n---\n",
            "## Input Statistics",
            f"| Field | Value |",
            f"|---|---|",
            f"| Input rows | {report.input_row_count:,} |",
            f"| Columns | {report.input_column_count} |",
            f"| Unique MMSIs (input) | {report.unique_mmsi_input:,} |",
            f"| Timestamp start | {report.timestamp_range_start} |",
            f"| Timestamp end | {report.timestamp_range_end} |",
            "\n## Cleaning Actions",
            "| Action | Count |",
            "|---|---|",
            f"| Null MMSI removed | {report.null_mmsi_removed} |",
            f"| Invalid coordinate rows removed | {report.invalid_coordinate_count} |",
            f"| Exact duplicate rows removed | {report.exact_duplicates_removed} |",
            f"| MMSI+timestamp duplicate rows removed | {report.mmsi_timestamp_duplicates_removed} |",
            f"| COG=360 -> NaN (rows kept) | {report.cog_360_normalised} |",
            f"| Heading=511 -> NaN (rows kept) | {report.heading_511_normalised} |",
            f"| Impossible SOG flagged (rows kept) | {report.impossible_sog_flagged} |",
            "\n## Output Statistics",
            "| Field | Value |",
            "|---|---|",
            f"| Output rows | {report.output_row_count:,} |",
            f"| Unique MMSIs (output) | {report.output_unique_mmsi:,} |",
            f"| Rows removed total | {report.input_row_count - report.output_row_count:,} |",
            "\n## Missing Values (Cleaned Dataset)",
            "| Column | Missing Count |",
            "|---|---|",
        ]
        for col, n in sorted(report.missing_value_summary.items(), key=lambda x: -x[1]):
            if n > 0:
                lines.append(f"| {col} | {n:,} |")

        lines += [
            "\n## AIS Gap Analysis",
            f"_(Gap threshold: >{self.config.normal_gap_max_minutes:.0f} min)_",
            "",
            "| Metric | Value |",
            "|---|---|",
            f"| Total gaps detected | {gap_stats.get('total_gaps', 0):,} |",
            f"| Vessels with at least one gap | {gap_stats.get('vessels_with_gaps', 0)} |",
            f"| Max gap (minutes) | {gap_stats.get('max_gap_minutes', 'N/A')} |",
            f"| Mean gap (minutes) | {round(gap_stats['mean_gap_minutes'], 1) if gap_stats.get('mean_gap_minutes') else 'N/A'} |",
            f"| Median gap (minutes) | {round(gap_stats['median_gap_minutes'], 1) if gap_stats.get('median_gap_minutes') else 'N/A'} |",
            "",
            "### Gap Class Distribution",
            "| Gap Class | Count |",
            "|---|---|",
        ]
        for cls, cnt in (gap_stats.get("gap_class_counts") or {}).items():
            lines.append(f"| {cls} | {cnt:,} |")

        lines += [
            "\n## Configuration",
            "| Parameter | Value |",
            "|---|---|",
        ]
        for k, v in dataclasses.asdict(self.config).items():
            if not isinstance(v, list):
                lines.append(f"| {k} | {v} |")

        lines += [
            "\n---",
            "\n> **Note**: M5 does not determine vessel responsibility.",
            "> It produces cleaned AIS trajectories, candidate-related features,",
            "> and evidence for downstream attribution.",
            "> Gap classification is purely temporal — no behavioural inference is made here.",
        ]

        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
        self.logger.info("Wrote quality report (Markdown) -> %s", path)

    # ------------------------------------------------------------------
    # Console summary
    # ------------------------------------------------------------------

    def _print_summary(self, report: QualityReport) -> None:
        removed = report.input_row_count - report.output_row_count
        self.logger.info("")
        self.logger.info("+------------------------------------------+")
        self.logger.info("|         M5 PIPELINE SUMMARY              |")
        self.logger.info("+------------------------------------------+")
        self.logger.info("|  Input rows         : %-18d|", report.input_row_count)
        self.logger.info("|  Output rows        : %-18d|", report.output_row_count)
        self.logger.info("|  Rows removed       : %-18d|", removed)
        self.logger.info("|  Unique MMSIs       : %-18d|", report.output_unique_mmsi)
        self.logger.info("|  COG=360 -> NaN     : %-18d|", report.cog_360_normalised)
        self.logger.info("|  Heading=511 -> NaN : %-18d|", report.heading_511_normalised)
        self.logger.info("|  AIS gaps detected  : %-18d|", report.total_gaps_detected)
        self.logger.info("+------------------------------------------+")


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def _build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="M5 AIS Intelligence Pipeline — Phase 1",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--csv",
        type=str,
        default=str(Path(__file__).parent.parent.parent / "data" / "ais_data.csv"),
        help="Path to the AccessAIS CSV file.",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=str(Path(__file__).parent.parent / "outputs"),
        help="Output directory for cleaned CSV, gap records, and quality report.",
    )
    parser.add_argument(
        "--normal-gap-max", type=float, default=15.0,
        help="Gap flag threshold in minutes (gaps > this are detected).",
    )
    parser.add_argument(
        "--short-gap-max", type=float, default=60.0,
        help="Upper bound for SHORT_GAP classification (minutes).",
    )
    parser.add_argument(
        "--significant-gap-max", type=float, default=360.0,
        help="Upper bound for SIGNIFICANT_GAP classification (minutes).",
    )
    parser.add_argument(
        "--max-gap-interp", type=float, default=60.0,
        help="(Reserved for future interpolation) Max gap in minutes to interpolate across.",
    )
    parser.add_argument(
        "--debug", action="store_true", help="Enable DEBUG-level logging."
    )
    return parser


def main() -> None:
    parser = _build_arg_parser()
    args = parser.parse_args()

    _setup_logging(logging.DEBUG if args.debug else logging.INFO)

    config = CleaningConfig(
        normal_gap_max_minutes=args.normal_gap_max,
        short_gap_max_minutes=args.short_gap_max,
        significant_gap_max_minutes=args.significant_gap_max,
        max_gap_minutes=args.max_gap_interp,
    )

    pipeline = M5Pipeline(config)
    pipeline.run(csv_path=args.csv, output_dir=args.output)


if __name__ == "__main__":
    main()

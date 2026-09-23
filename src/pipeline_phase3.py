"""
pipeline_phase3.py
==================
M5 Phase 3 — Candidate Feature Extraction Pipeline Orchestrator.

Reads Phase 1 and Phase 2 outputs.  Writes Phase 3 outputs exclusively to
outputs/phase3/.  Does NOT modify Phase 1 or Phase 2 outputs.

SCOPE STATEMENT
---------------
Phase 3 provides descriptive AIS evidence and candidate feature vectors.
It does NOT determine vessel responsibility or perform final attribution.
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import sys
from dataclasses import asdict
from typing import Any, Dict, List

import pandas as pd

# Allow direct execution from the m5-ais-intelligence root directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from candidate_features import extract_candidate_features
from feature_models import Phase3Config, Phase3Report
from gap_evidence import extract_gap_evidence
from space_time_filter import load_m4_fixture

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger("Phase3Pipeline")


def _df_to_md_table(df: pd.DataFrame, cols: List[str]) -> str:
    """Render a subset of a DataFrame as a Markdown pipe table (no tabulate needed)."""
    avail = [c for c in cols if c in df.columns]
    if not avail or df.empty:
        return "_No data._"
    sub = df[avail].fillna("").astype(str)
    # header row
    header = "| " + " | ".join(avail) + " |"
    sep = "| " + " | ".join(["---"] * len(avail)) + " |"
    rows = ["| " + " | ".join(row) + " |" for row in sub.itertuples(index=False, name=None)]
    return "\n".join([header, sep] + rows)


# ---------------------------------------------------------------------------
# Markdown report writer
# ---------------------------------------------------------------------------

def _write_markdown_report(
    path: str,
    report: Phase3Report,
    features_df: pd.DataFrame,
    gap_df: pd.DataFrame,
) -> None:
    """Write a human-readable Markdown feature report."""
    lines: List[str] = []
    lines.append("# M5 Phase 3 — Candidate Feature Extraction Report\n")
    lines.append(
        "> **Scope statement**: Phase 3 provides descriptive AIS evidence and "
        "candidate feature vectors. It does NOT determine vessel responsibility "
        "or perform final attribution.\n"
    )
    lines.append(f"- **Incident ID**: `{report.incident_id}`")
    lines.append(f"- **Fixture Source**: `{report.fixture_source}`")
    lines.append(f"- **Candidate Vessels**: `{report.candidate_count}`\n")

    lines.append("## 1. Candidate Trajectory Measurements\n")
    if not features_df.empty:
        traj_cols = [
            "mmsi", "observation_count", "observation_count_50_percent",
            "observation_count_90_percent", "first_candidate_timestamp",
            "last_candidate_timestamp", "track_duration_seconds",
            "segment_count", "min_distance_to_origin", "mean_distance_to_origin",
        ]
        lines.append(_df_to_md_table(features_df, traj_cols))
    else:
        lines.append("_No candidate feature data._")
    lines.append("")

    lines.append("## 2. Dwell Measurements\n")
    if not features_df.empty:
        dwell_cols = ["mmsi", "dwell_duration_seconds", "dwell_observation_count",
                      "stationary_observation_count", "stationary_fraction"]
        lines.append(_df_to_md_table(features_df, dwell_cols))
    lines.append("")

    lines.append("## 3. Speed Measurements\n")
    if not features_df.empty:
        spd_cols = ["mmsi", "min_sog", "max_sog", "mean_sog", "median_sog",
                    "sog_stddev", "speed_change_count", "speed_change_rate"]
        lines.append(_df_to_md_table(features_df, spd_cols))
    lines.append("")

    lines.append("## 4. Heading / COG Measurements\n")
    if not features_df.empty:
        hdg_cols = ["mmsi", "heading_change_count", "total_heading_change_degrees",
                    "mean_heading_change_degrees", "max_heading_change_degrees",
                    "cog_available_fraction", "heading_available_fraction"]
        lines.append(_df_to_md_table(features_df, hdg_cols))
    lines.append("")

    lines.append("## 5. Vessel Metadata\n")
    if not features_df.empty:
        meta_cols = ["mmsi", "vessel_type", "navigation_status", "imo", "draft", "cargo"]
        lines.append(_df_to_md_table(features_df, meta_cols))
    lines.append("")

    lines.append("## 6. AIS Gap Evidence\n")
    lines.append(
        "> **Note**: AIS transmission gaps are data-quality observations only. "
        "A gap overlapping the spill origin window is contextual evidence "
        "requiring further investigation, **NOT proof of wrongdoing**.\n"
    )
    if not gap_df.empty:
        gap_cols = ["mmsi", "gap_class", "gap_duration_seconds",
                    "overlaps_origin_window", "observed_gap_displacement_m",
                    "expected_displacement_m", "displacement_difference_m",
                    "displacement_quality"]
        lines.append(_df_to_md_table(gap_df.head(20), gap_cols))
        if len(gap_df) > 20:
            lines.append(f"\n_… and {len(gap_df) - 20} more gap evidence records (see candidate_gap_evidence.csv)_")
    else:
        lines.append("_No gap evidence records._")
    lines.append("")

    lines.append("## 7. Missing-Data Limitations\n")
    lines.append(f"- **Missing SOG observations**: {report.missing_sog_count}")
    lines.append(f"- **Missing COG observations**: {report.missing_cog_count}")
    lines.append(f"- **Missing Heading observations**: {report.missing_heading_count}")
    lines.append(f"- **Missing VesselType**: {report.missing_vessel_type_count} candidates")
    lines.append(f"- **Missing IMO**: {report.missing_imo_count} candidates")
    lines.append("")
    lines.append(
        "_Where data is absent, the corresponding feature is reported as null. "
        "No values have been fabricated or imputed._\n"
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------

def run_phase3_pipeline(
    fixture_path: str,
    candidate_obs_path: str,
    gap_records_path: str,
    output_dir: str,
    cfg: Phase3Config | None = None,
) -> Dict[str, Any]:
    """Execute M5 Phase 3 candidate feature extraction.

    Args:
        fixture_path: Path to M4 origin fixture JSON.
        candidate_obs_path: Phase 2 candidate_observations.csv.
        gap_records_path: Phase 1 ais_gap_records.csv.
        output_dir: Directory for Phase 3 output files.
        cfg: Optional Phase3Config; defaults used if None.

    Returns:
        Feature report dictionary.
    """
    if cfg is None:
        cfg = Phase3Config()

    os.makedirs(output_dir, exist_ok=True)
    logger.info("=== STARTING M5 PHASE 3 CANDIDATE FEATURE EXTRACTION ===")

    # 1. Load M4 fixture
    fixture = load_m4_fixture(fixture_path)
    logger.info("Incident: %s | Source: %s", fixture.incident_id, fixture.source)
    origin_start = fixture.origin_time_start_utc
    origin_end = fixture.origin_time_end_utc

    # 2. Load Phase 2 candidate observations
    logger.info("Loading Phase 2 candidate observations: %s", candidate_obs_path)
    cand_obs_df = pd.read_csv(candidate_obs_path)

    # 3. Load Phase 1 gap records
    logger.info("Loading Phase 1 gap records: %s", gap_records_path)
    gap_records_df = pd.read_csv(gap_records_path)

    # 4. Extract candidate features
    features_df = extract_candidate_features(
        cand_obs_df,
        fixture.origin_50_contour,
        fixture.origin_90_contour,
        cfg,
    )

    # 5. Extract gap evidence for all candidate MMSIs
    candidate_mmsis: List[str] = []
    if not features_df.empty:
        candidate_mmsis = features_df["mmsi"].astype(str).tolist()

    gap_evidence_df = extract_gap_evidence(
        candidate_mmsis, gap_records_df, origin_start, origin_end, cfg
    )

    # 6. Write outputs
    feat_csv = os.path.join(output_dir, "candidate_features.csv")
    gap_csv = os.path.join(output_dir, "candidate_gap_evidence.csv")
    json_path = os.path.join(output_dir, "feature_report.json")
    md_path = os.path.join(output_dir, "feature_report.md")

    features_df.to_csv(feat_csv, index=False)
    gap_evidence_df.to_csv(gap_csv, index=False)

    # 7. Compute missing-data statistics
    def _count_null(col: str, df: pd.DataFrame) -> int:
        return int(df[col].isna().sum()) if col in df.columns else 0

    missing_sog = _count_null("SOG", cand_obs_df)
    missing_cog = _count_null("COG", cand_obs_df)
    missing_hdg = _count_null("Heading", cand_obs_df)
    missing_vtype = _count_null("vessel_type", features_df)
    missing_imo = _count_null("imo", features_df)

    gaps_overlap = int(gap_evidence_df["overlaps_origin_window"].sum()) if not gap_evidence_df.empty else 0

    report = Phase3Report(
        incident_id=fixture.incident_id,
        fixture_source=fixture.source,
        candidate_count=len(features_df),
        feature_row_count=len(features_df),
        gap_evidence_row_count=len(gap_evidence_df),
        gaps_overlapping_window=gaps_overlap,
        missing_sog_count=missing_sog,
        missing_cog_count=missing_cog,
        missing_heading_count=missing_hdg,
        missing_vessel_type_count=missing_vtype,
        missing_imo_count=missing_imo,
        config=asdict(cfg),
        output_paths=[feat_csv, gap_csv, json_path, md_path],
    )

    report_dict = report.to_dict()
    report_dict["feature_definitions"] = {
        "distance_to_origin_50m": "Minimum Haversine distance (metres) to 50% contour centroid",
        "distance_to_origin_90m": "Minimum Haversine distance (metres) to 90% contour centroid",
        "min_distance_to_origin": "Minimum of the two contour distances",
        "mean_distance_to_origin": "Mean distance to 50% centroid across all candidate observations",
        "track_duration_seconds": "Elapsed seconds from first to last candidate observation",
        "dwell_duration_seconds": "Sum of observation time-deltas within origin region (seconds)",
        "stationary_fraction": "Fraction of observations where SOG < stationary_speed_threshold",
        "heading_change_count": "Count of consecutive COG changes >= heading_change_threshold",
        "displacement_difference_m": "Observed minus expected displacement (metres); sign and magnitude only — not an anomaly score",
    }

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(report_dict, f, indent=2, default=str)

    _write_markdown_report(md_path, report, features_df, gap_evidence_df)

    logger.info("Wrote candidate features     -> %s (%d rows)", feat_csv, len(features_df))
    logger.info("Wrote gap evidence           -> %s (%d rows)", gap_csv, len(gap_evidence_df))
    logger.info("Wrote JSON report            -> %s", json_path)
    logger.info("Wrote Markdown report        -> %s", md_path)

    print("\n+--------------------------------------------------+")
    print("|          M5 PHASE 3 FEATURE EXTRACTION           |")
    print("+--------------------------------------------------+")
    print(f"|  Candidate vessels         : {len(features_df):<19}|")
    print(f"|  Feature rows              : {len(features_df):<19}|")
    print(f"|  Gap evidence rows         : {len(gap_evidence_df):<19}|")
    print(f"|  Gaps overlapping window   : {gaps_overlap:<19}|")
    print("+--------------------------------------------------+\n")

    return report_dict


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    """CLI entry point for Phase 3 pipeline."""
    parser = argparse.ArgumentParser(
        description="M5 Phase 3 — Candidate Feature Extraction"
    )
    parser.add_argument("--fixture", default="data/m4_origin_fixture.json")
    parser.add_argument("--candidate-obs", default="outputs/phase2/candidate_observations.csv")
    parser.add_argument("--gaps-csv", default="outputs/ais_gap_records.csv")
    parser.add_argument("--output-dir", default="outputs/phase3/")
    parser.add_argument("--stationary-threshold", type=float, default=0.5)
    parser.add_argument("--heading-threshold", type=float, default=5.0)
    parser.add_argument("--speed-change-threshold", type=float, default=1.0)
    args = parser.parse_args()

    cfg = Phase3Config(
        stationary_speed_threshold_knots=args.stationary_threshold,
        heading_change_threshold_degrees=args.heading_threshold,
        speed_change_threshold_knots=args.speed_change_threshold,
    )

    run_phase3_pipeline(
        fixture_path=args.fixture,
        candidate_obs_path=args.candidate_obs,
        gap_records_path=args.gaps_csv,
        output_dir=args.output_dir,
        cfg=cfg,
    )


if __name__ == "__main__":
    main()

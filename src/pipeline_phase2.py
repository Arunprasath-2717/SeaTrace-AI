"""M5 Phase 2 — Space-Time Candidate Filtering Pipeline Orchestrator."""

import argparse
import json
import logging
import os
import sys
from typing import Any, Dict

import pandas as pd

# Add src to sys.path for direct execution
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from space_time_filter import (
    aggregate_candidate_vessels,
    compute_space_time_funnel,
    detect_gap_overlaps,
    filter_space_time,
    load_m4_fixture,
)
from space_time_models import M4Fixture, ObservationMatchStatus

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger("Phase2Pipeline")


def run_phase2_pipeline(
    fixture_path: str,
    cleaned_csv_path: str,
    gaps_csv_path: str,
    output_dir: str,
) -> Dict[str, Any]:
    """Execute M5 Phase 2 space-time filtering pipeline.

    Args:
        fixture_path: Path to M4 origin fixture JSON.
        cleaned_csv_path: Path to Phase 1 outputs/ais_cleaned.csv.
        gaps_csv_path: Path to Phase 1 outputs/ais_gap_records.csv.
        output_dir: Directory to store Phase 2 outputs (outputs/phase2/).

    Returns:
        Dict of execution summary and funnel metrics.
    """
    os.makedirs(output_dir, exist_ok=True)
    logger.info("=== STARTING M5 PHASE 2 SPACE-TIME FILTERING ===")

    # 1. Load M4 Fixture
    fixture = load_m4_fixture(fixture_path)
    logger.info("Incident ID: %s | Source: %s", fixture.incident_id, fixture.source)
    logger.info(
        "Spill Window (UTC): %s -> %s",
        fixture.origin_time_start_utc.isoformat(),
        fixture.origin_time_end_utc.isoformat(),
    )

    # 2. Load Phase 1 Data
    logger.info("Loading Phase 1 cleaned records: %s", cleaned_csv_path)
    df_cleaned = pd.read_csv(cleaned_csv_path)
    logger.info("Loading Phase 1 gap records: %s", gaps_csv_path)
    df_gaps = pd.read_csv(gaps_csv_path) if os.path.exists(gaps_csv_path) else pd.DataFrame()

    # 3. Filter Observations
    df_filtered = filter_space_time(df_cleaned, fixture)

    # Filter matched candidate observations
    candidate_obs_df = df_filtered[
        df_filtered["match_status"].isin(
            [
                ObservationMatchStatus.MATCH_50_PERCENT.value,
                ObservationMatchStatus.MATCH_90_PERCENT.value,
            ]
        )
    ].copy()

    # 4. Aggregate Candidate Vessels
    candidate_vessels_df = aggregate_candidate_vessels(df_filtered)

    # 5. Detect AIS Gap Overlaps
    gap_candidates_df = detect_gap_overlaps(df_gaps, fixture)

    # 6. Compute Progression Funnel
    funnel = compute_space_time_funnel(
        df_cleaned, df_filtered, candidate_vessels_df, gap_candidates_df
    )

    # 7. Write Outputs
    obs_out_path = os.path.join(output_dir, "candidate_observations.csv")
    vessels_out_path = os.path.join(output_dir, "candidate_vessels.csv")
    gaps_out_path = os.path.join(output_dir, "gap_overlap_candidates.csv")
    json_out_path = os.path.join(output_dir, "space_time_report.json")
    md_out_path = os.path.join(output_dir, "space_time_report.md")

    candidate_obs_df.to_csv(obs_out_path, index=False)
    candidate_vessels_df.to_csv(vessels_out_path, index=False)
    gap_candidates_df.to_csv(gaps_out_path, index=False)

    report_dict = {
        "incident_id": fixture.incident_id,
        "fixture_source": fixture.source,
        "not_real_m4_output": fixture.not_real_m4_output,
        "origin_time_start_utc": fixture.origin_time_start_utc.isoformat(),
        "origin_time_end_utc": fixture.origin_time_end_utc.isoformat(),
        "funnel_metrics": funnel.to_dict(),
        "candidate_vessels": candidate_vessels_df.to_dict(orient="records"),
        "gap_overlap_candidates": gap_candidates_df.to_dict(orient="records"),
    }

    with open(json_out_path, "w", encoding="utf-8") as f:
        json.dump(report_dict, f, indent=2, default=str)

    _write_markdown_report(md_out_path, fixture, funnel, candidate_vessels_df, gap_candidates_df)

    logger.info("Wrote candidate observations -> %s (%d rows)", obs_out_path, len(candidate_obs_df))
    logger.info("Wrote candidate vessels      -> %s (%d vessels)", vessels_out_path, len(candidate_vessels_df))
    logger.info("Wrote gap overlap candidates -> %s (%d gaps)", gaps_out_path, len(gap_candidates_df))
    logger.info("Wrote JSON report           -> %s", json_out_path)
    logger.info("Wrote Markdown report       -> %s", md_out_path)

    _print_summary_box(funnel, candidate_vessels_df, gap_candidates_df)
    return report_dict


def _write_markdown_report(
    path: str,
    fixture: M4Fixture,
    funnel: Any,
    vessels_df: pd.DataFrame,
    gaps_df: pd.DataFrame,
) -> None:
    """Generate Markdown report for Phase 2 results."""
    md = []
    md.append("# M5 Phase 2 — Space-Time Candidate Filtering Report\n")
    md.append(f"- **Incident ID**: `{fixture.incident_id}`")
    md.append(f"- **Fixture Source**: `{fixture.source}` (Not Real M4 Output: `{fixture.not_real_m4_output}`)")
    md.append(f"- **Origin Window (UTC)**: `{fixture.origin_time_start_utc.isoformat()}` to `{fixture.origin_time_end_utc.isoformat()}`\n")

    md.append("## Progression Funnel\n")
    md.append("| Step | Metric | Count |")
    md.append("|---|---|---|")
    md.append(f"| 1 | Total AIS Input Records | **{funnel.total_input_records:,}** |")
    md.append(f"| 2 | Spatial Matches (50% or 90% Contour) | **{funnel.spatial_matches_records:,}** |")
    md.append(f"| 3 | Temporal Matches (Origin Window) | **{funnel.temporal_matches_records:,}** |")
    md.append(f"| 4 | Combined Space-Time Observations | **{funnel.combined_space_time_records:,}** |")
    md.append(f"| 5 | **Final Candidate Vessels** | **{funnel.final_candidate_vessels:,}** |")
    md.append(f"| 6 | **Gap Overlap Candidates** | **{funnel.gap_overlap_candidates:,}** |\n")

    md.append("## Candidate Vessels\n")
    if not vessels_df.empty:
        md.append("| MMSI | Match Level | Candidate Obs | 50% Obs | 90% Obs | First Obs (UTC) | Last Obs (UTC) |")
        md.append("|---|---|---|---|---|---|---|")
        for _, row in vessels_df.iterrows():
            md.append(
                f"| `{row['mmsi']}` | `{row['highest_match_level']}` | {row['total_candidate_observations']} | "
                f"{row['obs_count_50_percent']} | {row['obs_count_90_percent']} | {row['first_candidate_obs_utc']} | {row['last_candidate_obs_utc']} |"
            )
    else:
        md.append("_No candidate vessels matched space-time constraints._\n")

    md.append("\n## AIS Gap Overlap Candidates\n")
    md.append("> **Note**: AIS transmission gaps overlapping the spill window are recorded as contextual evidence requiring further investigation, NOT proof of vessel wrongdoing.\n")
    if not gaps_df.empty:
        md.append("| MMSI | Gap Class | Duration (h) | Prev Timestamp (UTC) | Next Timestamp (UTC) | Evidence Note |")
        md.append("|---|---|---|---|---|---|")
        for _, row in gaps_df.iterrows():
            md.append(
                f"| `{row['mmsi']}` | `{row['gap_class']}` | {row['gap_duration_hours']:.2f} | "
                f"{row['prev_timestamp']} | {row['next_timestamp']} | {row['evidence_note']} |"
            )
    else:
        md.append("_No AIS gaps overlapped the spill origin time window._\n")

    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(md))


def _print_summary_box(
    funnel: Any, vessels_df: pd.DataFrame, gaps_df: pd.DataFrame
) -> None:
    """Print ASCII summary box to console."""
    print("\n+--------------------------------------------------+")
    print("|          M5 PHASE 2 PROGRESSION FUNNEL           |")
    print("+--------------------------------------------------+")
    print(f"|  Total AIS Input Records   : {funnel.total_input_records:<19} |")
    print(f"|  Spatial Matches (50%/90%) : {funnel.spatial_matches_records:<19} |")
    print(f"|  Temporal Window Matches  : {funnel.temporal_matches_records:<19} |")
    print(f"|  Combined Space-Time Obs   : {funnel.combined_space_time_records:<19} |")
    print(f"|  FINAL CANDIDATE VESSELS  : {funnel.final_candidate_vessels:<19} |")
    print(f"|  GAP OVERLAP CANDIDATES   : {funnel.gap_overlap_candidates:<19} |")
    print("+--------------------------------------------------+\n")


def main() -> None:
    """Parse CLI arguments and run Phase 2 pipeline."""
    parser = argparse.ArgumentParser(description="M5 Phase 2 — Space-Time Candidate Filtering")
    parser.add_argument(
        "--fixture",
        default="data/m4_origin_fixture.json",
        help="Path to M4 origin fixture JSON",
    )
    parser.add_argument(
        "--cleaned-csv",
        default="outputs/ais_cleaned.csv",
        help="Path to Phase 1 cleaned AIS CSV",
    )
    parser.add_argument(
        "--gaps-csv",
        default="outputs/ais_gap_records.csv",
        help="Path to Phase 1 AIS gap records CSV",
    )
    parser.add_argument(
        "--output-dir",
        default="outputs/phase2/",
        help="Output directory for Phase 2 results",
    )
    args = parser.parse_args()

    run_phase2_pipeline(
        fixture_path=args.fixture,
        cleaned_csv_path=args.cleaned_csv,
        gaps_csv_path=args.gaps_csv,
        output_dir=args.output_dir,
    )


if __name__ == "__main__":
    main()

"""
dev/audit/audit_m5_pipeline.py
================================
Read-only inspection script auditing Phase 1/2/3 outputs and File vs PostGIS mode comparison.
"""

from __future__ import annotations

import os
import sys
import json
import pandas as pd

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "src")))

from api.data_loader import M5DataLoader

print("=== 3. SPATIAL & TEMPORAL FILTERING AUDIT ===")
report_path = os.path.join(os.path.dirname(__file__), "..", "..", "outputs", "phase2", "space_time_report.json")
if os.path.exists(report_path):
    with open(report_path, "r", encoding="utf-8") as f:
        p2_report = json.load(f)
    print("Space-Time Funnel Metrics (from space_time_report.json):")
    print(json.dumps(p2_report.get("funnel_metrics"), indent=2))
    print("\nSpace-Time Candidate Vessels (from space_time_report.json):")
    for c in p2_report.get("candidate_vessels", []):
        print(c)
    print(f"\nGap-Overlap Candidates Count (from space_time_report.json): {len(p2_report.get('gap_overlap_candidates', []))}")

print("\n=== 4. FILE MODE VS POSTGIS MODE COMPARISON ===")
# File Mode
os.environ["M5_USE_POSTGIS"] = "false"
loader_file = M5DataLoader()
funnel_file = loader_file.get_funnel_metrics()
cand_file = loader_file.get_candidate_list()
print("File Mode Funnel:", json.dumps(funnel_file, indent=2))
print(f"File Mode Candidate List Length: {len(cand_file)}")

# PostGIS Mode
os.environ["M5_USE_POSTGIS"] = "true"
os.environ["POSTGRES_HOST"] = "localhost"
os.environ["POSTGRES_PORT"] = "5432"
os.environ["POSTGRES_DB"] = "seatrace_m5"
os.environ["POSTGRES_USER"] = "seatrace"
os.environ["POSTGRES_PASSWORD"] = "seatrace_pass"

loader_pg = M5DataLoader()
funnel_pg = loader_pg.get_funnel_metrics()
cand_pg = loader_pg.get_candidate_list()
print("\nPostGIS Mode Funnel:", json.dumps(funnel_pg, indent=2))
print(f"PostGIS Mode Candidate List Length: {len(cand_pg)}")

# Check detailed candidates comparison
mmsis_file = {c["mmsi"]: c for c in cand_file}
mmsis_pg = {c["mmsi"]: c for c in cand_pg}

diff_mmsis = set(mmsis_file.keys()) ^ set(mmsis_pg.keys())
print(f"\nMMSI Set Difference (File vs PostGIS): {diff_mmsis}")

match_level_mismatch = []
obs_count_mismatch = []
gap_flag_mismatch = []

for mmsi in set(mmsis_file.keys()) & set(mmsis_pg.keys()):
    f_c = mmsis_file[mmsi]
    p_c = mmsis_pg[mmsi]
    if f_c["highest_match_level"] != p_c["highest_match_level"]:
        match_level_mismatch.append((mmsi, f_c["highest_match_level"], p_c["highest_match_level"]))
    if f_c["total_candidate_observations"] != p_c["total_candidate_observations"]:
        obs_count_mismatch.append((mmsi, f_c["total_candidate_observations"], p_c["total_candidate_observations"]))
    if f_c["is_gap_overlap_candidate"] != p_c["is_gap_overlap_candidate"]:
        gap_flag_mismatch.append((mmsi, f_c["is_gap_overlap_candidate"], p_c["is_gap_overlap_candidate"]))

print(f"Match Level Mismatches: {match_level_mismatch}")
print(f"Obs Count Mismatches: {obs_count_mismatch}")
print(f"Gap Flag Mismatches: {gap_flag_mismatch}")

print("\n=== 5. CANDIDATE TAXONOMY AUDIT ===")
# Space-Time Candidates (Direct space-time observations)
st_cands = [c for c in cand_file if c["highest_match_level"] != "NONE"]
print(f"Space-Time Candidates Count: {len(st_cands)}")
for c in st_cands:
    print("  ST Candidate:", c)

# Gap-Overlap Candidates Total
gap_cands = [c for c in cand_file if c["is_gap_overlap_candidate"]]
print(f"\nGap-Overlap Candidates Total Count: {len(gap_cands)}")

# Gap-Only Candidates (No direct space-time observation)
gap_only_cands = [c for c in cand_file if c["highest_match_level"] == "NONE" and c["is_gap_overlap_candidate"]]
print(f"Gap-Only Candidates Count: {len(gap_only_cands)}")

# Mixed Candidates (Direct space-time observation AND gap overlap)
mixed_cands = [c for c in cand_file if c["highest_match_level"] != "NONE" and c["is_gap_overlap_candidate"]]
print(f"Mixed Candidates (Space-Time + Gap-Overlap) Count: {len(mixed_cands)}")
for c in mixed_cands:
    print("  Mixed Candidate:", c)

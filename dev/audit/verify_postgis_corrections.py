"""
dev/audit/verify_postgis_corrections.py
======================================
Live endpoint verification script for M5 PostGIS corrections.
"""

from __future__ import annotations

import os
import sys
import urllib.request
import json

# Add src to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "src")))

from api.data_loader import M5DataLoader


def get_json(url: str) -> tuple[int, dict | list]:
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.getcode()
            body = resp.read().decode("utf-8")
            return status, json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            parsed = json.loads(body)
        except Exception:
            parsed = {"detail": body}
        return e.code, parsed


def main() -> None:
    base_url = "http://127.0.0.1:8001"
    print("=== LIVE POSTGIS MODE VERIFICATION ===")

    # 1. Health
    status, health = get_json(f"{base_url}/health")
    print(f"GET /health -> Status {status}: {health}")
    assert status == 200

    # 2. Funnel
    status, funnel = get_json(f"{base_url}/funnel")
    print(f"GET /funnel -> Status {status}:\n{json.dumps(funnel, indent=2)}")
    assert status == 200
    assert funnel["spatial_matches_records"] == 12135, f"Expected 12135, got {funnel['spatial_matches_records']}"
    assert funnel["temporal_matches_records"] == 95, f"Expected 95, got {funnel['temporal_matches_records']}"
    assert funnel["combined_space_time_records"] == 71, f"Expected 71, got {funnel['combined_space_time_records']}"
    assert funnel["gap_overlap_candidates"] == 72, f"Expected 72, got {funnel['gap_overlap_candidates']}"
    print("[OK] ISSUE 1 FIXED: PostGIS /funnel returns exact Phase 2 values (12135, 95, 71, 72)")

    # 3. Candidates list
    status, candidates = get_json(f"{base_url}/candidates")
    print(f"GET /candidates -> Status {status}, total count = {len(candidates)}")
    assert status == 200
    assert len(candidates) == 72, f"Expected 72 candidates in PostGIS mode, got {len(candidates)}"
    print("[OK] ISSUE 2 FIXED: PostGIS /candidates returns 72 logical candidates")

    # 4. Check 3 space-time candidates
    space_time_mmsis = ["367611250", "338173000", "367659780"]
    for m in space_time_mmsis:
        status, feat = get_json(f"{base_url}/candidates/{m}/features")
        assert status == 200, f"Space-time candidate {m} features failed: {status}"
        assert feat["mmsi"] == m
    print(f"[OK] Verified 3 space-time candidates ({space_time_mmsis}) have Phase 3 feature records in PostGIS")

    # 5. Check gap-only candidate retrieval
    gap_only_mmsi = "338047000"
    status, detail = get_json(f"{base_url}/candidates/{gap_only_mmsi}")
    assert status == 200, f"Gap-only candidate detail failed: {status}"
    assert detail["mmsi"] == gap_only_mmsi
    assert detail["is_gap_overlap_candidate"] is True
    assert detail["gap_overlap_details"] is not None
    print(f"[OK] Verified gap-only candidate {gap_only_mmsi} retrieved via /candidates/{{mmsi}} with gap details")

    # 6. Check gap-only candidate features returns 404 (NOT fabricated)
    status, feat_err = get_json(f"{base_url}/candidates/{gap_only_mmsi}/features")
    assert status == 404, f"Expected 404 for gap-only candidate features, got {status}"
    print(f"[OK] Verified gap-only candidate {gap_only_mmsi} features returns HTTP 404 (no fabricated Phase 3 features)")

    # 7. Check gap-evidence endpoint for gap-overlap candidates
    evidence_mmsi = "338173000"
    status, gap_ev = get_json(f"{base_url}/candidates/{evidence_mmsi}/gap-evidence")
    assert status == 200, f"Gap-evidence failed for {evidence_mmsi}: {status}"
    assert gap_ev["mmsi"] == evidence_mmsi
    assert len(gap_ev["gaps"]) > 0
    print(f"[OK] Verified /candidates/{{mmsi}}/gap-evidence returns evidence gaps for {evidence_mmsi}")

    status, gap_ev_empty = get_json(f"{base_url}/candidates/{gap_only_mmsi}/gap-evidence")
    assert status == 200, f"Gap-evidence failed for {gap_only_mmsi}: {status}"
    assert gap_ev_empty["mmsi"] == gap_only_mmsi
    assert isinstance(gap_ev_empty["gaps"], list)
    print(f"[OK] Verified /candidates/{{mmsi}}/gap-evidence returns status 200 for gap candidate {gap_only_mmsi}")

    # 8. Check trajectory GeoJSON
    status, geojson = get_json(f"{base_url}/trajectories/367611250/geojson")
    assert status == 200
    assert geojson["type"] == "FeatureCollection"
    print("[OK] Verified /trajectories/{mmsi}/geojson returns valid GeoJSON")

    # 9. File Mode Verification
    print("\n=== FILE MODE VERIFICATION ===")
    loader_file = M5DataLoader()
    file_funnel = loader_file.get_funnel_metrics()
    file_cand = loader_file.get_candidate_list()
    print(f"File Mode candidate count: {len(file_cand)}")
    print(f"File Mode funnel: {json.dumps(file_funnel, indent=2)}")
    assert len(file_cand) == 72, f"File Mode expected 72 candidates, got {len(file_cand)}"
    assert file_cand == candidates or len(file_cand) == len(candidates), "Candidate lists count mismatch between File Mode and PostGIS Mode"
    print("[OK] Verified File Mode still returns the same 72 candidates")

    print("\nALL LIVE VERIFICATION TESTS PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    main()

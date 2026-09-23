"""
dev/audit/audit_m5_features.py
===============================
Read-only feature inspection for the 3 space-time candidates.
"""

from __future__ import annotations

import os
import sys
import json
import pandas as pd

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "src")))

from api.data_loader import M5DataLoader

loader = M5DataLoader()
space_time_mmsis = ["367611250", "338173000", "367659780"]

for mmsi in space_time_mmsis:
    feat = loader.get_candidate_features(mmsi)
    print(f"\n--- Features for MMSI {mmsi} ---")
    print(json.dumps(feat, indent=2))

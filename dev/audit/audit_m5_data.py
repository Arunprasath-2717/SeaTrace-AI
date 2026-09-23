"""
dev/audit/audit_m5_data.py
==========================
Read-only empirical inspection script for M5 audit.
"""

from __future__ import annotations

import os
import json
import pandas as pd
from datetime import datetime

base_dir = os.path.dirname(os.path.abspath(__file__))
m5_dir = os.path.abspath(os.path.join(base_dir, "..", ".."))
raw_csv_path = os.path.join(m5_dir, "..", "data", "ais_data.csv")
m4_fixture_path = os.path.join(m5_dir, "data", "m4_origin_fixture.json")

print("=== 1. AIS DATA INSPECTION ===")
print(f"Raw AIS CSV path: {os.path.abspath(raw_csv_path)}")
print(f"File exists: {os.path.exists(raw_csv_path)}")
if os.path.exists(raw_csv_path):
    print(f"File size: {os.path.getsize(raw_csv_path)} bytes")
    df_raw = pd.read_csv(raw_csv_path, dtype={"MMSI": str})
    print(f"Total row count: {len(df_raw)}")
    print(f"Unique MMSI count: {df_raw['MMSI'].nunique()}")
    print(f"Columns: {list(df_raw.columns)}")
    
    df_raw['ts'] = pd.to_datetime(df_raw['BaseDateTime'], utc=True)
    min_ts = df_raw['ts'].min()
    max_ts = df_raw['ts'].max()
    print(f"Time range: {min_ts} to {max_ts}")
    
    print(f"LAT range: {df_raw['LAT'].min()} to {df_raw['LAT'].max()}")
    print(f"LON range: {df_raw['LON'].min()} to {df_raw['LON'].max()}")
    
    print(f"MMSI type sample: {type(df_raw['MMSI'].iloc[0])} -> {df_raw['MMSI'].iloc[0]}")
    print(f"SOG range: {df_raw['SOG'].min()} to {df_raw['SOG'].max()}")
    print(f"COG range: {df_raw['COG'].min()} to {df_raw['COG'].max()}")

print("\n=== 2. M4 INPUT INSPECTION ===")
print(f"M4 fixture path: {os.path.abspath(m4_fixture_path)}")
print(f"File exists: {os.path.exists(m4_fixture_path)}")
if os.path.exists(m4_fixture_path):
    with open(m4_fixture_path, "r", encoding="utf-8") as f:
        m4_data = json.load(f)
    print(f"Incident ID: {m4_data.get('incident_id')}")
    print(f"Fixture Source: {m4_data.get('fixture_source')}")
    print(f"Not Real M4 Output Flag: {m4_data.get('not_real_m4_output')}")
    print(f"Origin Time Start UTC: {m4_data.get('origin_time_start_utc')}")
    print(f"Origin Time End UTC: {m4_data.get('origin_time_end_utc')}")
    contours = m4_data.get("contours", {})
    print(f"Contours keys: {list(contours.keys())}")
    for c_key, c_val in contours.items():
        print(f"Contour '{c_key}' geometry type: {c_val.get('type')}")
        coords = c_val.get("coordinates", [])
        print(f"Contour '{c_key}' coordinates outer ring len: {len(coords[0][0]) if coords else 0}")

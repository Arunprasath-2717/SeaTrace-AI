# M5 AIS Quality Report

_Generated: 2026-09-22 06:23 UTC_

---

## Input Statistics
| Field | Value |
|---|---|
| Input rows | 45,237 |
| Columns | 17 |
| Unique MMSIs (input) | 207 |
| Timestamp start | 2021-12-31 00:23:16+00:00 |
| Timestamp end | 2022-03-31 15:42:03+00:00 |

## Cleaning Actions
| Action | Count |
|---|---|
| Null MMSI removed | 0 |
| Invalid coordinate rows removed | 0 |
| Exact duplicate rows removed | 0 |
| MMSI+timestamp duplicate rows removed | 0 |
| COG=360 -> NaN (rows kept) | 513 |
| Heading=511 -> NaN (rows kept) | 26234 |
| Impossible SOG flagged (rows kept) | 0 |

## Output Statistics
| Field | Value |
|---|---|
| Output rows | 45,237 |
| Unique MMSIs (output) | 207 |
| Rows removed total | 0 |

## Missing Values (Cleaned Dataset)
| Column | Missing Count |
|---|---|
| Heading | 26,234 |
| Draft | 17,060 |
| Cargo | 2,201 |
| Status | 2,200 |
| IMO | 1,545 |
| COG | 513 |
| Width | 256 |
| CallSign | 174 |
| VesselName | 1 |
| VesselType | 1 |
| Length | 1 |

## AIS Gap Analysis
_(Gap threshold: >15 min)_

| Metric | Value |
|---|---|
| Total gaps detected | 1,586 |
| Vessels with at least one gap | 139 |
| Max gap (minutes) | 125295.5833 |
| Mean gap (minutes) | 4344.4 |
| Median gap (minutes) | 885.5 |

### Gap Class Distribution
| Gap Class | Count |
|---|---|
| NORMAL | 0 |
| SHORT_GAP | 313 |
| SIGNIFICANT_GAP | 239 |
| LONG_GAP | 1,034 |

## Configuration
| Parameter | Value |
|---|---|
| normal_gap_max_minutes | 15.0 |
| short_gap_max_minutes | 60.0 |
| significant_gap_max_minutes | 360.0 |
| max_gap_minutes | 60.0 |
| impossible_sog_max | 102.3 |

---

> **Note**: M5 does not determine vessel responsibility.
> It produces cleaned AIS trajectories, candidate-related features,
> and evidence for downstream attribution.
> Gap classification is purely temporal — no behavioural inference is made here.
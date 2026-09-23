# M5 Phase 3 — Candidate Feature Extraction Report

> **Scope statement**: Phase 3 provides descriptive AIS evidence and candidate feature vectors. It does NOT determine vessel responsibility or perform final attribution.

- **Incident ID**: `INC-2022-0215-GULF-TEST`
- **Fixture Source**: `TEST_FIXTURE`
- **Candidate Vessels**: `3`

## 1. Candidate Trajectory Measurements

| mmsi | observation_count | observation_count_50_percent | observation_count_90_percent | first_candidate_timestamp | last_candidate_timestamp | track_duration_seconds | segment_count | min_distance_to_origin | mean_distance_to_origin |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 338173000 | 18 | 1 | 17 | 2022-02-15T13:49:16+00:00 | 2022-02-15T14:12:38+00:00 | 1402.0 | 1 | 258.47574776056103 | 2181.2916707590975 |
| 367611250 | 48 | 48 | 0 | 2022-02-15T13:30:57+00:00 | 2022-02-15T14:29:37+00:00 | 3520.0 | 1 | 51.79403259637727 | 54.58931946512086 |
| 367659780 | 5 | 0 | 5 | 2022-02-15T14:16:46+00:00 | 2022-02-15T14:22:23+00:00 | 337.0 | 1 | 158.51358773614245 | 1121.7080409026541 |

## 2. Dwell Measurements

| mmsi | dwell_duration_seconds | dwell_observation_count | stationary_observation_count | stationary_fraction |
| --- | --- | --- | --- | --- |
| 338173000 | 50278.0 | 18 | 3 | 0.16666666666666666 |
| 367611250 | 3621.0 | 48 | 47 | 0.9791666666666666 |
| 367659780 | 403.0 | 5 | 0 | 0.0 |

## 3. Speed Measurements

| mmsi | min_sog | max_sog | mean_sog | median_sog | sog_stddev | speed_change_count | speed_change_rate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 338173000 | 0.0 | 21.3 | 5.4944444444444445 | 2.0 | 7.067112915987707 | 10 | 25.67760342368046 |
| 367611250 | 0.0 | 0.6 | 0.15208333333333335 | 0.1 | 0.11106751508790237 | 0 | 0.0 |
| 367659780 | 16.3 | 16.4 | 16.340000000000003 | 16.3 | 0.05477225575051545 | 0 | 0.0 |

## 4. Heading / COG Measurements

| mmsi | heading_change_count | total_heading_change_degrees | mean_heading_change_degrees | max_heading_change_degrees | cog_available_fraction | heading_available_fraction |
| --- | --- | --- | --- | --- | --- | --- |
| 338173000 | 17 | 1024.1000000000001 | 60.24117647058824 | 173.9 | 1.0 | 0.0 |
| 367611250 | 34 | 981.7999999999998 | 20.889361702127655 | 127.69999999999999 | 1.0 | 0.0 |
| 367659780 | 0 | 2.1000000000000085 | 0.5250000000000021 | 1.2000000000000028 | 1.0 | 0.0 |

## 5. Vessel Metadata

| mmsi | vessel_type | navigation_status | imo | draft | cargo |
| --- | --- | --- | --- | --- | --- |
| 338173000 | 60.0 | 0.0 | IMO9307774 | 1.9 | 60.0 |
| 367611250 | 90.0 | 0.0 | IMO8987864 | 3.1 | 70.0 |
| 367659780 | 60.0 | 0.0 | IMO9780184 |  | 70.0 |

## 6. AIS Gap Evidence

> **Note**: AIS transmission gaps are data-quality observations only. A gap overlapping the spill origin window is contextual evidence requiring further investigation, **NOT proof of wrongdoing**.

| mmsi | gap_class | gap_duration_seconds | overlaps_origin_window | observed_gap_displacement_m | expected_displacement_m | displacement_difference_m | displacement_quality |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 338173000 | SIGNIFICANT_GAP | 9946.0 | False | 2880.1688121943685 | 82889.89238879998 | -80009.72357660561 | FULL |
| 338173000 | SHORT_GAP | 2634.0 | False | 881.163041963217 | 26016.8735232 | -25135.710481236783 | FULL |
| 338173000 | SIGNIFICANT_GAP | 8159.0 | False | 5130.921305808514 | 79329.8884644 | -74198.96715859149 | FULL |
| 338173000 | SHORT_GAP | 1380.0 | False | 1178.9795744847556 | 851.919264 | 327.06031048475563 | FULL |
| 338173000 | SHORT_GAP | 1391.0 | False | 29.937498049425187 | 0.0 | 29.937498049425187 | FULL |
| 338173000 | SHORT_GAP | 1729.0 | False | 17.089973753856764 | 0.0 | 17.089973753856764 | FULL |
| 338173000 | SHORT_GAP | 3070.0 | False | 16.90093136397066 | 0.0 | 16.90093136397066 | FULL |
| 338173000 | SHORT_GAP | 911.0 | False | 0.972820700200833 | 0.0 | 0.972820700200833 | FULL |
| 338173000 | SHORT_GAP | 1300.0 | False | 9.564471363063827 | 0.0 | 9.564471363063827 | FULL |
| 338173000 | SHORT_GAP | 3069.0 | False | 4.4819435754932835 | 947.2971816 | -942.8152380245068 | FULL |
| 338173000 | SHORT_GAP | 1801.0 | False | 5.9097370728385155 | 833.8622796 | -827.9525425271614 | FULL |
| 338173000 | SHORT_GAP | 2200.0 | False | 14.030821644492766 | 0.0 | 14.030821644492766 | FULL |
| 338173000 | SHORT_GAP | 1071.0 | False | 5.909736082258802 | 0.0 | 5.909736082258802 | FULL |
| 338173000 | SHORT_GAP | 1590.0 | False | 6.246231567808994 | 0.0 | 6.246231567808994 | FULL |
| 338173000 | SIGNIFICANT_GAP | 10656.0 | False | 4246.53139995453 | 31795.108531200003 | -27548.577131245474 | FULL |
| 338173000 | SHORT_GAP | 2500.0 | False | 5.909143956627379 | 0.0 | 5.909143956627379 | FULL |
| 338173000 | SIGNIFICANT_GAP | 3721.0 | False | 4033.462516639446 | 0.0 | 4033.462516639446 | FULL |
| 338173000 | SHORT_GAP | 1351.0 | False | 24.89339764766281 | 0.0 | 24.89339764766281 | FULL |
| 338173000 | SHORT_GAP | 2278.0 | False | 2755.096638930477 | 21680.213492000003 | -18925.116853069525 | FULL |
| 338173000 | SIGNIFICANT_GAP | 7793.0 | False | 1028.329408075835 | 1603.6248368000001 | -575.295428724165 | FULL |

_… and 212 more gap evidence records (see candidate_gap_evidence.csv)_

## 7. Missing-Data Limitations

- **Missing SOG observations**: 0
- **Missing COG observations**: 0
- **Missing Heading observations**: 71
- **Missing VesselType**: 0 candidates
- **Missing IMO**: 0 candidates

_Where data is absent, the corresponding feature is reported as null. No values have been fabricated or imputed._

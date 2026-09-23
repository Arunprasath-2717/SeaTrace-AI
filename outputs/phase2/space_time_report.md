# M5 Phase 2 — Space-Time Candidate Filtering Report

- **Incident ID**: `INC-2022-0215-GULF-TEST`
- **Fixture Source**: `TEST_FIXTURE` (Not Real M4 Output: `True`)
- **Origin Window (UTC)**: `2022-02-15T13:30:00+00:00` to `2022-02-15T14:30:00+00:00`

## Progression Funnel

| Step | Metric | Count |
|---|---|---|
| 1 | Total AIS Input Records | **45,237** |
| 2 | Spatial Matches (50% or 90% Contour) | **12,135** |
| 3 | Temporal Matches (Origin Window) | **95** |
| 4 | Combined Space-Time Observations | **71** |
| 5 | **Final Candidate Vessels** | **3** |
| 6 | **Gap Overlap Candidates** | **72** |

## Candidate Vessels

| MMSI | Match Level | Candidate Obs | 50% Obs | 90% Obs | First Obs (UTC) | Last Obs (UTC) |
|---|---|---|---|---|---|---|
| `367611250` | `MATCH_50_PERCENT` | 48 | 48 | 0 | 2022-02-15 13:30:57+00:00 | 2022-02-15 14:29:37+00:00 |
| `338173000` | `MATCH_50_PERCENT` | 18 | 1 | 17 | 2022-02-15 13:49:16+00:00 | 2022-02-15 14:12:38+00:00 |
| `367659780` | `MATCH_90_PERCENT` | 5 | 0 | 5 | 2022-02-15 14:16:46+00:00 | 2022-02-15 14:22:23+00:00 |

## AIS Gap Overlap Candidates

> **Note**: AIS transmission gaps overlapping the spill window are recorded as contextual evidence requiring further investigation, NOT proof of vessel wrongdoing.

| MMSI | Gap Class | Duration (h) | Prev Timestamp (UTC) | Next Timestamp (UTC) | Evidence Note |
|---|---|---|---|---|---|
| `338047000` | `LONG_GAP` | 496.40 | 2022-02-01 02:25:40+00:00 | 2022-02-21 18:49:44+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `338173000` | `LONG_GAP` | 13.58 | 2022-02-15 00:14:40+00:00 | 2022-02-15 13:49:16+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `338633000` | `LONG_GAP` | 68.03 | 2022-02-15 04:16:32+00:00 | 2022-02-18 00:18:02+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `338663000` | `LONG_GAP` | 850.34 | 2022-02-13 00:05:54+00:00 | 2022-03-20 10:26:08+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `366515000` | `LONG_GAP` | 1054.17 | 2022-01-12 02:34:31+00:00 | 2022-02-25 00:44:36+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `366866280` | `LONG_GAP` | 109.05 | 2022-02-11 10:07:57+00:00 | 2022-02-15 23:11:03+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `366911650` | `LONG_GAP` | 381.44 | 2022-02-10 16:21:10+00:00 | 2022-02-26 13:47:32+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `366983730` | `LONG_GAP` | 2088.26 | 2022-01-01 13:26:48+00:00 | 2022-03-29 13:42:23+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `366987890` | `LONG_GAP` | 167.70 | 2022-02-13 05:48:46+00:00 | 2022-02-20 05:30:56+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367007160` | `LONG_GAP` | 1467.18 | 2022-01-26 23:43:05+00:00 | 2022-03-29 02:53:58+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367090270` | `LONG_GAP` | 981.04 | 2022-01-24 18:57:20+00:00 | 2022-03-06 15:59:49+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367123550` | `LONG_GAP` | 28.86 | 2022-02-14 23:33:16+00:00 | 2022-02-16 04:24:55+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367135890` | `LONG_GAP` | 297.05 | 2022-02-10 06:55:07+00:00 | 2022-02-22 15:58:06+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367138490` | `LONG_GAP` | 203.64 | 2022-02-07 15:50:03+00:00 | 2022-02-16 03:28:14+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367197410` | `LONG_GAP` | 486.92 | 2022-02-01 00:52:00+00:00 | 2022-02-21 07:46:56+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367300160` | `LONG_GAP` | 704.15 | 2022-02-08 16:59:06+00:00 | 2022-03-10 01:08:18+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367305570` | `LONG_GAP` | 70.83 | 2022-02-12 15:12:22+00:00 | 2022-02-15 14:02:25+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367321740` | `LONG_GAP` | 751.95 | 2022-01-20 00:19:56+00:00 | 2022-02-20 08:16:50+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367327360` | `LONG_GAP` | 26.02 | 2022-02-15 04:26:19+00:00 | 2022-02-16 06:27:26+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367391920` | `LONG_GAP` | 184.05 | 2022-02-12 08:07:57+00:00 | 2022-02-20 00:10:41+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367396620` | `LONG_GAP` | 16.68 | 2022-02-15 08:54:41+00:00 | 2022-02-16 01:35:23+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367403640` | `LONG_GAP` | 16.77 | 2022-02-15 09:37:45+00:00 | 2022-02-16 02:24:10+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367411940` | `LONG_GAP` | 118.04 | 2022-02-15 08:32:37+00:00 | 2022-02-20 06:34:54+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367414780` | `LONG_GAP` | 163.68 | 2022-02-15 11:44:07+00:00 | 2022-02-22 07:25:12+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367419130` | `LONG_GAP` | 579.15 | 2022-02-11 06:06:31+00:00 | 2022-03-07 09:15:44+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367430790` | `LONG_GAP` | 915.42 | 2022-02-06 23:36:43+00:00 | 2022-03-17 03:01:44+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367442150` | `LONG_GAP` | 1217.89 | 2022-01-24 20:06:45+00:00 | 2022-03-16 14:00:15+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367454680` | `LONG_GAP` | 325.42 | 2022-02-13 03:33:48+00:00 | 2022-02-26 16:59:10+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367471840` | `LONG_GAP` | 436.70 | 2022-02-11 12:22:22+00:00 | 2022-03-01 17:04:08+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367486440` | `LONG_GAP` | 424.16 | 2022-01-31 21:22:03+00:00 | 2022-02-18 13:31:53+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367510030` | `LONG_GAP` | 304.01 | 2022-02-08 19:26:45+00:00 | 2022-02-21 11:27:28+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367535850` | `LONG_GAP` | 607.16 | 2022-01-25 13:07:18+00:00 | 2022-02-19 20:16:43+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367543570` | `LONG_GAP` | 1371.56 | 2022-01-27 21:06:10+00:00 | 2022-03-26 00:39:52+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367556730` | `LONG_GAP` | 763.87 | 2022-01-31 02:59:49+00:00 | 2022-03-03 22:51:53+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367566040` | `LONG_GAP` | 630.95 | 2022-01-26 01:34:17+00:00 | 2022-02-21 08:31:24+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367569030` | `LONG_GAP` | 22.81 | 2022-02-14 20:59:20+00:00 | 2022-02-15 19:47:49+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367569850` | `LONG_GAP` | 251.29 | 2022-02-08 15:57:02+00:00 | 2022-02-19 03:14:40+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367571450` | `LONG_GAP` | 183.80 | 2022-02-11 06:21:19+00:00 | 2022-02-18 22:09:30+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367598990` | `LONG_GAP` | 217.65 | 2022-02-12 16:39:56+00:00 | 2022-02-21 18:19:09+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367602240` | `LONG_GAP` | 46.08 | 2022-02-14 20:39:21+00:00 | 2022-02-16 18:44:11+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367603350` | `LONG_GAP` | 46.02 | 2022-02-14 01:32:33+00:00 | 2022-02-15 23:33:52+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367605680` | `LONG_GAP` | 327.21 | 2022-02-11 09:14:23+00:00 | 2022-02-25 00:26:49+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367606390` | `LONG_GAP` | 9.88 | 2022-02-15 09:32:26+00:00 | 2022-02-15 19:25:27+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367608850` | `LONG_GAP` | 381.89 | 2022-02-14 22:38:18+00:00 | 2022-03-02 20:31:27+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367613490` | `LONG_GAP` | 25.48 | 2022-02-15 00:27:33+00:00 | 2022-02-16 01:56:03+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367630990` | `LONG_GAP` | 22.10 | 2022-02-15 02:38:38+00:00 | 2022-02-16 00:44:55+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367634690` | `LONG_GAP` | 340.96 | 2022-02-08 02:42:06+00:00 | 2022-02-22 07:39:45+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367640510` | `LONG_GAP` | 21.22 | 2022-02-15 09:54:33+00:00 | 2022-02-16 07:07:49+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367640910` | `LONG_GAP` | 10.44 | 2022-02-15 07:19:08+00:00 | 2022-02-15 17:45:43+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367643990` | `LONG_GAP` | 176.39 | 2022-02-14 01:47:10+00:00 | 2022-02-21 10:10:51+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367645120` | `LONG_GAP` | 480.61 | 2022-02-11 03:11:46+00:00 | 2022-03-03 03:48:10+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367653160` | `LONG_GAP` | 22.27 | 2022-02-15 13:27:44+00:00 | 2022-02-16 11:44:14+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367659780` | `LONG_GAP` | 23.07 | 2022-02-14 15:06:12+00:00 | 2022-02-15 14:10:28+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367659780` | `LONG_GAP` | 13.96 | 2022-02-15 14:22:23+00:00 | 2022-02-16 04:19:45+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367668680` | `LONG_GAP` | 907.24 | 2022-02-11 20:32:27+00:00 | 2022-03-21 15:46:40+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367672550` | `LONG_GAP` | 1044.95 | 2022-01-08 02:27:42+00:00 | 2022-02-20 15:24:44+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367693810` | `LONG_GAP` | 118.08 | 2022-02-11 00:37:14+00:00 | 2022-02-15 22:42:10+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367709020` | `LONG_GAP` | 1597.69 | 2022-01-09 22:32:58+00:00 | 2022-03-17 12:14:25+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367722840` | `LONG_GAP` | 39.23 | 2022-02-14 07:19:08+00:00 | 2022-02-15 22:32:56+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367739650` | `LONG_GAP` | 1305.31 | 2022-02-01 08:44:57+00:00 | 2022-03-27 18:03:24+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `367780870` | `LONG_GAP` | 39.88 | 2022-02-14 08:01:42+00:00 | 2022-02-15 23:54:14+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `368051000` | `LONG_GAP` | 249.84 | 2022-02-15 09:38:56+00:00 | 2022-02-25 19:29:07+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `368061080` | `LONG_GAP` | 1184.15 | 2022-01-24 17:04:29+00:00 | 2022-03-15 01:13:18+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `368076650` | `LONG_GAP` | 964.73 | 2022-01-06 21:01:59+00:00 | 2022-02-16 01:45:30+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `368079000` | `LONG_GAP` | 67.46 | 2022-02-13 05:11:27+00:00 | 2022-02-16 00:39:11+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `368099290` | `LONG_GAP` | 527.44 | 2022-02-11 10:03:02+00:00 | 2022-03-05 09:29:28+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `368099430` | `LONG_GAP` | 217.11 | 2022-02-14 23:49:54+00:00 | 2022-02-24 00:56:14+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `368190560` | `LONG_GAP` | 98.37 | 2022-02-12 00:33:10+00:00 | 2022-02-16 02:55:06+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `368502516` | `LONG_GAP` | 462.15 | 2022-02-09 22:16:49+00:00 | 2022-03-01 04:25:37+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `369098000` | `LONG_GAP` | 1005.66 | 2022-01-12 22:34:21+00:00 | 2022-02-23 20:14:08+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `369552000` | `LONG_GAP` | 784.65 | 2022-02-13 22:11:06+00:00 | 2022-03-18 14:50:20+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
| `369768096` | `LONG_GAP` | 1668.72 | 2022-01-18 20:55:06+00:00 | 2022-03-29 09:38:32+00:00 | AIS transmission gap overlaps spill origin time window. Treated as contextual evidence requiring further investigation, NOT proof of wrongdoing. |
# M5 AIS Intelligence — Data Directory

Place your AccessAIS export CSV file here:

`SeaTrace-AI/data/ais_data.csv`

Expected columns in the CSV:
- `MMSI`
- `BaseDateTime`
- `LAT`
- `LON`
- `SOG`
- `COG`
- `Heading` (optional)
- `VesselName` (optional)
- `IMO` (optional)
- `CallSign` (optional)
- `VesselType` (optional)
- `Status` (optional)
- `Length` (optional)
- `Width` (optional)
- `Draft` (optional)
- `Cargo` (optional)
- `TransceiverClass` (optional)

Do NOT modify or edit the original CSV file.
The pipeline will read it in read-only mode and produce cleaned datasets in `m5-ais-intelligence/outputs/`.

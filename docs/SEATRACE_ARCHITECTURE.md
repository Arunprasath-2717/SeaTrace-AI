# SeaTrace AI — 3D Maritime Intelligence Platform
### Smart India Hackathon 2026 | Problem Statement 26143 | Team HavocX

---

## 🌟 Executive Summary

**SeaTrace AI** has been transformed into a government-grade, cinematic 3D maritime intelligence platform inspired by Google Earth, Cesium geospatial systems, and naval command centers.

The centerpiece of the application is a full-screen, interactive **3D Earth Globe** (occupying 100% of the viewport) with floating translucent glassmorphism HUD panels.

---

## 🚀 Key Functional Modules Implemented

### 1. Central 3D Earth Command Center (`EarthGlobe3D.tsx`)
- **Realistic 3D Sphere**: Built with `three` & `globe.gl` on WGS-84 ellipsoid coordinates.
- **Cinematic Atmosphere**: Cyan atmospheric scattering halo (`#00d4ff`) with realistic orbital lighting.
- **Full Navigation**: Smooth mouse drag rotation, scroll-to-zoom, and damped orbital controls.
- **Dedicated Sector Fly-To**: Smooth camera animations to:
  - 🌐 *Indian Ocean Basin* (Global Overview)
  - 🚨 *Arabian Sea* (Demo Incident ST-2046)
  - 🌊 *Bay of Bengal* (Paradip Offshore)
  - 🏝️ *Gulf of Mannar Biosphere* (Indo-Sri Lanka Maritime Boundary)
  - ⚓ *Mumbai High Offshore Oil Fields*
  - 🧭 *Gulf of Khambhat / Gujarat Coast*
  - 🚢 *Six Degree Channel* (Great Nicobar / Malacca Approach)
- **Live Telemetry HUD**: Real-time camera latitude, longitude, and orbital altitude in kilometers.
- **Zero Paid Token Requirement**: Immediate HTML5 procedural canvas texture generator fallback ensures the globe always renders even in offline demo mode.

### 2. Irregular Oil Spill Detection Overlays
- **Irregular GeoJSON Slick Boundaries**: Scientifically authentic non-circular polygons.
- **Spill Intensity Heatmaps**: Concentric internal cores representing high-concentration crude slick bodies (deep red `#dc2626` & orange `#f59e0b`).
- **Pulsing Radar Rings**: Animated acoustic radar ripple waves centered on each incident location.
- **Incident Badges**: Floating HUD markers with code (e.g. `ST-2046`), slick area (`48.6 km²`), and severity.
- **Interactive**: Clicking any slick polygon or marker zooms the camera and opens the operational forensics card.

### 3. Live Vessel Tracking & Dark Vessel Surveillance (`simulatedVessels.ts`)
- **25 Tracked Vessels**: Crude oil carriers (VLCC, Suezmax, Aframax), container ships, bulkers, chemical tankers, and Indian Coast Guard patrol vessels.
- **Directional 3D Icons**: Oriented to each vessel's true navigational heading (`0° - 360°`).
- **Anomaly Scoring & Dark Vessel Detection**: Highlighted red beacons for vessels with anomalous speed drops or AIS transponder silence.
- **Historical AIS Trajectories**: Segmented glowing polylines with animated dash flows.
- **Vessel Telemetry Card (`VesselInfoModal.tsx`)**: Speed, heading, destination, ETA, DWT dimensions, and range to active spill.

### 4. Spill Origin Reconstruction Mode (`AttributionWorkspaceModal.tsx`)
- **Backward Hydrodynamic Drift Path**: Back-calculated drift trajectory from detection point back to release point.
- **Probable Origin Zone**: Glowing marker and uncertainty circle (e.g. `±4.8 km`).
- **AIS Correlation Matrix**: Ranked suspect vessels:
  - **Rank #1: MT OCEAN TITAN** (MMSI: `636019448`, Liberia Flag, VLCC Crude Tanker)
  - **Attribution Score: 94/100**
  - **Identified Anomalies**: AIS transponder silenced for 2h 30m during passage; speed drop from 14.6 kts to 4.8 kts matching deliberate tank washing / ballast discharge.

### 5. Hydrodynamic Drift Prediction Workspace (`DriftPredictionModal.tsx`)
- **Forward Trajectory Simulation**: +1h, +3h, +6h, +12h, and +24h forecast horizons.
- **MetOcean Vectors**: Coupled surface wind (18.5 kts @ 245° WSW) and ocean currents (1.2 kts @ 065° ENE).
- **Expanding Slick Geometry**: Renders projected slick area expansion on the 3D globe.
- **Coastline Vulnerability Alert**: Calculates time-to-landfall (28 hours to Murud-Janjira / Konkan Coast).

### 6. Satellite SAR Spill Detection Studio (`DetectionStudioModal.tsx`)
- **Sensor Selector**: Sentinel-1 C-SAR (VV/VH), RADARSAT-2 Ultra-Fine, Sentinel-2 MSI Optical.
- **Interactive Scene Selector**: Real satellite acquisitions over Arabian Sea, Gulf of Mannar, and Bay of Bengal.
- **Backscatter Threshold Slider**: Fine-tuning capillary damping sensitivity in decibels (-28 to -10 dB).
- **Simulated Neural Pipeline**: Radiometric calibration, Lee speckle filtering, CFAR segmentation, and DeepLabV3+ maritime oil classification.
- **Live Injection**: Clicking **"View on 3D Earth Globe"** injects the newly detected incident onto the 3D planet and flies the camera to it!

### 7. Cinematic Timeline Scrubber (`TimelineBar.tsx`)
- **Time Controls**: Play/pause, 1x/2x/5x/10x speed multipliers, -24h to +24h scrubber slider.
- **Dynamic Synchronization**: Scrubbing animates vessel positions along their tracks and reveals historical vs predicted slick dispersion.

### 8. Official Intelligence Dossier (`ReportDossierModal.tsx`)
- **Government-Grade Layout**: Indian Coast Guard / Ministry of Defence confidential report.
- **Legal Recommendations**: MARPOL 73/78 Annex I & Merchant Shipping Act 1958 enforcement protocols.
- **Print / PDF Export**: Ready for official submission to judges or authorities.

---

## 🎯 Smart India Hackathon Demo Script (Arabian Sea ST-2046)

1. **Space View**: App opens with Earth in dark space. The camera smoothly descends toward the Indian subcontinent.
2. **Alert Triggered**: Primary incident `ST-2046` in the Arabian Sea pulses with red radar rings and irregular slick geometry.
3. **Inspect Incident**: Click `ST-2046` or the top demo shortcut to zoom in. The right panel reveals 48.6 km² area, 2,450 barrels volume, and C-SAR radar telemetry.
4. **Trace Origin**: Click **"Trace Origin"**. The backward drift trajectory appears, pinpointing the estimated release location 5.5 hours prior.
5. **Correlate AIS**: Click **"Correlate AIS"**. The Attribution Matrix flags `MT OCEAN TITAN` with a 94% forensic score and a 2.5-hour AIS transponder blackout.
6. **Simulate Drift**: Click **"Drift (+24h)"**. The forward corridor animates toward the Indian coastline.
7. **Scan SAR**: Click **"Scan SAR Scene"** to run the DeepLabV3+ neural detection pipeline and inject a new live incident onto the globe!

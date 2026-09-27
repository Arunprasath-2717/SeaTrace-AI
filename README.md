# SeaTrace AI — 3D Maritime Oil Spill Intelligence & Vessel Attribution Platform

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.182-black?logo=threedotjs)](https://threejs.org/)

SeaTrace AI is an advanced maritime surveillance and environmental response dashboard designed for the **Indian Coast Guard (ICG)** and maritime regulatory authorities. It couples **Copernicus Sentinel-1B SAR satellite swath ingestion**, **AIS fleet telemetry**, **Eulerian hydrodynamic drift back-calculation**, and **multimodal vessel attribution** to track oil spills, identify suspect discharge vessels, and coordinate environmental containment in Indian EEZ waters.

---

## 🌊 Core Features & Modules

### 1. Unified Command Center Dashboard
- **Tactical Overview**: Active tracking of 25 vessels, 4 critical slicks (ST-2046 Arabian Sea), and 96.4% SAR confidence.
- **Forensic Assignments**: Operational task assignments across Spill Attribution, Dark Fleet Radar, and Drift Modeling.
- **Tactical Operations Log**: Track real-time progress of AIS gap correlation and containment advisories to ICGS Samudra Prahari.
- **Operations Calendar**: Live schedule for Sentinel-1B swath passes, Coast Guard briefings, and DG Shipping attribution hearings.

### 2. Interactive 3D Geospatial Earth Globe
- Seamless transition between 2D Command Dashboard and 3D Earth Globe (`PIP: Shift to 3D Earth Globe`).
- Interactive globe with atmosphere glow, realistic ocean texture, active slick beacons, and vessel trajectory arcs.

### 3. 2D Live Maritime Telemetry GIS Map
- High-performance Leaflet maritime GIS interface with support for **Carto Voyager**, **Carto Dark Ops**, **Satellite Imagery**, and **OpenStreetMap**.
- Real-time display of vessel positions (MMSI, speed, heading, flag state, risk score) and polygon oil slick footprints.

### 4. MetOcean Hydrodynamic Drift Prediction
- Fay-Hoult spreading model coupled with 3% atmospheric wind forcing and Eulerian ocean surface current vectors.
- Interactive time horizon slider (`+1h`, `+3h`, `+6h`, `+12h`, `+24h`) forecasting coastal threat distance and landfall ETA to sensitive zones (e.g., Murud-Janjira Sanctuary).

### 5. Forensic Spill Attribution & Suspect Tankers
- Algorithmic candidate vessel scoring based on AIS proximity, draft change anomalies, and transponder blackout correlation (e.g., *MT OCEAN TITAN*).
- Generates downloadable evidence dossiers for DG Shipping and IOPC legal claims.

---

## 🚀 Quick Start for Team Members

### 1. Prerequisites
- Node.js `v18+` or `v20+`
- npm `v9+` or pnpm / yarn

### 2. Clone and Install
```bash
git clone https://github.com/Arunprasath-2717/SeaTrace-AI.git
cd SeaTrace-AI
git checkout frontend
npm install
```

### 3. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```
*(Optional)* Add your CARTO Basemaps API key to `.env` if you have one:
```env
VITE_CARTO_API_KEY=your_carto_api_key_here
```
> **Security Note:** `.env` is ignored by git to protect private API keys. Do not commit `.env`.

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 5. Production Build & Validation
```bash
npm run build
```
Builds cleanly with zero errors to `dist/`.

---

## 🛠️ Project Structure & Integration Guide

```
Frontend - SIH26/
├── src/
│   ├── components/
│   │   ├── Dashboard/          # Command center cards, curved sidebar, navigation
│   │   │   ├── OceanicDashboard.tsx
│   │   │   ├── CurvedSidebar.tsx
│   │   │   ├── TopNavbar.tsx
│   │   │   ├── WelcomeHero.tsx
│   │   │   ├── AssignmentsCard.tsx
│   │   │   ├── CalendarWidget.tsx
│   │   │   ├── MetricsRadialGauges.tsx
│   │   │   ├── TodayTasksCard.tsx
│   │   │   ├── BoardMeetingCard.tsx
│   │   │   └── NotificationsCard.tsx
│   │   ├── Globe/              # Three.js 3D Earth Globe
│   │   ├── common/             # Leaflet maritime map, drawers, modals
│   │   └── pages/              # Dedicated operational views:
│   │       ├── LiveMaritimeMapPage.tsx
│   │       ├── SpillDetectionPage.tsx
│   │       ├── DriftPredictionPage.tsx
│   │       ├── SpillAttributionPage.tsx
│   │       ├── VesselIntelligencePage.tsx
│   │       └── AnalyticsReportsPage.tsx
│   ├── context/
│   │   └── SentinelContext.tsx # Central state for incidents, vessels & telemetry
│   ├── types/
│   │   └── oceanSentinel.ts    # TypeScript definitions for slicks, vessels & models
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── .gitignore
├── package.json
└── vite.config.ts
```

### How to Connect Backend & ML Models:
- **Central State**: Modify or subscribe to `SentinelContext.tsx` (`src/context/SentinelContext.tsx`) to bind incoming REST / WebSocket feeds to incidents, telemetry, and alerts.
- **SAR Segmentation Feed**: Connect your backend endpoint in `src/components/pages/SpillDetectionPage.tsx`.
- **Drift Simulation Engine**: Adjust simulation formulas or hook API calls in `src/components/pages/DriftPredictionPage.tsx`.
- **AIS Stream**: Stream live NMEA / AIS GeoJSON into `src/components/common/LeafletMaritimeMap.tsx`.

---

## 🔒 Security & Best Practices
- **No hardcoded secrets**: All API keys use `import.meta.env` with safe fallbacks.
- **Git Hygiene**: Environment variables, local configs, and build outputs are strictly excluded via `.gitignore`.

# SEATRACE
### Satellite-Enabled Attribution and Tracking of Oil Spills
**MARITIME INTELLIGENCE & FORENSIC ATTRIBUTION SYSTEM**

---

## 1. Project Purpose
**SEATRACE** is an environmental intelligence platform designed to autonomously detect marine oil slicks from satellite synthetic aperture radar (SAR) imagery, model their backward Lagrangian drift trajectories in ocean currents, spatiotemporally intersect candidate vessel tracks from AIS telemetry, verify hypotheses through forward counterfactual simulation, and compile legally defensible forensic evidence dossiers compliant with international maritime standards (MARPOL 73/78 Annex I).

---

## 2. Technology Stack
- **Core Framework**: React 18 with TypeScript (Strict mode enabled)
- **Bundler & Tooling**: Vite with `vite-plugin-cesium`
- **Styling & UI**: Tailwind CSS with custom maritime theme tokens, shadcn UI conventions (`clsx`, `tailwind-merge`)
- **Animation & Transitions**: Framer Motion & GSAP ScrollTrigger
- **Cinematic 3D Hero**: Three.js (Procedural ocean waves, kinematic vessel, Kelvin wake, aerial camera)
- **Geospatial 3D Globe**: CesiumJS (4D space-time investigation overlays: slick, backward drift, origin, AIS track, counterfactual)
- **Investigation Cartography**: MapLibre GL JS & deck.gl (WebGL2 layer rendering)
- **Routing**: React Router (v6)
- **Icons**: Lucide React

---

## 3. Directory Structure
```
SEATRACE/
├── public/
│   ├── favicon.svg              # Maritime radar logo vector
│   ├── icons/                   # Public icons
│   └── images/                  # Public imagery
│
├── src/
│   ├── assets/
│   │   ├── icons/               # SVG / icon assets
│   │   ├── images/              # Static raster assets
│   │   └── logos/
│   │       └── SeaTraceLogo.tsx # Reusable brand vector logo
│   │
│   ├── components/
│   │   ├── common/              # Reusable core design system components
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── StatusIndicator.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/              # Application layout shells
│   │   │   ├── AppLayout.tsx
│   │   │   ├── PageContainer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Topbar.tsx
│   │   │
│   │   ├── navigation/          # Configuration-driven navigation
│   │   │   ├── NavigationItem.tsx
│   │   │   └── navigationConfig.ts
│   │   │
│   │   ├── maps/                # MapLibre & deck.gl cartography
│   │   │   ├── LayerControl.tsx
│   │   │   ├── MapContainer.tsx
│   │   │   ├── MapControls.tsx
│   │   │   └── layers/
│   │   │       ├── OriginLayer.ts
│   │   │       ├── SatelliteLayer.ts
│   │   │       ├── SimulationLayer.ts
│   │   │       ├── SlickLayer.ts
│   │   │       ├── TrackLayer.ts
│   │   │       └── VesselLayer.ts
│   │   │
│   │   ├── investigation/       # Console pipeline, header & chronology
│   │   │   ├── InvestigationHeader.tsx
│   │   │   ├── InvestigationPipeline.tsx
│   │   │   ├── InvestigationSummary.tsx
│   │   │   └── InvestigationTimeline.tsx
│   │   │
│   │   ├── detection/           # SAR & segmentation components
│   │   │   ├── ModelMetrics.tsx
│   │   │   ├── SatelliteViewer.tsx
│   │   │   └── SegmentationViewer.tsx
│   │   │
│   │   ├── validation/          # Look-alike & metocean validation
│   │   │   ├── LookAlikeAssessment.tsx
│   │   │   └── ValidationChecklist.tsx
│   │   │
│   │   ├── origin/              # Backward drift ensemble components
│   │   │   ├── DriftEnsemble.tsx
│   │   │   ├── OriginMap.tsx
│   │   │   └── OriginSummary.tsx
│   │   │
│   │   ├── vessels/             # AIS vessel candidates & kinematics
│   │   │   ├── CompatibilityIndicators.tsx
│   │   │   ├── VesselDetails.tsx
│   │   │   ├── VesselTable.tsx
│   │   │   └── VesselTrack.tsx
│   │   │
│   │   ├── simulation/          # Counterfactual forward modeling
│   │   │   ├── ObservedSimulationComparison.tsx
│   │   │   ├── SimulationMetrics.tsx
│   │   │   └── SimulationWorkflow.tsx
│   │   │
│   │   ├── evidence/            # Cryptographic chain of custody
│   │   │   ├── EvidenceChain.tsx
│   │   │   ├── EvidenceDetails.tsx
│   │   │   ├── EvidenceItem.tsx
│   │   │   └── ProvenancePanel.tsx
│   │   │
│   │   └── reports/             # Forensic dossier export
│   │       ├── ReportActions.tsx
│   │       └── ReportSummary.tsx
│   │
│   ├── config/
│   │   ├── constants.ts         # Pipeline stages & defaults
│   │   ├── environment.ts       # Typed environment variable access
│   │   └── navigation.ts        # Navigation re-exports
│   │
│   ├── data/
│   │   └── demo/                # Isolated demo data fixtures
│   │       ├── detection.ts
│   │       ├── incidents.ts
│   │       ├── origin.ts
│   │       ├── simulation.ts
│   │       └── vessels.ts
│   │
│   ├── hooks/
│   │   ├── useApi.ts            # Type-safe async API hook
│   │   ├── useInvestigation.ts  # Active incident & pipeline stage state
│   │   └── useMapLayers.ts      # Cartographic layer visibility toggles
│   │
│   ├── pages/
│   │   ├── Counterfactual/
│   │   ├── Dashboard/
│   │   ├── DataSources/
│   │   ├── Detection/
│   │   ├── Evidence/
│   │   ├── Investigations/
│   │   ├── Landing/
│   │   ├── Login/
│   │   ├── NotFound/
│   │   ├── Origin/
│   │   ├── Reports/
│   │   ├── SystemStatus/
│   │   ├── Validation/
│   │   └── Vessels/
│   │
│   ├── router/
│   │   └── AppRouter.tsx        # React Router hierarchy
│   │
│   ├── services/
│   │   ├── api/                 # Central API client & typed endpoints
│   │   │   ├── client.ts
│   │   │   ├── detection.ts
│   │   │   ├── evidence.ts
│   │   │   ├── incidents.ts
│   │   │   ├── origin.ts
│   │   │   ├── reports.ts
│   │   │   ├── simulations.ts
│   │   │   ├── validation.ts
│   │   │   └── vessels.ts
│   │   └── maps/
│   │       └── mapConfig.ts     # MapLibre basemap & view settings
│   │
│   ├── styles/
│   │   ├── globals.css          # Tailwind directives & dark scrollbars
│   │   └── theme.css            # Brand CSS variables & palette
│   │
│   ├── types/                   # Domain TypeScript definitions
│   │   ├── detection.ts
│   │   ├── evidence.ts
│   │   ├── incident.ts
│   │   ├── origin.ts
│   │   ├── report.ts
│   │   ├── simulation.ts
│   │   ├── validation.ts
│   │   └── vessel.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env.example
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 4. Installation & Getting Started

### Prerequisites
- Node.js >= 18 (Tested on v26)
- npm >= 9

### Install Dependencies
```bash
npm install
```

### Start Local Development Server
```bash
npm run dev
```
Accessible at: `http://localhost:3000`

### Build Production Bundle
```bash
npm run build
```

---

## 5. Environment Variables
Create a `.env` file in the root directory from `.env.example`:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of backend forensic service | `http://localhost:8000` |
| `VITE_MAP_STYLE_URL` | Vector basemap tile JSON URL | `https://demotiles.maplibre.org/style.json` |

*Security Notice: Never commit API credentials or secrets into frontend code.*

---

## 6. Routing Map

| Route | View | Description | Shell |
| :--- | :--- | :--- | :--- |
| `/` | Landing Page | Public architecture and feature overview | Minimal |
| `/login` | Login Page | Analyst authentication and session access | Minimal |
| `/app` | Investigation Console | Central command dashboard with map & telemetry | `AppLayout` |
| `/app/incidents` | Incidents | Triage queue of detected oil spill scenes | `AppLayout` |
| `/app/detection` | Detection | SAR viewer, segmentation mask, and AI metrics | `AppLayout` |
| `/app/validation` | Validation | Look-alike risk and metocean screening | `AppLayout` |
| `/app/origin` | Origin Reconstruction | Backward drift ensemble and probable zone | `AppLayout` |
| `/app/vessels` | Vessel Intelligence | AIS track correlations and compatibility ranking | `AppLayout` |
| `/app/counterfactual` | Counterfactual | Forward OpenOil simulation and IoU scores | `AppLayout` |
| `/app/evidence` | Evidence Package | Cryptographic SHA-256 chain of custody | `AppLayout` |
| `/app/reports` | Reports | Forensic dossier export and distribution | `AppLayout` |
| `/app/data-sources` | Data Sources | Real-time sensor, satellite, and ocean feeds | `AppLayout` |
| `/app/system-status` | System Status | Compute nodes, GPU workers, and API health | `AppLayout` |
| `*` | Not Found | 404 handler with return navigation | Standalone |

---

## 7. Design System & Brand Palette
Configured in `src/styles/theme.css` and extended via `tailwind.config.js`:

- **Mint (`--color-mint`)**: `#45EBA5` (Accents, top candidates, active radar returns)
- **Teal (`--color-teal`)**: `#21ABA5` (Secondary highlights, outlines, status info)
- **Deep Teal (`--color-deep-teal`)**: `#1D566E` (Active tab fills, nautical panels)
- **Navy (`--color-navy`)**: `#163A5F` (Tactical surfaces, container backgrounds)
- **Primary Background**: `#08121E` (Dark maritime abyssal background)
- **Surface**: `#12263F` (Elevated card background)

---

## 8. Development Status

### ✅ Implemented
- [x] Complete Vite + React 18 + TypeScript strict setup.
- [x] Tailwind CSS maritime design system configuration with custom color tokens.
- [x] Configuration-driven sidebar navigation (`navigationConfig.ts`).
- [x] Responsive layout architecture (`AppLayout`, `Sidebar`, `Topbar`, `PageContainer`).
- [x] React Router skeleton for all 13 required public and application routes.
- [x] Map foundation with MapLibre GL JS and deck.gl layer overlays.
- [x] Reusable common components: `Button`, `Badge`, `Card`, `StatusIndicator`, `LoadingState`, `EmptyState`, `ErrorState`.
- [x] Investigation Console with Header, Pipeline stages, Map, Summary, and Chronological Timeline.
- [x] Complete TypeScript interfaces for Incidents, Detections, Validations, Origins, Vessels, Simulations, Evidence, and Reports.
- [x] Isolated demo data structures (`data/demo/*`) with explicit "DEMO DATA" labeling.
- [x] Typed API client and placeholder modules for all analytical services.

### 🟡 Placeholder / Architecture Foundations
- [ ] MapLibre layer data connected to live GeoTIFF COGs and Vector Tiles.
- [ ] Real-time WebSocket connection to telemetry pipelines.
- [ ] Authentication session tokens tied to OAuth / OIDC provider.

### ⏳ Planned Backend Integrations
- [ ] Automated Sentinel-1 SAR acquisition pipeline via ESA Copernicus API.
- [ ] ResNet50-UNet++ AI inference service.
- [ ] OpenDrift / OpenOil backward and forward Lagrangian trajectory runs.
- [ ] Spire AIS real-time kinematics and MMSI cross-referencing.
- [ ] PDF legal dossier compilation engine.

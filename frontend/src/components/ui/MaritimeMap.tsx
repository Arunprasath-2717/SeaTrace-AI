import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, ZoomIn, ZoomOut, Layers, Eye, EyeOff, Navigation } from 'lucide-react';

/* ── India EEZ approximate boundary points (lat/lon) ──────────────── */
const INDIA_EEZ: [number, number][] = [
  [23.5, 61.0],[22.0, 58.5],[19.5, 57.0],[16.0, 56.0],[12.5, 55.5],
  [8.0,  57.0],[6.5,  60.0],[7.0,  68.0],[8.2,  74.0],[8.5,  77.5],
  [9.0,  80.5],[10.0, 84.0],[13.5, 88.0],[17.0, 89.5],[20.0, 89.0],
  [22.0, 89.5],[23.0, 89.0],[22.5, 87.0],[24.0, 85.0],[24.5, 80.0],
  [26.0, 75.0],[27.0, 70.0],[25.5, 66.0],[24.5, 63.5],[23.5, 61.0],
];

/* ── Oil slick polygons (Arabian Sea locations) ────────────────────── */
const OIL_SLICKS = [
  {
    id: 'ST-2046', status: 'confirmed', area: '48.6 km²', vessel: 'MT OCEAN TITAN',
    coords: [[21.45, 67.8],[21.55, 68.1],[21.35, 68.3],[21.2, 68.0],[21.3, 67.7]] as [number,number][],
    color: '#ef4444',
  },
  {
    id: 'ST-2047', status: 'investigating', area: '12.3 km²', vessel: 'MV ADRIATIC STAR',
    coords: [[19.1, 71.5],[19.2, 71.8],[19.0, 72.0],[18.85, 71.7],[18.9, 71.4]] as [number,number][],
    color: '#f97316',
  },
  {
    id: 'ST-2048', status: 'investigating', area: '6.1 km²', vessel: 'Unknown',
    coords: [[15.5, 73.2],[15.6, 73.5],[15.4, 73.6],[15.25, 73.3],[15.3, 73.0]] as [number,number][],
    color: '#f97316',
  },
];

/* ── Vessels ──────────────────────────────────────────────────────── */
const VESSELS = [
  { id: 'MT OCEAN TITAN',  lat: 21.45, lon: 68.32, status: 'PRIME SUSPECT', color: '#ef4444', speed: '0.0 kn (AIS Dark)' },
  { id: 'MV ADRIATIC STAR', lat: 19.22, lon: 72.11, status: 'MONITORING',    color: '#f97316', speed: '12.4 kn' },
  { id: 'MT PACIFIC GLORY', lat: 22.10, lon: 65.80, status: 'CLEAR',         color: '#10b981', speed: '14.1 kn' },
];

/* ── 72-Hour Metocean Drift Forecast Data (OpenDrift / NOAA GNOME) ─── */
const DRIFT_WAYPOINTS = [
  {
    step: 'T+00h',
    time: 'Sep 28 06:00 UTC',
    lat: 21.45,
    lon: 68.10,
    distNm: 0.0,
    areaKm2: 48.6,
    evapPct: 0.0,
    emulsPct: 0.0,
    wind: '6.4 m/s WSW',
    current: '0.42 m/s ESE',
    color: '#ef4444',
    risk: 'Ground Zero',
  },
  {
    step: 'T+12h',
    time: 'Sep 28 18:00 UTC',
    lat: 21.58,
    lon: 68.35,
    distNm: 15.8,
    areaKm2: 56.2,
    evapPct: 18.2,
    emulsPct: 12.0,
    wind: '6.7 m/s WSW',
    current: '0.44 m/s ESE',
    color: '#f59e0b',
    risk: 'Open Water Drift',
  },
  {
    step: 'T+24h',
    time: 'Sep 29 06:00 UTC',
    lat: 21.72,
    lon: 68.62,
    distNm: 32.4,
    areaKm2: 68.9,
    evapPct: 27.5,
    emulsPct: 28.4,
    wind: '7.1 m/s WSW',
    current: '0.45 m/s ESE',
    color: '#f97316',
    risk: 'Intermediate Drift',
  },
  {
    step: 'T+48h',
    time: 'Sep 30 06:00 UTC',
    lat: 21.98,
    lon: 69.15,
    distNm: 64.8,
    areaKm2: 89.4,
    evapPct: 38.0,
    emulsPct: 49.2,
    wind: '6.8 m/s WSW',
    current: '0.41 m/s ESE',
    color: '#0284c7',
    risk: 'Coastal Watch (42 NM)',
  },
  {
    step: 'T+72h',
    time: 'Oct 01 06:00 UTC',
    lat: 22.21,
    lon: 69.65,
    distNm: 96.2,
    areaKm2: 114.7,
    evapPct: 44.2,
    emulsPct: 65.0,
    wind: '6.2 m/s WSW',
    current: '0.38 m/s ESE',
    color: '#8b5cf6',
    risk: 'High Alert: Saurashtra Coastal Approach',
  },
];

/* ── Drift Dispersion Uncertainty Envelope (90% Confidence Cone) ─── */
const DRIFT_CONE: [number, number][] = [
  [21.45, 68.10],
  [21.65, 68.20],
  [21.88, 68.45],
  [22.20, 68.95],
  [22.50, 69.50],
  [22.40, 69.85],
  [22.21, 69.65],
  [21.98, 69.45],
  [21.75, 69.00],
  [21.50, 68.50],
  [21.32, 68.20],
  [21.45, 68.10],
];

/* ── Basemap Configurations (100% Free, No API Keys Required) ─────── */
export type BasemapType = 'ocean' | 'satellite' | 'dark' | 'osm';

interface BasemapConfig {
  label: string;
  base: string;
  ref?: string;
  maxZoom: number;
}

const BASEMAPS: Record<BasemapType, BasemapConfig> = {
  ocean: {
    label: 'Ocean',
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    ref: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 16,
  },
  satellite: {
    label: 'Satellite',
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ref: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
  },
  dark: {
    label: 'Dark',
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    ref: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 16,
  },
  osm: {
    label: 'OSM',
    base: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
  },
};

interface MaritimeMapProps {
  onSelectVessel?: (vesselName: string) => void;
  onSelectSlick?: (slickId: string) => void;
}

export const MaritimeMap: React.FC<MaritimeMapProps> = ({ onSelectVessel, onSelectSlick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletRef = useRef<typeof import('leaflet') | null>(null);
  const activeTileLayersRef = useRef<{ base?: any; ref?: any }>({});

  const [activeBasemap, setActiveBasemap] = useState<BasemapType>('ocean');
  const [showSwath, setShowSwath] = useState(true);
  const [showDrift, setShowDrift] = useState(true);

  const swathLayerRef = useRef<any>(null);
  const driftLayerGroupRef = useRef<any>(null);

  /* Function to swap basemap tiles cleanly */
  const applyBasemap = (type: BasemapType) => {
    const map = mapInstanceRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    // Remove existing tile layers
    if (activeTileLayersRef.current.base) {
      map.removeLayer(activeTileLayersRef.current.base);
    }
    if (activeTileLayersRef.current.ref) {
      map.removeLayer(activeTileLayersRef.current.ref);
    }

    const cfg = BASEMAPS[type];
    const newBase = L.tileLayer(cfg.base, {
      maxZoom: cfg.maxZoom,
      attribution: '© Esri / OSM / SeaTrace',
    }).addTo(map);

    let newRef: any = null;
    if (cfg.ref) {
      newRef = L.tileLayer(cfg.ref, {
        maxZoom: cfg.maxZoom,
        zIndex: 10,
      }).addTo(map);
    }

    activeTileLayersRef.current = { base: newBase, ref: newRef };
    setActiveBasemap(type);
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let map: import('leaflet').Map;

    const init = async () => {
      try {
        const L = await import('leaflet');
        leafletRef.current = L;

        /* fix default icon URLs */
        (L.Icon.Default.prototype as unknown as Record<string, unknown>)['_getIconUrl'] = undefined;
        delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)['_getIconUrl'];
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        map = L.map(mapRef.current!, {
          center: [21.1, 69.2],
          zoom: 6.2,
          zoomControl: false,
          attributionControl: false,
        });

        mapInstanceRef.current = map;

        /* Apply initial basemap (Ocean Bathymetry) */
        const oceanCfg = BASEMAPS['ocean'];
        const baseLayer = L.tileLayer(oceanCfg.base, {
          maxZoom: oceanCfg.maxZoom,
          attribution: '© Esri Ocean / SeaTrace',
        }).addTo(map);

        let refLayer: any = null;
        if (oceanCfg.ref) {
          refLayer = L.tileLayer(oceanCfg.ref, {
            maxZoom: oceanCfg.maxZoom,
            zIndex: 10,
          }).addTo(map);
        }

        activeTileLayersRef.current = { base: baseLayer, ref: refLayer };

        /* India EEZ boundary */
        L.polygon(INDIA_EEZ, {
          color: '#38bdf8', weight: 2, opacity: 0.9,
          fillColor: '#38bdf8', fillOpacity: 0.05,
          dashArray: '8 5',
        }).addTo(map).bindPopup(`
          <div style="font-family:'Inter',system-ui,sans-serif;font-size:12px;padding:4px">
            <strong style="color:#0284c7;font-size:13px">India EEZ Boundary</strong>
            <p style="margin:4px 0 0;color:#334155;font-weight:600">Exclusive Economic Zone — 200 Nautical Miles</p>
          </div>
        `);

        /* Territorial waters reference ring */
        L.circle([15, 74], {
          radius: 1200000,
          color: '#6366f1', weight: 1.5, opacity: 0.5,
          fillColor: '#6366f1', fillOpacity: 0.03,
          dashArray: '5 5',
        }).addTo(map);

        /* Oil slick polygons */
        OIL_SLICKS.forEach(slick => {
          const poly = L.polygon(slick.coords, {
            color: slick.color, weight: 2.5, opacity: 1,
            fillColor: slick.color, fillOpacity: 0.45,
          }).addTo(map);

          poly.bindPopup(`
            <div style="font-family:'Inter',system-ui,sans-serif;font-size:12px;min-width:180px;padding:4px">
              <div style="font-weight:900;color:${slick.color};font-size:14px;margin-bottom:6px">🚨 ${slick.id}</div>
              <div style="color:#1e293b;margin-bottom:2px">Surface Area: <strong>${slick.area}</strong></div>
              <div style="color:#1e293b;margin-bottom:2px">Classification: <strong style="color:${slick.color}">${slick.status.toUpperCase()}</strong></div>
              <div style="color:#1e293b">Attribution Suspect: <strong>${slick.vessel}</strong></div>
            </div>
          `, { maxWidth: 240 });

          poly.on('click', () => {
            if (onSelectSlick) onSelectSlick(slick.id);
          });

          /* Pulsing perimeter radar echo */
          L.circle([slick.coords[0][0], slick.coords[0][1]], {
            radius: 24000,
            color: slick.color, weight: 1.2, opacity: 0.5,
            fillColor: slick.color, fillOpacity: 0.1,
          }).addTo(map);
        });

        /* ── 72-HOUR HYDRODYNAMIC DRIFT FORECAST LAYER ─────────────── */
        const driftGroup = L.layerGroup();

        // 1. Spreading / Uncertainty Dispersion Envelope
        L.polygon(DRIFT_CONE, {
          color: '#06b6d4',
          weight: 1.5,
          opacity: 0.85,
          fillColor: '#06b6d4',
          fillOpacity: 0.14,
          dashArray: '5 4',
        }).addTo(driftGroup).bindPopup(`
          <div style="font-family:'Inter',system-ui,sans-serif;font-size:12px;padding:4px">
            <strong style="color:#0891b2;font-size:13px">72-Hour Drift Uncertainty Envelope</strong>
            <p style="margin:4px 0 2px;color:#334155;font-weight:600">OpenDrift Monte Carlo Ensemble (90% Confidence Cone)</p>
            <p style="margin:0;color:#64748b;font-size:11px">Forced by ECMWF ERA5 10m wind (6.4 m/s) & CMEMS Mercator currents (0.42 m/s)</p>
          </div>
        `);

        // 2. Trajectory Polyline connecting forecast timesteps
        const trajectoryPoints = DRIFT_WAYPOINTS.map(w => [w.lat, w.lon] as [number, number]);
        L.polyline(trajectoryPoints, {
          color: '#0284c7',
          weight: 3.5,
          opacity: 0.95,
          dashArray: '8 6',
        }).addTo(driftGroup);

        // 3. Interactive Drift Waypoint Pins
        DRIFT_WAYPOINTS.forEach((wp) => {
          const icon = L.divIcon({
            className: '',
            html: `
              <div style="position:relative;display:flex;align-items:center;cursor:pointer">
                <div style="position:absolute;width:12px;height:12px;border-radius:50%;background:${wp.color};border:2px solid #fff;left:0;box-shadow:0 0 8px ${wp.color}"></div>
                <div style="margin-left:14px;background:#0f172aee;border:1px solid ${wp.color};color:#fff;font-family:'Inter',sans-serif;font-size:10px;font-weight:800;padding:2px 6px;border-radius:6px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.5)">
                  ${wp.step}
                </div>
              </div>
            `,
            iconSize: [64, 22],
            iconAnchor: [6, 11],
          });

          L.marker([wp.lat, wp.lon], { icon })
            .addTo(driftGroup)
            .bindPopup(`
              <div style="font-family:'Inter',system-ui,sans-serif;font-size:12px;min-width:240px;padding:4px">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
                  <strong style="color:${wp.color};font-size:13px">🌊 Drift Forecast: ${wp.step}</strong>
                  <span style="font-size:10px;font-weight:700;background:${wp.color}22;color:${wp.color};padding:2px 6px;border-radius:4px;margin-left:8px">${wp.risk}</span>
                </div>
                <div style="color:#1e293b;margin-bottom:2px">Valid Timestamp: <strong>${wp.time}</strong></div>
                <div style="color:#1e293b;margin-bottom:2px">Coordinates: <strong>${wp.lat.toFixed(2)}°N, ${wp.lon.toFixed(2)}°E</strong></div>
                <div style="color:#1e293b;margin-bottom:2px">Drift Distance: <strong>${wp.distNm.toFixed(1)} Nautical Miles</strong></div>
                <div style="color:#1e293b;margin-bottom:2px">Projected Area: <strong>${wp.areaKm2.toFixed(1)} km² (Fay spreading)</strong></div>
                <div style="border-top:1px solid #e2e8f0;margin-top:6px;padding-top:4px">
                  <div style="color:#475569;font-size:11px">Weathering: <strong>${wp.evapPct}% Evaporated · ${wp.emulsPct}% Emulsified</strong></div>
                  <div style="color:#475569;font-size:11px">Forcing: <strong>Wind ${wp.wind} · Current ${wp.current}</strong></div>
                </div>
              </div>
            `, { maxWidth: 280 });
        });

        driftGroup.addTo(map);
        driftLayerGroupRef.current = driftGroup;

        /* Vessel markers */
        VESSELS.forEach(vessel => {
          const icon = L.divIcon({
            className: '',
            html: `
              <div style="position:relative;width:26px;height:26px;cursor:pointer">
                <div style="position:absolute;inset:0;border-radius:50%;background:${vessel.color};opacity:0.35;animation:ping 1.6s ease-in-out infinite"></div>
                <div style="position:absolute;inset:3px;border-radius:50%;background:${vessel.color};border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.5)"></div>
              </div>
            `,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          });

          const marker = L.marker([vessel.lat, vessel.lon], { icon }).addTo(map).bindPopup(`
            <div style="font-family:'Inter',system-ui,sans-serif;font-size:12px;min-width:210px;padding:4px">
              <div style="font-weight:900;color:#0f172a;font-size:13px;margin-bottom:6px">⚓ ${vessel.id}</div>
              <div style="color:#334155;margin-bottom:2px">Tactical Status: <strong style="color:${vessel.color}">${vessel.status}</strong></div>
              <div style="color:#334155;margin-bottom:2px">Speed Over Ground: <strong>${vessel.speed}</strong></div>
              <div style="color:#334155">Coordinates: <strong>${vessel.lat.toFixed(2)}°N, ${vessel.lon.toFixed(2)}°E</strong></div>
            </div>
          `, { maxWidth: 260 });

          marker.on('click', () => {
            if (onSelectVessel) onSelectVessel(vessel.id);
          });
        });

        /* Sentinel-1B SAR swath bounding box */
        const swath = L.rectangle([[18.5, 65.5], [23.5, 71.2]], {
          color: '#06b6d4', weight: 2, opacity: 0.75,
          fillColor: '#06b6d4', fillOpacity: 0.08,
          dashArray: '6 4',
        }).addTo(map).bindPopup(`
          <div style="font-family:'Inter',system-ui,sans-serif;font-size:12px;padding:4px">
            <strong style="color:#0891b2;font-size:13px">Sentinel-1B C-SAR Swath</strong>
            <p style="margin:4px 0 0;color:#334155;font-weight:600">IW Mode · VV Polarisation · Coincident Satellite Pass</p>
          </div>
        `);
        swathLayerRef.current = swath;

        /* Inject CSS for ping animation */
        if (!document.getElementById('leaflet-ping-style')) {
          const style = document.createElement('style');
          style.id = 'leaflet-ping-style';
          style.textContent = `@keyframes ping{0%,100%{transform:scale(1);opacity:.45}50%{transform:scale(2.2);opacity:0}}`;
          document.head.appendChild(style);
        }
      } catch (e) {
        console.error('Leaflet init error:', e);
      }
    };

    init();

    /* ResizeObserver to automatically resize map when layout or sidebar expands */
    let ro: ResizeObserver | null = null;
    if (mapRef.current) {
      ro = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      ro.observe(mapRef.current);
    }

    return () => {
      ro?.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onSelectVessel, onSelectSlick]);

  /* Toolbar actions */
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([18.2, 70.8], 5.5, { duration: 0.8 });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const toggleSwath = () => {
    if (swathLayerRef.current && mapInstanceRef.current) {
      if (showSwath) {
        mapInstanceRef.current.removeLayer(swathLayerRef.current);
      } else {
        swathLayerRef.current.addTo(mapInstanceRef.current);
      }
      setShowSwath(!showSwath);
    }
  };

  const toggleDrift = () => {
    if (driftLayerGroupRef.current && mapInstanceRef.current) {
      if (showDrift) {
        mapInstanceRef.current.removeLayer(driftLayerGroupRef.current);
      } else {
        driftLayerGroupRef.current.addTo(mapInstanceRef.current);
      }
      setShowDrift(!showDrift);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full rounded-2xl overflow-hidden shadow-sm"
      style={{ height: 380, border: '1px solid #cbd5e1' }}
    >
      {/* Map canvas */}
      <div ref={mapRef} className="w-full h-full bg-slate-900" />

      {/* Floating Map Controls & Basemap Switcher */}
      <div className="absolute top-3 right-3 z-[999] flex items-center gap-2 flex-wrap justify-end">
        {/* Basemap Switcher (Ocean, Satellite, Dark, OSM) */}
        <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md rounded-xl p-1 border border-slate-700 shadow-md">
          <Layers className="w-3.5 h-3.5 text-indigo-400 ml-1.5 mr-0.5" />
          {(['ocean', 'satellite', 'dark', 'osm'] as BasemapType[]).map((type) => (
            <button
              key={type}
              onClick={() => applyBasemap(type)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                activeBasemap === type
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {BASEMAPS[type].label}
            </button>
          ))}
        </div>

        {/* Drift & Swath Layer Toggles */}
        <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md rounded-xl p-1 border border-slate-700 shadow-md">
          {/* 72h Drift Forecast Toggle */}
          <button
            onClick={toggleDrift}
            title="Toggle 72-Hour Metocean Drift Forecast Trajectory"
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              showDrift
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Navigation className="w-3 h-3 rotate-45" />
            <span>72h Drift</span>
          </button>

          {/* SAR Swath Toggle */}
          <button
            onClick={toggleSwath}
            title="Toggle Sentinel-1B SAR Swath"
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              showSwath
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {showSwath ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>SAR Swath</span>
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md rounded-xl p-1 border border-slate-700 shadow-md">
          <button
            onClick={handleRecenter}
            title="Re-center Arabian Sea & Indian Maritime Area"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Crosshair style={{ width: 14, height: 14 }} />
          </button>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ZoomIn style={{ width: 14, height: 14 }} />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ZoomOut style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-emerald-500/40 shadow-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wide">FORECAST LIVE</span>
        </div>
      </div>

      {/* Overlay Legend */}
      <div className="absolute bottom-3 left-3 z-[999] flex flex-col gap-1.5 bg-slate-950/85 backdrop-blur-md rounded-xl px-3 py-2 border border-slate-700 shadow-md">
        <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
          Maritime Legend
        </div>
        {[
          { c: '#ef4444', l: 'Confirmed Slick (ST-2046)' },
          { c: '#0284c7', l: '72h Drift Trajectory' },
          { c: '#06b6d4', l: '90% Spreading Envelope' },
          { c: '#38bdf8', l: 'India EEZ (200 NM)' },
          { c: '#10b981', l: 'Cleared Vessel' },
        ].map(item => (
          <div key={item.l} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ background: item.c }} />
            <span className="text-[10px] text-slate-200 font-bold">{item.l}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MaritimeMap;

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { SpillIncident, Vessel } from '../../types/oceanSentinel';
import { Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// Carto Basemaps API Key from environment variables (optional)
const CARTO_API_KEY = import.meta.env.VITE_CARTO_API_KEY || '';
const cartoKeyParam = CARTO_API_KEY ? `?key=${CARTO_API_KEY}` : '';

export type BaseLayerType = 'voyager' | 'dark' | 'satellite' | 'streets';

const BASEMAP_PROVIDERS: Record<
  BaseLayerType,
  {
    name: string;
    url: string;
    options: L.TileLayerOptions;
  }
> = {
  voyager: {
    name: 'Voyager',
    url: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png${cartoKeyParam}`,
    options: {
      subdomains: 'abcd',
      maxZoom: 20,
      attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
    },
  },
  dark: {
    name: 'Dark Ops',
    url: `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png${cartoKeyParam}`,
    options: {
      subdomains: 'abcd',
      maxZoom: 20,
      attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
    },
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxZoom: 18,
      attribution: '&copy; Esri World Imagery',
    },
  },
  streets: {
    name: 'Streets',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors',
    },
  },
};

interface LeafletMaritimeMapProps {
  incidents: SpillIncident[];
  vessels: Vessel[];
  selectedIncident?: SpillIncident | null;
  onSelectIncident?: (inc: SpillIncident) => void;
  selectedVessel?: Vessel | null;
  onSelectVessel?: (vessel: Vessel) => void;
  showLayersControl?: boolean;
  className?: string;
  focusedCoordinates?: { lat: number; lng: number; zoom?: number } | null;
  defaultBaseLayer?: BaseLayerType;
}

export const LeafletMaritimeMap: React.FC<LeafletMaritimeMapProps> = ({
  incidents,
  vessels,
  selectedIncident,
  onSelectIncident,
  selectedVessel,
  onSelectVessel,
  showLayersControl = true,
  className = 'w-full h-full',
  focusedCoordinates,
  defaultBaseLayer = 'voyager',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Layer toggle states
  const [layers, setLayers] = useState({
    spills: true,
    vessels: true,
    tracks: true,
    drift: true,
    boundaries: true,
  });

  const [activeBaseLayer, setActiveBaseLayer] = useState<BaseLayerType>(defaultBaseLayer);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [15.2, 78.0], // Centered on Indian Ocean / Subcontinent
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Tile provider with Carto API Key
    const initialConfig = BASEMAP_PROVIDERS[defaultBaseLayer] || BASEMAP_PROVIDERS.voyager;
    const initialTileLayer = L.tileLayer(initialConfig.url, initialConfig.options);
    initialTileLayer.addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const config = BASEMAP_PROVIDERS[activeBaseLayer] || BASEMAP_PROVIDERS.voyager;
    const newTileLayer = L.tileLayer(config.url, config.options);

    newTileLayer.addTo(map);
    newTileLayer.bringToBack();
  }, [activeBaseLayer]);

  // Handle flyTo when focusedCoordinates changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !focusedCoordinates) return;
    map.flyTo([focusedCoordinates.lat, focusedCoordinates.lng], focusedCoordinates.zoom || 8, {
      duration: 1.5,
    });
  }, [focusedCoordinates]);

  // Render Overlays: Incidents, Polygons, Vessels, Tracks
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Render Spill Incidents & Polygons
    if (layers.spills) {
      incidents.forEach((inc) => {
        const isSelected = selectedIncident?.id === inc.id;

        // Color based on severity
        let primaryColor = '#EF4444'; // Critical
        if (inc.severity === 'High') primaryColor = '#F59E0B';
        if (inc.severity === 'Medium') primaryColor = '#14B8A6';
        if (inc.severity === 'Low') primaryColor = '#00C2FF';

        // Polygon overlay
        if (inc.polygon && inc.polygon.length > 0) {
          const poly = L.polygon(inc.polygon, {
            color: primaryColor,
            weight: isSelected ? 3 : 1.5,
            fillColor: primaryColor,
            fillOpacity: isSelected ? 0.45 : 0.25,
            dashArray: isSelected ? undefined : '4, 4',
          });

          poly.bindTooltip(
            `<div class="text-xs font-mono"><strong>${inc.code}</strong>: ${inc.estimatedAreaKm2} km² (${inc.confidencePct}% conf)</div>`,
            { className: 'leaflet-custom-tooltip' }
          );

          poly.on('click', () => {
            if (onSelectIncident) onSelectIncident(inc);
          });

          poly.addTo(layerGroup);
        }

        // Spill Center Marker
        const markerHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="absolute w-8 h-8 rounded-full animate-ping opacity-60" style="background-color: ${primaryColor};"></div>
            <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-black text-slate-950" style="background-color: ${primaryColor};">
              ⚠️
            </div>
            <div class="absolute -bottom-5 px-1.5 py-0.5 rounded bg-slate-950/90 text-white font-mono text-[9px] border border-slate-700 whitespace-nowrap shadow-md pointer-events-none">
              ${inc.code}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: 'custom-spill-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([inc.lat, inc.lng], { icon });
        marker.on('click', () => {
          if (onSelectIncident) onSelectIncident(inc);
        });
        marker.addTo(layerGroup);

        // Drift Prediction vector arrow
        if (layers.drift && inc.driftDirectionDeg !== undefined) {
          const rad = (inc.driftDirectionDeg * Math.PI) / 180;
          const arrowLen = 0.4;
          const endLat = inc.lat + arrowLen * Math.cos(rad);
          const endLng = inc.lng + arrowLen * Math.sin(rad);

          const driftLine = L.polyline(
            [
              [inc.lat, inc.lng],
              [endLat, endLng],
            ],
            {
              color: '#00C2FF',
              weight: 2,
              dashArray: '5, 5',
            }
          );
          driftLine.bindTooltip(`Drift: ${inc.driftDirectionDeg}° @ ${inc.driftSpeedKts} kts`, {
            className: 'leaflet-custom-tooltip',
          });
          driftLine.addTo(layerGroup);
        }
      });
    }

    // 2. Render Vessels
    if (layers.vessels) {
      vessels.forEach((v) => {
        const isSuspect = v.investigationStatus === 'Prime Suspect';
        const isPOI = v.investigationStatus === 'Person of Interest';
        const isSelected = selectedVessel?.id === v.id;

        let vesselColor = '#38BDF8'; // Normal commercial blue
        if (isSuspect) vesselColor = '#EF4444';
        if (isPOI) vesselColor = '#F59E0B';
        if (v.type === 'Patrol Vessel') vesselColor = '#10B981';

        // Directional SVG Vessel Marker rotated to heading
        const heading = v.headingDeg || 0;
        const vesselHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group" style="transform: rotate(${heading}deg);">
            ${isSelected ? '<span class="absolute -inset-1.5 rounded-full border-2 border-[#00C2FF] animate-pulse"></span>' : ''}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="${vesselColor}" stroke="${isSelected ? '#00C2FF' : '#ffffff'}" stroke-width="${isSelected ? '2' : '1.5'}">
              <path d="M12 2L3 20L12 16L21 20L12 2Z" />
            </svg>
            ${isSuspect ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>' : ''}
          </div>
        `;

        const icon = L.divIcon({
          html: vesselHtml,
          className: 'custom-vessel-icon',
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const marker = L.marker([v.currentLat, v.currentLng], { icon });

        marker.bindTooltip(
          `<div class="text-xs font-mono font-bold">${v.name} (${v.type})<br/><span class="text-slate-400 font-normal">MMSI: ${v.mmsi} | ${v.speedKts} kts @ ${v.headingDeg}°</span></div>`,
          { className: 'leaflet-custom-tooltip' }
        );

        marker.on('click', () => {
          if (onSelectVessel) onSelectVessel(v);
        });

        marker.addTo(layerGroup);

        // Historical AIS Track
        if (layers.tracks && v.track && v.track.length > 1) {
          const latlngs: [number, number][] = v.track.map((pt) => [pt.lat, pt.lng]);
          const trackLine = L.polyline(latlngs, {
            color: isSuspect ? '#EF4444' : '#64748B',
            weight: isSuspect ? 2.5 : 1.5,
            dashArray: isSuspect ? '6, 4' : '2, 4',
            opacity: 0.8,
          });
          trackLine.addTo(layerGroup);
        }
      });
    }

    // 3. Indian EEZ Maritime Boundaries (Approximate guideline lines)
    if (layers.boundaries) {
      const eezPoints: [number, number][] = [
        [22.5, 68.0],
        [19.0, 69.5],
        [15.0, 71.0],
        [10.0, 74.0],
        [7.0, 77.5],
        [6.0, 80.0],
        [10.0, 84.0],
        [15.0, 86.5],
        [20.5, 89.0],
      ];

      const boundaryLine = L.polyline(eezPoints, {
        color: '#14B8A6',
        weight: 1.2,
        dashArray: '8, 8',
        opacity: 0.5,
      });
      boundaryLine.bindTooltip('Indian EEZ Security Perimeter (200 NM)', {
        className: 'leaflet-custom-tooltip',
      });
      boundaryLine.addTo(layerGroup);
    }
  }, [incidents, vessels, selectedIncident, selectedVessel, layers]);

  return (
    <div className={`relative ${className} overflow-hidden rounded-2xl border border-[#23364B] bg-[#07111F]`}>
      {/* Actual Leaflet Map container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls Top-Right */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Layer Toggle Menu Button */}
        {showLayersControl && (
          <div className="relative">
            <button
              onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
              className="p-2.5 rounded-xl bg-[#0D1B2A]/90 hover:bg-[#13283F] border border-[#23364B] text-slate-200 shadow-xl backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Map Layers"
            >
              <Layers className="w-4 h-4 text-[#00C2FF]" />
              <span>Layers</span>
            </button>

            {isLayerMenuOpen && (
              <div className="absolute right-0 top-12 w-56 p-3.5 rounded-2xl bg-[#0D1B2A]/95 border border-[#23364B] shadow-2xl backdrop-blur-md text-xs text-slate-200 flex flex-col gap-2.5 z-30">
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400">
                  Basemap Theme
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['voyager', 'dark', 'satellite', 'streets'] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setActiveBaseLayer(b)}
                      className={`px-2 py-1.5 rounded text-[11px] font-semibold capitalize border transition-all text-center ${
                        activeBaseLayer === b
                          ? 'bg-[#00C2FF]/20 border-[#00C2FF] text-[#00C2FF]'
                          : 'border-[#23364B] hover:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {BASEMAP_PROVIDERS[b].name}
                    </button>
                  ))}
                </div>

                <div className="h-px bg-[#23364B] my-1" />

                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400">
                  Intelligence Layers
                </span>

                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={layers.spills}
                    onChange={(e) => setLayers({ ...layers, spills: e.target.checked })}
                    className="accent-[#00C2FF] rounded"
                  />
                  <span>Oil Spill Incidents (8)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={layers.vessels}
                    onChange={(e) => setLayers({ ...layers, vessels: e.target.checked })}
                    className="accent-[#00C2FF] rounded"
                  />
                  <span>AIS Vessel Positions (10)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={layers.tracks}
                    onChange={(e) => setLayers({ ...layers, tracks: e.target.checked })}
                    className="accent-[#00C2FF] rounded"
                  />
                  <span>Historical AIS Tracks</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={layers.drift}
                    onChange={(e) => setLayers({ ...layers, drift: e.target.checked })}
                    className="accent-[#00C2FF] rounded"
                  />
                  <span>Drift Direction Vectors</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={layers.boundaries}
                    onChange={(e) => setLayers({ ...layers, boundaries: e.target.checked })}
                    className="accent-[#00C2FF] rounded"
                  />
                  <span>EEZ Maritime Boundaries</span>
                </label>
              </div>
            )}
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-xl bg-[#0D1B2A]/90 border border-[#23364B] overflow-hidden shadow-xl backdrop-blur-md">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-2 hover:bg-[#13283F] text-slate-300 border-b border-[#23364B]"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-2 hover:bg-[#13283F] text-slate-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Reset View */}
        <button
          onClick={() => mapInstanceRef.current?.flyTo([15.2, 78.0], 5)}
          className="p-2.5 rounded-xl bg-[#0D1B2A]/90 hover:bg-[#13283F] border border-[#23364B] text-slate-300 shadow-xl backdrop-blur-md"
          title="Reset Indian Waters Overview"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Map Legend Bottom-Left */}
      <div className="absolute bottom-4 left-4 z-20 p-3 rounded-2xl bg-[#0D1B2A]/90 border border-[#23364B] shadow-xl backdrop-blur-md text-[11px] text-slate-300 flex flex-col gap-1.5 font-mono">
        <span className="font-bold text-[10px] uppercase text-slate-400 mb-0.5">
          Tactical Map Legend
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span>Critical Slick Polygon</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>High Severity Slick</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
          <span>Prime Suspect Tanker</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>ICG Patrol Vessel</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-[#00C2FF]" />
          <span>Drift Vector Arrow</span>
        </div>
      </div>
    </div>
  );
};

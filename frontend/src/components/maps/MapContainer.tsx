import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl, { Map as MapLibreMap } from 'maplibre-gl';
import { Deck } from '@deck.gl/core';
import { defaultMapConfig, MapViewConfig } from '../../services/maps/mapConfig';
import { MapControls } from './MapControls';
import { LayerControl, LayerState } from './LayerControl';
import { createSlickLayer } from './layers/SlickLayer';
import { createVesselLayer } from './layers/VesselLayer';
import { createTrackLayer } from './layers/TrackLayer';
import { createOriginLayer } from './layers/OriginLayer';
import { createSimulationLayer } from './layers/SimulationLayer';
import { demoVessels } from '../../data/demo/vessels';
import { demoOrigin } from '../../data/demo/origin';
import { demoSimulation } from '../../data/demo/simulation';
import { AlertCircle } from 'lucide-react';

export interface MapContainerProps {
  initialView?: Partial<MapViewConfig>;
  className?: string;
  showControls?: boolean;
  showLayerControl?: boolean;
  children?: React.ReactNode;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  initialView,
  className = '',
  showControls = true,
  showLayerControl = true,
  children,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const deckCanvasRef = useRef<HTMLCanvasElement>(null);
  const mapInstanceRef = useRef<MapLibreMap | null>(null);
  const deckInstanceRef = useRef<Deck | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lng: number; lat: number; zoom: number }>({
    lng: initialView?.center?.[0] ?? defaultMapConfig.defaultView.center[0],
    lat: initialView?.center?.[1] ?? defaultMapConfig.defaultView.center[1],
    zoom: initialView?.zoom ?? defaultMapConfig.defaultView.zoom,
  });

  const [layerVisibility, setLayerVisibility] = useState<LayerState>({
    satellite: true,
    slick: true,
    vessels: true,
    tracks: true,
    origin: true,
    simulation: true,
  });

  const toggleLayer = useCallback((key: keyof LayerState) => {
    setLayerVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Update DeckGL layers when visibility changes
  const updateDeckLayers = useCallback(() => {
    if (!deckInstanceRef.current) return;

    const layers = [];

    // Slick layer
    if (layerVisibility.slick) {
      layers.push(
        createSlickLayer({
          data: [
            {
              id: 'primary-slick',
              contour: [
                [-90.25, 28.42],
                [-90.22, 28.48],
                [-90.18, 28.45],
                [-90.21, 28.40],
                [-90.25, 28.42],
              ],
            },
          ],
        })
      );
    }

    // Vessel tracks layer
    if (layerVisibility.tracks) {
      layers.push(
        createTrackLayer({
          data: demoVessels.map((v) => ({
            vesselId: v.id,
            isCandidateTrack: v.id === 'VESSEL-CANDIDATE-01',
            path: v.track.points.map((p) => [p.longitude, p.latitude] as [number, number]),
          })),
        })
      );
    }

    // Origin reconstruction zone layer
    if (layerVisibility.origin) {
      layers.push(
        createOriginLayer({
          data: [
            {
              id: 'origin-zone-01',
              coordinates: [demoOrigin.probableZone.longitude, demoOrigin.probableZone.latitude],
              radiusMeters: demoOrigin.probableZone.radiusKm * 1000,
            },
          ],
        })
      );
    }

    // Vessel positions layer
    if (layerVisibility.vessels) {
      layers.push(
        createVesselLayer({
          data: demoVessels.map((v) => {
            const latestPoint = v.track.points[v.track.points.length - 1];
            return {
              id: v.id,
              name: v.identity.name,
              mmsi: v.identity.mmsi,
              coordinates: [latestPoint.longitude, latestPoint.latitude],
              attributionScore: v.attributionScore,
              isPrimaryCandidate: v.id === 'VESSEL-CANDIDATE-01',
            };
          }),
        })
      );
    }

    // Forward simulation layer
    if (layerVisibility.simulation) {
      layers.push(
        createSimulationLayer({
          data: [
            {
              id: demoSimulation.id,
              contour: demoSimulation.predictedSlick.coordinates,
              isCounterfactual: true,
            },
          ],
        })
      );
    }

    deckInstanceRef.current.setProps({
      layers: layers.filter(Boolean),
    });
  }, [layerVisibility]);

  useEffect(() => {
    updateDeckLayers();
  }, [updateDeckLayers]);

  // Initialize MapLibre & DeckGL
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: defaultMapConfig.styleUrl,
        center: initialView?.center ?? defaultMapConfig.defaultView.center,
        zoom: initialView?.zoom ?? defaultMapConfig.defaultView.zoom,
        minZoom: defaultMapConfig.defaultView.minZoom,
        maxZoom: defaultMapConfig.defaultView.maxZoom,
        attributionControl: false,
      });

      map.on('load', () => {
        setMapLoaded(true);

        // Deck.gl initialization overlay
        if (deckCanvasRef.current) {
          const deck = new Deck({
            canvas: deckCanvasRef.current,
            width: '100%',
            height: '100%',
            initialViewState: {
              longitude: map.getCenter().lng,
              latitude: map.getCenter().lat,
              zoom: map.getZoom(),
              pitch: map.getPitch(),
              bearing: map.getBearing(),
            },
            controller: false,
          });

          deckInstanceRef.current = deck;
          updateDeckLayers();
        }
      });

      const handleMove = () => {
        const center = map.getCenter();
        const zoom = map.getZoom();
        const pitch = map.getPitch();
        const bearing = map.getBearing();

        setCoords({ lng: center.lng, lat: center.lat, zoom });

        if (deckInstanceRef.current) {
          deckInstanceRef.current.setProps({
            viewState: {
              longitude: center.lng,
              latitude: center.lat,
              zoom,
              pitch,
              bearing,
            },
          });
        }
      };

      map.on('move', handleMove);
      map.on('error', (e) => {
        // Fallback gracefully without breaking UI if tile server is slow/unreachable
        console.warn('MapLibre resource warning:', e);
      });

      mapInstanceRef.current = map;
    } catch (err) {
      console.error('Map initialization failed:', err);
      setMapError('Map data unavailable.');
    }

    return () => {
      if (deckInstanceRef.current) {
        deckInstanceRef.current.finalize();
        deckInstanceRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initialView, updateDeckLayers]);

  // Map Controls callbacks
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut({ duration: 300 });
  };

  const handleResetBearing = () => {
    mapInstanceRef.current?.resetNorthPitch({ duration: 300 });
  };

  const handleFitBounds = () => {
    mapInstanceRef.current?.flyTo({
      center: defaultMapConfig.defaultView.center,
      zoom: defaultMapConfig.defaultView.zoom,
      duration: 1000,
    });
  };

  return (
    <div
      className={`relative w-full h-full min-h-[380px] bg-seatrace-bg-primary rounded-lg overflow-hidden border border-seatrace-border-subtle ${className}`}
    >
      {/* MapLibre DOM Node */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Synchronized DeckGL Canvas Overlay */}
      <canvas
        ref={deckCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Loading overlay */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-seatrace-bg-primary/80 backdrop-blur">
          <div className="w-8 h-8 rounded-full border-2 border-seatrace-deepTeal border-t-seatrace-mint animate-spin mb-3" />
          <span className="text-xs font-mono text-seatrace-text-secondary tracking-wider uppercase">
            Initializing Maritime Cartography...
          </span>
        </div>
      )}

      {/* Error state */}
      {mapError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-seatrace-bg-primary/95 p-6 text-center">
          <AlertCircle className="w-8 h-8 text-seatrace-status-danger mb-2" />
          <h4 className="text-sm font-semibold text-seatrace-text-primary">
            {mapError}
          </h4>
          <p className="text-xs text-seatrace-text-muted mt-1 max-w-sm">
            Check VITE_MAP_STYLE_URL in environment configuration.
          </p>
        </div>
      )}

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute top-4 right-4 z-20">
          <MapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetBearing={handleResetBearing}
            onFitBounds={handleFitBounds}
            coordinates={coords}
          />
        </div>
      )}

      {/* Layer Control Overlay */}
      {showLayerControl && (
        <div className="absolute top-4 left-4 z-20">
          <LayerControl layers={layerVisibility} onToggleLayer={toggleLayer} />
        </div>
      )}

      {/* Additional Map Overlay Content Slot */}
      {children && <div className="absolute inset-0 z-20 pointer-events-none">{children}</div>}

      {/* Cartographic Attribution Footer */}
      <div className="absolute bottom-1 right-2 z-20 pointer-events-none">
        <span className="text-[9px] font-mono text-seatrace-text-dim bg-seatrace-bg-primary/80 px-2 py-0.5 rounded">
          {defaultMapConfig.attribution} | DEMO TELEMETRY
        </span>
      </div>
    </div>
  );
};

export default MapContainer;

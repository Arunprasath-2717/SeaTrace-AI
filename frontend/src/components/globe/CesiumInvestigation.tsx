import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import { addSlickOverlay } from './SlickOverlay';
import { addOriginZone } from './OriginZone';
import { addVesselTrack } from './VesselTrack';
import { Badge } from '../common/Badge';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const CesiumInvestigation: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);

  const [activeStep, setActiveStep] = useState<'all' | 'slick' | 'drift' | 'track' | 'sim'>('all');
  const [initError, setInitError] = useState<string | null>(null);

  // Entities references for toggling
  const entitiesRef = useRef<{
    slick?: Cesium.Entity;
    origin?: Cesium.Entity;
    drift?: Cesium.Entity[];
    track?: Cesium.Entity;
    vesselPoint?: Cesium.Entity;
    counterfactual?: Cesium.Entity;
  }>({});

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    try {
      // Initialize Cesium Viewer with restrained technical configuration
      const viewer = new Cesium.Viewer(containerRef.current, {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        scene3DOnly: true,
        useDefaultRenderLoop: true,
      });

      // Dark maritime background
      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#071320');
      viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#0b1a2b');
      viewer.scene.globe.enableLighting = false;

      // Add investigation overlays
      const slick = addSlickOverlay(viewer);
      const { originEntity, driftEntities } = addOriginZone(viewer);
      const { trackEntity, vesselPointEntity, counterfactualEntity } = addVesselTrack(viewer);

      entitiesRef.current = {
        slick,
        origin: originEntity,
        drift: driftEntities,
        track: trackEntity,
        vesselPoint: vesselPointEntity,
        counterfactual: counterfactualEntity,
      };

      // Camera orientation over scenario
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-90.22, 28.30, 85000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-62),
          roll: 0,
        },
        duration: 0.1,
      });

      viewerRef.current = viewer;
    } catch (err) {
      console.warn('Cesium initialization notice:', err);
      setInitError('Geospatial WebGL engine fallback enabled.');
    }

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // Update visibility based on active step
  useEffect(() => {
    const { slick, origin, drift, track, vesselPoint, counterfactual } = entitiesRef.current;
    if (!slick || !origin) return;

    const showAll = activeStep === 'all';
    slick.show = showAll || activeStep === 'slick';
    origin.show = showAll || activeStep === 'drift';
    drift?.forEach((d) => (d.show = showAll || activeStep === 'drift'));
    if (track) track.show = showAll || activeStep === 'track';
    if (vesselPoint) vesselPoint.show = showAll || activeStep === 'track';
    if (counterfactual) counterfactual.show = showAll || activeStep === 'sim';
  }, [activeStep]);

  const handleResetCamera = () => {
    viewerRef.current?.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-90.22, 28.30, 85000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-62),
        roll: 0,
      },
      duration: 1.2,
    });
  };

  return (
    <div className={`relative w-full h-[580px] rounded-xl overflow-hidden border border-seatrace-border-subtle bg-[#071320] shadow-panel ${className}`}>
      {/* Cesium Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Fallback if WebGL/Cesium fails */}
      {initError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#071320] text-seatrace-text-secondary z-10">
          <AlertCircle className="w-8 h-8 text-seatrace-teal mb-3" />
          <h4 className="text-sm font-semibold text-seatrace-text-primary">
            Illustrative Geospatial Reconstruction
          </h4>
          <p className="text-xs max-w-md mt-1 mb-4">
            Interactive 3D globe coordinates: 28.452°N, 90.218°W (Mississippi Canyon Sector).
          </p>
          <div className="p-4 rounded bg-seatrace-bg-surface border border-seatrace-border-subtle text-left font-mono text-[11px] space-y-1.5 max-w-sm">
            <div className="flex justify-between"><span className="text-seatrace-teal">Observed Slick:</span> 14.8 km² polygon</div>
            <div className="flex justify-between"><span className="text-amber-400">Drift Origin:</span> 2.8 km radius</div>
            <div className="flex justify-between"><span className="text-seatrace-mint">Candidate MMSI:</span> 211832000</div>
          </div>
        </div>
      )}

      {/* Top Banner: Mandatory Disclaimer */}
      <div className="absolute top-4 left-4 z-20 pointer-events-auto flex items-center gap-2">
        <Badge variant="navy" size="md" className="border-seatrace-border-default bg-white/90 backdrop-blur text-slate-800">
          ILLUSTRATIVE INVESTIGATION SCENARIO
        </Badge>
        <Badge variant="teal" size="sm" className="hidden sm:inline-flex bg-white/90 backdrop-blur text-cyan-900">
          GULF OF MEXICO SECTOR
        </Badge>
      </div>

      {/* Top Right: Camera Reset */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <button
          onClick={handleResetCamera}
          title="Reset Viewport Angle"
          className="p-2 rounded bg-white/90 backdrop-blur border border-seatrace-border-subtle text-seatrace-text-secondary hover:text-seatrace-mint transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Step Switcher */}
      <div className="absolute bottom-16 sm:bottom-4 left-4 z-20 pointer-events-auto">
        <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-white/90 backdrop-blur border border-seatrace-border-subtle text-[11px] font-mono shadow-sm">
          <button
            onClick={() => setActiveStep('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeStep === 'all'
                ? 'bg-seatrace-teal text-seatrace-text-inverse font-bold'
                : 'text-seatrace-text-secondary hover:text-seatrace-text-primary'
            }`}
          >
            All Evidence
          </button>
          <button
            onClick={() => setActiveStep('slick')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeStep === 'slick'
                ? 'bg-seatrace-teal text-seatrace-text-inverse font-bold'
                : 'text-seatrace-text-secondary hover:text-seatrace-text-primary'
            }`}
          >
            01 Slick
          </button>
          <button
            onClick={() => setActiveStep('drift')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeStep === 'drift'
                ? 'bg-seatrace-teal text-seatrace-text-inverse font-bold'
                : 'text-seatrace-text-secondary hover:text-seatrace-text-primary'
            }`}
          >
            02 Drift Ensemble
          </button>
          <button
            onClick={() => setActiveStep('track')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeStep === 'track'
                ? 'bg-seatrace-teal text-seatrace-text-inverse font-bold'
                : 'text-seatrace-text-secondary hover:text-seatrace-text-primary'
            }`}
          >
            03 AIS Track
          </button>
          <button
            onClick={() => setActiveStep('sim')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeStep === 'sim'
                ? 'bg-seatrace-teal text-seatrace-text-inverse font-bold'
                : 'text-seatrace-text-secondary hover:text-seatrace-text-primary'
            }`}
          >
            04 Counterfactual
          </button>
        </div>
      </div>

      {/* Floating Legend */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto hidden sm:block">
        <div className="p-3 rounded-lg bg-white/90 backdrop-blur border border-seatrace-border-subtle text-[10px] font-mono space-y-1.5 w-52 shadow-sm">
          <div className="text-[9px] uppercase tracking-wider text-seatrace-text-muted font-bold border-b border-seatrace-border-subtle pb-1 mb-1">
            Map Legend
          </div>
          <div className="flex items-center gap-2 text-seatrace-text-secondary">
            <span className="w-2.5 h-2.5 rounded-sm bg-seatrace-teal border border-seatrace-mint" />
            <span>OBSERVED SLICK</span>
          </div>
          <div className="flex items-center gap-2 text-seatrace-text-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/40 border border-amber-400" />
            <span>PROBABLE ORIGIN ZONE</span>
          </div>
          <div className="flex items-center gap-2 text-seatrace-text-secondary">
            <span className="w-2.5 h-0.5 bg-seatrace-mint" />
            <span>AIS VESSEL TRACK</span>
          </div>
          <div className="flex items-center gap-2 text-seatrace-text-secondary">
            <span className="w-2.5 h-0.5 border-t border-dashed border-seatrace-teal" />
            <span>DRIFT ENSEMBLE</span>
          </div>
          <div className="flex items-center gap-2 text-seatrace-text-secondary">
            <span className="w-2.5 h-2.5 rounded-sm bg-seatrace-deepTeal border border-seatrace-teal" />
            <span>COUNTERFACTUAL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CesiumInvestigation;

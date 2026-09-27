import React, { useEffect, useRef, useState, useCallback } from 'react';
import Globe, { type GlobeInstance } from 'globe.gl';
import type { OilSpillIncident, Vessel, LayerVisibilityState, GlobeTheme } from '../../types/intelligence';
import { GLOBE_TEXTURES, createProceduralEarthTexture, createProceduralStarfield } from '../../utils/globeTextures';
import { INDIAN_EEZ_BOUNDARY, MAJOR_SHIPPING_LANES } from '../../data/maritimeBoundaries';

interface EarthGlobe3DProps {
  incidents: OilSpillIncident[];
  selectedIncident: OilSpillIncident | null;
  onSelectIncident: (incident: OilSpillIncident | null) => void;
  vessels: Vessel[];
  selectedVessel: Vessel | null;
  onSelectVessel: (vessel: Vessel | null) => void;
  activeCandidateVessels: Vessel[];
  layers: LayerVisibilityState;
  theme: GlobeTheme;
  investigationMode: boolean; // Reconstruct origin mode
  driftMode: boolean; // Drift prediction mode
  driftForecastHour: number; // 0, 1, 3, 6, 12, 24
  timelineHoursOffset: number; // e.g. -24 to +24
  onCameraChange?: (coords: { lat: number; lng: number; altitude: number }) => void;
}

export const EarthGlobe3D: React.FC<EarthGlobe3DProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  vessels,
  selectedVessel,
  onSelectVessel,
  activeCandidateVessels: _activeCandidateVessels,

  layers,
  theme,
  investigationMode,
  driftMode,
  driftForecastHour,
  timelineHoursOffset,
  onCameraChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<GlobeInstance | null>(null);
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number; altitude: number }>({
    lat: 16.5,
    lng: 73.5,
    altitude: 1.8,
  });

  // Keep a reference to latest handlers to avoid stale closures in DOM listeners
  const onSelectIncidentRef = useRef(onSelectIncident);
  onSelectIncidentRef.current = onSelectIncident;
  const onSelectVesselRef = useRef(onSelectVessel);
  onSelectVesselRef.current = onSelectVessel;

  // Initialize Globe
  useEffect(() => {
    if (!containerRef.current) return;

    const proceduralTexture = createProceduralEarthTexture();
    const proceduralStars = createProceduralStarfield();

    // Instantiate globe.gl
    const GlobeConstructor = Globe as any;
    const globe: GlobeInstance = new GlobeConstructor(containerRef.current)
      .width(window.innerWidth)
      .height(window.innerHeight)
      .globeImageUrl(GLOBE_TEXTURES[theme] || proceduralTexture)
      .bumpImageUrl(GLOBE_TEXTURES.bump)
      .backgroundImageUrl(GLOBE_TEXTURES.nightSky || proceduralStars)
      .showAtmosphere(layers.atmosphereGlow)
      .atmosphereColor('#14b8a6')
      .atmosphereAltitude(0.24)
      .pointOfView({ lat: 15.0, lng: 75.0, altitude: 2.2 }, 0);

    // Damped smooth orbital controls
    const controls = globe.controls();
    if (controls) {
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.rotateSpeed = 0.7;
      controls.zoomSpeed = 0.9;
      controls.minDistance = 101; // prevent clipping into planet core
      controls.maxDistance = 1000;
    }

    globeInstanceRef.current = globe;
    setIsGlobeReady(true);

    // Initial cinematic fly-in to Indian Ocean after brief pause
    const initialFlyTimer = setTimeout(() => {
      globe.pointOfView({ lat: 17.5, lng: 73.0, altitude: 1.6 }, 2200);
    }, 600);

    // Track camera movement for live HUD coordinate display
    const updateCameraCoords = () => {
      if (!globe) return;
      const pov = globe.pointOfView();
      if (pov) {
        const coords = {
          lat: Number(pov.lat.toFixed(2)),
          lng: Number(pov.lng.toFixed(2)),
          altitude: Number(pov.altitude.toFixed(2)),
        };
        setCurrentCoords(coords);
        if (onCameraChange) onCameraChange(coords);
      }
    };

    const interval = setInterval(updateCameraCoords, 250);

    // Window resize handler
    const handleResize = () => {
      if (globe && containerRef.current) {
        globe.width(window.innerWidth).height(window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initialFlyTimer);
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      if (globe && globe._destructor) {
        globe._destructor();
      }
    };
  }, []);

  // Handle Theme switch
  useEffect(() => {
    const globe = globeInstanceRef.current;
    if (!globe || !isGlobeReady) return;

    let targetTexture = GLOBE_TEXTURES[theme];
    if (!targetTexture) {
      targetTexture = createProceduralEarthTexture();
    }
    globe.globeImageUrl(targetTexture);
    globe.showAtmosphere(layers.atmosphereGlow);
  }, [theme, layers.atmosphereGlow, isGlobeReady]);

  // Smooth flyTo triggered when an incident is selected externally
  useEffect(() => {
    const globe = globeInstanceRef.current;
    if (!globe || !isGlobeReady || !selectedIncident) return;

    globe.pointOfView(
      {
        lat: selectedIncident.lat,
        lng: selectedIncident.lng,
        altitude: 0.45,
      },
      1800
    );
  }, [selectedIncident, isGlobeReady]);

  // Smooth flyTo triggered when a vessel is selected
  useEffect(() => {
    const globe = globeInstanceRef.current;
    if (!globe || !isGlobeReady || !selectedVessel) return;

    globe.pointOfView(
      {
        lat: selectedVessel.currentLat,
        lng: selectedVessel.currentLng,
        altitude: 0.55,
      },
      1600
    );
  }, [selectedVessel, isGlobeReady]);

  // Prepare Polygons Data (Irregular oil slicks, heatmap cores, drift forecast)
  useEffect(() => {
    const globe = globeInstanceRef.current;
    if (!globe || !isGlobeReady) return;

    if (!layers.spillPolygons) {
      globe.polygonsData([]);
      return;
    }

    const polygonFeatures: any[] = [];

    incidents.forEach((inc) => {
      const isSelected = selectedIncident?.id === inc.id;

      // 1. Main irregular spill slick polygon
      polygonFeatures.push({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [inc.slickPolygon],
        },
        properties: {
          id: `spill-${inc.id}`,
          incidentId: inc.id,
          name: inc.name,
          code: inc.code,
          type: 'slick-outer',
          capColor: isSelected
            ? 'rgba(255, 77, 77, 0.65)'
            : 'rgba(239, 68, 68, 0.45)',
          sideColor: 'rgba(255, 77, 77, 0.25)',
          strokeColor: isSelected ? '#ff0055' : '#ff4d4d',
          altitude: isSelected ? 0.012 : 0.008,
        },
      });

      // 2. High-intensity internal heatmap core rings (if layer enabled)
      if (layers.spillIntensityHeatmap && inc.internalHeatmapRings) {
        inc.internalHeatmapRings.forEach((ring, idx) => {
          polygonFeatures.push({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [ring],
            },
            properties: {
              id: `spill-core-${inc.id}-${idx}`,
              incidentId: inc.id,
              name: `${inc.name} (Core ${idx + 1})`,
              code: inc.code,
              type: 'slick-core',
              capColor: idx === 0 ? 'rgba(220, 38, 38, 0.85)' : 'rgba(251, 191, 36, 0.9)',
              sideColor: 'rgba(220, 38, 38, 0.4)',
              strokeColor: idx === 0 ? '#ef4444' : '#f59e0b',
              altitude: 0.014 + idx * 0.004,
            },
          });
        });
      }

      // 3. Drift forecast polygon overlay for selected incident if driftMode is on
      if (driftMode && isSelected && inc.forwardDriftForecast) {
        const targetStep =
          inc.forwardDriftForecast.find((s) => s.hoursOffset === driftForecastHour) ||
          inc.forwardDriftForecast[inc.forwardDriftForecast.length - 1];

        if (targetStep) {
          polygonFeatures.push({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [targetStep.slickPolygon],
            },
            properties: {
              id: `drift-forecast-${inc.id}-${targetStep.hoursOffset}`,
              incidentId: inc.id,
              name: `Forecast +${targetStep.hoursOffset}h: ${targetStep.areaKm2} km²`,
              type: 'drift-predicted',
              capColor: 'rgba(20, 184, 166, 0.38)',
              sideColor: 'rgba(52, 211, 153, 0.25)',
              strokeColor: '#34d399',
              altitude: 0.018,
            },
          });
        }
      }
    });

    globe
      .polygonsData(polygonFeatures)
      .polygonCapColor((d: any) => d.properties.capColor)
      .polygonSideColor((d: any) => d.properties.sideColor)
      .polygonStrokeColor((d: any) => d.properties.strokeColor)
      .polygonAltitude((d: any) => d.properties.altitude)
      .polygonLabel((d: any) => `
        <div style="background: rgba(9, 23, 50, 0.95); border: 1px solid #14b8a6; padding: 8px 12px; border-radius: 8px; font-family: sans-serif; color: #fff; font-size: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.8);">
          <div style="font-weight: 700; color: #f43f5e; font-size: 13px;">${d.properties.code || 'SPILL ZONE'}</div>
          <div style="color: #6ee7b7; font-weight: 600;">${d.properties.name}</div>
          <div style="color: #94a3b8; font-size: 11px; margin-top: 4px;">Click to inspect forensic attribution</div>
        </div>
      `)
      .onPolygonClick((d: any) => {
        const found = incidents.find((i) => i.id === d.properties.incidentId);
        if (found) {
          onSelectIncidentRef.current(found);
        }
      });
  }, [
    incidents,
    selectedIncident,
    layers.spillPolygons,
    layers.spillIntensityHeatmap,
    driftMode,
    driftForecastHour,
    isGlobeReady,
  ]);

  // Prepare Paths (AIS tracks, back-trajectories, drift forecast paths, EEZ, shipping lanes)
  useEffect(() => {
    const globe = globeInstanceRef.current;
    if (!globe || !isGlobeReady) return;

    const paths: any[] = [];

    // 1. Indian EEZ Boundary (Glowing Mint & Sea Green)
    if (layers.maritimeBoundaries) {
      paths.push({
        name: INDIAN_EEZ_BOUNDARY.name,
        points: INDIAN_EEZ_BOUNDARY.coordinates.map(([lng, lat]) => [lng, lat, 0.004]),
        color: 'rgba(52, 211, 153, 0.75)',
        dashLength: 0.25,
        dashGap: 0.05,
        dashAnimateTime: 4000,
        strokeWidth: 2,
      });

      // Major Shipping Lanes (Royal Blue)
      MAJOR_SHIPPING_LANES.forEach((lane) => {
        paths.push({
          name: lane.name,
          points: lane.coordinates.map(([lng, lat]) => [lng, lat, 0.002]),
          color: 'rgba(59, 130, 246, 0.45)',
          dashLength: 0.1,
          dashGap: 0.03,
          dashAnimateTime: 3000,
          strokeWidth: 1.5,
        });
      });
    }

    // 2. Historical AIS Tracks of tracked vessels (Royal Blue & Sea Green)
    if (layers.historicalAISTracks) {
      vessels.forEach((v) => {
        const isSelected = selectedVessel?.id === v.id;
        const isSuspect = v.isDarkVessel || v.anomalyScore && v.anomalyScore > 70;

        if (v.aisTrajectory && v.aisTrajectory.length > 1) {
          paths.push({
            name: `${v.name} AIS Track`,
            points: v.aisTrajectory.map((wpt) => [wpt.lng, wpt.lat, isSelected ? 0.01 : 0.005]),
            color: isSelected
              ? '#34d399' // Mint when selected
              : isSuspect
              ? 'rgba(244, 63, 94, 0.85)' // Alert Coral
              : 'rgba(37, 99, 235, 0.55)', // Royal Blue normal
            dashLength: isSelected ? 0.4 : 0.15,
            dashGap: 0.02,
            dashAnimateTime: isSelected ? 1200 : 2500,
            strokeWidth: isSelected ? 3.5 : isSuspect ? 2.2 : 1.5,
          });
        }
      });
    }

    // 3. Origin Reconstruction Mode: Backward Drift Trajectory (Teal to Mint)
    if ((investigationMode || layers.backwardDriftPaths) && selectedIncident) {
      if (selectedIncident.backwardDriftTrajectory.length > 1) {
        paths.push({
          name: `Back-Tracked Drift Origin: ${selectedIncident.code}`,
          points: selectedIncident.backwardDriftTrajectory.map(([lng, lat]) => [lng, lat, 0.015]),
          color: '#14b8a6', // Teal back-trajectory
          dashLength: 0.3,
          dashGap: 0.04,
          dashAnimateTime: 1000,
          strokeWidth: 3.5,
        });
      }

      // Also render candidate vessel trajectories during incident window (Royal Blue & Mint)
      if (layers.candidateVesselTracks && selectedIncident.candidates) {
        selectedIncident.candidates.forEach((cand) => {
          if (cand.historicalTrackDuringIncident) {
            paths.push({
              name: `Candidate: ${cand.vesselName} (Rank #${cand.rank})`,
              points: cand.historicalTrackDuringIncident.map(([lng, lat]) => [lng, lat, 0.016]),
              color: cand.rank === 1 ? '#2563eb' : 'rgba(52, 211, 153, 0.85)',
              dashLength: 0.2,
              dashGap: 0.03,
              dashAnimateTime: 1500,
              strokeWidth: cand.rank === 1 ? 3.5 : 2,
            });
          }
        });
      }
    }

    // 4. Drift Prediction Mode: Forward drift forecast vector path (Mint & Ocean Blue)
    if ((driftMode || layers.driftForecastPath) && selectedIncident) {
      if (selectedIncident.forwardDriftForecast.length > 0) {
        const driftPoints: [number, number, number][] = [
          [selectedIncident.lng, selectedIncident.lat, 0.012],
          ...selectedIncident.forwardDriftForecast.map((f) => [f.centerLng, f.centerLat, 0.014] as [number, number, number]),
        ];
        paths.push({
          name: `Forecast Drift Vector (+24h): ${selectedIncident.code}`,
          points: driftPoints,
          color: '#34d399', // Mint projection vector
          dashLength: 0.25,
          dashGap: 0.04,
          dashAnimateTime: 1200,
          strokeWidth: 3,
        });
      }
    }

    globe
      .pathsData(paths)
      .pathPoints((d: any) => d.points)
      .pathPointLat((p: any) => p[1])
      .pathPointLng((p: any) => p[0])
      .pathPointAlt((p: any) => p[2] || 0.004)
      .pathColor((d: any) => d.color)
      .pathDashLength((d: any) => d.dashLength)
      .pathDashGap((d: any) => d.dashGap)
      .pathDashAnimateTime((d: any) => d.dashAnimateTime)
      .pathStroke((d: any) => d.strokeWidth);
  }, [
    layers.maritimeBoundaries,
    layers.historicalAISTracks,
    layers.candidateVesselTracks,
    layers.backwardDriftPaths,
    layers.driftForecastPath,
    vessels,
    selectedVessel,
    selectedIncident,
    investigationMode,
    driftMode,
    isGlobeReady,
  ]);

  // Prepare Rings Data (Radar pulse on oil spills and origin point)
  useEffect(() => {
    const globe = globeInstanceRef.current;
    if (!globe || !isGlobeReady) return;

    const rings: any[] = [];

    // Pulsing alert rings on oil spills
    if (layers.spillPolygons) {
      incidents.forEach((inc) => {
        const isSelected = selectedIncident?.id === inc.id;
        rings.push({
          id: `ring-${inc.id}`,
          lat: inc.lat,
          lng: inc.lng,
          color: isSelected ? 'rgba(255, 77, 77, 0.9)' : 'rgba(239, 68, 68, 0.7)',
          maxRadius: isSelected ? 4.5 : 2.8,
          speed: isSelected ? 2.5 : 1.8,
          period: 1400,
        });
      });
    }

    // Origin Uncertainty Ring for selected incident
    if ((investigationMode || layers.backwardDriftPaths) && selectedIncident) {
      rings.push({
        id: `origin-ring-${selectedIncident.id}`,
        lat: selectedIncident.probableOrigin.lat,
        lng: selectedIncident.probableOrigin.lng,
        color: 'rgba(251, 191, 36, 0.85)', // Amber origin zone
        maxRadius: 3.5,
        speed: 1.5,
        period: 1800,
      });
    }

    globe
      .ringsData(rings)
      .ringLat((d: any) => d.lat)
      .ringLng((d: any) => d.lng)
      .ringColor((d: any) => d.color)
      .ringMaxRadius((d: any) => d.maxRadius)
      .ringPropagationSpeed((d: any) => d.speed)
      .ringRepeatPeriod((d: any) => d.period);
  }, [incidents, selectedIncident, investigationMode, layers.spillPolygons, layers.backwardDriftPaths, isGlobeReady]);

  // Prepare HTML Elements Data (Vessel markers with directional arrows + Incident Badges)
  useEffect(() => {
    const globe = globeInstanceRef.current;
    if (!globe || !isGlobeReady) return;

    const htmlMarkers: any[] = [];

    // 1. Vessel Markers
    if (layers.vesselPositions) {
      vessels.forEach((v) => {
        // Adjust simulated position slightly based on timeline offset
        let lat = v.currentLat;
        let lng = v.currentLng;
        if (timelineHoursOffset !== 0 && v.aisTrajectory.length > 1) {
          // interpolate or shift slightly along trajectory
          const shiftIdx = Math.max(0, Math.min(v.aisTrajectory.length - 1, Math.round(v.aisTrajectory.length / 2 + (timelineHoursOffset / 12))));
          const wpt = v.aisTrajectory[shiftIdx];
          if (wpt) {
            lat = wpt.lat;
            lng = wpt.lng;
          }
        }

        const isSelected = selectedVessel?.id === v.id;
        const isDark = v.isDarkVessel || (v.anomalyScore && v.anomalyScore > 75);

        htmlMarkers.push({
          type: 'vessel',
          id: v.id,
          vessel: v,
          lat,
          lng,
          altitude: isSelected ? 0.025 : 0.015,
          heading: v.headingDeg,
          name: v.name,
          mmsi: v.mmsi,
          vesselType: v.type,
          isSelected,
          isDark,
        });
      });
    }

    // 2. Incident Center Badges
    if (layers.spillPolygons) {
      incidents.forEach((inc) => {
        const isSelected = selectedIncident?.id === inc.id;
        htmlMarkers.push({
          type: 'incident',
          id: inc.id,
          incident: inc,
          lat: inc.lat,
          lng: inc.lng,
          altitude: 0.022,
          code: inc.code,
          name: inc.name,
          area: inc.estimatedAreaKm2,
          severity: inc.severity,
          isSelected,
        });
      });
    }

    // 3. Origin Point Marker for selected incident
    if ((investigationMode || layers.backwardDriftPaths) && selectedIncident) {
      htmlMarkers.push({
        type: 'origin',
        id: `origin-marker-${selectedIncident.id}`,
        lat: selectedIncident.probableOrigin.lat,
        lng: selectedIncident.probableOrigin.lng,
        altitude: 0.024,
        code: selectedIncident.code,
        radiusKm: selectedIncident.probableOrigin.uncertaintyRadiusKm,
      });
    }

    globe
      .htmlElementsData(htmlMarkers)
      .htmlLat((d: any) => d.lat)
      .htmlLng((d: any) => d.lng)
      .htmlAltitude((d: any) => d.altitude)
      .htmlElement((d: any) => {
        const el = document.createElement('div');

        if (d.type === 'vessel') {
          // Vessel Icon with Heading Rotation using Sea green, Teal, Mint, Blue, Royal Blue
          const color = d.isSelected
            ? '#34d399' // Mint when selected
            : d.isDark
            ? '#f43f5e' // Alert Coral for dark suspect
            : d.vesselType === 'Tanker'
            ? '#0ea5e9' // Ocean Blue for tankers
            : d.vesselType === 'Patrol'
            ? '#10b981' // Sea Green for Coast Guard patrol
            : d.vesselType === 'Fishing'
            ? '#14b8a6' // Teal for fishing
            : '#3b82f6'; // Royal Blue for cargo/merchant

          el.className = 'cursor-pointer select-none group transition-transform duration-200 hover:scale-125';
          el.innerHTML = `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <!-- Directional Vessel Arrow / Vessel SVG -->
              <div style="
                transform: rotate(${d.heading}deg);
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                filter: drop-shadow(0 0 8px ${color});
              ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${color}" stroke="#060d1f" stroke-width="1.8">
                  <path d="M12 2L19 21L12 17L5 21L12 2Z" />
                </svg>
              </div>

              ${d.isSelected ? `
                <div style="
                  position: absolute;
                  width: 34px;
                  height: 34px;
                  border: 2px dashed #34d399;
                  border-radius: 50%;
                  animation: spin 6s linear infinite;
                  box-shadow: 0 0 12px rgba(52, 211, 153, 0.4);
                "></div>
              ` : ''}

              <!-- Tooltip on hover -->
              <div style="
                display: none;
                position: absolute;
                bottom: 28px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(9, 23, 50, 0.95);
                border: 1px solid ${color};
                padding: 6px 12px;
                border-radius: 8px;
                white-space: nowrap;
                font-family: sans-serif;
                font-size: 11px;
                color: #f8fafc;
                box-shadow: 0 8px 25px rgba(0,0,0,0.8), 0 0 15px ${color}33;
                pointer-events: none;
                z-index: 100;
              " class="vessel-hover-tooltip">
                <div style="font-weight: 700; color: ${color}; font-size: 12px;">${d.name}</div>
                <div style="color: #6ee7b7; font-size: 10px;">MMSI: ${d.mmsi} • <span style="color: #94a3b8;">${d.vesselType}</span></div>
                <div style="color: #cbd5e1; font-size: 10px; margin-top: 2px;">Speed: <strong style="color: #34d399;">${d.vessel.speedKts} kts</strong> • Hdg: ${d.heading}°</div>
                ${d.isDark ? '<div style="color: #f43f5e; font-weight: bold; font-size: 10px; margin-top: 2px;">⚠️ SUSPICIOUS ANOMALY INDEX</div>' : ''}
              </div>
            </div>
          `;

          // Add hover behavior via script
          const tooltip = el.querySelector('.vessel-hover-tooltip') as HTMLElement;
          el.addEventListener('mouseenter', () => {
            if (tooltip) tooltip.style.display = 'block';
          });
          el.addEventListener('mouseleave', () => {
            if (tooltip) tooltip.style.display = 'none';
          });

          el.onclick = (e) => {
            e.stopPropagation();
            onSelectVesselRef.current(d.vessel);
          };
        } else if (d.type === 'incident') {
          // Incident Marker with Badge - Clean Sea Green/Teal and Alert Coral
          const isCrit = d.severity === 'Critical';
          const borderColor = d.isSelected ? '#34d399' : isCrit ? '#f43f5e' : '#14b8a6';
          const badgeBg = isCrit ? 'rgba(244, 63, 94, 0.2)' : 'rgba(20, 184, 166, 0.2)';
          const dotColor = isCrit ? '#f43f5e' : '#10b981';

          el.className = 'cursor-pointer select-none transition-transform duration-200 hover:scale-115';
          el.innerHTML = `
            <div style="
              display: flex;
              align-items: center;
              gap: 6px;
              background: rgba(9, 23, 50, 0.92);
              border: 1.5px solid ${borderColor};
              padding: 4px 10px;
              border-radius: 20px;
              box-shadow: 0 4px 18px rgba(0,0,0,0.6), 0 0 12px ${borderColor}66;
              font-family: monospace;
              font-size: 11px;
              color: #f8fafc;
            ">
              <span style="
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: ${dotColor};
                box-shadow: 0 0 8px ${dotColor};
              "></span>
              <span style="font-weight: 700; color: #f8fafc;">${d.code}</span>
              <span style="color: #6ee7b7; font-size: 10px; background: ${badgeBg}; padding: 1px 5px; border-radius: 10px;">${d.area} km²</span>
            </div>
          `;

          el.onclick = (e) => {
            e.stopPropagation();
            onSelectIncidentRef.current(d.incident);
          };
        } else if (d.type === 'origin') {
          // Estimated Origin Marker
          el.className = 'select-none pointer-events-none';
          el.innerHTML = `
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              transform: translate(-50%, -100%);
            ">
              <div style="
                background: rgba(251, 191, 36, 0.9);
                color: #030712;
                font-size: 10px;
                font-weight: 800;
                padding: 2px 6px;
                border-radius: 4px;
                box-shadow: 0 0 10px #fbbf24;
                font-family: monospace;
                white-space: nowrap;
              ">
                🎯 PROBABLE ORIGIN (±${d.radiusKm} km)
              </div>
              <div style="
                width: 2px;
                height: 14px;
                background: #fbbf24;
              "></div>
              <div style="
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #fbbf24;
                box-shadow: 0 0 12px #fbbf24;
              "></div>
            </div>
          `;
        }

        return el;
      });
  }, [
    vessels,
    selectedVessel,
    incidents,
    selectedIncident,
    investigationMode,
    layers.vesselPositions,
    layers.spillPolygons,
    layers.backwardDriftPaths,
    timelineHoursOffset,
    isGlobeReady,
  ]);

  // Method to fly directly to preset geographic viewpoints
  const flyToPreset = useCallback(
    (lat: number, lng: number, altitude: number) => {
      const globe = globeInstanceRef.current;
      if (globe) {
        globe.pointOfView({ lat, lng, altitude }, 2000);
      }
    },
    []
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030712]">
      {/* 3D Globe Canvas Mount */}
      <div ref={containerRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Floating Coordinates & Telemetry HUD (Bottom Left) */}
      <div className="absolute bottom-20 left-6 z-10 pointer-events-none">
        <div className="hud-panel px-3.5 py-2 rounded-lg border border-[#1e293b] flex items-center space-x-4 text-xs font-mono text-[#94a3b8]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-ping" />
            <span className="text-[#00d4ff] font-semibold">CAMERA:</span>
            <span className="text-[#f8fafc]">
              {Math.abs(currentCoords.lat).toFixed(2)}°{currentCoords.lat >= 0 ? 'N' : 'S'},{' '}
              {Math.abs(currentCoords.lng).toFixed(2)}°{currentCoords.lng >= 0 ? 'E' : 'W'}
            </span>
          </div>
          <div className="h-3 w-px bg-[#1e293b]" />
          <div>
            <span className="text-[#94a3b8]">ALTITUDE: </span>
            <span className="text-[#f8fafc]">{(currentCoords.altitude * 6371).toFixed(0)} KM</span>
          </div>
          <div className="h-3 w-px bg-[#1e293b]" />
          <div>
            <span className="text-[#94a3b8]">PROJECTION: </span>
            <span className="text-[#14b8a6]">WGS-84 3D SPHERE</span>
          </div>
        </div>
      </div>

      {/* Quick Camera Navigation Controls (Bottom Right above Timeline) */}
      <div className="absolute bottom-20 right-6 z-10 flex flex-col space-y-2 pointer-events-auto">
        <div className="hud-panel p-1.5 rounded-lg border border-[#1e293b] flex flex-col space-y-1">
          <button
            onClick={() => {
              const globe = globeInstanceRef.current;
              if (globe) {
                const current = globe.pointOfView();
                globe.pointOfView({ ...current, altitude: Math.max(0.2, current.altitude * 0.7) }, 600);
              }
            }}
            title="Zoom In"
            className="w-8 h-8 rounded flex items-center justify-center text-[#94a3b8] hover:text-[#00d4ff] hover:bg-[#1e293b]/50 transition-colors"
          >
            <span className="text-lg font-bold">+</span>
          </button>
          <div className="h-px w-full bg-[#1e293b]" />
          <button
            onClick={() => {
              const globe = globeInstanceRef.current;
              if (globe) {
                const current = globe.pointOfView();
                globe.pointOfView({ ...current, altitude: Math.min(3.5, current.altitude * 1.4) }, 600);
              }
            }}
            title="Zoom Out"
            className="w-8 h-8 rounded flex items-center justify-center text-[#94a3b8] hover:text-[#00d4ff] hover:bg-[#1e293b]/50 transition-colors"
          >
            <span className="text-lg font-bold">−</span>
          </button>
          <div className="h-px w-full bg-[#1e293b]" />
          <button
            onClick={() => flyToPreset(15.0, 75.0, 2.2)}
            title="Reset Global Earth View"
            className="w-8 h-8 rounded flex items-center justify-center text-[#94a3b8] hover:text-[#00d4ff] hover:bg-[#1e293b]/50 transition-colors text-xs font-mono"
          >
            🌐
          </button>
        </div>
      </div>
    </div>
  );
};

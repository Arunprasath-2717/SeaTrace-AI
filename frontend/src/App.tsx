import React, { useState } from 'react';
import { SentinelProvider } from './context/SentinelContext';
import { OceanicDashboard } from './components/Dashboard/OceanicDashboard';
import { EarthGlobe3D } from './components/Globe/EarthGlobe3D';
import { SIMULATED_INCIDENTS } from './data/simulatedIncidents';
import { SIMULATED_VESSELS } from './data/simulatedVessels';
import type { OilSpillIncident, Vessel, LayerVisibilityState } from './types/intelligence';
import { ArrowLeft } from 'lucide-react';

export function App() {
  const [viewMode, setViewMode] = useState<'platform' | 'globe3d'>('platform');

  const [incidents] = useState<OilSpillIncident[]>(SIMULATED_INCIDENTS);
  const [vessels] = useState<Vessel[]>(SIMULATED_VESSELS);
  const [selectedIncident, setSelectedIncident] = useState<OilSpillIncident | null>(SIMULATED_INCIDENTS[0]);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  const [layers] = useState<LayerVisibilityState>({
    satelliteImagery: true,
    spillPolygons: true,
    spillIntensityHeatmap: true,
    vesselPositions: true,
    historicalAISTracks: true,
    candidateVesselTracks: true,
    backwardDriftPaths: true,
    driftForecastPath: true,
    oceanCurrentVectors: true,
    maritimeBoundaries: true,
    atmosphereGlow: true,
    nightLights: false,
  });

  if (viewMode === 'globe3d') {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-[#030712] font-sans select-none">
        {/* Button to return to the SeaTrace Command Dashboard */}
        <div className="absolute top-4 left-4 z-50 pointer-events-auto">
          <button
            onClick={() => setViewMode('platform')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D1B2A]/90 hover:bg-[#13283F] border border-[#23364B] text-slate-100 text-xs font-bold shadow-2xl backdrop-blur-md transition-all group"
          >
            <ArrowLeft className="w-4 h-4 text-[#00C2FF] group-hover:-translate-x-1 transition-transform" />
            <span>Return to SeaTrace Dashboard</span>
          </button>
        </div>

        {/* 3D Earth Globe view */}
        <EarthGlobe3D
          incidents={incidents}
          selectedIncident={selectedIncident}
          onSelectIncident={(inc) => setSelectedIncident(inc)}
          vessels={vessels}
          selectedVessel={selectedVessel}
          onSelectVessel={(v) => setSelectedVessel(v)}
          activeCandidateVessels={vessels.filter((v) => v.isDarkVessel)}
          layers={layers}
          theme="satellite"
          investigationMode={false}
          driftMode={false}
          driftForecastHour={6}
          timelineHoursOffset={0}
        />
      </div>
    );
  }

  return (
    <SentinelProvider>
      <OceanicDashboard onToggleToGlobe={() => setViewMode('globe3d')} />
    </SentinelProvider>
  );
}

export default App;

import React, { useState } from 'react';
import { useSentinel } from '../../context/SentinelContext';
import { SATELLITE_SCENES } from '../../data/sentinelData';
import {
  Satellite,
  Download,
  Filter,
  Eye,
  Sliders,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const SatelliteImageryPage: React.FC = () => {
  const { showToast, setActivePage } = useSentinel();

  const [sensorFilter, setSensorFilter] = useState<string>('All');
  const [selectedScene, setSelectedScene] = useState(SATELLITE_SCENES[0]);
  const [showSlickOverlay, setShowSlickOverlay] = useState<boolean>(true);

  const filteredScenes = SATELLITE_SCENES.filter((s) => {
    if (sensorFilter !== 'All' && !s.sensor.includes(sensorFilter)) return false;
    return true;
  });

  const handleDownloadSample = () => {
    showToast(`Downloading sample orbital geotiff swath: ${selectedScene.name}`, 'info');
  };

  return (
    <div className="flex-1 flex flex-col gap-5 p-6 overflow-y-auto select-none bg-[#07111F] text-slate-100 scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Satellite className="w-5 h-5 text-[#00C2FF]" />
            <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">
              Satellite Imagery Catalog
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00C2FF]/15 text-[#00C2FF] border border-[#00C2FF]/30">
              ORBITAL ARCHIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingest and inspect synthetic aperture radar (SAR) and multispectral optical imagery covering Indian maritime zones.
          </p>
        </div>

        <button
          onClick={handleDownloadSample}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D1B2A] hover:bg-[#13283F] border border-[#23364B] text-xs font-semibold text-slate-200 transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-teal-400" />
          <span>Download Sample GeoTIFF ({selectedScene.fileSizeBytes})</span>
        </button>
      </div>

      {/* Sensor Filter Bar */}
      <div className="p-3 px-4 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Filter Sensor:</span>
          {(['All', 'Sentinel-1', 'Sentinel-2', 'RADARSAT'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSensorFilter(s)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                sensorFilter === s
                  ? 'bg-[#00C2FF]/20 border-[#00C2FF] text-[#00C2FF]'
                  : 'border-[#23364B] text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Showing {filteredScenes.length} orbital acquisitions
        </span>
      </div>

      {/* Main Grid: Catalog Cards (5 cols) & Inspection Workspace (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Catalog List */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {filteredScenes.map((scene) => {
            const isSelected = selectedScene.id === scene.id;
            return (
              <div
                key={scene.id}
                onClick={() => setSelectedScene(scene)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                  isSelected
                    ? 'bg-[#13283F] border-[#00C2FF] shadow-lg shadow-[#00C2FF]/10'
                    : 'bg-[#0D1B2A] border-[#23364B] hover:border-slate-500'
                }`}
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-[#23364B] relative">
                  <img
                    src={scene.thumbnailUrl}
                    alt={scene.name}
                    className="w-full h-full object-cover filter contrast-125"
                  />
                  {scene.hasDetectedSlick && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-rose-500 text-white">
                      SLICK
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-[#00C2FF] font-bold">
                        {scene.sensor}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {scene.resolutionM}m resolution
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white truncate leading-tight">
                      {scene.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 truncate">
                      {scene.region}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-[#23364B]/60">
                    <span>{scene.acquisitionDate}</span>
                    <span>{scene.fileSizeBytes}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scene Detail & Imagery Inspection Panel */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Preview Container */}
          <div className="relative h-80 rounded-2xl border border-[#23364B] overflow-hidden bg-[#07111F]">
            <img
              src={selectedScene.thumbnailUrl}
              alt="Inspection"
              className="w-full h-full object-cover filter contrast-125 brightness-95"
            />

            {/* Slick Vector Overlay */}
            {showSlickOverlay && selectedScene.hasDetectedSlick && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-36 rounded-full border-2 border-rose-500 bg-rose-500/30 blur-[1px] animate-pulse flex items-center justify-center">
                  <span className="px-2 py-1 rounded bg-slate-950/80 text-rose-400 font-mono text-[10px] border border-rose-600">
                    CLASSIFIED HYDROCARBON ANOMALY
                  </span>
                </div>
              </div>
            )}

            {/* Controls Bar on Top of Image */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 text-white font-mono text-[11px] border border-slate-700">
                {selectedScene.sensor} | {selectedScene.acquisitionDate}
              </span>

              <button
                onClick={() => setShowSlickOverlay(!showSlickOverlay)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border backdrop-blur-md transition-all ${
                  showSlickOverlay
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700'
                }`}
              >
                {showSlickOverlay ? 'Hide Slick Overlay' : 'Show Slick Overlay'}
              </button>
            </div>
          </div>

          {/* Metadata Inspector Card */}
          <div className="p-5 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col gap-3">
            <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
              Scene Telemetry & Sensor Metadata
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#07111F] border border-[#23364B]">
                <span className="text-[10px] text-slate-400 block">Sensor Platform</span>
                <span className="text-white font-bold">{selectedScene.sensor}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#07111F] border border-[#23364B]">
                <span className="text-[10px] text-slate-400 block">Ground Sampling</span>
                <span className="text-[#00C2FF] font-bold">{selectedScene.resolutionM} meters</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#07111F] border border-[#23364B]">
                <span className="text-[10px] text-slate-400 block">Polarization / Bands</span>
                <span className="text-white font-bold">{selectedScene.polarization || selectedScene.bands || 'Single-Pol'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#07111F] border border-[#23364B]">
                <span className="text-[10px] text-slate-400 block">Cloud Cover</span>
                <span className="text-emerald-400 font-bold">{selectedScene.cloudCoverPct}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Ready for automated neural segmentation in Detection Studio.
              </span>
              <button
                onClick={() => setActivePage('spill-detection')}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#14B8A6] text-slate-950 font-bold text-xs shadow-md"
              >
                Send to Detection Studio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

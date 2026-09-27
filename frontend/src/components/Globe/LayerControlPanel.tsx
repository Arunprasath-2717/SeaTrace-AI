import React, { useState } from 'react';
import { Layers, Eye, EyeOff, Globe2, Wind, ShieldAlert, Navigation2, Compass, RotateCcw } from 'lucide-react';
import type { LayerVisibilityState, GlobeTheme } from '../../types/intelligence';


interface LayerControlPanelProps {
  layers: LayerVisibilityState;
  onToggleLayer: (layerKey: keyof LayerVisibilityState) => void;
  onResetLayers: () => void;
  theme: GlobeTheme;
  onChangeTheme: (theme: GlobeTheme) => void;
}

export const LayerControlPanel: React.FC<LayerControlPanelProps> = ({
  layers,
  onToggleLayer,
  onResetLayers,
  theme,
  onChangeTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-20 right-6 z-20">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`hud-panel px-3.5 py-2.5 rounded-lg border flex items-center space-x-2.5 transition-all duration-200 ${
          isOpen
            ? 'border-[#00d4ff] bg-[#0b1220]/95 text-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.25)]'
            : 'border-[#1e293b] hover:border-[#00d4ff]/60 text-[#f8fafc] hover:text-[#00d4ff]'
        }`}
      >
        <Layers className="w-4 h-4 text-[#00d4ff]" />
        <span className="text-xs font-semibold uppercase tracking-wider font-mono">Map Layers</span>
        <span className="text-[10px] bg-[#1e293b] px-1.5 py-0.5 rounded text-[#94a3b8] font-mono">
          {Object.values(layers).filter(Boolean).length} Active
        </span>
      </button>

      {/* Layer Control Menu Drawer */}
      {isOpen && (
        <div className="mt-2 w-72 hud-panel p-4 rounded-xl border border-[#1e293b] shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-[#00d4ff]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#f8fafc] font-mono">
                Geospatial Layers
              </span>
            </div>
            <button
              onClick={onResetLayers}
              title="Reset all layers to default"
              className="flex items-center space-x-1 text-[11px] text-[#94a3b8] hover:text-[#00d4ff] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Globe Imagery Basemap Selector */}
          <div className="py-3 border-b border-[#1e293b]">
            <div className="text-[11px] font-mono text-[#94a3b8] mb-2 uppercase tracking-wide">
              Earth Basemap Texture
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
              <button
                onClick={() => onChangeTheme('satellite')}
                className={`px-2.5 py-1.5 rounded border text-left flex items-center space-x-2 transition-all ${
                  theme === 'satellite'
                    ? 'border-[#00d4ff] bg-[#00d4ff]/15 text-[#00d4ff]'
                    : 'border-[#1e293b] text-[#94a3b8] hover:border-[#334155]'
                }`}
              >
                <span>🛰️</span>
                <span>Blue Marble</span>
              </button>
              <button
                onClick={() => onChangeTheme('night')}
                className={`px-2.5 py-1.5 rounded border text-left flex items-center space-x-2 transition-all ${
                  theme === 'night'
                    ? 'border-[#00d4ff] bg-[#00d4ff]/15 text-[#00d4ff]'
                    : 'border-[#1e293b] text-[#94a3b8] hover:border-[#334155]'
                }`}
              >
                <span>🌃</span>
                <span>Night Lights</span>
              </button>
              <button
                onClick={() => onChangeTheme('dark')}
                className={`px-2.5 py-1.5 rounded border text-left flex items-center space-x-2 transition-all ${
                  theme === 'dark'
                    ? 'border-[#00d4ff] bg-[#00d4ff]/15 text-[#00d4ff]'
                    : 'border-[#1e293b] text-[#94a3b8] hover:border-[#334155]'
                }`}
              >
                <span>🌐</span>
                <span>Dark Vector</span>
              </button>
              <button
                onClick={() => onChangeTheme('bathymetric')}
                className={`px-2.5 py-1.5 rounded border text-left flex items-center space-x-2 transition-all ${
                  theme === 'bathymetric'
                    ? 'border-[#00d4ff] bg-[#00d4ff]/15 text-[#00d4ff]'
                    : 'border-[#1e293b] text-[#94a3b8] hover:border-[#334155]'
                }`}
              >
                <span>🌊</span>
                <span>Topography</span>
              </button>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="py-2 space-y-1 text-xs">
            {/* Oil Spill Overlays */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#1e293b]/40">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[#ff4d4d]" />
                <span className="text-[#f8fafc]">Oil Spill Polygons</span>
              </div>
              <button
                onClick={() => onToggleLayer('spillPolygons')}
                className={`p-1 rounded transition-colors ${
                  layers.spillPolygons ? 'text-[#ff4d4d]' : 'text-[#64748b]'
                }`}
              >
                {layers.spillPolygons ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Spill Intensity Heatmap */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#1e293b]/40">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fb923c]" />
                <span className="text-[#f8fafc]">Spill Intensity Heatmap</span>
              </div>
              <button
                onClick={() => onToggleLayer('spillIntensityHeatmap')}
                className={`p-1 rounded transition-colors ${
                  layers.spillIntensityHeatmap ? 'text-[#fb923c]' : 'text-[#64748b]'
                }`}
              >
                {layers.spillIntensityHeatmap ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Active Vessels */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#1e293b]/40">
              <div className="flex items-center space-x-2">
                <Navigation2 className="w-3.5 h-3.5 text-[#00d4ff]" />
                <span className="text-[#f8fafc]">Vessel Positions</span>
              </div>
              <button
                onClick={() => onToggleLayer('vesselPositions')}
                className={`p-1 rounded transition-colors ${
                  layers.vesselPositions ? 'text-[#00d4ff]' : 'text-[#64748b]'
                }`}
              >
                {layers.vesselPositions ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Historical AIS Tracks */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#1e293b]/40">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-0.5 bg-[#38bdf8] rounded" />
                <span className="text-[#f8fafc]">Historical AIS Tracks</span>
              </div>
              <button
                onClick={() => onToggleLayer('historicalAISTracks')}
                className={`p-1 rounded transition-colors ${
                  layers.historicalAISTracks ? 'text-[#38bdf8]' : 'text-[#64748b]'
                }`}
              >
                {layers.historicalAISTracks ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Suspect / Candidate Vessel Tracks */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#1e293b]/40">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-0.5 bg-[#ff0055] rounded" />
                <span className="text-[#f8fafc]">Candidate Attributions</span>
              </div>
              <button
                onClick={() => onToggleLayer('candidateVesselTracks')}
                className={`p-1 rounded transition-colors ${
                  layers.candidateVesselTracks ? 'text-[#ff0055]' : 'text-[#64748b]'
                }`}
              >
                {layers.candidateVesselTracks ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Backward Drift Path */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#1e293b]/40">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-0.5 bg-[#f59e0b] border-t border-dashed" />
                <span className="text-[#f8fafc]">Origin Back-Trajectory</span>
              </div>
              <button
                onClick={() => onToggleLayer('backwardDriftPaths')}
                className={`p-1 rounded transition-colors ${
                  layers.backwardDriftPaths ? 'text-[#f59e0b]' : 'text-[#64748b]'
                }`}
              >
                {layers.backwardDriftPaths ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Spill Drift Forecast */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#1e293b]/40">
              <div className="flex items-center space-x-2">
                <Wind className="w-3.5 h-3.5 text-[#fbbf24]" />
                <span className="text-[#f8fafc]">Drift Forecast (+24h)</span>
              </div>
              <button
                onClick={() => onToggleLayer('driftForecastPath')}
                className={`p-1 rounded transition-colors ${
                  layers.driftForecastPath ? 'text-[#fbbf24]' : 'text-[#64748b]'
                }`}
              >
                {layers.driftForecastPath ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Maritime Boundaries & EEZ */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#1e293b]/40">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-0.5 border-t border-dashed border-[#00d4ff]" />
                <span className="text-[#f8fafc]">India EEZ & Shipping Lanes</span>
              </div>
              <button
                onClick={() => onToggleLayer('maritimeBoundaries')}
                className={`p-1 rounded transition-colors ${
                  layers.maritimeBoundaries ? 'text-[#00d4ff]' : 'text-[#64748b]'
                }`}
              >
                {layers.maritimeBoundaries ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Atmosphere Halo */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#1e293b]/40">
              <div className="flex items-center space-x-2">
                <Globe2 className="w-3.5 h-3.5 text-[#00d4ff]" />
                <span className="text-[#f8fafc]">Atmospheric Glow</span>
              </div>
              <button
                onClick={() => onToggleLayer('atmosphereGlow')}
                className={`p-1 rounded transition-colors ${
                  layers.atmosphereGlow ? 'text-[#00d4ff]' : 'text-[#64748b]'
                }`}
              >
                {layers.atmosphereGlow ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

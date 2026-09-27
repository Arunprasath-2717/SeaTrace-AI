import React from 'react';
import {
  Wind,
  X,
  AlertTriangle,
  Globe,
} from 'lucide-react';
import type { OilSpillIncident } from '../../types/intelligence';


interface DriftPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: OilSpillIncident | null;
  selectedForecastHour: number;
  onSelectForecastHour: (hours: number) => void;
  onActivateGlobeDriftMode: () => void;
}

export const DriftPredictionModal: React.FC<DriftPredictionModalProps> = ({
  isOpen,
  onClose,
  incident,
  selectedForecastHour,
  onSelectForecastHour,
  onActivateGlobeDriftMode,
}) => {
  if (!isOpen || !incident) return null;

  const STEPS = incident.forwardDriftForecast || [];
  const currentStep = STEPS.find((s) => s.hoursOffset === selectedForecastHour) || STEPS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#030712]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="hud-panel w-full max-w-4xl rounded-2xl border border-[#1e293b] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between bg-[#0b1220]/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#fbbf24]/15 border border-[#fbbf24]/50 text-[#fbbf24]">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold font-mono text-[#f8fafc] uppercase tracking-wider">
                  Hydrodynamic Drift & Weathering Simulation
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#fbbf24]/15 text-[#fbbf24] border border-[#fbbf24]/30 font-bold">
                  INCIDENT {incident.code}
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] font-mono">
                Eulerian-Lagrangian Coupled Wind & Ocean Surface Drift Projection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#f8fafc] p-1.5 rounded-lg hover:bg-[#1e293b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-3 gap-5 font-mono">
          {/* Left Column: Forecast Controls & Stepper */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-[#94a3b8] mb-2 font-bold">
                Forecast Time Horizon
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[1, 3, 6, 12, 24].map((hr) => (
                  <button
                    key={hr}
                    onClick={() => onSelectForecastHour(hr)}
                    className={`py-2 rounded-lg border font-bold transition-all ${
                      selectedForecastHour === hr
                        ? 'border-[#fbbf24] bg-[#fbbf24]/20 text-[#fbbf24] shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                        : 'border-[#1e293b] bg-[#0b1220] text-[#94a3b8] hover:border-[#334155]'
                    }`}
                  >
                    +{hr} Hours
                  </button>
                ))}
              </div>
            </div>

            {/* MetOcean Conditions */}
            <div className="p-3.5 rounded-xl bg-[#0b1220] border border-[#1e293b] space-y-2.5">
              <span className="text-xs uppercase text-[#94a3b8] font-bold block pb-1 border-b border-[#1e293b]">
                MetOcean Vector Inputs
              </span>

              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94a3b8]">Surface Wind:</span>
                <span className="text-[#f8fafc] font-bold">
                  {incident.metOcean.windSpeedKts} kts @ {incident.metOcean.windDirectionDeg}° (WSW)
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94a3b8]">Ocean Current:</span>
                <span className="text-[#00d4ff] font-bold">
                  {incident.metOcean.currentSpeedKts} kts @ {incident.metOcean.currentDirectionDeg}° (ENE)
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94a3b8]">Sea Temp / Waves:</span>
                <span className="text-[#f8fafc]">
                  {incident.metOcean.seaSurfaceTempC}°C / {incident.metOcean.waveHeightM}m
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94a3b8]">Oil Weathering:</span>
                <span className="text-[#fb923c] font-bold">14% Evaporated</span>
              </div>
            </div>

            {/* Coastline Warning */}
            <div className="p-3 rounded-xl bg-[#ff4d4d]/10 border border-[#ff4d4d]/30 text-xs">
              <div className="flex items-center space-x-2 text-[#ff4d4d] font-bold mb-1">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>COASTAL RISK EVALUATION</span>
              </div>
              <p className="text-[#cbd5e1] text-[11px] leading-relaxed">
                Projected trajectory vectors carry slick east-northeast towards the {incident.closestLandmark}. Estimated earliest coastal impact at +28 hours if uncontained.
              </p>
            </div>

            {/* Activate Globe Button */}
            <button
              onClick={() => {
                onActivateGlobeDriftMode();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#f97316] text-[#030712] font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-[0_0_15px_rgba(251,191,36,0.4)] flex items-center justify-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>Simulate on 3D Earth Globe</span>
            </button>
          </div>

          {/* Right Two Columns: Forecast Step Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="hud-panel p-4 rounded-xl border border-[#1e293b] bg-[#0b1220]/80">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1e293b]">
                <div>
                  <h3 className="text-sm font-bold text-[#f8fafc]">
                    Forecast State at +{selectedForecastHour} Hours
                  </h3>
                  <div className="text-xs text-[#94a3b8]">
                    Valid for: {currentStep ? currentStep.timestamp.substring(0, 16).replace('T', ' ') : ''} UTC
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-[#fbbf24]/20 text-[#fbbf24] border border-[#fbbf24]/40 font-bold">
                  EXPANDING SLICK
                </span>
              </div>

              {/* Data Cards */}
              <div className="grid grid-cols-3 gap-3 text-xs mb-4">
                <div className="bg-[#030712] p-3 rounded-lg border border-[#1e293b]">
                  <span className="text-[10px] text-[#94a3b8] block">PROJECTED AREA</span>
                  <span className="text-xl font-bold text-[#fbbf24]">
                    {currentStep ? currentStep.areaKm2 : incident.estimatedAreaKm2} km²
                  </span>
                  <span className="text-[10px] text-[#10b981] block">
                    +{currentStep ? (currentStep.areaKm2 - incident.estimatedAreaKm2).toFixed(1) : 0} km² spread
                  </span>
                </div>

                <div className="bg-[#030712] p-3 rounded-lg border border-[#1e293b]">
                  <span className="text-[10px] text-[#94a3b8] block">CENTER LAT / LNG</span>
                  <span className="text-sm font-bold text-[#f8fafc]">
                    {currentStep ? currentStep.centerLat.toFixed(2) : incident.lat}°N
                  </span>
                  <span className="text-sm font-bold text-[#f8fafc] block">
                    {currentStep ? currentStep.centerLng.toFixed(2) : incident.lng}°E
                  </span>
                </div>

                <div className="bg-[#030712] p-3 rounded-lg border border-[#1e293b]">
                  <span className="text-[10px] text-[#94a3b8] block">DISPERSION SPEED</span>
                  <span className="text-xl font-bold text-[#00d4ff]">
                    1.4 kts
                  </span>
                  <span className="text-[10px] text-[#64748b] block">towards 070° East</span>
                </div>
              </div>

              {/* Hydrodynamic Corridor Graphic */}
              <div className="relative h-44 rounded-xl border border-[#1e293b] bg-[#030712] overflow-hidden flex items-center justify-center p-4">
                <svg viewBox="0 0 360 140" className="w-full h-full">
                  {/* Grid */}
                  <line x1="0" y1="70" x2="360" y2="70" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="180" y1="0" x2="180" y2="140" stroke="#1e293b" strokeDasharray="3,3" />

                  {/* Uncertainty cone */}
                  <polygon
                    points="60,70 320,30 320,110"
                    fill="rgba(251, 191, 36, 0.12)"
                    stroke="rgba(251, 191, 36, 0.4)"
                    strokeDasharray="4,4"
                  />

                  {/* Initial slick */}
                  <circle cx="60" cy="70" r="14" fill="rgba(255, 77, 77, 0.6)" stroke="#ff4d4d" strokeWidth="2" />
                  <text x="60" y="100" textAnchor="middle" fill="#ff4d4d" fontSize="10" fontFamily="monospace">
                    T0 (Initial)
                  </text>

                  {/* Drift Vector Arrow */}
                  <line x1="60" y1="70" x2="220" y2="70" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="5,5" />
                  <polygon points="220,66 230,70 220,74" fill="#fbbf24" />

                  {/* Forecast Slick (+hr) */}
                  <circle cx="230" cy="70" r="22" fill="rgba(251, 191, 36, 0.5)" stroke="#fbbf24" strokeWidth="2" />
                  <text x="230" y="105" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    +{selectedForecastHour}h Position
                  </text>
                </svg>

                <div className="absolute bottom-2 right-2 text-[10px] text-[#94a3b8] font-mono">
                  UNCERTAINTY ENVELOPE: ±12%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

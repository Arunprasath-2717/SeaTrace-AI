import React, { useState } from 'react';
import { useSentinel } from '../../context/SentinelContext';
import {
  Wind,
  Compass,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldAlert,
  Waves,
  MapPin,
} from 'lucide-react';

export const DriftPredictionPage: React.FC = () => {
  const { incidents, selectedIncident, setSelectedIncident, showToast } = useSentinel();

  const currentInc = selectedIncident || incidents[0];

  // MetOcean Inputs
  const [windSpeedKts, setWindSpeedKts] = useState<number>(18.5);
  const [windDirDeg, setWindDirDeg] = useState<number>(245); // WSW
  const [currentSpeedKts, setCurrentSpeedKts] = useState<number>(1.2);
  const [currentDirDeg, setCurrentDirDeg] = useState<number>(65); // ENE

  // Forecast Timeline Slider: +1h, +3h, +6h, +12h, +24h
  const [forecastHour, setForecastHour] = useState<number>(6);

  // Dynamic calculations based on forecast hour
  const areaMultiplier = 1 + (forecastHour / 24) * 1.45;
  const projectedArea = (currentInc.estimatedAreaKm2 * areaMultiplier).toFixed(1);
  const driftDistanceKm = (forecastHour * (currentSpeedKts * 1.852 + windSpeedKts * 0.03 * 1.852)).toFixed(1);
  const remainingDistanceToCoast = Math.max(0, currentInc.coastalDistanceKm - parseFloat(driftDistanceKm)).toFixed(0);
  const estimatedLandfallHours = Math.round(currentInc.coastalDistanceKm / (currentSpeedKts * 1.852 + windSpeedKts * 0.03 * 1.852));

  return (
    <div className="flex-1 flex flex-col gap-5 p-6 overflow-y-auto select-none bg-[#07111F] text-slate-100 scrollbar-thin">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-[#00C2FF]" />
          <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">
            Oil Spill Hydrodynamic Drift Prediction
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/40">
            METOCEAN SIMULATION
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Coupled ocean surface currents and atmospheric wind forcing model forecasting trajectory and coastal threat distance.
        </p>
      </div>

      {/* Main Grid: MetOcean Controls (4 cols) & Forecast Projection Workspace (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* MetOcean Parameters Card */}
        <div className="lg:col-span-4 p-5 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col gap-4">
          <h2 className="text-xs font-bold font-mono text-white uppercase tracking-wider pb-2 border-b border-[#23364B]">
            MetOcean Hydrodynamic Inputs
          </h2>

          {/* Incident Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Target Incident
            </label>
            <select
              value={currentInc.id}
              onChange={(e) => {
                const match = incidents.find((i) => i.id === e.target.value);
                if (match) setSelectedIncident(match);
              }}
              className="w-full bg-[#07111F] border border-[#23364B] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00C2FF]"
            >
              {incidents.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.code} — {i.name}
                </option>
              ))}
            </select>
          </div>

          {/* Wind Speed & Direction */}
          <div className="p-3 rounded-xl bg-[#07111F] border border-[#23364B] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-[#00C2FF]" /> Surface Wind
              </span>
              <span className="font-mono font-bold text-[#00C2FF]">{windSpeedKts} kts @ {windDirDeg}°</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400">Wind Speed (kts)</span>
              <input
                type="range"
                min="0"
                max="40"
                value={windSpeedKts}
                onChange={(e) => setWindSpeedKts(parseFloat(e.target.value))}
                className="w-full accent-[#00C2FF] cursor-pointer"
              />
            </div>

            <div>
              <span className="text-[10px] text-slate-400">Wind Direction (Deg)</span>
              <input
                type="range"
                min="0"
                max="360"
                value={windDirDeg}
                onChange={(e) => setWindDirDeg(parseInt(e.target.value))}
                className="w-full accent-[#00C2FF] cursor-pointer"
              />
            </div>
          </div>

          {/* Ocean Current Speed & Direction */}
          <div className="p-3 rounded-xl bg-[#07111F] border border-[#23364B] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-teal-400" /> Ocean Current
              </span>
              <span className="font-mono font-bold text-teal-400">{currentSpeedKts} kts @ {currentDirDeg}°</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400">Current Velocity (kts)</span>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={currentSpeedKts}
                onChange={(e) => setCurrentSpeedKts(parseFloat(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>

            <div>
              <span className="text-[10px] text-slate-400">Current Direction (Deg)</span>
              <input
                type="range"
                min="0"
                max="360"
                value={currentDirDeg}
                onChange={(e) => setCurrentDirDeg(parseInt(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Simulation Assumptions */}
          <div className="p-3 rounded-xl bg-[#07111F]/50 border border-[#23364B] text-[10px] text-slate-400 leading-relaxed font-mono">
            <strong>Model:</strong> Fay-Hoult Spreading + 3% Wind Drift Law + Eulerian current advection. Evaporative loss modeled at 22% in first 24h.
          </div>
        </div>

        {/* Projection Visualization Workspace */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Timeline Horizon Slider Card */}
          <div className="p-5 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Forecast Horizon
                </span>
                <span className="text-xl font-black font-mono text-[#00C2FF]">
                  +{forecastHour} Hours Post-Detection
                </span>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-xs">
                {[1, 3, 6, 12, 24].map((h) => (
                  <button
                    key={h}
                    onClick={() => setForecastHour(h)}
                    className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                      forecastHour === h
                        ? 'bg-gradient-to-r from-[#00C2FF] to-[#14B8A6] text-slate-950 border-transparent shadow-md'
                        : 'border-[#23364B] text-slate-300 hover:bg-[#13283F]'
                    }`}
                  >
                    +{h}h
                  </button>
                ))}
              </div>
            </div>

            {/* Slider */}
            <div>
              <input
                type="range"
                min="1"
                max="24"
                value={forecastHour}
                onChange={(e) => setForecastHour(parseInt(e.target.value))}
                className="w-full accent-[#00C2FF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>+1 Hour (Immediate)</span>
                <span>+6 Hours (Tactical)</span>
                <span>+12 Hours (Regional)</span>
                <span>+24 Hours (Strategic Landfall)</span>
              </div>
            </div>
          </div>

          {/* Key Forecast Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#0D1B2A] border border-[#23364B]">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">
                Projected Slick Area
              </span>
              <span className="text-2xl font-black font-mono text-white">
                {projectedArea} km²
              </span>
              <span className="text-[10px] font-mono text-rose-400 block mt-1">
                +{((parseFloat(projectedArea) - currentInc.estimatedAreaKm2) / currentInc.estimatedAreaKm2 * 100).toFixed(0)}% Expansion
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D1B2A] border border-[#23364B]">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">
                Cumulative Drift Distance
              </span>
              <span className="text-2xl font-black font-mono text-[#00C2FF]">
                {driftDistanceKm} km
              </span>
              <span className="text-[10px] font-mono text-slate-400 block mt-1">
                Direction: {currentInc.driftDirectionDeg}° ENE
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D1B2A] border border-[#23364B]">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">
                Shoreline Landfall Threat
              </span>
              <span className="text-2xl font-black font-mono text-amber-400">
                ~{estimatedLandfallHours} Hours
              </span>
              <span className="text-[10px] font-mono text-slate-400 block mt-1">
                {remainingDistanceToCoast} km to Konkan Coast
              </span>
            </div>
          </div>

          {/* Shoreline Threat & Containment Recommendation Card */}
          <div className="p-5 rounded-2xl border border-rose-500/40 bg-[#0D1B2A] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span className="uppercase font-mono tracking-wider">
                Coastline Environmental Threat Advisory
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              At current MetOcean parameters (wind 18.5 kts @ 245°, current 1.2 kts @ 065°), the slick trajectory intersects the <strong>Murud-Janjira Coastal Sanctuary and Revdanda Estuary</strong> in approximately <strong>{estimatedLandfallHours} hours</strong>. 
            </p>

            <div className="p-3 rounded-xl bg-[#07111F] border border-[#23364B] flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Recommended Action</span>
                <span className="font-semibold text-emerald-400">
                  Deploy offshore containment boom barrier at coordinate 18.65°N, 72.15°E
                </span>
              </div>
              <button
                onClick={() => showToast('Dispatched containment advisory to Coast Guard Western Command.', 'success')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs hover:opacity-95 shadow-md"
              >
                Dispatch Advisory
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

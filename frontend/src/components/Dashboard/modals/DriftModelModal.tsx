import React, { useState } from 'react';
import { X, Wind, Play, RefreshCw } from 'lucide-react';

interface DriftModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onSuccess: (msg: string) => void;
}

export const DriftModelModal: React.FC<DriftModelModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onSuccess,
}) => {
  const [horizon, setHorizon] = useState('72');
  const [particles, setParticles] = useState('1000');
  const [windSpeed, setWindSpeed] = useState('14');
  const [currentSpeed, setCurrentSpeed] = useState('1.2');
  const [running, setRunning] = useState(false);

  if (!isOpen) return null;

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      onSuccess(`OpenDrift backward reconstruction finished! 72-hr origin candidate localized with 94% confidence.`);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md select-none">
      <div
        className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl transition-all ${
          isDarkMode ? 'bg-[#0a1835] border-blue-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-teal-500/10 text-teal-500">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">MetOcean Hydrodynamic Drift Simulation</h2>
              <div className="text-[10px] text-slate-700 dark:text-slate-400 font-bold">Lagrangian Particle Backward Trajectory</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-300 block mb-1">
                Projection Horizon
              </label>
              <select
                value={horizon}
                onChange={(e) => setHorizon(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border outline-none bg-slate-50 dark:bg-[#0f244a] border-slate-300 dark:border-blue-900/60 text-slate-900 dark:text-white font-semibold"
              >
                <option value="24">24 Hours (Immediate)</option>
                <option value="48">48 Hours (Standard)</option>
                <option value="72">72 Hours (Extended)</option>
                <option value="120">120 Hours (Long-Range)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-300 block mb-1">
                Ensemble Particles
              </label>
              <select
                value={particles}
                onChange={(e) => setParticles(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border outline-none bg-slate-50 dark:bg-[#0f244a] border-slate-300 dark:border-blue-900/60 text-slate-900 dark:text-white font-semibold"
              >
                <option value="500">500 Particles (Fast)</option>
                <option value="1000">1,000 Particles (Nominal)</option>
                <option value="5000">5,000 Particles (High-Res)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-300">
                Wind Drift Factor (ECMWF ERA5)
              </label>
              <span className="font-mono text-teal-800 dark:text-teal-400 font-black">{windSpeed} knots (SSW)</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={windSpeed}
              onChange={(e) => setWindSpeed(e.target.value)}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-300">
                Surface Current Velocity (HYCOM)
              </label>
              <span className="font-mono text-sky-800 dark:text-sky-400 font-black">{currentSpeed} m/s</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={currentSpeed}
              onChange={(e) => setCurrentSpeed(e.target.value)}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/50 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-900 dark:text-slate-300">Model Engine: OpenDrift 2.10</span>
            <span className="text-[10px] font-mono font-black text-teal-800 dark:text-teal-400">Coupled MetOcean</span>
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:opacity-90 shadow-lg shadow-teal-500/25 cursor-pointer transition-all disabled:opacity-50"
            >
              {running ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Simulating Particles…
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Execute Trajectory Model
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useSentinel } from '../../context/SentinelContext';
import {
  Settings,
  User,
  Sliders,
  RotateCcw,
  Shield,
  Save,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoData, showToast } = useSentinel();

  const [confThreshold, setConfThreshold] = useState<number>(settings.confidenceThreshold);
  const [spatialWeight, setSpatialWeight] = useState<number>(settings.spatialWeight);
  const [temporalWeight, setTemporalWeight] = useState<number>(settings.temporalWeight);
  const [driftWeight, setDriftWeight] = useState<number>(settings.driftWeight);
  const [behaviorWeight, setBehaviorWeight] = useState<number>(settings.behaviorWeight);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  const handleSaveParameters = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      confidenceThreshold: confThreshold,
      spatialWeight,
      temporalWeight,
      driftWeight,
      behaviorWeight,
    });
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col gap-5 p-6 overflow-y-auto select-none bg-[#07111F] text-slate-100 scrollbar-thin">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#00C2FF]" />
          <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">
            Platform Configuration & Settings
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
            NTRO SECURITY SETTINGS
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Tune attribution algorithm weight matrices, set detection confidence limits, and manage user profile credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* User Profile Credentials (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col gap-4">
          <h2 className="text-xs font-bold font-mono text-white uppercase tracking-wider pb-2 border-b border-[#23364B]">
            Investigator Profile
          </h2>

          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="CDR Rodriguez"
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#00C2FF]/40 shadow-lg"
            />
            <div>
              <h3 className="text-sm font-bold text-white">CDR James Rodriguez</h3>
              <p className="text-xs text-[#00C2FF] font-mono">Duty Officer / Senior Analyst</p>
              <span className="text-[10px] text-slate-400 font-mono">Badge #NTRO-MAR-4019</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#07111F] border border-[#23364B] flex flex-col gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block">Organization</span>
              <span className="text-slate-200">National Technical Research Organisation</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Clearance Level</span>
              <span className="text-emerald-400">RESTRICTED // SIH-GOV-OPS</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Session Token</span>
              <span className="text-slate-400 truncate block">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</span>
            </div>
          </div>
        </div>

        {/* Algorithm Weight Matrix Form (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col justify-between">
          <form onSubmit={handleSaveParameters} className="flex flex-col gap-4">
            <h2 className="text-xs font-bold font-mono text-white uppercase tracking-wider pb-2 border-b border-[#23364B]">
              Spill Attribution Scoring Weights (Total: 100%)
            </h2>

            {/* Spatial Weight */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-300">Spatial Proximity Weight</span>
                <span className="font-mono text-[#00C2FF] font-bold">{spatialWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={spatialWeight}
                onChange={(e) => setSpatialWeight(parseInt(e.target.value))}
                className="w-full accent-[#00C2FF] cursor-pointer"
              />
            </div>

            {/* Temporal Weight */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-300">Temporal Consistency Weight</span>
                <span className="font-mono text-[#14B8A6] font-bold">{temporalWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={temporalWeight}
                onChange={(e) => setTemporalWeight(parseInt(e.target.value))}
                className="w-full accent-[#14B8A6] cursor-pointer"
              />
            </div>

            {/* Drift Weight */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-300">Drift Trajectory Compatibility Weight</span>
                <span className="font-mono text-emerald-400 font-bold">{driftWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={driftWeight}
                onChange={(e) => setDriftWeight(parseInt(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Behavior Weight */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-300">Behavioral Anomaly & AIS Silence Weight</span>
                <span className="font-mono text-rose-400 font-bold">{behaviorWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={behaviorWeight}
                onChange={(e) => setBehaviorWeight(parseInt(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Sum: {spatialWeight + temporalWeight + driftWeight + behaviorWeight}% (Optimal = 100%)
              </span>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#14B8A6] text-slate-950 font-bold text-xs shadow-md hover:opacity-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Parameters</span>
              </button>
            </div>
          </form>

          {/* Reset Demo Data Action */}
          <div className="mt-6 pt-4 border-t border-[#23364B] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Reset Demo Environment</span>
              <span className="text-[10px] text-slate-400">
                Revert all modified incident records, scores, and investigator notes to initial baseline.
              </span>
            </div>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-500/15 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-[#0D1B2A] border border-[#23364B] shadow-2xl text-slate-100 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-sm">Confirm Reset Demo Environment</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will clear all localStorage changes and restore all 8 simulated incidents and 10 vessels to their original factory demonstration values.
            </p>
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

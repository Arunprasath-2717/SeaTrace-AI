import React from 'react';
import { useSentinel } from '../../context/SentinelContext';
import {
  X,
  AlertTriangle,
  Ship,
  Compass,
  Clock,
  Shield,
  Target,
  Wind,
  FileCheck,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const InvestigationDrawer: React.FC = () => {
  const {
    selectedIncident,
    setSelectedIncident,
    selectedVessel,
    setSelectedVessel,
    setActivePage,
  } = useSentinel();

  if (!selectedIncident && !selectedVessel) return null;

  const handleClose = () => {
    setSelectedIncident(null);
    setSelectedVessel(null);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[#0D1B2A] border-l border-[#23364B] shadow-2xl z-50 flex flex-col justify-between overflow-hidden select-none animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#23364B] flex items-center justify-between bg-[#07111F]/50">
        <div className="flex items-center gap-2">
          {selectedIncident ? (
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          ) : (
            <Ship className="w-5 h-5 text-[#00C2FF]" />
          )}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              {selectedIncident ? 'Incident Dossier' : 'Vessel Intelligence'}
            </span>
            <h2 className="text-sm font-bold text-white truncate max-w-[240px]">
              {selectedIncident ? selectedIncident.code : selectedVessel?.name}
            </h2>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4 text-xs text-slate-300">
        {selectedIncident && (
          <>
            {/* Incident Summary Card */}
            <div className="p-3.5 rounded-xl bg-[#07111F] border border-[#23364B] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{selectedIncident.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedIncident.severity === 'Critical'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {selectedIncident.severity}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {selectedIncident.description}
              </p>
            </div>

            {/* Incident Metrics Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#07111F] border border-[#23364B]">
                <span className="text-[10px] font-mono text-slate-400 block">Estimated Area</span>
                <span className="text-sm font-bold text-[#00C2FF] font-mono">
                  {selectedIncident.estimatedAreaKm2} km²
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#07111F] border border-[#23364B]">
                <span className="text-[10px] font-mono text-slate-400 block">SAR Confidence</span>
                <span className="text-sm font-bold text-[#14B8A6] font-mono">
                  {selectedIncident.confidencePct}%
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#07111F] border border-[#23364B]">
                <span className="text-[10px] font-mono text-slate-400 block">Sensor Satellite</span>
                <span className="text-xs font-semibold text-slate-200">
                  {selectedIncident.sensor}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#07111F] border border-[#23364B]">
                <span className="text-[10px] font-mono text-slate-400 block">Coast Distance</span>
                <span className="text-xs font-semibold text-slate-200">
                  {selectedIncident.coastalDistanceKm} km
                </span>
              </div>
            </div>

            {/* Quick Investigation Action Links */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400">
                Investigation Actions
              </span>
              <button
                onClick={() => {
                  setActivePage('spill-attribution');
                  handleClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#07111F] hover:bg-[#13283F] border border-[#23364B] text-slate-200 font-semibold group transition-all"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#00C2FF]" />
                  <span>Run Spill Attribution Engine</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setActivePage('drift-prediction');
                  handleClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#07111F] hover:bg-[#13283F] border border-[#23364B] text-slate-200 font-semibold group transition-all"
              >
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-[#14B8A6]" />
                  <span>Simulate Drift Forecast</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setActivePage('incident-management');
                  handleClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#07111F] hover:bg-[#13283F] border border-[#23364B] text-slate-200 font-semibold group transition-all"
              >
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Manage Incident Status</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </>
        )}

        {selectedVessel && !selectedIncident && (
          <>
            {/* Vessel Summary Card */}
            <div className="p-3.5 rounded-xl bg-[#07111F] border border-[#23364B] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{selectedVessel.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedVessel.investigationStatus === 'Prime Suspect'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : selectedVessel.investigationStatus === 'Person of Interest'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {selectedVessel.investigationStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {selectedVessel.behaviorNotes || 'Standard maritime transit.'}
              </p>
            </div>

            {/* Vessel Metadata Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#07111F] border border-[#23364B]">
                <span className="text-[10px] font-mono text-slate-400 block">MMSI / IMO</span>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {selectedVessel.mmsi} / {selectedVessel.imo}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#07111F] border border-[#23364B]">
                <span className="text-[10px] font-mono text-slate-400 block">Vessel Type</span>
                <span className="text-xs font-semibold text-slate-200">
                  {selectedVessel.type}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#07111F] border border-[#23364B]">
                <span className="text-[10px] font-mono text-slate-400 block">Current Telemetry</span>
                <span className="text-xs font-mono font-bold text-[#00C2FF]">
                  {selectedVessel.speedKts} kts @ {selectedVessel.headingDeg}°
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#07111F] border border-[#23364B]">
                <span className="text-[10px] font-mono text-slate-400 block">Attribution Score</span>
                <span className="text-xs font-mono font-bold text-rose-400">
                  {selectedVessel.attributionScore}/100
                </span>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => {
                setActivePage('vessel-intelligence');
                handleClose();
              }}
              className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-[#00C2FF]/15 hover:bg-[#00C2FF]/25 border border-[#00C2FF]/40 text-[#00C2FF] font-semibold group transition-all"
            >
              <span>Inspect Full Vessel Intelligence History</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-[#23364B] bg-[#07111F]/50 flex items-center justify-end">
        <button
          onClick={handleClose}
          className="px-4 py-1.5 rounded-xl bg-[#0D1B2A] hover:bg-[#13283F] border border-[#23364B] text-xs font-semibold text-slate-300"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Ship, MapPin, Clock, ShieldAlert, Radio } from 'lucide-react';

export interface VesselData {
  name: string;
  imo: string;
  mmsi: string;
  lat: string;
  lon: string;
  sc: string;
  st: string;
  spd: string;
}

interface VesselDetailModalProps {
  vessel: VesselData | null;
  onClose: () => void;
  isDarkMode: boolean;
  onSuccess: (msg: string) => void;
}

export const VesselDetailModal: React.FC<VesselDetailModalProps> = ({
  vessel,
  onClose,
  isDarkMode,
  onSuccess,
}) => {
  if (!vessel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md select-none">
      <div
        className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl transition-all ${
          isDarkMode ? 'bg-[#0a1835] border-blue-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 dark:text-white">{vessel.name}</h2>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold text-white ${vessel.sc}`}>
                  {vessel.st}
                </span>
              </div>
              <div className="text-[10px] text-slate-700 dark:text-slate-400 font-bold">IMO: {vessel.imo} · MMSI: {vessel.mmsi}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs mb-4">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0f244a] border border-slate-300 dark:border-blue-900/40">
            <span className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Current Coordinates</span>
            <div className="flex items-center gap-1.5 font-black font-mono text-slate-900 dark:text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-indigo-700" />
              {vessel.lat}, {vessel.lon}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0f244a] border border-slate-300 dark:border-blue-900/40">
            <span className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Speed Over Ground (SOG)</span>
            <div className="flex items-center gap-1.5 font-black font-mono text-slate-900 dark:text-slate-200">
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              {vessel.spd}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0f244a] border border-slate-300 dark:border-blue-900/40">
            <span className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Vessel Type & Flag</span>
            <div className="font-black text-slate-900 dark:text-slate-200">
              Crude Oil Tanker (VLCC) · Panama [PA]
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0f244a] border border-slate-300 dark:border-blue-900/40">
            <span className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Proximity to Slick ST-2046</span>
            <div className="font-black font-mono text-rose-700 dark:text-rose-400">
              0.42 NM (Intersecting Trajectory)
            </div>
          </div>
        </div>

        {/* Forensic Attribution Highlight */}
        <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 mb-5 text-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span className="font-black text-rose-900 dark:text-rose-400 uppercase tracking-wider text-[11px]">
              Forensic AIS Anomaly Flagged
            </span>
          </div>
          <p className="text-slate-800 dark:text-slate-300 font-medium leading-relaxed text-[11px]">
            Terrestrial receiver recorded continuous transponder transmission until 04:12 UTC, followed by an unannounced 3.8-hour telemetry blackout corresponding with the Sentinel-1B SAR slick detection window.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onSuccess(`Vessel ${vessel.name} pinned for priority live telemetry monitoring.`);
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 cursor-pointer transition-all"
          >
            <Radio className="w-3.5 h-3.5" /> Pin for Priority Radar Tracking
          </button>
        </div>
      </div>
    </div>
  );
};

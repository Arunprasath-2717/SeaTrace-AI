import React, { useState } from 'react';
import { X, Satellite, Play, RefreshCw, Radio } from 'lucide-react';

interface SarIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onSuccess: (msg: string) => void;
}

export const SarIngestModal: React.FC<SarIngestModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onSuccess,
}) => {
  const [satellite, setSatellite] = useState('Sentinel-1B');
  const [mode, setMode] = useState('IW_GRDH');
  const [polarization, setPolarization] = useState('VV+VH');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleStartIngest = () => {
    setProcessing(true);
    setProgress(15);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          onSuccess(`Ingested SAR Pass ${satellite} (${mode} · ${polarization}) successfully! 2 new slicks segmented.`);
          onClose();
          return 100;
        }
        return prev + 25;
      });
    }, 400);
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
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Ingest Satellite SAR Pass</h2>
              <div className="text-[10px] text-slate-700 dark:text-slate-400 font-bold">Copernicus & CSA Downlink Feed</div>
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
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-300 block mb-1">
              Select Constellation / Sensor
            </label>
            <select
              value={satellite}
              onChange={(e) => setSatellite(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border outline-none bg-slate-50 dark:bg-[#0f244a] border-slate-300 dark:border-blue-900/60 text-slate-900 dark:text-white font-semibold"
            >
              <option value="Sentinel-1B">Sentinel-1B (ESA C-band Synthetic Aperture)</option>
              <option value="Sentinel-1A">Sentinel-1A (Copernicus Archive)</option>
              <option value="RADARSAT-2">RADARSAT-2 (MDA Quad-Pol)</option>
              <option value="ALOS-2 PALSAR">ALOS-2 PALSAR-2 (JAXA L-band Deep Sea)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-300 block mb-1">
                Acquisition Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border outline-none bg-slate-50 dark:bg-[#0f244a] border-slate-300 dark:border-blue-900/60 text-slate-900 dark:text-white font-semibold"
              >
                <option value="IW_GRDH">IW (Interferometric Wide)</option>
                <option value="EW_GRDH">EW (Extra-Wide Swath)</option>
                <option value="SM_SLC">SM (Stripmap High-Res)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-300 block mb-1">
                Polarization
              </label>
              <select
                value={polarization}
                onChange={(e) => setPolarization(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border outline-none bg-slate-50 dark:bg-[#0f244a] border-slate-300 dark:border-blue-900/60 text-slate-900 dark:text-white font-semibold"
              >
                <option value="VV+VH">Dual: VV + VH</option>
                <option value="HH+HV">Dual: HH + HV</option>
                <option value="QUAD">Full Quad-Pol</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-900 dark:text-slate-300">Target: Sector 4B (Arabian Sea)</span>
            </div>
            <span className="text-[10px] font-mono font-black text-indigo-900 dark:text-indigo-400">21.45°N, 68.32°E</span>
          </div>

          {processing && (
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex items-center justify-between text-[11px] font-black text-slate-900">
                <span className="flex items-center gap-1.5 text-indigo-700">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Ingesting & Segmenting SAR pass…
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-sky-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartIngest}
              disabled={processing}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 cursor-pointer transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" /> Start SAR Ingestion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

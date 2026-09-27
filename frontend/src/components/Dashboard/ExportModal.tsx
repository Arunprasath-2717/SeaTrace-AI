import React from 'react';
import { X, Download, FileSpreadsheet, FileJson, FileText, ShieldCheck } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div
        className={`w-full max-w-sm p-6 rounded-3xl border shadow-2xl transition-all ${
          isDarkMode
            ? 'bg-[#0a1835] border-blue-900/50 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-bold">Export Intelligence Dossier</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          Export verified maritime intelligence reports, IMO compliance packets, and
          hydrodynamic drift projections for legal attribution.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onClose}
            className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
              isDarkMode
                ? 'bg-[#0f244a]/50 border-blue-900/40 hover:bg-[#0f244a] hover:border-teal-400'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-teal-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-emerald-500" />
              <div className="text-left">
                <span className="text-xs font-semibold block">IMO Evidence Dossier (.pdf)</span>
                <span className="text-[10px] text-slate-400">Formal legal attribution dossier</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
              Certified
            </span>
          </button>

          <button
            onClick={onClose}
            className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
              isDarkMode
                ? 'bg-[#0f244a]/50 border-blue-900/40 hover:bg-[#0f244a] hover:border-teal-400'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-teal-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileJson className="w-5 h-5 text-blue-500" />
              <div className="text-left">
                <span className="text-xs font-semibold block">GIS GeoJSON Slicks (.json)</span>
                <span className="text-[10px] text-slate-400">Vector polygon & drift vectors</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">
              QGIS/ESRI
            </span>
          </button>

          <button
            onClick={onClose}
            className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
              isDarkMode
                ? 'bg-[#0f244a]/50 border-blue-900/40 hover:bg-[#0f244a] hover:border-teal-400'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-teal-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-teal-400" />
              <div className="text-left">
                <span className="text-xs font-semibold block">AIS Telemetry Logs (.xlsx)</span>
                <span className="text-[10px] text-slate-400">25 vessels & speed anomalies</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-teal-500/10 text-teal-500">
              Raw Data
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

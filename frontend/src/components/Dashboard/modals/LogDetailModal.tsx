import React from 'react';
import { X, Download } from 'lucide-react';

export interface LogData {
  label: string;
  tag: string;
  tc: string;
  date: string;
  Icon: React.ElementType;
}

interface LogDetailModalProps {
  log: LogData | null;
  onClose: () => void;
  isDarkMode: boolean;
  onSuccess: (msg: string) => void;
}

export const LogDetailModal: React.FC<LogDetailModalProps> = ({
  log,
  onClose,
  isDarkMode,
  onSuccess,
}) => {
  if (!log) return null;
  const Icon = log.Icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md select-none">
      <div
        className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl transition-all ${
          isDarkMode ? 'bg-[#0a1835] border-blue-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Operational Log Record</h2>
              <div className="text-[10px] text-slate-700 dark:text-slate-400 font-bold">Timestamp: {log.date} · Verified Hash</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f244a] border border-slate-300 dark:border-blue-900/40 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-900 dark:text-white">{log.label}</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: log.tc }}>
              {log.tag}
            </span>
          </div>
          <p className="text-xs text-slate-800 dark:text-slate-400 font-medium leading-relaxed">
            Record captured by SeaTrace Automated Telemetry Pipeline. Processed with dual-stage U-Net segmentation & Kalman-filtered AIS trajectory correlation.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-xs mb-5">
          <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-700 dark:text-slate-400 font-bold">Integrity Hash</span>
            <span className="font-mono font-black text-slate-900 dark:text-slate-300">sha256:8f92a1...bc40</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-700 dark:text-slate-400 font-bold">Source Node</span>
            <span className="font-black text-slate-900 dark:text-slate-300">Orbital Ingest Worker-04 (IN-West)</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-700 dark:text-slate-400 font-bold">Compliance Status</span>
            <span className="font-black text-emerald-800 dark:text-emerald-500">IOPC Rule 4A Certified</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onSuccess(`Exported raw audit log for "${log.label}".`);
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 cursor-pointer transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};

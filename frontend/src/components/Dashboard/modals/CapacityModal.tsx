import React from 'react';
import { X, Cpu, Zap, Activity } from 'lucide-react';

interface CapacityModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onSuccess: (msg: string) => void;
}

export const CapacityModal: React.FC<CapacityModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onSuccess,
}) => {
  if (!isOpen) return null;

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
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Neural Compute & Ingestion Capacity</h2>
              <div className="text-[10px] text-slate-700 dark:text-slate-400 font-bold">GPU Cluster Health · Arabian Sea Pipeline</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs mb-4">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0f244a] border border-slate-300 dark:border-blue-900/40">
            <span className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Model Inference Latency</span>
            <div className="text-base font-black font-mono text-emerald-700 dark:text-emerald-400">38 ms / tile</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0f244a] border border-slate-300 dark:border-blue-900/40">
            <span className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider block mb-0.5">GPU Memory Allocation</span>
            <div className="text-base font-black font-mono text-indigo-700 dark:text-indigo-400">14.2 / 24 GB</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0f244a] border border-slate-300 dark:border-blue-900/40">
            <span className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Active Ingest Queues</span>
            <div className="text-base font-black font-mono text-slate-900 dark:text-slate-100">2 Streams</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0f244a] border border-slate-300 dark:border-blue-900/40">
            <span className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider block mb-0.5">System Availability</span>
            <div className="text-base font-black font-mono text-teal-700 dark:text-teal-400">99.98% Uptime</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200">All 4 Processing Nodes Nominal</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
            HEALTHY
          </span>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 cursor-pointer"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              onSuccess('Triggered GPU cache rebalance and pipeline health check.');
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 cursor-pointer transition-all"
          >
            <Zap className="w-3.5 h-3.5" /> Rebalance Cluster
          </button>
        </div>
      </div>
    </div>
  );
};

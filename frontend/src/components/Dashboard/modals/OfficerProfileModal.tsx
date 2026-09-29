import React from 'react';
import { X, Shield, LogOut } from 'lucide-react';

interface OfficerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onSuccess: (msg: string) => void;
}

export const OfficerProfileModal: React.FC<OfficerProfileModalProps> = ({
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
            <Shield className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-black text-slate-900 dark:text-white">Maritime Command Officer Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 mb-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-indigo-500/60 shadow-md shrink-0">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80"
              alt="CDR Rodriguez"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 dark:text-white">CDR James Rodriguez</div>
            <div className="text-xs text-indigo-700 dark:text-indigo-400 font-bold">Command Duty Officer (CDO)</div>
            <div className="text-[10px] text-slate-700 dark:text-slate-400 font-bold mt-0.5">Naval Command & Control Center · Mumbai</div>
          </div>
        </div>

        {/* Credentials & Details */}
        <div className="flex flex-col gap-2.5 text-xs mb-5">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0f244a] border border-slate-300 dark:border-blue-900/40">
            <span className="text-slate-700 dark:text-slate-400 font-bold">Security Clearance</span>
            <span className="font-black text-emerald-800 dark:text-emerald-500 font-mono">SECRET // RELEASABLE IN/NATO</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0f244a] border border-slate-300 dark:border-blue-900/40">
            <span className="text-slate-700 dark:text-slate-400 font-bold">Active Watch Shift</span>
            <span className="font-black text-slate-900 dark:text-slate-200">06:00 – 18:00 UTC (Current)</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0f244a] border border-slate-300 dark:border-blue-900/40">
            <span className="text-slate-700 dark:text-slate-400 font-bold">Authorized Sectors</span>
            <span className="font-black text-slate-900 dark:text-slate-200">Arabian Sea · Bay of Bengal · EEZ</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0f244a] border border-slate-300 dark:border-blue-900/40">
            <span className="text-slate-700 dark:text-slate-400 font-bold">Active Incidents Under Watch</span>
            <span className="font-black text-rose-800 dark:text-rose-400 font-mono">4 Slicks (1 Prime Suspect)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onSuccess('Watch log signed & verified. Officer shift active.');
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer shadow-md transition-all text-center"
          >
            Confirm Watch Log
          </button>
          <button
            onClick={() => {
              onSuccess('Switched duty officer station.');
              onClose();
            }}
            className="flex items-center gap-1.5 py-2.5 px-4 rounded-full text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 cursor-pointer transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Transfer Watch
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Edit2,
  CheckCircle,
  Radio,
} from 'lucide-react';

interface BoardMeetingCardProps {
  isDarkMode?: boolean;
}

export const BoardMeetingCard: React.FC<BoardMeetingCardProps> = () => {
  const [status, setStatus] = useState<'idle' | 'accepted' | 'rescheduled'>('idle');

  return (
    <div className="flex flex-col p-5 rounded-3xl border border-[#1E2E48] bg-[#0B1528]/95 shadow-xl shadow-black/20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold tracking-tight text-white">
            ICG Tactical Command Briefing
          </h2>
        </div>
        <button
          title="Edit meeting"
          className="p-1 text-slate-400 hover:text-cyan-300 transition-all"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Date & Time info */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <p className="text-xs font-semibold text-slate-200">
          Today at 18:00 UTC (Operational Brief)
        </p>
      </div>

      {/* Description / Attendees */}
      <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
        Joint ICG & DG Shipping Review: Incident ST-2046 Spill Containment & Flag State Attribution
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setStatus('rescheduled')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold border transition-all duration-200 text-center ${
            status === 'rescheduled'
              ? 'border-amber-500 text-amber-400 bg-amber-500/10'
              : 'border-[#1E2E48] text-slate-300 hover:bg-[#0E1B33] hover:border-slate-500'
          }`}
        >
          {status === 'rescheduled' ? 'Deferred' : 'Request Deferral'}
        </button>

        <button
          onClick={() => setStatus('accepted')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold text-white shadow-sm transition-all duration-200 text-center ${
            status === 'accepted'
              ? 'bg-emerald-600 shadow-emerald-500/25'
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
          }`}
        >
          {status === 'accepted' ? (
            <span className="flex items-center justify-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Confirmed
            </span>
          ) : (
            'Confirm Attendance'
          )}
        </button>
      </div>
    </div>
  );
};

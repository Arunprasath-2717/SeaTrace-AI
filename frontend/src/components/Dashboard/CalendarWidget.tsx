import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Satellite,
  MoreHorizontal,
  Anchor,
} from 'lucide-react';

interface CalendarWidgetProps {
  isDarkMode?: boolean;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = () => {
  const [selectedDate, setSelectedDate] = useState<number>(27);
  const [monthName] = useState<string>('Operations Calendar');

  const days = [
    { dayName: 'M', date: 23 },
    { dayName: 'T', date: 24 },
    { dayName: 'W', date: 25 },
    { dayName: 'T', date: 26 },
    { dayName: 'F', date: 27 },
    { dayName: 'S', date: 28 },
    { dayName: 'S', date: 29 },
  ];

  return (
    <div className="flex flex-col p-5 rounded-3xl border border-[#1E2E48] bg-[#0B1528]/95 shadow-xl shadow-black/20 select-none">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold tracking-tight text-white">
          {monthName}
        </h2>
        <div className="flex items-center gap-1 text-slate-400">
          <button
            title="Previous"
            className="p-1 hover:text-cyan-300 rounded transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            title="Next"
            className="p-1 hover:text-cyan-300 rounded transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days Strip */}
      <div className="grid grid-cols-7 gap-1 mb-5 text-center">
        {days.map((item) => {
          const isSelected = selectedDate === item.date;
          return (
            <button
              key={item.date}
              onClick={() => setSelectedDate(item.date)}
              className={`flex flex-col items-center py-1.5 px-1 rounded-2xl transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105 font-bold ring-2 ring-indigo-400/40'
                  : 'hover:bg-[#0e1e38] text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] font-medium opacity-80 mb-0.5">
                {item.dayName}
              </span>
              <span
                className={`text-xs ${
                  isSelected ? 'font-bold text-white' : 'font-medium'
                }`}
              >
                {item.date}
              </span>
            </button>
          );
        })}
      </div>

      {/* Operations Briefings List */}
      <div className="flex flex-col gap-3">
        {/* Schedule Item 1: Sentinel-1B SAR Swath Pass */}
        <div className="p-3.5 rounded-2xl border border-[#1E2E48] bg-[#0E1B33]/80 hover:border-cyan-400/50 hover:bg-[#112344] transition-all duration-200 group">
          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1.5">
            <span className="font-semibold">04:30 - 06:00 UTC (Next Pass)</span>
            <button className="text-slate-400 hover:text-slate-200">
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/70 border border-indigo-700/50 flex items-center justify-center text-cyan-400 shrink-0">
              <Satellite className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold leading-tight truncate text-white">
                Sentinel-1B SAR Swath Pass
              </h3>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                ESA Copernicus • Mumbai High Sector Ingestion
              </p>
            </div>
          </div>
        </div>

        {/* Schedule Item 2: ICG Pollution Response Briefing */}
        <div className="p-3.5 rounded-2xl border border-[#1E2E48] bg-[#0E1B33]/80 hover:border-cyan-400/50 hover:bg-[#112344] transition-all duration-200 group">
          <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 mb-1.5">
            <span className="font-semibold">11:30 - 12:30 UTC</span>
            <button className="text-slate-400 hover:text-slate-200">
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-950/70 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0">
              <Anchor className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold leading-tight truncate text-white">
                ICG Pollution Response Briefing
              </h3>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                ICGS Samudra Prahari • Containment Booms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useSentinel } from '../../context/SentinelContext';
import {
  Search,
  Bell,
  Globe,
  Radio,
  Clock,
  User,
  ShieldAlert,
  ChevronDown,
  X,
} from 'lucide-react';

export const TopNavbar: React.FC = () => {
  const {
    selectedRegion,
    setSelectedRegion,
    globalSearch,
    setGlobalSearch,
    incidents,
    showToast,
  } = useSentinel();

  const [utcTime, setUtcTime] = useState<string>('');
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);

  // UTC Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const regions = [
    'All Regions',
    'Arabian Sea',
    'Bay of Bengal',
    'Gulf of Mannar',
    'Six Degree Channel',
  ];

  return (
    <header className="h-16 px-6 bg-[#07111F] border-b border-[#23364B] flex items-center justify-between gap-4 select-none z-20 shrink-0">
      {/* Left: Operational Region Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block -mb-0.5">
            Operational Sector
          </label>
          <div className="flex items-center gap-1.5 cursor-pointer">
            <Globe className="w-3.5 h-3.5 text-[#00C2FF]" />
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                showToast(`Filter applied: ${e.target.value}`, 'info');
              }}
              className="bg-transparent text-xs font-bold text-slate-200 outline-none cursor-pointer pr-4"
            >
              {regions.map((r) => (
                <option key={r} value={r} className="bg-[#0D1B2A] text-slate-200">
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Center: Global Intelligence Search Bar */}
      <div className="flex-1 max-w-lg mx-4">
        <div className="relative flex items-center w-full px-3.5 py-1.5 rounded-xl border border-[#23364B] bg-[#0D1B2A] focus-within:border-[#00C2FF] focus-within:shadow-sm transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search MMSI, Vessel name, Spill ID (ST-2046), or coordinate..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 outline-none"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="p-0.5 text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 ml-2">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Data Sync Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-[#0D1B2A] border border-[#23364B] text-[11px] font-mono text-slate-300">
          <Radio className="w-3 h-3 text-[#14B8A6] animate-pulse" />
          <span>AIS FEED: LIVE</span>
        </div>

        {/* Live UTC Clock */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5 text-[#00C2FF]" />
          <span>{utcTime}</span>
        </div>

        {/* Mandatory DEMO ENVIRONMENT Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-[10px] font-mono font-bold tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>DEMO MODE</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl bg-[#0D1B2A] hover:bg-[#13283F] border border-[#23364B] text-slate-300 transition-all"
            title="Operational Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0D1B2A]" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-12 w-80 p-4 rounded-2xl bg-[#0D1B2A] border border-[#23364B] shadow-2xl z-50 text-xs text-slate-200">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#23364B]">
                <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                  Critical Alerts (3)
                </span>
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-0.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>ST-2046 Arabian Sea</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Spill area expanded to 48.6 km². Prime suspect MT OCEAN TITAN identified.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-0.5">
                    <Radio className="w-3.5 h-3.5" />
                    <span>AIS Gap Detected</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Vessel MT OCEAN TITAN transponder went dark for 2h 48m.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#23364B]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00C2FF] to-[#14B8A6] p-[2px] shadow-md">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="CDR Rodriguez"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-bold text-white block leading-tight">
              CDR J. Rodriguez
            </span>
            <span className="text-[10px] font-mono text-[#00C2FF] block leading-tight">
              NTRO Maritime Ops
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

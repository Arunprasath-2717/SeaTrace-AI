import React, { useState, useEffect } from 'react';
import { Search, Radio, Compass, Database, ChevronDown } from 'lucide-react';
import type { OilSpillIncident, Vessel } from '../../types/intelligence';


interface TopNavProps {
  incidents: OilSpillIncident[];
  vessels: Vessel[];
  onSelectIncident: (inc: OilSpillIncident) => void;
  onSelectVessel: (v: Vessel) => void;
  onFlyToPreset: (name: string, lat: number, lng: number, altitude: number) => void;
  onOpenDetectionModal: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  incidents,
  vessels,
  onSelectIncident,
  onSelectVessel,
  onFlyToPreset,
  onOpenDetectionModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentTime, setCurrentTime] = useState<{ utc: string; ist: string }>({ utc: '', ist: '' });
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);

  // Live real-time clock updating in UTC & IST
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime({
        utc: now.toISOString().substring(11, 19) + ' UTC',
        ist: now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter search results
  const filteredIncidents = searchQuery.trim()
    ? incidents.filter(
        (i) =>
          i.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.region.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredVessels = searchQuery.trim()
    ? vessels.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.mmsi.includes(searchQuery) ||
          v.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const REGIONS = [
    { label: 'Indian Ocean Overview', lat: 10.0, lng: 77.0, alt: 2.2, icon: '🌐' },
    { label: 'Arabian Sea (Demo ST-2046)', lat: 18.52, lng: 71.85, alt: 0.5, icon: '🚨' },
    { label: 'Bay of Bengal (Paradip)', lat: 19.85, lng: 87.20, alt: 0.6, icon: '🌊' },
    { label: 'Gulf of Mannar Biosphere', lat: 9.12, lng: 79.45, alt: 0.5, icon: '🏝️' },
    { label: 'Mumbai High Offshore Fields', lat: 19.40, lng: 71.30, alt: 0.5, icon: '⚓' },
    { label: 'Gulf of Khambhat / Gujarat', lat: 20.80, lng: 70.90, alt: 0.6, icon: '🧭' },
    { label: 'Six Degree Channel (Great Nicobar)', lat: 6.70, lng: 93.80, alt: 0.6, icon: '🚢' },
  ];

  return (
    <header className="absolute top-4 left-6 right-6 z-30 pointer-events-auto">
      <div className="hud-panel px-4 py-2.5 rounded-xl border border-[#1e293b] flex items-center justify-between shadow-2xl backdrop-blur-xl">
        {/* Brand / Title Section */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/40 shadow-[0_0_12px_rgba(0,212,255,0.3)]">
            <Radio className="w-5 h-5 text-[#00d4ff] animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00d4ff]"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold tracking-wider text-[#f8fafc] font-mono flex items-center">
                SEATRACE<span className="text-[#00d4ff] ml-1">AI</span>
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30 font-mono">
                3D COMMAND
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#1e293b] text-[#94a3b8] font-mono">
                SIH 26143 • Team HavocX
              </span>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#94a3b8] font-mono">
              Oil Spill Intelligence & Vessel Attribution Platform
            </div>
          </div>
        </div>

        {/* Center: Search Field & Quick Region Fly-To */}
        <div className="flex items-center space-x-3">
          {/* Quick Region Fly-to Selector */}
          <div className="relative">
            <button
              onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
              className="hud-panel px-3 py-1.5 rounded-lg border border-[#1e293b] hover:border-[#00d4ff]/50 text-xs font-mono text-[#f8fafc] flex items-center space-x-2 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-[#00d4ff]" />
              <span>Fly To Sector</span>
              <ChevronDown className="w-3 h-3 text-[#94a3b8]" />
            </button>

            {isRegionDropdownOpen && (
              <div className="absolute top-full mt-1.5 left-0 w-64 hud-panel p-1.5 rounded-xl border border-[#1e293b] shadow-2xl z-50 animate-in fade-in duration-100">
                <div className="text-[10px] font-mono uppercase px-2 py-1 text-[#94a3b8]">
                  Select Surveillance Sector
                </div>
                {REGIONS.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onFlyToPreset(r.label, r.lat, r.lng, r.alt);
                      setIsRegionDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#00d4ff]/15 text-xs text-[#f8fafc] flex items-center space-x-2 transition-colors font-mono"
                  >
                    <span>{r.icon}</span>
                    <span className="truncate">{r.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative w-80">
            <div
              className={`flex items-center px-3 py-1.5 rounded-lg border bg-[#0b1220]/80 transition-all ${
                isSearchFocused
                  ? 'border-[#00d4ff] shadow-[0_0_12px_rgba(0,212,255,0.2)]'
                  : 'border-[#1e293b]'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#94a3b8] mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search incident ID, MMSI, vessel name..."
                className="w-full bg-transparent text-xs text-[#f8fafc] placeholder-[#64748b] focus:outline-none font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#94a3b8] hover:text-[#f8fafc]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search Autocomplete Results Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute top-full mt-1.5 left-0 right-0 hud-panel p-2 rounded-xl border border-[#00d4ff]/40 shadow-2xl z-50 max-h-72 overflow-y-auto">
                {filteredIncidents.length === 0 && filteredVessels.length === 0 ? (
                  <div className="p-3 text-center text-xs text-[#94a3b8] font-mono">
                    No matching incidents or vessels found
                  </div>
                ) : (
                  <>
                    {filteredIncidents.length > 0 && (
                      <div className="mb-2">
                        <div className="text-[10px] font-mono uppercase text-[#ff4d4d] px-2 py-1 font-bold">
                          Oil Spill Incidents ({filteredIncidents.length})
                        </div>
                        {filteredIncidents.map((inc) => (
                          <div
                            key={inc.id}
                            onMouseDown={() => {
                              onSelectIncident(inc);
                              setSearchQuery('');
                            }}
                            className="px-2.5 py-1.5 rounded hover:bg-[#ff4d4d]/15 cursor-pointer flex items-center justify-between text-xs font-mono"
                          >
                            <span className="font-bold text-[#ff4d4d]">{inc.code}</span>
                            <span className="text-[#f8fafc] truncate max-w-[160px]">{inc.name}</span>
                            <span className="text-[#94a3b8] text-[10px]">{inc.estimatedAreaKm2} km²</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {filteredVessels.length > 0 && (
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#00d4ff] px-2 py-1 font-bold">
                          Tracked Maritime Vessels ({filteredVessels.length})
                        </div>
                        {filteredVessels.map((v) => (
                          <div
                            key={v.id}
                            onMouseDown={() => {
                              onSelectVessel(v);
                              setSearchQuery('');
                            }}
                            className="px-2.5 py-1.5 rounded hover:bg-[#00d4ff]/15 cursor-pointer flex items-center justify-between text-xs font-mono"
                          >
                            <span className="font-semibold text-[#00d4ff]">{v.name}</span>
                            <span className="text-[#94a3b8] text-[10px]">MMSI: {v.mmsi}</span>
                            <span className="text-[#14b8a6] text-[10px]">{v.type}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Telemetry, Demo Mode & System Status */}
        <div className="flex items-center space-x-4">
          {/* Simulated AIS Sync Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#0b1220] border border-[#1e293b] text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
            <span className="text-[#94a3b8]">AIS FEED:</span>
            <span className="text-[#10b981] font-semibold">LIVE (4.8k msg/s)</span>
          </div>

          {/* Demo Mode Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-xs font-mono text-[#00d4ff]">
            <Database className="w-3 h-3 text-[#00d4ff]" />
            <span className="font-bold">DEMO MODE</span>
          </div>

          {/* Real-time Clock */}
          <div className="hidden sm:flex flex-col text-right font-mono text-[11px] leading-tight">
            <span className="text-[#f8fafc] font-semibold">{currentTime.utc}</span>
            <span className="text-[#94a3b8] text-[10px]">{currentTime.ist}</span>
          </div>

          {/* SAR Detection Quick Launch Button */}
          <button
            onClick={onOpenDetectionModal}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#14b8a6] text-[#030712] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-[0_0_12px_rgba(0,212,255,0.4)] flex items-center space-x-1.5"
          >
            <span>🛰️</span>
            <span>Scan SAR</span>
          </button>
        </div>
      </div>
    </header>
  );
};

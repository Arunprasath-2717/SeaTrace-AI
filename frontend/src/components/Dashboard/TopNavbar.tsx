import React from 'react';
import {
  LayoutGrid,
  Satellite,
  Search,
  Sun,
  Moon,
  Volume2,
  Sliders,
  Plus,
  Compass,
} from 'lucide-react';

export type TopTab = 'dashboard' | 'workflows' | 'integrations';

interface TopNavbarProps {
  activeTab: TopTab;
  onSelectTab: (tab: TopTab) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExportClick: () => void;
  onAddBoardClick: () => void;
  currentBoard?: string;
  onSelectBoard?: (board: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  onSelectTab,
  isDarkMode,
  onToggleDarkMode,
  searchQuery,
  onSearchChange,
  onExportClick,
  onAddBoardClick,
}) => {
  return (
    <header className="w-full h-16 px-6 flex items-center justify-between gap-4 select-none bg-[#09152b]/95 border-b border-[#1E2E48] backdrop-blur-md text-white z-20">
      {/* Left: Operational Modes */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            activeTab === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Command Center</span>
        </button>

        <button
          onClick={() => onSelectTab('workflows')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            activeTab === 'workflows'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Satellite className="w-3.5 h-3.5 text-cyan-400" />
          <span>SAR Swaths</span>
        </button>

        <button
          onClick={() => onSelectTab('integrations')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            activeTab === 'integrations'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-teal-400" />
          <span>Coast Guard Grid</span>
        </button>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md mx-2">
        <div className="relative flex items-center w-full px-3.5 py-1.5 rounded-full border border-[#1E2E48] bg-[#0E1B33]/80 focus-within:border-cyan-400/60 focus-within:bg-[#0E1B33] transition-all duration-200">
          <Search className="w-4 h-4 mr-2.5 shrink-0 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search vessel IMO, MMSI, slick ID, or port..."
            className="w-full bg-transparent text-xs font-normal outline-none placeholder:text-slate-500 text-slate-100"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded ml-2 shrink-0 bg-[#09152b] text-slate-400 border border-slate-700/60">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Side Theme Toggle Pill (Switches curved sidebar between Ocean Blue and Midnight Dark) */}
        <div
          title="Toggle Sidebar Theme (Light Ocean Blue / Dark Midnight Navy)"
          className="flex items-center p-0.5 rounded-full border border-[#1E2E48] bg-[#0c1a36] text-xs"
        >
          <button
            onClick={() => isDarkMode && onToggleDarkMode()}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
              !isDarkMode
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>
          <button
            onClick={() => !isDarkMode && onToggleDarkMode()}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
              isDarkMode
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>
        </div>

        {/* Volume / Sound */}
        <button
          title="Notification Audio Alarm"
          className="p-2 rounded-full border border-[#1E2E48] bg-[#0c1a36] text-slate-300 hover:text-cyan-300 hover:bg-[#122345] transition-all"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>

        {/* Settings Sliders */}
        <button
          title="Surveillance Density Filter"
          className="p-2 rounded-full border border-[#1E2E48] bg-[#0c1a36] text-slate-300 hover:text-cyan-300 hover:bg-[#122345] transition-all"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Export Data Button */}
        <button
          onClick={onExportClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[#1E2E48] bg-[#0c1a36] text-slate-200 hover:border-cyan-400/60 hover:text-white transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-slate-400" />
          <span>Export dossier</span>
          <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded ml-0.5 bg-slate-800 text-slate-400">
            ⌘E
          </kbd>
        </button>

        {/* Task Satellite Button */}
        <button
          onClick={onAddBoardClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all"
        >
          <Satellite className="w-3.5 h-3.5 text-white" />
          <span>+ Ingest SAR Pass</span>
        </button>

        {/* UPPER RIGHT: SeaTrace Logo & Name Pill */}
        <div
          title="SeaTrace - AI Maritime Intelligence Platform"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 shadow-md shadow-indigo-500/25 border border-indigo-400/40 cursor-pointer hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all select-none"
        >
          <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-cyan-300 text-[10px] font-black">
            🌊
          </div>
          <span className="tracking-wide font-extrabold text-xs">SeaTrace</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </div>
      </div>
    </header>
  );
};

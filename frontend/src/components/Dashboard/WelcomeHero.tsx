import React from 'react';
import {
  Plus,
  Radar,
  Radio,
  Anchor,
  Sparkles,
  ShieldCheck,
  Waves,
} from 'lucide-react';

interface WelcomeHeroProps {
  userName?: string;
  isDarkMode?: boolean;
  onQuickAdd: () => void;
  onStayOrganizedClick: () => void;
  onSyncNotesClick: () => void;
  onCollaborateClick: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  userName = 'CDR Rodriguez',
  onQuickAdd,
  onStayOrganizedClick,
  onSyncNotesClick,
  onCollaborateClick,
}) => {
  return (
    <section className="w-full grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch select-none">
      {/* Left Welcome Greeting Banner (Takes ~5 cols on xl) */}
      <div className="xl:col-span-5 flex flex-col justify-between p-6 rounded-3xl border border-[#1E2E48] bg-gradient-to-br from-[#0c1c3d]/95 via-[#0d274f]/85 to-[#08182b]/95 shadow-xl shadow-black/30 relative overflow-hidden group">
        {/* Decorative subtle ambient gradients using royal blue & sea green */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 rounded-full bg-gradient-to-br from-cyan-500/10 via-teal-500/10 to-blue-500/10 blur-2xl pointer-events-none" />

        <div>
          {/* Greeting Header */}
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Hi, {userName}!
            </h1>
            <div className="flex items-center -space-x-1.5 ml-1">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 shadow-sm ring-1 ring-emerald-500/30" />
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-slate-900 shadow-sm ring-1 ring-blue-600/30" />
            </div>
            <Sparkles className="w-4 h-4 text-emerald-400 ml-1" />
          </div>

          {/* Main Mission Question */}
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight mb-2.5 text-slate-100">
            What are your maritime surveillance priorities today?
          </h2>

          {/* SeaTrace AI Subtitle */}
          <p className="text-xs leading-relaxed max-w-md text-slate-300">
            SeaTrace AI 3D Maritime Intelligence: tracking 25 vessels, 4 active slicks,
            and back-calculated Hydrodynamic Drift across Indian Ocean EEZ waters.
          </p>
        </div>

        {/* SeaTrace Quick status chips */}
        <div className="flex items-center flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800/80">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            96.4% SAR Confidence
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-500/15 text-cyan-300 border border-blue-500/30">
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            Prime Suspect: MT OCEAN TITAN (94/100)
          </span>
        </div>
      </div>

      {/* Right Quick Action Cards Grid (Takes ~7 cols on xl) */}
      <div className="xl:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Card 1: Elevated Quick Add Squircle */}
        <button
          onClick={onQuickAdd}
          title="Task New Forensic Investigation"
          className="flex flex-col items-center justify-center p-5 rounded-3xl border border-[#1E2E48] bg-[#0B1528]/90 hover:border-cyan-400/50 hover:bg-[#0E1E38] transition-all duration-300 group hover:scale-[1.02] shadow-lg shadow-black/20"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:rotate-90 transition-transform duration-300">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="mt-2.5 text-[11px] font-semibold text-slate-200">
            Task Mission
          </span>
        </button>

        {/* Card 2: Active Slicks Radar */}
        <div
          onClick={onStayOrganizedClick}
          className="flex flex-col justify-between p-4 rounded-3xl border border-[#1E2E48] bg-[#0B1528]/90 hover:border-cyan-400/50 hover:bg-[#0E1E38] transition-all duration-300 cursor-pointer group hover:scale-[1.02] shadow-lg shadow-black/20"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-950/60 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
            <Radar className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <h3 className="text-xs font-bold leading-tight text-white">
              Active Slicks Radar
            </h3>
            <p className="text-[10px] text-slate-400 leading-snug mt-1">
              4 oil slicks tracked in EEZ
            </p>
          </div>
        </div>

        {/* Card 3: MetOcean Hydrodynamic Drift */}
        <div
          onClick={onSyncNotesClick}
          className="flex flex-col justify-between p-4 rounded-3xl border border-[#1E2E48] bg-[#0B1528]/90 hover:border-teal-400/50 hover:bg-[#0E1E38] transition-all duration-300 cursor-pointer group hover:scale-[1.02] shadow-lg shadow-black/20"
        >
          <div className="w-10 h-10 rounded-2xl bg-teal-950/60 border border-teal-700/50 flex items-center justify-center text-teal-400">
            <Radio className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <h3 className="text-xs font-bold leading-tight text-white">
              Hydrodynamic Drift
            </h3>
            <p className="text-[10px] text-slate-400 leading-snug mt-1">
              Trajectory to Konkan coast
            </p>
          </div>
        </div>

        {/* Card 4: Coast Guard Deployment */}
        <div
          onClick={onCollaborateClick}
          className="flex flex-col justify-between p-4 rounded-3xl border border-[#1E2E48] bg-[#0B1528]/90 hover:border-indigo-400/50 hover:bg-[#0E1E38] transition-all duration-300 cursor-pointer group hover:scale-[1.02] shadow-lg shadow-black/20"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-950/60 border border-blue-700/50 flex items-center justify-center text-cyan-400">
            <Anchor className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <h3 className="text-xs font-bold leading-tight text-white">
              Coast Guard Assets
            </h3>
            <p className="text-[10px] text-slate-400 leading-snug mt-1">
              ICGS Samudra Prahari live
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

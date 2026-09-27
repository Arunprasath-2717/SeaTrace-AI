import React from 'react';
import { ShieldCheck, ArrowRight, Satellite } from 'lucide-react';

interface GoPremiumCardProps {
  isDarkMode?: boolean;
  onFindOutMore?: () => void;
}

export const GoPremiumCard: React.FC<GoPremiumCardProps> = ({
  onFindOutMore,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 select-none shadow-xl transition-all duration-300 group hover:shadow-2xl hover:scale-[1.01] bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#312e81] text-white border border-indigo-500/30">
      {/* Decorative ambient elements */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-indigo-300/30 to-purple-400/20 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-950/60 rounded-full blur-xl pointer-events-none" />

      {/* Floating geometric glass tiles for the depth effect */}
      <div className="absolute top-4 right-6 w-20 h-20 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md -rotate-6 pointer-events-none opacity-40 group-hover:rotate-0 transition-transform duration-500" />
      <div className="absolute top-8 right-12 w-14 h-14 rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm rotate-12 pointer-events-none opacity-30 group-hover:rotate-6 transition-transform duration-500" />

      {/* Icon Badge: Satellite / Shield */}
      <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
        <Satellite className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h2 className="text-xl font-extrabold tracking-tight text-white mb-2 drop-shadow-sm">
          SeaTrace Sentinel Pro
        </h2>

        <p className="text-xs text-indigo-100/90 leading-relaxed mb-6 max-w-[270px]">
          Unlock High-Resolution SAR Satellite tasking, 72-hour MetOcean hydrodynamic drift modeling, and automated IMO legal dossiers.
        </p>

        {/* Action Button */}
        <button
          onClick={onFindOutMore}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-slate-950/85 hover:bg-slate-900 text-white border border-white/20 shadow-lg hover:shadow-xl backdrop-blur-md transition-all duration-200 group-hover:border-white/40"
        >
          <span>Unlock Tactical Feeds</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

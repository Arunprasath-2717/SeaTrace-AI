import React from 'react';

interface MetricsRadialGaugesProps {
  isDarkMode?: boolean;
}

export const MetricsRadialGauges: React.FC<MetricsRadialGaugesProps> = () => {
  // SVG circular calculations
  const radius = 28;
  const circumference = 2 * Math.PI * radius;

  const sarPrecisionPercent = 96;
  const attributionPercent = 94;

  const sarOffset =
    circumference - (sarPrecisionPercent / 100) * circumference;
  const attributionOffset =
    circumference - (attributionPercent / 100) * circumference;

  return (
    <div className="flex items-center justify-between p-5 rounded-3xl border border-[#1E2E48] bg-[#0B1528]/95 shadow-xl shadow-black/20 gap-4 select-none">
      {/* Gauge 1: 96% SAR DETECTION - Oil Slick Precision */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 72 72">
            <defs>
              <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
            </defs>
            {/* Background track */}
            <circle
              cx="36"
              cy="36"
              r={radius}
              strokeWidth="5"
              className="stroke-blue-950/80"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="36"
              cy="36"
              r={radius}
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={sarOffset}
              strokeLinecap="round"
              stroke="url(#cyanGrad)"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="absolute font-extrabold text-xs tracking-tight text-cyan-400">
            {sarPrecisionPercent}%
          </span>
        </div>

        <div className="min-w-0">
          <span className="text-[9px] font-bold tracking-wider uppercase text-cyan-400 block truncate">
            SAR DETECTION
          </span>
          <h3 className="text-xs font-bold leading-tight truncate text-white">
            Oil Slick Precision
          </h3>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">
            Sentinel-1B (48.6 km²)
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-12 bg-blue-900/40" />

      {/* Gauge 2: 94% VESSEL ATTRIBUTION - MT OCEAN TITAN */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 72 72">
            <defs>
              <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            {/* Background track */}
            <circle
              cx="36"
              cy="36"
              r={radius}
              strokeWidth="5"
              className="stroke-blue-950/80"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="36"
              cy="36"
              r={radius}
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={attributionOffset}
              strokeLinecap="round"
              stroke="url(#indigoGrad)"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="absolute font-extrabold text-xs tracking-tight text-indigo-400">
            {attributionPercent}%
          </span>
        </div>

        <div className="min-w-0">
          <span className="text-[9px] font-bold tracking-wider uppercase text-indigo-400 block truncate">
            ATTRIBUTION
          </span>
          <h3 className="text-xs font-bold leading-tight truncate text-white">
            MT OCEAN TITAN
          </h3>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">
            IMO 9324567 • VLCC
          </p>
        </div>
      </div>
    </div>
  );
};

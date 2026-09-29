import React, { useState } from 'react';
import { Card } from '../common/Card';
import { demoSimulation } from '../../data/demo/simulation';
import { demoDetection } from '../../data/demo/detection';
import { demoVessels } from '../../data/demo/vessels';
import { Info } from 'lucide-react';

export type ComparisonViewMode = 'split' | 'overlay' | 'difference';

export const ObservedSimulationComparison: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<ComparisonViewMode>('split');
  const candidate = demoVessels[0];

  return (
    <Card
      title="OBSERVED VS. SIMULATED COMPARISON"
      subtitle="Spatial concordance between Sentinel-1 observation and forward drift"
      headerAction={
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 text-xs font-mono">
          {(['split', 'overlay', 'difference'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`px-2.5 py-0.5 rounded uppercase text-[10px] transition-colors ${
                viewMode === m
                  ? 'bg-seatrace-teal text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {m === 'split' ? 'Split Screen' : m === 'overlay' ? 'Overlay View' : 'Difference View'}
            </button>
          ))}
        </div>
      }
      className={className}
    >
      <div className="space-y-4">
        {/* Physical Hypothesis Explanation */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 text-xs font-sans text-slate-800 dark:text-slate-300 leading-relaxed">
          <p className="font-bold text-slate-950 dark:text-white mb-1">
            Forensic Question: If a release had occurred near this candidate vessel at the estimated time, would the simulated oil distribution be consistent with the observed slick?
          </p>
          <p className="text-[11px] text-slate-700 dark:text-slate-400 font-medium">
            The counterfactual test uses the OpenDrift / OpenOil engine to model forward advection, surface spreading, and evaporation from the candidate crossing position.
          </p>
        </div>

        {/* Viewport Comparison Canvas */}
        {viewMode === 'split' ? (
          /* Split Screen: LEFT Observed / RIGHT Simulated */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* LEFT: Observed */}
            <div className="relative aspect-[4/3] rounded-lg bg-[#05111F] border border-seatrace-border-subtle flex flex-col items-center justify-center p-3 select-none overflow-hidden">
              <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded text-[10px] font-mono text-seatrace-teal border border-slate-200 shadow-sm font-semibold">
                LEFT: OBSERVED SLICK
              </div>

              <svg className="w-full h-full max-h-44" viewBox="0 0 250 180">
                <rect width="250" height="180" fill="#071526" />
                {/* Observed Slick Polygon */}
                <path
                  d="M 60,60 Q 120,85 160,80 T 210,110 Q 170,135 120,125 T 55,85 Z"
                  fill="rgba(33, 171, 165, 0.35)"
                  stroke="#21ABA5"
                  strokeWidth="2"
                />
                <circle cx="130" cy="100" r="3" fill="#21ABA5" />
                <text x="138" y="104" fill="#F1F5F9" fontSize="9" fontFamily="monospace">
                  Observed Centroid
                </text>
              </svg>

              <div className="w-full flex justify-between items-center text-[10px] font-mono text-slate-300 mt-2 border-t border-slate-700 pt-1">
                <span>Sensor: Sentinel-1A SAR</span>
                <span className="text-teal-400 font-semibold">{demoDetection.area} km²</span>
              </div>
            </div>

            {/* RIGHT: Simulated */}
            <div className="relative aspect-[4/3] rounded-lg bg-[#05111F] border border-seatrace-border-subtle flex flex-col items-center justify-center p-3 select-none overflow-hidden">
              <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded text-[10px] font-mono text-seatrace-mint border border-slate-200 shadow-sm font-semibold">
                RIGHT: SIMULATED SLICK
              </div>

              <svg className="w-full h-full max-h-44" viewBox="0 0 250 180">
                <rect width="250" height="180" fill="#071526" />
                {/* Simulated Forward Dispersion Slick Polygon */}
                <path
                  d="M 65,62 Q 124,88 158,82 T 205,108 Q 168,132 118,122 T 58,87 Z"
                  fill="rgba(69, 235, 165, 0.35)"
                  stroke="#45EBA5"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                <circle cx="134" cy="98" r="3" fill="#45EBA5" />
                <text x="142" y="102" fill="#F1F5F9" fontSize="9" fontFamily="monospace">
                  Simulated Centroid
                </text>
              </svg>

              <div className="w-full flex justify-between items-center text-[10px] font-mono text-slate-300 mt-2 border-t border-slate-700 pt-1">
                <span>Engine: OpenOil Forward</span>
                <span className="text-emerald-400 font-semibold">{demoSimulation.predictedSlick.areaKm2} km²</span>
              </div>
            </div>
          </div>
        ) : viewMode === 'overlay' ? (
          /* Overlay View: Composite */
          <div className="relative aspect-video w-full rounded-lg bg-[#05111F] border border-seatrace-border-subtle flex flex-col items-center justify-center p-4 select-none overflow-hidden">
            <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded text-[10px] font-mono text-teal-800 border border-slate-200 shadow-sm font-semibold">
              OVERLAY: OBSERVED (TEAL) + SIMULATED (MINT DASHED)
            </div>

            <svg className="w-full h-full max-h-56" viewBox="0 0 400 220">
              <rect width="400" height="220" fill="#071526" />
              {/* Observed */}
              <path
                d="M 100,70 Q 190,105 250,100 T 330,135 Q 270,165 190,150 T 90,105 Z"
                fill="rgba(33, 171, 165, 0.25)"
                stroke="#21ABA5"
                strokeWidth="2"
              />
              {/* Simulated */}
              <path
                d="M 108,72 Q 195,108 248,102 T 325,132 Q 268,162 188,148 T 96,108 Z"
                fill="rgba(69, 235, 165, 0.25)"
                stroke="#45EBA5"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              {/* Centroid offset line */}
              <line x1="205" y1="120" x2="210" y2="117" stroke="#F59E0B" strokeWidth="2" />
              <circle cx="205" cy="120" r="3" fill="#21ABA5" />
              <circle cx="210" cy="117" r="3" fill="#45EBA5" />
              <text x="220" y="122" fill="#F59E0B" fontSize="10" fontFamily="monospace">
                Δ Centroid: 0.65 km
              </text>
            </svg>

            <div className="w-full flex justify-between items-center text-[10px] font-mono text-slate-300 mt-2 border-t border-slate-700 pt-1">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-seatrace-teal" /> Observed: 14.8 km²</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-400 border border-dashed border-emerald-400" /> Simulated: 14.2 km²</span>
              <span className="text-emerald-400 font-bold">Intersection over Union (IoU): 84%</span>
            </div>
          </div>
        ) : (
          /* Difference View: Spatial delta */
          <div className="relative aspect-video w-full rounded-lg bg-[#05111F] border border-seatrace-border-subtle flex flex-col items-center justify-center p-4 select-none overflow-hidden">
            <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded text-[10px] font-mono text-amber-800 border border-slate-200 shadow-sm font-semibold">
              DIFFERENCE VIEW: UNMATCHED MARGINS
            </div>

            <svg className="w-full h-full max-h-56" viewBox="0 0 400 220">
              <rect width="400" height="220" fill="#071526" />
              {/* Shared Overlap Core */}
              <path
                d="M 108,72 Q 192,106 248,102 T 325,132 Q 268,162 190,149 T 96,108 Z"
                fill="rgba(69, 235, 165, 0.4)"
                stroke="#45EBA5"
                strokeWidth="1.5"
              />
              {/* Marginal Dissimilarity Regions (Rose/Amber) */}
              <path
                d="M 100,70 L 108,72 L 96,108 L 90,105 Z"
                fill="rgba(244, 63, 94, 0.4)"
                stroke="#F43F5E"
                strokeWidth="1"
              />
              <path
                d="M 250,100 L 330,135 L 325,132 L 248,102 Z"
                fill="rgba(245, 158, 11, 0.4)"
                stroke="#F59E0B"
                strokeWidth="1"
              />
              <text x="140" y="115" fill="#F1F5F9" fontSize="11" fontWeight="bold" fontFamily="monospace">
                Concordant Overlap: 84%
              </text>
              <text x="140" y="130" fill="#94A3B8" fontSize="9" fontFamily="monospace">
                False Negative: 8% | False Positive: 8%
              </text>
            </svg>

            <div className="w-full flex justify-between items-center text-[10px] font-mono text-slate-300 mt-2 border-t border-slate-700 pt-1">
              <span className="text-rose-400">■ Unmatched Observed Fringe (8%)</span>
              <span className="text-amber-400">■ Excess Simulated Margin (8%)</span>
              <span className="text-emerald-400">■ Mutual Intersection (84%)</span>
            </div>
          </div>
        )}

        {/* Legal Restraint Warning Banner */}
        <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 flex items-start gap-2 text-[11px] text-slate-800 dark:text-slate-300 font-sans">
          <Info className="w-4 h-4 text-teal-700 dark:text-teal-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-950 dark:text-white">Forensic Restraint:</strong> High physical similarity demonstrates hydrodynamic compatibility under modeled metocean forcing. It does not prove that candidate vessel {candidate.identity.name} was the actual source of the discharge.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ObservedSimulationComparison;

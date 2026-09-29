import React from 'react';
import { Card } from '../common/Card';
import { demoSimulation } from '../../data/demo/simulation';

export const SimulationMetrics: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Card
      title="SIMULATION VALIDATION SCORES"
      subtitle="Quantitative goodness-of-fit indicators"
      className={className}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-300 dark:border-slate-800">
          <div className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase mb-1">
            Intersection Over Union (IoU)
          </div>
          <div className="text-xl font-black text-emerald-800 dark:text-emerald-400">
            {(demoSimulation.comparison.iouScore * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-800 dark:text-slate-300 font-semibold mt-1">High spatial overlap</div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-300 dark:border-slate-800">
          <div className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase mb-1">
            Centroid Displacement
          </div>
          <div className="text-xl font-black text-teal-800 dark:text-teal-400">
            {demoSimulation.comparison.centroidDistanceKm} km
          </div>
          <div className="text-[10px] text-slate-800 dark:text-slate-300 font-semibold mt-1">&lt; 1.0 km threshold</div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-300 dark:border-slate-800">
          <div className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase mb-1">
            Match Confidence
          </div>
          <div className="text-xl font-black text-indigo-900 dark:text-indigo-400">
            {(demoSimulation.comparison.matchConfidence * 100).toFixed(0)}%
          </div>
          <div className="text-[10px] text-slate-800 dark:text-slate-300 font-semibold mt-1">Legally defensible</div>
        </div>
      </div>
    </Card>
  );
};

export default SimulationMetrics;

import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { demoOrigin } from '../../data/demo/origin';
import { Waves, Wind, Compass, Activity } from 'lucide-react';

export const DriftEnsemble: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Card
      title="HYDRODYNAMIC FORCING & ENSEMBLE SPECIFICATIONS"
      subtitle="Coupled ocean circulation, atmospheric leeway, and wave Stokes drift"
      headerAction={
        <Badge variant="teal" size="sm">
          {demoOrigin.ensemble.runs} ENSEMBLE RUNS
        </Badge>
      }
      className={className}
    >
      <div className="space-y-3 text-xs font-mono">
        {/* Hydrodynamic Engine */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-300">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-700" />
            <span className="text-slate-700 font-bold">Drift Engine:</span>
          </div>
          <span className="text-slate-900 font-black">
            {demoOrigin.ensemble.model}
          </span>
        </div>

        {/* Ocean Current Source */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-300">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-teal-700" />
            <span className="text-slate-700 font-bold">Ocean Currents:</span>
          </div>
          <span className="text-slate-900 font-black">
            {demoOrigin.ensemble.oceanCurrentSource}
          </span>
        </div>

        {/* Wind Forcing Source */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-300">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-emerald-700" />
            <span className="text-slate-700 font-bold">Wind Forcing:</span>
          </div>
          <span className="text-slate-900 font-black">
            {demoOrigin.ensemble.windForcingSource}
          </span>
        </div>

        {/* Wave Data Source */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-300">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-700" />
            <span className="text-slate-700 font-bold">Wave Data:</span>
          </div>
          <span className="text-slate-900 font-black">
            {demoOrigin.ensemble.waveDataSource}
          </span>
        </div>

        {/* Stokes Drift Flag */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300 flex items-center justify-between text-[11px]">
          <span className="text-slate-700 font-bold">Stokes Wave Drift Formulation:</span>
          <span className="text-teal-800 font-black">Enabled (Monochromatic approximation)</span>
        </div>
      </div>
    </Card>
  );
};

export default DriftEnsemble;

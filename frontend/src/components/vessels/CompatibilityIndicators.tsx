import React from 'react';
import { Card } from '../common/Card';
import { CandidateVessel } from '../../types/vessel';
import { Badge } from '../common/Badge';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export const CompatibilityIndicators: React.FC<{
  vessel: CandidateVessel | null;
  className?: string;
}> = ({ vessel, className = '' }) => {
  if (!vessel) return null;

  const indicators = [
    {
      label: 'Temporal Compatibility',
      value: vessel.temporalCompatibility,
      description: 'Physical overlap between vessel navigation timestamp and calculated release window.',
      color: 'bg-indigo-600',
      textColor: 'text-indigo-800 font-black',
    },
    {
      label: 'Spatial Compatibility',
      value: vessel.spatialCompatibility,
      description: 'Proximity of vessel trajectory to the 95th-percentile reverse drift envelope.',
      color: 'bg-teal-600',
      textColor: 'text-teal-800 font-black',
    },
    {
      label: 'Drift Hydrodynamic Match',
      value: vessel.driftCompatibility,
      description: 'Concordance between forward Lagrangian dispersion from vessel crossing and observed slick shape.',
      color: 'bg-emerald-600',
      textColor: 'text-emerald-800 font-black',
    },
  ];

  return (
    <Card
      title="EVIDENCE COMPATIBILITY VECTORS"
      subtitle="Quantitative multi-modal intersection scores for candidate vessel"
      headerAction={
        <Badge variant="teal" size="sm">
          {vessel.evidenceStatus.toUpperCase()}
        </Badge>
      }
      className={className}
    >
      <div className="space-y-4">
        {/* Relative Compatibility Sliders */}
        {indicators.map((ind) => (
          <div key={ind.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-900 font-sans">{ind.label}</span>
              <span className={`font-bold ${ind.textColor}`}>
                {(ind.value * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${ind.color}`}
                style={{ width: `${ind.value * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-700 leading-relaxed font-sans">
              {ind.description}
            </p>
          </div>
        ))}

        {/* Supporting Evidence List */}
        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-black text-emerald-900 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Supporting Evidence ({vessel.supportingEvidence.length})
          </div>
          <ul className="space-y-1 text-[11px] text-slate-800 font-medium list-disc pl-3">
            {vessel.supportingEvidence.map((ev, i) => (
              <li key={i}>{ev}</li>
            ))}
          </ul>
        </div>

        {/* Conflicting Evidence List */}
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-black text-rose-900 font-mono">
            <XCircle className="w-3.5 h-3.5 text-rose-700" />
            Conflicting Evidence ({vessel.conflictingEvidence.length})
          </div>
          <ul className="space-y-1 text-[11px] text-slate-800 font-medium list-disc pl-3">
            {vessel.conflictingEvidence.map((ev, i) => (
              <li key={i}>{ev}</li>
            ))}
          </ul>
        </div>

        {/* Uncertainty Notes */}
        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-black text-amber-900 font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            Uncertainty & Gaps ({vessel.uncertaintyNotes.length})
          </div>
          <ul className="space-y-1 text-[11px] text-amber-950 font-medium list-disc pl-3">
            {vessel.uncertaintyNotes.map((un, i) => (
              <li key={i}>{un}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default CompatibilityIndicators;

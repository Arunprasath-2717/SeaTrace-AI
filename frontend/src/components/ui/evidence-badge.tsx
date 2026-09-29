import React from 'react';
import { cn } from '../../lib/utils';
import { ShieldCheck, AlertTriangle, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

export type EvidenceCompatibilityType =
  | 'candidate'
  | 'supporting'
  | 'conflicting'
  | 'observation-gap'
  | 'probable-origin';

export interface EvidenceBadgeProps {
  type: EvidenceCompatibilityType;
  label?: string;
  className?: string;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  type,
  label,
  className,
}) => {
  switch (type) {
    case 'candidate':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-50 border border-teal-300 text-teal-800 font-mono text-[10px] tracking-wider uppercase font-semibold',
            className
          )}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
          {label || 'CANDIDATE VESSEL'}
        </span>
      );

    case 'supporting':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-[10px] tracking-wider uppercase font-semibold',
            className
          )}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
          {label || 'SUPPORTING EVIDENCE'}
        </span>
      );

    case 'conflicting':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 border border-rose-300 text-rose-800 font-mono text-[10px] tracking-wider uppercase font-semibold',
            className
          )}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-700 flex-shrink-0" />
          {label || 'CONFLICTING EVIDENCE'}
        </span>
      );

    case 'observation-gap':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-300 border-dashed text-amber-800 font-mono text-[10px] tracking-wider uppercase font-semibold',
            className
          )}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
          {label || 'OBSERVATION GAP'}
        </span>
      );

    case 'probable-origin':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-50 border border-sky-300 text-sky-800 font-mono text-[10px] tracking-wider uppercase font-semibold',
            className
          )}
        >
          <HelpCircle className="w-3.5 h-3.5 text-sky-700 flex-shrink-0" />
          {label || 'PROBABLE ORIGIN ZONE'}
        </span>
      );
  }
};

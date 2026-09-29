import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, HelpCircle, ShieldCheck } from 'lucide-react';

export interface UncertaintyIndicatorProps {
  score: number; // 0 to 1
  confidenceInterval?: [number, number]; // e.g. [0.72, 0.91]
  label?: string;
  hasObservationGap?: boolean;
  gapReason?: string;
  className?: string;
}

export const UncertaintyIndicator: React.FC<UncertaintyIndicatorProps> = ({
  score,
  confidenceInterval,
  label = 'Compatibility Score',
  hasObservationGap = false,
  gapReason,
  className,
}) => {
  const percentage = Math.round(score * 100);
  const lower = confidenceInterval ? Math.round(confidenceInterval[0] * 100) : null;
  const upper = confidenceInterval ? Math.round(confidenceInterval[1] * 100) : null;

  return (
    <div
      className={cn(
        'p-3 rounded-md bg-white border border-seatrace-border-subtle shadow-sm font-mono text-xs space-y-2',
        className
      )}
    >
      <div className="flex items-center justify-between text-seatrace-text-secondary">
        <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
          {hasObservationGap ? (
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-seatrace-teal" />
          )}
          {label}
        </span>
        <span className="text-seatrace-mint font-semibold text-sm">{percentage}%</span>
      </div>

      {/* Uncertainty Range Bar */}
      <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        {/* Confidence Interval Spread */}
        {lower !== null && upper !== null && (
          <div
            className="absolute top-0 bottom-0 bg-sky-200 border-l border-r border-sky-400"
            style={{
              left: `${lower}%`,
              width: `${Math.max(4, upper - lower)}%`,
            }}
          />
        )}
        {/* Point Estimate Marker */}
        <div
          className="absolute top-0 bottom-0 bg-seatrace-mint rounded-full transition-all duration-500 shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Statistical Uncertainty Breakdown */}
      <div className="flex items-center justify-between text-[10px] text-seatrace-text-muted">
        {confidenceInterval ? (
          <span>
            95% CI: [{lower}%, {upper}%]
          </span>
        ) : (
          <span>Estimated certainty</span>
        )}
        <span>{percentage > 75 ? 'HIGH COMPATIBILITY' : percentage > 50 ? 'MODERATE' : 'LOW'}</span>
      </div>

      {/* Observation Gap Warning Banner */}
      {hasObservationGap && (
        <div className="flex items-start gap-1.5 pt-1 border-t border-amber-200 text-[10px] text-amber-800">
          <HelpCircle className="w-3 h-3 flex-shrink-0 mt-0.5 text-amber-600" />
          <span>
            {gapReason || 'AIS observation gap present in drift interval. Trajectory interpolated.'}
          </span>
        </div>
      )}
    </div>
  );
};

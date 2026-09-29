import React from 'react';

export interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Loading investigation...',
  description = 'Fetching satellite telemetry and hydrodynamic records',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-seatrace-bg-secondary/40 rounded-lg border border-seatrace-border-subtle ${className}`}
    >
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-seatrace-deepTeal/40" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-seatrace-mint animate-spin" />
        <div className="absolute inset-2 rounded-full border border-dashed border-seatrace-teal/60 animate-pulse" />
      </div>
      <h4 className="text-sm font-semibold text-seatrace-text-primary mb-1 tracking-wide">
        {title}
      </h4>
      {description && (
        <p className="text-xs text-seatrace-text-secondary max-w-sm">{description}</p>
      )}
    </div>
  );
};

export default LoadingState;

import React from 'react';
import { Layers } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No investigation selected.',
  description = 'Select an incident from the queue or search by satellite scene identifier to begin attribution.',
  icon,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-seatrace-bg-secondary/30 rounded-lg border border-dashed border-seatrace-border-subtle ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-seatrace-bg-surface flex items-center justify-center text-seatrace-teal mb-3">
        {icon || <Layers className="w-6 h-6 opacity-75" />}
      </div>
      <h4 className="text-sm font-semibold text-seatrace-text-primary mb-1 tracking-wide">
        {title}
      </h4>
      {description && (
        <p className="text-xs text-seatrace-text-secondary max-w-md mb-4">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;

import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from './Button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load investigation.',
  description = 'An error occurred while communicating with the SEATRACE analytical pipeline.',
  errorMessage,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-seatrace-status-danger/5 rounded-lg border border-seatrace-status-danger/30 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-seatrace-status-danger/15 flex items-center justify-center text-seatrace-status-danger mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-seatrace-text-primary mb-1 tracking-wide">
        {title}
      </h4>
      {description && (
        <p className="text-xs text-seatrace-text-secondary max-w-md mb-3">{description}</p>
      )}
      {errorMessage && (
        <div className="font-mono text-[11px] bg-seatrace-bg-primary px-3 py-1.5 rounded border border-seatrace-border-subtle text-seatrace-status-danger mb-4 max-w-md overflow-x-auto">
          {errorMessage}
        </div>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </div>
  );
};

export default ErrorState;

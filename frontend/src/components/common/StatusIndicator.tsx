import React from 'react';

export type StatusType =
  | 'online'
  | 'offline'
  | 'warning'
  | 'busy'
  | 'processing'
  | 'verified'
  | 'failed';

export interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  pulse?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  pulse = false,
  className = '',
}) => {
  const statusStyles: Record<StatusType, { dot: string; text: string; defaultLabel: string }> = {
    online: {
      dot: 'bg-seatrace-mint',
      text: 'text-seatrace-mint',
      defaultLabel: 'Online',
    },
    offline: {
      dot: 'bg-seatrace-text-dim',
      text: 'text-seatrace-text-muted',
      defaultLabel: 'Offline',
    },
    warning: {
      dot: 'bg-seatrace-status-warning',
      text: 'text-seatrace-status-warning',
      defaultLabel: 'Warning',
    },
    busy: {
      dot: 'bg-amber-400',
      text: 'text-amber-400',
      defaultLabel: 'Busy',
    },
    processing: {
      dot: 'bg-seatrace-teal',
      text: 'text-seatrace-teal',
      defaultLabel: 'Processing',
    },
    verified: {
      dot: 'bg-seatrace-mint',
      text: 'text-seatrace-mint',
      defaultLabel: 'Verified',
    },
    failed: {
      dot: 'bg-seatrace-status-danger',
      text: 'text-seatrace-status-danger',
      defaultLabel: 'Failed',
    },
  };

  const current = statusStyles[status];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`} />
      </span>
      {(label || current.defaultLabel) && (
        <span className={`text-xs font-mono font-medium ${current.text}`}>
          {label ?? current.defaultLabel}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;

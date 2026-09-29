import React from 'react';

export interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  footer,
  children,
  variant = 'default',
  padding = 'md',
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white',
    elevated: 'bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-800 shadow-md text-slate-900 dark:text-white',
    bordered: 'bg-white dark:bg-[#0f172a] border border-slate-400 dark:border-slate-700 shadow-sm text-slate-900 dark:text-white',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const hasHeader = Boolean(title || subtitle || headerAction);

  return (
    <div className={`rounded-2xl overflow-hidden ${variantClasses[variant]} ${className}`}>
      {hasHeader && (
        <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-800 px-5 py-3.5">
          <div>
            {title && (
              <h3 className="text-sm font-black tracking-wider uppercase text-slate-950 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={`flex-1 min-h-0 ${paddingClasses[padding]}`}>{children}</div>
      {footer && (
        <div className="border-t border-seatrace-border-subtle px-4 py-2.5 bg-seatrace-bg-primary/50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;

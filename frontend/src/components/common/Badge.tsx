import React from 'react';

export type BadgeVariant = 'mint' | 'teal' | 'navy' | 'warning' | 'danger' | 'neutral';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'teal',
  size = 'md',
  children,
  icon,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 tracking-wide rounded-md',
    md: 'text-xs px-2.5 py-1 gap-1.5 tracking-wide rounded-md',
  };

  const variantClasses = {
    mint: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold',
    teal: 'bg-teal-100 dark:bg-teal-950/60 text-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-700 font-bold',
    navy: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 font-bold',
    warning: 'bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-bold',
    danger: 'bg-rose-100 dark:bg-rose-950/60 text-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-700 font-bold',
    neutral: 'bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center font-sans ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;

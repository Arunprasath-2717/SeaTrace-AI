import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ocean'
    | 'teal'
    | 'success'
    | 'amber'
    | 'purple'
    | 'pink'
    | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className, ...props }) => {
  const base =
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-mono font-semibold uppercase tracking-[0.08em] border backdrop-blur-md transition-colors';
  const variants: Record<string, string> = {
    default:     'bg-white text-slate-950 border-white',
    secondary:   'bg-white/10 border-white/15 text-white',
    destructive: 'bg-red-500/20 border-red-500/40 text-red-300',
    outline:     'border-white/20 text-slate-200 bg-white/5',
    ocean:       'bg-sky-500/15 border-sky-500/30 text-sky-300',
    teal:        'bg-teal-500/15 border-teal-500/30 text-teal-300',
    neutral:     'bg-white/8 border-white/12 text-slate-300',
    success:     'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    amber:       'bg-amber-500/15 border-amber-500/30 text-amber-300',
    purple:      'bg-purple-500/15 border-purple-500/30 text-purple-300',
    pink:        'bg-pink-500/15 border-pink-500/30 text-pink-300',
  };
  return (
    <span className={cn(base, variants[variant] || variants.neutral, className)} {...props}>
      {children}
    </span>
  );
};

export default Badge;

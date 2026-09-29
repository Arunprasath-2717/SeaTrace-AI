import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ChevronRight } from 'lucide-react';

/* ─── SeaCard (Crisp, High-contrast, Low 10% Morphism) ───────────── */
export interface SeaCardProps extends HTMLMotionProps<'div'> {
  glass?: boolean;
  hover?: boolean;
  delay?: number;
}

export const SeaCard = React.forwardRef<HTMLDivElement, SeaCardProps>(
  ({ className, glass = true, hover = true, delay = 0, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } : undefined}
      className={cn(
        'rounded-2xl overflow-hidden',
        glass && 'bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
SeaCard.displayName = 'SeaCard';

export const SeaCardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
  <div className={cn('flex items-center justify-between px-4 pt-4 pb-2', className)} {...p} />
);
export const SeaCardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...p }) => (
  <h3 className={cn('text-base font-black text-slate-950 dark:text-white tracking-tight', className)} {...p} />
);
export const SeaCardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
  <div className={cn('px-4 pb-4 text-slate-900 dark:text-white', className)} {...p} />
);

/* ─── SeaBadge ────────────────────────────────────────────────────── */
type BadgeVariant = 'indigo'|'orange'|'emerald'|'rose'|'sky'|'amber'|'slate';
const BADGE: Record<BadgeVariant, string> = {
  indigo:  'bg-indigo-100 text-indigo-950 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-800',
  orange:  'bg-orange-100 text-orange-950 border-orange-300 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800',
  emerald: 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800',
  rose:    'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800',
  sky:     'bg-sky-100 text-sky-950 border-sky-300 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-800',
  amber:   'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800',
  slate:   'bg-slate-100 text-slate-950 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
};
export interface SeaBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  pulse?: boolean;
}
export const SeaBadge: React.FC<SeaBadgeProps> = ({ variant = 'indigo', pulse, className, children, ...p }) => (
  <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border tracking-wide', BADGE[variant], className)} {...p}>
    {pulse && (
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
      </span>
    )}
    {children}
  </span>
);

/* ─── SeaButton ───────────────────────────────────────────────────── */
type BtnVariant = 'primary'|'secondary'|'ghost'|'gradient';
const BTNS: Record<BtnVariant, string> = {
  primary:   'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm font-black',
  secondary: 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm font-black',
  ghost:     'text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 font-black',
  gradient:  'text-white shadow-sm font-black',
};
export interface SeaButtonProps extends HTMLMotionProps<'button'> {
  variant?: BtnVariant;
  size?: 'sm'|'md'|'lg';
  grad?: string;
}
export const SeaButton: React.FC<SeaButtonProps> = ({ variant = 'primary', size = 'md', grad, className, style, children, ...p }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      'inline-flex items-center gap-1.5 font-black rounded-xl transition-all duration-150 cursor-pointer',
      size === 'sm' && 'px-3 py-1.5 text-xs',
      size === 'md' && 'px-4 py-2 text-xs',
      size === 'lg' && 'px-5 py-2.5 text-sm',
      BTNS[variant],
      className,
    )}
    style={variant === 'gradient' ? { background: grad || 'linear-gradient(135deg,#4f46e5,#6366f1)', ...style } : style}
    {...p}
  >
    {children}
  </motion.button>
);

/* ─── SeaStatCard (Bigger & Darker Text, Tight Spacing) ──────────── */
export interface SeaStatCardProps {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: React.ElementType;
  delay?: number;
  onClick?: () => void;
}
export const SeaStatCard: React.FC<SeaStatCardProps> = ({ label, value, sub, color, icon: Icon, delay = 0, onClick }) => (
  <SeaCard delay={delay} onClick={onClick} className={cn("flex items-center gap-4 p-4 border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f172a]", onClick && "cursor-pointer transition-all hover:border-indigo-500 hover:scale-[1.01]")}>
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: delay + 0.15, type: 'spring', stiffness: 260 }}
      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
      style={{ background: color + '20' }}
    >
      <Icon style={{ width: 24, height: 24, color }} />
    </motion.div>
    <div className="min-w-0 flex-1">
      <div className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider truncate">{label}</div>
      <motion.div
        className="text-3xl font-black text-slate-950 dark:text-white leading-none mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.25 }}
      >
        {value}
      </motion.div>
      {sub && <div className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mt-1">{sub}</div>}
    </div>
  </SeaCard>
);

/* ─── SeaGradientBanner ───────────────────────────────────────────── */
export interface SeaGradientBannerProps {
  title: string;
  sub: string;
  stats?: { v: string; l: string }[];
  grad: string;
  action?: React.ReactNode;
  delay?: number;
}
export const SeaGradientBanner: React.FC<SeaGradientBannerProps> = ({ title, sub, stats, grad, action, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    className="rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap shadow-md relative overflow-hidden"
    style={{ background: grad }}
  >
    <div className="relative z-10">
      <div className="text-lg font-black text-white mb-0.5">{title}</div>
      <div className="text-xs font-semibold text-white/90">{sub}</div>
    </div>
    {stats && (
      <div className="relative z-10 flex gap-6">
        {stats.map(s => (
          <div key={s.l} className="text-center">
            <div className="text-2xl font-black text-white">{s.v}</div>
            <div className="text-xs text-white/80 font-bold">{s.l}</div>
          </div>
        ))}
      </div>
    )}
    {action && <div className="relative z-10">{action}</div>}
  </motion.div>
);

/* ─── SeaFilterPills ──────────────────────────────────────────────── */
export interface SeaFilterPillsProps {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}
export const SeaFilterPills: React.FC<SeaFilterPillsProps> = ({ options, value, onChange }) => (
  <div className="flex items-center gap-1.5 flex-wrap">
    {options.map(o => (
      <motion.button
        key={o}
        whileTap={{ scale: 0.96 }}
        onClick={() => onChange(o)}
        className={cn(
          'px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-150 cursor-pointer',
          value === o ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700',
        )}
      >
        {o}
      </motion.button>
    ))}
  </div>
);

export const SeeAllButton: React.FC<{ onClick?: () => void; label?: string }> = ({ onClick, label = 'See All' }) => (
  <SeaButton variant="ghost" size="sm" onClick={onClick}>
    {label} <ChevronRight style={{ width: 14, height: 14 }} />
  </SeaButton>
);

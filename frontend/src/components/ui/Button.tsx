import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, className, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 cursor-pointer rounded-lg';

    const variants = {
      primary:   'bg-sky-500 text-white hover:bg-sky-400 active:bg-sky-600',
      secondary: 'bg-white/8 text-white border border-white/12 hover:bg-white/12 hover:border-white/20',
      ghost:     'text-slate-400 hover:text-white hover:bg-white/8',
      outline:   'border border-sky-500/40 text-sky-400 hover:bg-sky-500/10 hover:border-sky-400',
    };

    const sizes = {
      sm: 'h-8 px-3 text-[13px]',
      md: 'h-10 px-5 text-[14px]',
      lg: 'h-12 px-7 text-[15px]',
    };

    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

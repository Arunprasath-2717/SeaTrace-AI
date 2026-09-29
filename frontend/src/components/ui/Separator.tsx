import * as React from 'react';
import { clsx } from 'clsx';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ orientation = 'horizontal', className, ...props }) => {
  if (orientation === 'vertical') {
    return <div className={clsx('w-px bg-white/10 self-stretch shrink-0', className)} {...props} />;
  }
  return <div className={clsx('h-px w-full bg-white/10 shrink-0', className)} {...props} />;
};

export default Separator;

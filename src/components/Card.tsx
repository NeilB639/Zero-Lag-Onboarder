import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface CardProps extends PropsWithChildren {
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div
    className={clsx(
      'rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-card dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
      className,
    )}
  >
    {children}
  </div>
);

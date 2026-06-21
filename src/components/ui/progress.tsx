'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  variant?: 'default' | 'slim' | 'outline-solid';
  indicatorClassName?: string;
  indicatorStyle?: React.CSSProperties;
}

function Progress({
  className,
  value = 0,
  variant = 'default',
  indicatorClassName,
  indicatorStyle,
  ...props
}: ProgressProps) {
  const isSlim = variant === 'slim';
  const isOutline = variant === 'outline-solid';

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={cn(
        'relative w-full overflow-hidden rounded-full h-3 bg-white/[0.04] border border-border-soft-val',
        isSlim && 'bg-white/[0.02]',
        isOutline && 'bg-white/[0.04]',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'bg-brand-primary transition-all duration-150',
          isSlim
            ? 'absolute top-1/2 -translate-y-1/2 h-[60%] rounded-full'
            : 'h-full',
          indicatorClassName,
        )}
        style={
          isSlim
            ? {
                left: '4px',
                width: `calc(${value || 0}% - 8px)`,
                ...indicatorStyle,
              }
            : { width: `${value || 0}%`, ...indicatorStyle }
        }
      />
    </div>
  );
}

export { Progress };

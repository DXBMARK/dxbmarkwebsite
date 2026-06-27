'use client';

import * as React from 'react';
import { useServicesMotion } from '@/components/home/services/useServicesMotion';

type ServicesAnimateProps = {
  children: React.ReactNode;
};

export function ServicesAnimate({ children }: ServicesAnimateProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  
  useServicesMotion(rootRef);

  return (
    <div ref={rootRef} className="w-full">
      {children}
    </div>
  );
}

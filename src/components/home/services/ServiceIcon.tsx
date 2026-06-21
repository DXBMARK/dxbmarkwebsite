'use client';

import * as React from 'react';

interface ServiceIconProps extends React.SVGProps<SVGSVGElement> {
  name: "web-app" | "website" | "portal" | "cloud" | "automation" | "consulting";
}

export function ServiceIcon({ name, className, ...props }: ServiceIconProps) {
  const baseSvgProps = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    ...props
  };

  switch (name) {
    case "web-app":
      // App window / dashboard grid
      return (
        <svg {...baseSvgProps}>
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      );
    case "website":
      // Browser page / layout
      return (
        <svg {...baseSvgProps}>
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <circle cx="6" cy="6" r="0.5" fill="currentColor" />
          <circle cx="9" cy="6" r="0.5" fill="currentColor" />
          <circle cx="12" cy="6" r="0.5" fill="currentColor" />
        </svg>
      );
    case "portal":
      // Connected panels / admin dashboard
      return (
        <svg {...baseSvgProps}>
          <rect width="8" height="8" x="3" y="3" rx="1" />
          <rect width="8" height="8" x="13" y="3" rx="1" />
          <rect width="8" height="8" x="3" y="13" rx="1" />
          <rect width="8" height="8" x="13" y="13" rx="1" />
          <path d="M11 7h2" />
          <path d="M7 11v2" />
          <path d="M11 17h2" />
          <path d="M17 11v2" />
        </svg>
      );
    case "cloud":
      // Cloud server / upload
      return (
        <svg {...baseSvgProps}>
          <path d="M17.5 19A3.5 3.5 0 0 0 18 12h-1.25a6.5 6.5 0 0 0-12.5-2A4.25 4.25 0 0 0 5 18.5h12.5" />
          <path d="M12 12v6" />
          <path d="m9 15 3-3 3 3" />
        </svg>
      );
    case "automation":
      // Workflow nodes / arrows
      return (
        <svg {...baseSvgProps}>
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M9 6h5a2 2 0 0 1 2 2v5" />
          <path d="m14 11 2 2 2-2" />
          <circle cx="6" cy="18" r="2" />
          <path d="M6 9v7" />
        </svg>
      );
    case "consulting":
      // Compass / blueprint / spark
      return (
        <svg {...baseSvgProps}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );
  }
}

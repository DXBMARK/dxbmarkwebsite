"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface IntegrationFlowPathsProps {
  containerRef: React.RefObject<HTMLElement | null>;
  expandedTile?: string | null;
}

export function IntegrationFlowPaths({ containerRef, expandedTile }: IntegrationFlowPathsProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "center center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Main flow paths (always visible)
  const paths = [
    // Source (Left) - Starts from Hub (around x:520, y:320) and travels outward to Source Tiles
    {
      id: "src-1",
      d: "M 520 320 C 420 320 340 120 198 120",
      stroke: "var(--color-accent-primary)",
      duration: 5.8,
      delay: 0 * 0.16,
    },
    {
      id: "src-2",
      d: "M 520 320 C 420 320 340 200 198 200",
      stroke: "var(--color-accent-primary)",
      duration: 5.8,
      delay: 1 * 0.16,
    },
    {
      id: "src-3",
      d: "M 520 320 C 440 320 360 280 198 280",
      stroke: "var(--color-accent-primary)",
      duration: 5.8,
      delay: 2 * 0.16,
    },
    {
      id: "src-4",
      d: "M 520 320 C 440 320 360 360 198 360",
      stroke: "var(--color-accent-primary)",
      duration: 5.8,
      delay: 3 * 0.16,
    },
    {
      id: "src-5",
      d: "M 520 320 C 420 320 350 440 198 440",
      stroke: "var(--color-accent-primary)",
      duration: 5.8,
      delay: 4 * 0.16,
    },
    {
      id: "src-6",
      d: "M 520 320 C 420 320 340 520 198 520",
      stroke: "var(--color-accent-primary)",
      duration: 5.8,
      delay: 5 * 0.16,
    },

    // Hub to Destination (Right) - Starts from Hub (around x:680, y:320) and travels outward
    {
      id: "dest-1",
      d: "M 680 320 C 780 320 860 120 1002 120",
      stroke: "var(--color-accent-primary)",
      duration: 5.8,
      delay: 0 * 0.16 + 0.1,
    },
    {
      id: "dest-2",
      d: "M 680 320 C 780 320 850 200 1002 200",
      stroke: "var(--color-accent-primary)",
      duration: 5.8,
      delay: 1 * 0.16 + 0.1,
    },
    {
      id: "dest-3",
      d: "M 680 320 C 760 320 840 280 1002 280",
      stroke: "var(--color-accent-primary)",
      duration: 5.8,
      delay: 2 * 0.16 + 0.1,
    },
    {
      id: "dest-4",
      d: "M 680 320 C 760 320 840 360 1002 360",
      stroke: "var(--color-accent-primary)",
      duration: 5.8,
      delay: 3 * 0.16 + 0.1,
    },
    {
      id: "dest-5",
      d: "M 680 320 C 780 320 850 440 1002 440",
      stroke: "var(--color-accent-primary)",
      duration: 5.8,
      delay: 4 * 0.16 + 0.1,
    },
    {
      id: "dest-6",
      d: "M 680 320 C 780 320 860 520 1002 520",
      stroke: "var(--color-accent-primary)",
      duration: 5.8,
      delay: 5 * 0.16 + 0.1,
    },
  ];

  // Payments sub-flow paths (active only when Payments tile is expanded)
  // Starts from Payments parent { x: 170, y: 520 } and travels outward to children
  const paymentsSubPaths = [
    {
      id: "sub-stripe",
      d: "M 170 520 C 130 540 90 560 55 585",
      stroke: "var(--color-accent-primary)",
      duration: 3.1,
      delay: 0 * 0.12,
    },
    {
      id: "sub-paypal",
      d: "M 170 520 C 150 560 140 590 130 620",
      stroke: "var(--color-accent-primary)",
      duration: 3.1,
      delay: 1 * 0.12,
    },
    {
      id: "sub-paymob",
      d: "M 170 520 C 190 560 200 590 215 620",
      stroke: "var(--color-accent-primary)",
      duration: 3.1,
      delay: 2 * 0.12,
    },
    {
      id: "sub-tabby",
      d: "M 170 520 C 210 540 260 560 295 585",
      stroke: "var(--color-accent-primary)",
      duration: 3.1,
      delay: 3 * 0.12,
    },
  ];

  // CRM sub-flow paths (active only when CRM Systems tile is expanded)
  // Starts from CRM parent { x: 170, y: 200 } and travels outward to children
  const crmSubPaths = [
    {
      id: "sub-hubspot",
      d: "M 170 200 C 130 180 90 140 70 120",
      stroke: "var(--color-accent-primary)",
      duration: 3.1,
      delay: 0 * 0.12,
    },
    {
      id: "sub-salesforce",
      d: "M 170 200 C 130 200 100 200 70 200",
      stroke: "var(--color-accent-primary)",
      duration: 3.1,
      delay: 1 * 0.12,
    },
    {
      id: "sub-zoho",
      d: "M 170 200 C 130 220 90 260 70 280",
      stroke: "var(--color-accent-primary)",
      duration: 3.1,
      delay: 2 * 0.12,
    },
  ];

  const crmActivePaths = expandedTile === "source-crm" ? crmSubPaths : [];
  const paymentsActivePaths = expandedTile === "source-payments" ? paymentsSubPaths : [];
  const activePaths = [...paths, ...crmActivePaths, ...paymentsActivePaths];

  return (
    <svg
      viewBox="0 0 1200 640"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full pointer-events-none select-none overflow-visible z-0"
      aria-hidden="true"
    >
      <defs>
        {/* Glow blur filter */}
        <filter id="integrationGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Pulse moving gradient */}
        <linearGradient id="integrationPulseGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--color-accent-primary)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {activePaths.map((path) => {
        const isSubPath = path.id.startsWith("sub-");
        return (
          <g key={path.id}>
            {/* Layer 1: Thin base guide path */}
            <path
              d={path.d}
              stroke="var(--color-border-soft)"
              strokeWidth={1.25}
              fill="none"
              strokeOpacity={isSubPath ? 0.45 : 0.14}
            />

            {/* Layer 2: Scroll-drawn path */}
            <motion.path
              d={path.d}
              style={isSubPath ? {} : { pathLength }}
              initial={isSubPath ? { pathLength: 0, opacity: 0 } : {}}
              animate={isSubPath ? { pathLength: 1 } : {}}
              transition={isSubPath ? { duration: 0.6, ease: "easeOut" } : {}}
              stroke={path.stroke}
              strokeWidth={1.25}
              fill="none"
              strokeLinecap="round"
              strokeOpacity={isSubPath ? 0.45 : undefined}
              className={isSubPath ? "" : "opacity-35"}
            />

            {/* Layer 3: Animated glowing stroke */}
            <motion.path
              d={path.d}
              stroke="url(#integrationPulseGradient)"
              strokeWidth={1.75}
              fill="none"
              strokeLinecap="round"
              strokeDasharray="28 180"
              animate={{ strokeDashoffset: [0, -208] }}
              transition={{
                duration: path.duration,
                delay: path.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              filter="url(#integrationGlow)"
              strokeOpacity={0.55}
            />

            {/* Layer 4: Moving particle dot */}
            <motion.circle
              r={3.5}
              fill={path.stroke}
              filter="url(#integrationGlow)"
              className="opacity-80"
            >
              <animateMotion
                dur={`${path.duration}s`}
                repeatCount="indefinite"
                path={path.d}
                begin={`${path.delay}s`}
              />
            </motion.circle>
          </g>
        );
      })}
    </svg>
  );
}

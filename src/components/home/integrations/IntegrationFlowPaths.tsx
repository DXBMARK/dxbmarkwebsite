"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface IntegrationFlowPathsProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

const FLOW_WIDTH = 1200;
const FLOW_HEIGHT = 560;

export function IntegrationFlowPaths({ containerRef }: IntegrationFlowPathsProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "center center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Main flow paths (always visible)
  const paths = [
    // Left side
    {
      id: "source-hubspot",
      d: "M 517 260 C 455 260 365 35 292 35",
      stroke: "var(--color-accent-primary)",
      duration: 6.4,
      delay: 0,
    },
    {
      id: "source-zapier",
      d: "M 517 280 C 455 280 365 160 292 160",
      stroke: "var(--color-accent-primary)",
      duration: 6.4,
      delay: 0.12,
    },
    {
      id: "source-shopify",
      d: "M 517 300 C 455 300 365 285 292 285",
      stroke: "var(--color-accent-primary)",
      duration: 6.4,
      delay: 0.24,
    },
    {
      id: "source-paypal",
      d: "M 517 320 C 455 320 365 410 292 410",
      stroke: "var(--color-accent-primary)",
      duration: 6.4,
      delay: 0.36,
    },
    {
      id: "source-cloud",
      d: "M 517 340 C 455 340 365 535 292 535",
      stroke: "var(--color-accent-primary)",
      duration: 6.4,
      delay: 0.48,
    },

    // Right side
    {
      id: "dest-stripe",
      d: "M 683 260 C 745 260 835 35 908 35",
      stroke: "var(--color-accent-primary)",
      duration: 6.4,
      delay: 0.06,
    },
    {
      id: "dest-analytics",
      d: "M 683 280 C 745 280 835 160 908 160",
      stroke: "var(--color-accent-primary)",
      duration: 6.4,
      delay: 0.18,
    },
    {
      id: "dest-slack",
      d: "M 683 300 C 745 300 835 285 908 285",
      stroke: "var(--color-accent-primary)",
      duration: 6.4,
      delay: 0.3,
    },
    {
      id: "dest-whatsapp",
      d: "M 683 320 C 745 320 835 410 908 410",
      stroke: "var(--color-accent-primary)",
      duration: 6.4,
      delay: 0.42,
    },
    {
      id: "dest-telegram",
      d: "M 683 340 C 745 340 835 535 908 535",
      stroke: "var(--color-accent-primary)",
      duration: 6.4,
      delay: 0.54,
    },
  ];

  return (
    <svg
      viewBox={`0 0 ${FLOW_WIDTH} ${FLOW_HEIGHT}`}
      preserveAspectRatio="none"
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

      {paths.map((path) => {
        return (
          <g key={path.id}>
            {/* Layer 1: Thin base guide path */}
            <path
              d={path.d}
              stroke="var(--color-border-soft)"
              strokeWidth={1.5}
              fill="none"
              strokeOpacity={0.14}
            />

            {/* Layer 2: Scroll-drawn path */}
            <motion.path
              d={path.d}
              stroke={path.stroke}
              strokeWidth={1.5}
              fill="none"
              strokeLinecap="round"
              style={{ pathLength, opacity: 0.32 }}
            />

            {/* Layer 3: Animated glowing stroke */}
            <motion.path
              d={path.d}
              stroke="url(#integrationPulseGradient)"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeDasharray="26 160"
              animate={{ strokeDashoffset: [0, -208] }}
              transition={{
                duration: path.duration,
                delay: path.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              filter="url(#integrationGlow)"
              strokeOpacity={0.75}
            />

            {/* Layer 4: Moving particle dot */}
            <motion.circle
              r={3.6}
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

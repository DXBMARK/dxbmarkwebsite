"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/layout";
import { saasSystemCapabilities } from "@/content/home/saas-systems";
import { cn } from "@/lib/utils";

/**
 * SaasSystemCapabilities Component
 * 
 * Heroicons-inspired feature showcase section
 * Text-heavy features on left, dashboard visual on right
 * Follows DXBMARK dark premium theme
 */

// Custom SVG icons matching Heroicons style
const icons = {
  "cloud-arrow-up": (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 0 1-1.44-8.765 4.5 4.5 0 0 1 8.302-3.046 3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm3.75-2.75a.75.75 0 0 0 1.5 0V9.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z" clipRule="evenodd" />
    </svg>
  ),
  "lock-closed": (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
    </svg>
  ),
  "server": (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M4.632 3.533A2 2 0 0 1 6.577 2h6.846a2 2 0 0 1 1.945 1.533l1.976 8.234A3.489 3.489 0 0 0 16 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234Z" />
      <path fillRule="evenodd" d="M4 13a2 2 0 1 0 0 4h12a2 2 0 1 0 0-4H4Zm11.24 2a.75.75 0 0 1 .75-.75H16a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75h-.01a.75.75 0 0 1-.75-.75V15Zm-2.25-.75a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75H13a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75h-.01Z" clipRule="evenodd" />
    </svg>
  ),
  "bolt": (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
    </svg>
  ),
  "chart-bar": (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 2h-1ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9A1.5 1.5 0 0 0 9.5 18h1a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 10.5 6h-1ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5A1.5 1.5 0 0 0 3.5 18h1A1.5 1.5 0 0 0 6 16.5v-5A1.5 1.5 0 0 0 4.5 10h-1Z" />
    </svg>
  ),
  "cog-6-tooth": (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
    </svg>
  ),
};

const ICON_MAP = icons;

interface CapabilityVisualProps {
  className?: string;
}

function CapabilityVisual({ className }: CapabilityVisualProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.96 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative aspect-[2432/1442] w-full max-w-[640px] overflow-hidden rounded-2xl border border-white/[0.09] bg-[rgba(10,16,32,0.85)] shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl ring-1 ring-white/5",
        className
      )}
    >
      {/* Top shimmer */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -bottom-10 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full bg-brand-glow opacity-30 blur-[80px]"
        aria-hidden="true"
      />
      
      {/* Dashboard mockup with SVG */}
      <svg
        viewBox="0 0 2432 1442"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect width="2432" height="1442" fill="rgba(10,16,32,0.9)" />
        
        {/* Top bar */}
        <rect x="40" y="40" width="2352" height="100" fill="rgba(255,255,255,0.04)" rx="16" />
        <circle cx="80" cy="90" r="18" fill="rgba(249,126,26,0.6)" />
        <rect x="120" y="70" width="300" height="18" fill="rgba(255,255,255,0.15)" rx="9" />
        <rect x="120" y="100" width="200" height="14" fill="rgba(255,255,255,0.08)" rx="7" />
        
        {/* KPI Cards Row */}
        <g>
          <rect x="40" y="180" width="560" height="240" fill="rgba(255,255,255,0.04)" stroke="rgba(249,126,26,0.3)" strokeWidth="2" rx="20" />
          <rect x="60" y="200" width="180" height="20" fill="rgba(175,175,175,0.4)" rx="10" />
          <rect x="60" y="240" width="300" height="40" fill="rgba(249,126,26,0.8)" rx="10" />
          <rect x="60" y="300" width="240" height="20" fill="rgba(52,211,153,0.6)" rx="10" />
        </g>
        <g>
          <rect x="640" y="180" width="560" height="240" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" rx="20" />
          <rect x="660" y="200" width="180" height="20" fill="rgba(175,175,175,0.4)" rx="10" />
          <rect x="660" y="240" width="280" height="40" fill="rgba(255,255,255,0.9)" rx="10" />
        </g>
        <g>
          <rect x="1240" y="180" width="560" height="240" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" rx="20" />
          <rect x="1260" y="200" width="180" height="20" fill="rgba(175,175,175,0.4)" rx="10" />
          <rect x="1260" y="240" width="260" height="40" fill="rgba(255,255,255,0.9)" rx="10" />
        </g>
        <g>
          <rect x="1840" y="180" width="552" height="240" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" rx="20" />
          <rect x="1860" y="200" width="180" height="20" fill="rgba(175,175,175,0.4)" rx="10" />
          <rect x="1860" y="240" width="240" height="40" fill="rgba(255,255,255,0.9)" rx="10" />
        </g>
        
        {/* Large Chart Area */}
        <rect x="40" y="460" width="1520" height="942" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" rx="20" />
        <rect x="60" y="480" width="280" height="20" fill="rgba(175,175,175,0.4)" rx="10" />
        <rect x="60" y="520" width="400" height="80" fill="rgba(255,255,255,0.9)" rx="10" />
        
        {/* Chart path with orange accent */}
        <path
          d="M 80 1300 Q 280 1100, 480 1200 Q 680 1000, 880 1150 Q 1080 950, 1280 1100 Q 1480 900, 1500 1050"
          fill="none"
          stroke="rgba(249,126,26,0.9)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 80 1300 Q 280 1100, 480 1200 Q 680 1000, 880 1150 Q 1080 950, 1280 1100 Q 1480 900, 1500 1050 L 1500 1380 L 80 1380 Z"
          fill="url(#capabilityGradient)"
          opacity="0.35"
        />
        
        {/* Side Panels */}
        <rect x="1600" y="460" width="792" height="460" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" rx="20" />
        <rect x="1620" y="480" width="220" height="20" fill="rgba(175,175,175,0.4)" rx="10" />
        <rect x="1620" y="530" width="740" height="80" fill="rgba(52,211,153,0.15)" stroke="rgba(52,211,153,0.3)" strokeWidth="2" rx="16" />
        <rect x="1620" y="640" width="740" height="80" fill="rgba(249,126,26,0.15)" stroke="rgba(249,126,26,0.3)" strokeWidth="2" rx="16" />
        <rect x="1620" y="750" width="740" height="80" fill="rgba(56,189,248,0.15)" stroke="rgba(56,189,248,0.3)" strokeWidth="2" rx="16" />
        
        <rect x="1600" y="960" width="792" height="442" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" rx="20" />
        <rect x="1620" y="980" width="180" height="20" fill="rgba(175,175,175,0.4)" rx="10" />
        <rect x="1620" y="1020" width="740" height="60" fill="rgba(255,255,255,0.06)" rx="12" />
        <rect x="1620" y="1100" width="740" height="60" fill="rgba(255,255,255,0.06)" rx="12" />
        <rect x="1620" y="1180" width="740" height="60" fill="rgba(255,255,255,0.06)" rx="12" />
        <rect x="1620" y="1260" width="740" height="60" fill="rgba(255,255,255,0.06)" rx="12" />
        
        <defs>
          <linearGradient id="capabilityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(249,126,26,0.5)" />
            <stop offset="100%" stopColor="rgba(249,126,26,0)" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

export function SaasSystemCapabilities() {
  return (
    <div className="relative w-full overflow-hidden bg-transparent py-20 sm:py-24 lg:py-32">
      {/* Subtle ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-glow opacity-8 blur-[160px]"
        aria-hidden="true"
      />

      <Container>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-x-16 xl:gap-x-20">
          
          {/* LEFT — Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pr-4 lg:pt-4"
          >
            <div className="lg:max-w-lg">
              <h2 className="font-label text-sm font-semibold uppercase tracking-wider text-brand-primary">
                {saasSystemCapabilities.badge}
              </h2>
              <p className="mt-2 font-sans text-3xl font-black tracking-tight text-text-main sm:text-4xl">
                {saasSystemCapabilities.headline}
              </p>
              <p className="mt-6 font-body text-base leading-relaxed text-text-sub lg:text-lg">
                {saasSystemCapabilities.description}
              </p>
              
              <dl className="mt-10 max-w-xl space-y-8 font-body text-sm leading-7 text-text-sub lg:max-w-none">
                {saasSystemCapabilities.features.map((feature, index) => {
                  const Icon = ICON_MAP[feature.icon as keyof typeof ICON_MAP];
                  
                  return (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        ease: [0.22, 1, 0.36, 1] 
                      }}
                      className="relative pl-9"
                    >
                      <dt className="inline font-sans font-bold text-text-main">
                        <Icon 
                          aria-hidden="true" 
                          className="absolute left-1 top-1 h-5 w-5 text-brand-primary" 
                        />
                        {feature.name}
                      </dt>{' '}
                      <dd className="inline">{feature.description}</dd>
                    </motion.div>
                  );
                })}
              </dl>
            </div>
          </motion.div>
          
          {/* RIGHT — Dashboard visual */}
          <div className="flex items-center justify-center lg:justify-end">
            <CapabilityVisual className="lg:-mr-8 xl:-mr-12" />
          </div>
        </div>
      </Container>
    </div>
  );
}

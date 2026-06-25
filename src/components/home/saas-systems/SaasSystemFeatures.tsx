"use client";

import * as React from "react";
import { Container } from "@/components/ui/layout";
import { saasSystemFeatures } from "@/content/home/saas-systems";
import { cn } from "@/lib/utils";

/**
 * SaasSystemFeatures Component
 * 
 * Each feature row is a magnetic scroll target for homepage scroll behavior.
 * Alternating left-right layout matching reference design.
 * Follows DXBMARK dark premium theme.
 */

interface FeatureVisualProps {
  featureId: string;
  aspectRatio?: string;
}

function FeatureVisual({ featureId, aspectRatio = "aspect-[570/408]" }: FeatureVisualProps) {
  // Generate SVG mockups based on feature type
  const renderMockup = () => {
    switch (featureId) {
      case "dashboard-components":
        return (
          <svg
            viewBox="0 0 570 408"
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Dashboard grid mockup */}
            <rect width="570" height="408" fill="rgba(10,16,32,0.9)" rx="16" />
            
            {/* Top bar */}
            <rect x="20" y="20" width="530" height="48" fill="rgba(255,255,255,0.04)" rx="8" />
            <circle cx="40" cy="44" r="8" fill="rgba(249,126,26,0.6)" />
            <rect x="60" y="36" width="120" height="8" fill="rgba(255,255,255,0.15)" rx="4" />
            <rect x="60" y="48" width="80" height="6" fill="rgba(255,255,255,0.08)" rx="3" />
            
            {/* KPI Cards Row */}
            <g>
              <rect x="20" y="88" width="160" height="92" fill="rgba(255,255,255,0.04)" stroke="rgba(249,126,26,0.3)" strokeWidth="1" rx="12" />
              <rect x="30" y="98" width="60" height="8" fill="rgba(175,175,175,0.4)" rx="4" />
              <rect x="30" y="116" width="100" height="16" fill="rgba(249,126,26,0.8)" rx="4" />
              <rect x="30" y="144" width="80" height="8" fill="rgba(52,211,153,0.6)" rx="4" />
            </g>
            <g>
              <rect x="205" y="88" width="160" height="92" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" rx="12" />
              <rect x="215" y="98" width="60" height="8" fill="rgba(175,175,175,0.4)" rx="4" />
              <rect x="215" y="116" width="80" height="16" fill="rgba(255,255,255,0.9)" rx="4" />
            </g>
            <g>
              <rect x="390" y="88" width="160" height="92" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" rx="12" />
              <rect x="400" y="98" width="60" height="8" fill="rgba(175,175,175,0.4)" rx="4" />
              <rect x="400" y="116" width="70" height="16" fill="rgba(255,255,255,0.9)" rx="4" />
            </g>
            
            {/* Chart Area */}
            <rect x="20" y="200" width="350" height="188" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" rx="12" />
            <rect x="30" y="210" width="80" height="8" fill="rgba(175,175,175,0.4)" rx="4" />
            <path
              d="M 40 330 Q 90 290, 140 310 T 240 280 T 340 300"
              fill="none"
              stroke="rgba(249,126,26,0.8)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 40 330 Q 90 290, 140 310 T 240 280 T 340 300 L 340 370 L 40 370 Z"
              fill="url(#dashGradient)"
              opacity="0.3"
            />
            
            {/* Side Panel */}
            <rect x="390" y="200" width="160" height="188" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" rx="12" />
            <rect x="400" y="210" width="70" height="8" fill="rgba(175,175,175,0.4)" rx="4" />
            <rect x="400" y="230" width="140" height="32" fill="rgba(52,211,153,0.15)" stroke="rgba(52,211,153,0.3)" strokeWidth="1" rx="8" />
            <rect x="400" y="274" width="140" height="32" fill="rgba(249,126,26,0.15)" stroke="rgba(249,126,26,0.3)" strokeWidth="1" rx="8" />
            <rect x="400" y="318" width="140" height="32" fill="rgba(56,189,248,0.15)" stroke="rgba(56,189,248,0.3)" strokeWidth="1" rx="8" />
            
            <defs>
              <linearGradient id="dashGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(249,126,26,0.5)" />
                <stop offset="100%" stopColor="rgba(249,126,26,0)" />
              </linearGradient>
            </defs>
          </svg>
        );

      case "data-visualization":
        return (
          <svg
            viewBox="0 0 570 440"
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect width="570" height="440" fill="rgba(10,16,32,0.9)" rx="16" />
            
            {/* Header */}
            <rect x="20" y="20" width="530" height="48" fill="rgba(255,255,255,0.04)" rx="8" />
            <rect x="30" y="32" width="100" height="10" fill="rgba(249,126,26,0.8)" rx="5" />
            <rect x="30" y="46" width="140" height="8" fill="rgba(255,255,255,0.15)" rx="4" />
            
            {/* Charts Grid */}
            {/* Bar Chart */}
            <rect x="20" y="88" width="260" height="160" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" rx="12" />
            <rect x="30" y="98" width="60" height="8" fill="rgba(175,175,175,0.4)" rx="4" />
            {[60, 90, 120, 150, 180, 210].map((x, i) => (
              <rect
                key={i}
                x={x}
                y={240 - (i * 15 + 40)}
                width="28"
                height={i * 15 + 40}
                fill={i === 2 ? "rgba(249,126,26,0.8)" : "rgba(56,189,248,0.6)"}
                rx="4"
              />
            ))}
            
            {/* Donut Chart */}
            <g transform="translate(430, 168)">
              <rect x="-120" y="-80" width="260" height="160" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" rx="12" />
              <rect x="-110" y="-70" width="60" height="8" fill="rgba(175,175,175,0.4)" rx="4" />
              <circle cx="0" cy="0" r="50" fill="none" stroke="rgba(56,189,248,0.6)" strokeWidth="20" strokeDasharray="94.2 314" />
              <circle cx="0" cy="0" r="50" fill="none" stroke="rgba(249,126,26,0.8)" strokeWidth="20" strokeDasharray="125.6 314" strokeDashoffset="-94.2" />
              <circle cx="0" cy="0" r="50" fill="none" stroke="rgba(52,211,153,0.6)" strokeWidth="20" strokeDasharray="94.2 314" strokeDashoffset="-219.8" />
            </g>
            
            {/* Area Chart */}
            <rect x="20" y="268" width="530" height="152" fill="rgba(255,255,255,0.04)" stroke="rgba(249,126,26,0.3)" strokeWidth="1" rx="12" />
            <rect x="30" y="278" width="60" height="8" fill="rgba(175,175,175,0.4)" rx="4" />
            <path
              d="M 40 380 Q 100 340, 160 360 Q 220 320, 280 350 Q 340 310, 400 340 Q 460 300, 520 330"
              fill="none"
              stroke="rgba(249,126,26,0.9)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 40 380 Q 100 340, 160 360 Q 220 320, 280 350 Q 340 310, 400 340 Q 460 300, 520 330 L 520 400 L 40 400 Z"
              fill="url(#areaGradient)"
              opacity="0.35"
            />
            
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(249,126,26,0.6)" />
                <stop offset="100%" stopColor="rgba(249,126,26,0)" />
              </linearGradient>
            </defs>
          </svg>
        );

      case "system-capabilities":
        return (
          <svg
            viewBox="0 0 570 408"
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect width="570" height="408" fill="rgba(10,16,32,0.9)" rx="16" />
            
            {/* Top bar */}
            <rect x="20" y="20" width="530" height="48" fill="rgba(255,255,255,0.04)" rx="8" />
            <circle cx="40" cy="44" r="8" fill="rgba(52,211,153,0.6)" />
            <rect x="60" y="36" width="140" height="8" fill="rgba(255,255,255,0.15)" rx="4" />
            <rect x="60" y="48" width="100" height="6" fill="rgba(255,255,255,0.08)" rx="3" />
            
            {/* System architecture layout */}
            {/* Left - Security */}
            <rect x="20" y="88" width="160" height="120" fill="rgba(255,255,255,0.04)" stroke="rgba(52,211,153,0.3)" strokeWidth="1" rx="12" />
            <rect x="30" y="98" width="80" height="8" fill="rgba(52,211,153,0.6)" rx="4" />
            <rect x="30" y="118" width="140" height="24" fill="rgba(52,211,153,0.15)" rx="6" />
            <rect x="30" y="150" width="140" height="24" fill="rgba(52,211,153,0.15)" rx="6" />
            <rect x="30" y="182" width="140" height="18" fill="rgba(52,211,153,0.1)" rx="6" />
            
            {/* Center - Core */}
            <rect x="205" y="88" width="160" height="120" fill="rgba(255,255,255,0.04)" stroke="rgba(249,126,26,0.4)" strokeWidth="2" rx="12" />
            <rect x="215" y="98" width="60" height="8" fill="rgba(249,126,26,0.8)" rx="4" />
            <rect x="215" y="118" width="140" height="80" fill="rgba(249,126,26,0.15)" rx="8" />
            <circle cx="285" cy="158" r="20" fill="rgba(249,126,26,0.3)" stroke="rgba(249,126,26,0.6)" strokeWidth="2" />
            
            {/* Right - Scale */}
            <rect x="390" y="88" width="160" height="120" fill="rgba(255,255,255,0.04)" stroke="rgba(56,189,248,0.3)" strokeWidth="1" rx="12" />
            <rect x="400" y="98" width="70" height="8" fill="rgba(56,189,248,0.6)" rx="4" />
            <rect x="400" y="118" width="140" height="24" fill="rgba(56,189,248,0.15)" rx="6" />
            <rect x="400" y="150" width="140" height="24" fill="rgba(56,189,248,0.15)" rx="6" />
            <rect x="400" y="182" width="140" height="18" fill="rgba(56,189,248,0.1)" rx="6" />
            
            {/* Bottom - Analytics & Automation */}
            <rect x="20" y="228" width="350" height="160" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" rx="12" />
            <rect x="30" y="238" width="100" height="8" fill="rgba(175,175,175,0.4)" rx="4" />
            {/* Mini chart */}
            <path
              d="M 40 350 Q 90 320, 140 340 Q 190 310, 240 330 Q 290 300, 340 320"
              fill="none"
              stroke="rgba(249,126,26,0.8)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <rect x="30" y="260" width="120" height="32" fill="rgba(249,126,26,0.12)" rx="8" />
            <rect x="160" y="260" width="120" height="32" fill="rgba(56,189,248,0.12)" rx="8" />
            <rect x="290" y="260" width="70" height="32" fill="rgba(52,211,153,0.12)" rx="8" />
            
            {/* Deployment Pipeline */}
            <rect x="390" y="228" width="160" height="160" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" rx="12" />
            <rect x="400" y="238" width="90" height="8" fill="rgba(175,175,175,0.4)" rx="4" />
            <rect x="400" y="260" width="140" height="28" fill="rgba(52,211,153,0.15)" rx="6" />
            <rect x="400" y="298" width="140" height="28" fill="rgba(52,211,153,0.15)" rx="6" />
            <rect x="400" y="336" width="140" height="28" fill="rgba(52,211,153,0.15)" rx="6" />
            
            <defs>
              <linearGradient id="capGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(249,126,26,0.5)" />
                <stop offset="100%" stopColor="rgba(249,126,26,0)" />
              </linearGradient>
            </defs>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="relative w-full"
      data-saas-feature-visual
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[rgba(10,16,32,0.88)] shadow-[0_4px_24px_rgba(0,0,0,0.4),0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-xl ring-1 ring-white/5",
          aspectRatio
        )}
      >
        {/* Top shimmer */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -bottom-12 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-brand-glow opacity-25 blur-[90px]"
          aria-hidden="true"
        />
        
        {/* Content */}
        <div className="relative h-full w-full">{renderMockup()}</div>
      </div>
    </div>
  );
}

interface FeatureItemProps {
  feature: {
    readonly id: string;
    readonly badge: string;
    readonly headline: string;
    readonly features: ReadonlyArray<{
      readonly title: string;
      readonly description: string;
    }>;
  };
  index: number;
}

function FeatureItem({ feature, index }: FeatureItemProps) {
  const isReversed = index % 2 === 1;
  const aspectRatio = feature.id === "data-visualization" ? "aspect-[570/440]" : "aspect-[570/408]";

  return (
    <section
      // Magnetic scroll target attributes
      data-home-section
      data-saas-feature-section
      data-saas-feature={feature.id}
      className="relative w-full overflow-hidden py-16 sm:py-20"
    >
      {/* Subtle section glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-glow opacity-5 blur-[120px]"
        aria-hidden="true"
      />

      <Container>
        <div
          className={cn(
            "grid grid-cols-1 items-center gap-x-12 gap-y-12 lg:grid-cols-2 xl:gap-x-16",
            isReversed && "lg:grid-flow-dense"
          )}
        >
          {/* Visual */}
          <div
            className={cn(
              "relative w-full",
              isReversed ? "lg:col-start-2" : "lg:col-start-1"
            )}
          >
            <FeatureVisual featureId={feature.id} aspectRatio={aspectRatio} />
          </div>

          {/* Content */}
          <div
            className={cn(
              "w-full",
              isReversed ? "lg:col-start-1" : "lg:col-start-2"
            )}
            data-saas-feature-content
          >
            <div className="lg:max-w-lg">
              <h3 className="mb-4 font-label text-base font-medium text-brand-primary md:mb-5 md:text-lg">
                {feature.badge}
              </h3>
              <h4 className="font-sans text-2xl font-semibold tracking-tight text-text-main sm:text-3xl xl:text-4xl">
                {feature.headline}
              </h4>

              <div className="mt-8 space-y-6">
                {feature.features.map((item, idx) => (
                  <div key={idx}>
                    <h5 className="mb-2 font-sans text-xl font-semibold text-text-main">
                      {item.title}
                    </h5>
                    <p className="font-body text-base leading-relaxed text-text-sub">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function SaasSystemFeatures() {
  return (
    <>
      {saasSystemFeatures.map((feature, index) => (
        <FeatureItem key={feature.id} feature={feature} index={index} />
      ))}
    </>
  );
}

"use client";

import * as React from "react";
import { Container } from "@/components/ui/layout";
import { saasSystemFinalCTA } from "@/content/home/saas-systems";

/**
 * SaasSystemFinalCTA Component
 * 
 * Large premium closing panel for the SaaS Systems module.
 * Final conversion moment with hero quote, supporting copy, and CTA.
 * Magnetic scroll target: data-home-section, data-saas-final-panel
 */

export function SaasSystemFinalCTA() {
  return (
    <section
      data-home-section
      data-saas-final-panel
      className="relative w-full overflow-hidden py-20 sm:py-24 lg:py-28"
    >
      {/* Ambient orange glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-glow opacity-12 blur-[140px]"
        aria-hidden="true"
      />

      <Container>
        {/* Large glass panel */}
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/[0.1] bg-[rgba(10,16,32,0.88)] shadow-[0_4px_32px_rgba(0,0,0,0.4),0_0_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          {/* Top shimmer */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Orange glow behind quote */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-glow opacity-25 blur-[100px]"
            aria-hidden="true"
          />
          
          {/* SVG background with subtle node-line system grid */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            {/* Grid lines */}
            <defs>
              <pattern id="ctaGrid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(249,126,26,0.15)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="800" height="600" fill="url(#ctaGrid)" />
            
            {/* Connector lines */}
            <path d="M 100 150 Q 250 200 400 150" stroke="rgba(249,126,26,0.2)" strokeWidth="1.5" fill="none" />
            <path d="M 400 150 Q 550 100 700 150" stroke="rgba(249,126,26,0.2)" strokeWidth="1.5" fill="none" />
            <path d="M 100 450 Q 250 400 400 450" stroke="rgba(56,189,248,0.15)" strokeWidth="1.5" fill="none" />
            <path d="M 400 450 Q 550 500 700 450" stroke="rgba(56,189,248,0.15)" strokeWidth="1.5" fill="none" />
            
            {/* Small nodes */}
            <circle cx="400" cy="150" r="4" fill="rgba(249,126,26,0.4)" />
            <circle cx="100" cy="150" r="3" fill="rgba(249,126,26,0.3)" />
            <circle cx="700" cy="150" r="3" fill="rgba(249,126,26,0.3)" />
            <circle cx="400" cy="450" r="4" fill="rgba(56,189,248,0.3)" />
            <circle cx="100" cy="450" r="3" fill="rgba(56,189,248,0.25)" />
            <circle cx="700" cy="450" r="3" fill="rgba(56,189,248,0.25)" />
          </svg>
          
          {/* Content */}
          <div className="relative z-10 px-6 py-12 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <p className="font-label text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">
              {saasSystemFinalCTA.badge}
            </p>

            <h3 className="mx-auto mt-5 max-w-3xl font-sans text-3xl font-black tracking-tight text-text-main sm:text-4xl lg:text-5xl">
              &ldquo;{saasSystemFinalCTA.quote}&rdquo;
            </h3>
            
            <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-8 text-text-sub sm:text-lg">
              {saasSystemFinalCTA.description}
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {/* Primary CTA */}
              <a
                href={saasSystemFinalCTA.primaryCTA.href}
                className="inline-flex items-center justify-center rounded-radius-default bg-brand-primary px-8 py-4 font-label text-sm font-bold text-white shadow-[0_4px_16px_rgba(249,126,26,0.25)] transition-all duration-300 hover:bg-brand-secondary hover:shadow-[0_6px_24px_rgba(249,126,26,0.35)] hover:-translate-y-[2px] focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary sm:text-base"
              >
                {saasSystemFinalCTA.primaryCTA.label}
              </a>
              
              {/* Secondary CTA */}
              <
a
                href={saasSystemFinalCTA.secondaryCTA.href}
                className="inline-flex items-center justify-center rounded-radius-default border border-white/[0.15] bg-white/[0.04] px-8 py-4 font-label text-sm font-bold text-text-main backdrop-blur-sm transition-all duration-300 hover:border-white/[0.25] hover:bg-white/[0.08] hover:-translate-y-[1px] focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary sm:text-base"
              >
                {saasSystemFinalCTA.secondaryCTA.label}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

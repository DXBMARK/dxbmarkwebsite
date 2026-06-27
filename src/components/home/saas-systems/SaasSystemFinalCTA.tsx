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
      className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      {/* Subtle radial orange glow behind headline */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-glow opacity-8 blur-[100px]"
        aria-hidden="true"
      />

      <Container>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Label */}
          <p className="font-label text-[10px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-brand-primary">
            BUILT AROUND YOUR WORKFLOW
          </p>

          {/* Headline */}
          <h3 className="mx-auto mt-4 max-w-3xl font-sans text-3xl font-black tracking-tight text-text-main sm:text-4xl lg:text-5xl leading-[1.1]">
            From scattered tools to one reliable system.
          </h3>

          {/* Supporting Copy */}
          <p className="mx-auto mt-5 max-w-2xl font-body text-xs sm:text-sm md:text-base leading-relaxed text-text-sub">
            DXBMARK builds the software layer that connects workflows, data, tools, and daily operations into reliable systems your business can actually run.
          </p>

          {/* Mini Flow Visual - Staggered elegant curves */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 my-10 max-w-lg mx-auto">
            {/* Problem */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 font-label text-[10px] sm:text-xs uppercase tracking-widest text-text-sub">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500/60" aria-hidden="true" />
                <span>Problem</span>
              </div>
              <span className="mt-1 font-body text-[9px] text-text-muted-gray">Connect tools</span>
            </div>

            {/* Path 1 */}
            <svg className="hidden md:block w-12 h-3 text-white/10" viewBox="0 0 48 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M 0 6 C 12 0, 36 0, 48 6" stroke="currentColor" strokeWidth="0.8" fill="none" strokeDasharray="3 3" />
            </svg>

            {/* System */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 font-label text-[10px] sm:text-xs uppercase tracking-widest text-brand-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" aria-hidden="true" />
                <span className="font-bold">System</span>
              </div>
              <span className="mt-1 font-body text-[9px] text-text-sub">Automate workflows</span>
            </div>

            {/* Path 2 */}
            <svg className="hidden md:block w-12 h-3 text-white/10" viewBox="0 0 48 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M 0 6 C 12 12, 36 12, 48 6" stroke="currentColor" strokeWidth="0.8" fill="none" strokeDasharray="3 3" />
            </svg>

            {/* Operation */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 font-label text-[10px] sm:text-xs uppercase tracking-widest text-text-sub">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" aria-hidden="true" />
                <span>Operation</span>
              </div>
              <span className="mt-1 font-body text-[9px] text-text-muted-gray">Run operations</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Primary CTA */}
            <a
              href={saasSystemFinalCTA.primaryCTA.href}
              className="inline-flex items-center justify-center rounded-radius-default bg-brand-primary px-8 py-3.5 font-label text-xs sm:text-sm font-bold text-white shadow-[0_4px_16px_rgba(249,126,26,0.2)] transition-all duration-300 hover:bg-brand-secondary hover:shadow-[0_6px_24px_rgba(249,126,26,0.3)] hover:-translate-y-[2px] focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            >
              {saasSystemFinalCTA.primaryCTA.label}
            </a>

            {/* Secondary CTA */}
            <a
              href={saasSystemFinalCTA.secondaryCTA.href}
              className="inline-flex items-center justify-center rounded-radius-default border border-white/[0.12] bg-white/[0.03] px-8 py-3.5 font-label text-xs sm:text-sm font-bold text-text-main backdrop-blur-sm transition-all duration-300 hover:border-white/[0.22] hover:bg-white/[0.06] hover:-translate-y-[1px] focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            >
              {saasSystemFinalCTA.secondaryCTA.label}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

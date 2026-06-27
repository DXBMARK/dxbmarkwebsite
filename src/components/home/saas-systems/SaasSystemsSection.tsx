"use client";

import * as React from "react";
import { HomeSection } from "@/components/home/sections/HomeSection";
import { Container } from "@/components/ui/layout";
import { HeroBadge } from "@/components/home/hero/HeroBadge";
import { saasSystemsContent } from "@/content/home/saas-systems";
import type { SaasSystemId } from "@/content/home/saas-systems";
import { SaasSystemPanel } from "./SaasSystemPanel";
import { SaasSystemVisual } from "./SaasSystemVisual";
import { SaasSystemFeatures } from "./SaasSystemFeatures";
import { SaasSystemFinalCTA } from "./SaasSystemFinalCTA";
import { useSaasSystemsMotion } from "./useSaasSystemsMotion";

export function SaasSystemsSection() {
  const sectionRef = React.useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = React.useState<SaasSystemId>("saas-platforms");

  // GSAP entrance reveal
  useSaasSystemsMotion(sectionRef);

  return (
    <HomeSection
      id="saas-systems"
      ref={sectionRef}
      className="relative overflow-visible bg-transparent"
      aria-labelledby="home-saas-systems-title"
    >
      {/* Ambient orange glow — matched to IntegrationsSection pattern */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-glow opacity-10 blur-[160px]"
        aria-hidden="true"
      />
      {/* Secondary glow — right-side, behind visual panel */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 h-[300px] w-[300px] -translate-y-1/2 translate-x-1/4 rounded-full bg-brand-glow opacity-8 blur-[120px]"
        aria-hidden="true"
      />

      <Container className="relative z-10 flex min-h-[100svh] w-full flex-col justify-start pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-32 lg:pb-20">

        {/* ------------------------------------------------------------------ */}
        {/* Section header — centered badge + headline + description            */}
        {/* ------------------------------------------------------------------ */}
        <div className="mb-6 flex w-full flex-col items-center text-center sm:mb-8 lg:mb-10">
          <div data-saas-reveal className="inline-flex">
            <HeroBadge label={saasSystemsContent.badge} />
          </div>

          <h2
            id="home-saas-systems-title"
            data-saas-reveal
            className="mx-auto mt-3 max-w-4xl font-sans text-4xl font-black tracking-tight text-text-main sm:text-5xl lg:text-[3.4rem] xl:text-[3.6rem] leading-[1.06]"
          >
            {/* Split to apply gradient on last word */}
            Build Your{" "}
            <span className="bg-gradient-to-r from-[#FFE1C2] via-[#F97E1A] to-[#FF8A1F] bg-clip-text pb-1 text-transparent">
              System.
            </span>
          </h2>

          <p
            data-saas-reveal
            className="mx-auto mt-3 max-w-2xl font-body text-xs leading-relaxed text-text-sub sm:text-sm md:text-base"
          >
            {saasSystemsContent.description}
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Two-column layout: left list / right visual                         */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-[0.68fr_1.32fr] xl:grid-cols-[0.62fr_1.38fr] lg:gap-8 xl:gap-12">

          {/* LEFT — Interactive item list */}
          <div data-saas-reveal className="flex flex-col">
            <SaasSystemPanel activeId={activeId} onSelect={setActiveId} />
          </div>

          {/* RIGHT — Dashboard visual panel (desktop only; mobile shown inline in SaasSystemPanel) */}
          <div
            data-saas-visual
            className="hidden lg:block lg:sticky lg:top-[calc(50vh-240px)] h-[480px] xl:h-[520px]"
          >
            <SaasSystemVisual
              activeId={activeId}
              className="h-full w-full"
            />
          </div>

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Feature Showcase — alternating visual + text rows                  */}
        {/* ------------------------------------------------------------------ */}
        <SaasSystemFeatures />

      </Container>

      {/* ------------------------------------------------------------------ */}
      {/* Final Highlight CTA Block — closing conversion moment             */}
      {/* ------------------------------------------------------------------ */}
      <SaasSystemFinalCTA />
    </HomeSection>
  );
}

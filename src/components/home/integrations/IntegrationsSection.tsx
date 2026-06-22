"use client";

import * as React from "react";
import { HomeSection } from "@/components/home/sections/HomeSection";
import { HeroBadge } from "@/components/home/hero/HeroBadge";
import { integrationFeatures } from "@/content/home/integrations";
import { IntegrationFeatureCard } from "./IntegrationFeatureCard";
import { IntegrationFlowMap } from "./IntegrationFlowMap";
import { useIntegrationsMotion } from "./useIntegrationsMotion";

export function IntegrationsSection() {
  const sectionRef = React.useRef<HTMLDivElement | null>(null);

  // Trigger GSAP entrance stagger reveal animations
  useIntegrationsMotion(sectionRef);

  return (
    <HomeSection
      id="integrations"
      className="relative overflow-hidden border-t border-border-soft-val/30 bg-background-slate"
    >
      {/* Background ambient radial glow */}
      <div 
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-brand-glow blur-[150px] opacity-10" 
        aria-hidden="true" 
      />

      <section
        ref={sectionRef}
        className="relative z-10 flex min-h-[100svh] w-full flex-col justify-center px-6 pt-24 pb-10 sm:px-8 lg:px-10"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
          
          {/* Header area */}
          <div className="flex flex-col items-center text-center max-w-3xl mb-8">
            <div data-integrations-reveal className="inline-flex">
              <HeroBadge label="INTEGRATIONS" />
            </div>

            <h2
              id="home-integrations-title"
              data-integrations-reveal
              className="font-sans text-3xl font-black tracking-tight text-text-main sm:text-4xl lg:text-5xl leading-[1.1] mt-3"
            >
              Connected systems.{" "}
              <span className="bg-gradient-to-r from-text-main via-brand-primary to-brand-secondary bg-clip-text text-transparent pb-1">
                Cleaner operations.
              </span>
            </h2>

            <p
              data-integrations-reveal
              className="mt-3 font-body text-xs sm:text-sm leading-relaxed text-text-sub max-w-2xl"
            >
              We connect business tools, data sources, cloud services, and internal systems so information moves reliably across your operations.
            </p>
          </div>

          {/* Three Feature Cards in one row on desktop */}
          <div 
            data-integrations-reveal
            className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-4xl mb-8"
          >
            {integrationFeatures.map((feat) => (
              <IntegrationFeatureCard key={feat.id} item={feat} />
            ))}
          </div>

          {/* Large Integration Flow Map (Fitted height for laptop) */}
          <div 
            data-integrations-visual
            className="relative w-full overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0"
          >
            {/* Horizontal flow container minimum width on small screens to keep layout from wrapping */}
            <div className="min-w-[800px] lg:min-w-0 w-full h-[660px] lg:h-[700px] xl:h-[720px]">
              <IntegrationFlowMap containerRef={sectionRef} />
            </div>
          </div>

          {/* CTA Action Button */}
          <div data-integrations-reveal className="mt-24 flex justify-center w-full">
            <a
              href="/contact"
              className="group inline-flex items-center justify-center px-6 py-3 rounded-radius-default bg-brand-primary text-white font-label font-bold text-xs sm:text-sm transition-all duration-300 hover:bg-brand-secondary hover:shadow-shadow-glow hover:-translate-y-[2px] focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <span>Discuss an integration →</span>
            </a>
          </div>

        </div>
      </section>
    </HomeSection>
  );
}

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
      className="relative overflow-visible bg-transparent"
    >
      {/* Background ambient radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-glow opacity-10 blur-[150px]"
        aria-hidden="true"
      />

      <section
        ref={sectionRef}
        className="relative z-10 flex min-h-[100svh] w-full flex-col justify-center px-6 pt-14 pb-7 sm:px-8 sm:pt-16 sm:pb-8 lg:px-10 lg:pt-9 lg:pb-6"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
          {/* Header area */}
          <div className="mb-4 flex w-full max-w-6xl flex-col items-center text-center">
            <div data-integrations-reveal className="inline-flex">
              <HeroBadge label="INTEGRATIONS" />
            </div>

            <h2
              id="home-integrations-title"
              data-integrations-reveal
              className="mx-auto mt-2.5 max-w-5xl text-center text-4xl font-extrabold leading-[0.98] text-text-main sm:text-5xl lg:text-[3.2rem] xl:text-[3.45rem]"
            >
              Connect your{" "}
              <span className="bg-gradient-to-r from-[#FFE1C2] via-[#F97E1A] to-[#FF8A1F] bg-clip-text pb-1 text-transparent">
                systems.
              </span>
            </h2>

            <p
              data-integrations-reveal
              className="mt-2 max-w-2xl font-body text-xs leading-snug text-text-sub sm:text-sm"
            >
              We connect business tools, data sources, cloud services, and internal systems so information moves reliably across your operations.
            </p>
          </div>

          {/* Three Feature Cards in one row on desktop */}
          <div 
            data-integrations-reveal
            className="mb-6 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {integrationFeatures.map((feat) => (
              <IntegrationFeatureCard key={feat.id} item={feat} />
            ))}
          </div>

          {/* Large Integration Flow Map (Fitted height for laptop) */}
          <div 
            data-integrations-visual
            className="relative w-full overflow-x-auto lg:overflow-x-visible"
          >
            {/* Horizontal flow container minimum width on small screens to keep layout from wrapping */}
            <div className="h-[356px] min-w-[800px] w-full sm:h-[376px] lg:h-[360px] lg:min-w-0 xl:h-[366px]">
              <IntegrationFlowMap containerRef={sectionRef} />
            </div>
          </div>

          {/* CTA Action Button */}
          <div data-integrations-reveal className="mt-2 flex w-full justify-center">
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

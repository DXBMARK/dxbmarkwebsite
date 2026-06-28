"use client";
import * as React from "react";
import { Container } from "../../ui/layout";
import { HeroBadge } from "./HeroBadge";
import { HeroTrustLogos } from "./HeroTrustLogos";
import { HeroScrollCue } from "./HeroScrollCue";
import { useHeroMotion } from "./useHeroMotion";
import { HOME_HERO_CONTENT } from "@/content/home";
import { HomeSection } from "../sections/HomeSection";

export function HeroSection() {
  const containerRef = useHeroMotion();

  return (
    <HomeSection 
      ref={containerRef}
      id="hero"
      className="pt-24 pb-12 text-center"
      contentClassName="justify-between"
      aria-label="DXBMARK Hero"
    >
      <Container className="relative z-10 flex flex-col items-center justify-between flex-1 w-full gap-8 sm:gap-12">
        {/* Top content group: badge, headline, subheadline, CTA buttons */}
        <div className="hero-content-wrapper flex flex-col items-center max-w-4xl mx-auto w-full mt-4 sm:mt-6">
          {/* Animated Badge */}
          <HeroBadge />

          {/* Centered Large Headline */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[4.25rem] font-black tracking-tight leading-[1.05] mt-6 sm:mt-8 max-w-4xl mx-auto">
            <span className="hero-title-line block text-text-main">
              {HOME_HERO_CONTENT.headlineLine1}
            </span>
            <span className="hero-title-line block mt-3 bg-gradient-to-r from-text-main via-brand-primary to-brand-secondary bg-clip-text text-transparent">
              {HOME_HERO_CONTENT.headlineLine2}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="hero-sub-elem font-body text-xs sm:text-sm md:text-base lg:text-lg text-text-sub leading-relaxed max-w-2xl mx-auto mt-6 sm:mt-8">
            {HOME_HERO_CONTENT.subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-elem flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 sm:mt-10 w-full sm:w-auto">
            <a
              href={HOME_HERO_CONTENT.primaryCta.href}
              className="group w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-radius-default bg-brand-primary text-[#0a101d] font-label font-bold text-sm transition-all duration-300 hover:bg-brand-secondary hover:shadow-shadow-glow hover:-translate-y-[2px] focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <span>{HOME_HERO_CONTENT.primaryCta.label}</span>
              <svg className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href={HOME_HERO_CONTENT.secondaryCta.href}
              className="group w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-radius-default border border-border-soft-val bg-white/5 text-text-sub font-label font-bold text-sm transition-all duration-300 hover:bg-brand-primary/5 hover:border-border-strong-val hover:-translate-y-[2px] focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <span>{HOME_HERO_CONTENT.secondaryCta.label}</span>
              <svg className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Lower trust group: trust title and logo strip */}
        <div className="hero-trust-logos-elem w-full mt-auto">
          <HeroTrustLogos logos={HOME_HERO_CONTENT.trustLogos} title={HOME_HERO_CONTENT.trustTitle} />
        </div>

        {/* Bottom cue group: Decorative Bouncing Scroll Indicator */}
        <HeroScrollCue className="relative mt-2 sm:mt-4 lg:mt-6" />
      </Container>
    </HomeSection>
  );
}


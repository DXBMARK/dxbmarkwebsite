'use client';

import * as React from 'react';
import { HomeSection } from '@/components/home/sections/HomeSection';
import { Container } from '@/components/ui/layout';
import { homeServices } from '@/content/home/services';
import { HeroBadge } from '@/components/home/hero/HeroBadge';
import { ServiceCard } from './ServiceCard';
import { useServicesMotion } from './useServicesMotion';

export function ServicesSection() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  
  // Register GSAP ScrollTrigger entry reveal animation
  useServicesMotion(rootRef);

  return (
    <HomeSection
      id="services"
      ref={rootRef}
      className="relative overflow-hidden border-t border-border-soft-val/30"
      aria-labelledby="home-services-title"
    >
      {/* Absolute pointer-events-none background accents */}
      <div 
        className="pointer-events-none absolute left-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-brand-glow blur-[100px] opacity-10" 
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-brand-glow blur-[100px] opacity-10" 
        aria-hidden="true" 
      />

      <Container className="relative z-10 flex min-h-[100svh] w-full flex-col justify-center pt-20 pb-8 sm:pt-24 sm:pb-8 lg:pt-24 lg:pb-8">
        {/* Section Header */}
        <div className="mx-auto mb-5 max-w-3xl text-center sm:mb-6 lg:mb-6">
          <div data-services-reveal className="mb-4 inline-flex">
            <HeroBadge label="WHAT WE DO" />
          </div>

          <h2
            id="home-services-title"
            data-services-reveal
            className="font-sans text-3xl font-black tracking-tight text-text-main sm:text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.1]"
          >
            Explore Our{" "}
            <span className="bg-gradient-to-r from-text-main via-brand-primary to-brand-secondary bg-clip-text text-transparent pb-1">
              Digital Services
            </span>
          </h2>

          <p
            data-services-reveal
            className="mx-auto mt-4 max-w-2xl font-body text-xs sm:text-sm md:text-base leading-relaxed text-text-sub"
          >
            From web applications and business websites to automation, hosting, and technical consulting, we build practical digital systems that help businesses launch, scale, and operate with confidence.
          </p>
        </div>

        {/* 3x2 Grid structure */}
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {homeServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Container>
    </HomeSection>
  );
}

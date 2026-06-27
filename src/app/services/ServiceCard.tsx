'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  AppWindow,
  Globe2,
  PanelsTopLeft,
  Server,
  Workflow,
  Cable,
  Compass,
  LayoutDashboard,
} from 'lucide-react';
import gsap from 'gsap';

const iconMap = {
  AppWindow,
  Globe2,
  PanelsTopLeft,
  Server,
  Workflow,
  Cable,
  Compass,
  LayoutDashboard,
};

type ServiceCardProps = {
  service: {
    id: string;
    title: string;
    description: string;
    tags: readonly string[];
    icon: keyof typeof iconMap;
  };
};

export function ServiceCard({ service }: ServiceCardProps) {
  const cardRef = React.useRef<HTMLAnchorElement | null>(null);
  const iconWrapRef = React.useRef<HTMLDivElement | null>(null);
  const iconRef = React.useRef<HTMLDivElement | null>(null);
  const arrowRef = React.useRef<HTMLSpanElement | null>(null);
  const Icon = iconMap[service.icon] || Globe2;

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const handlePointerEnter = () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.to(cardRef.current, {
      y: -8,
      scale: 1.018,
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(iconWrapRef.current, {
      y: -5,
      scale: 1.12,
      rotate: -3,
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(iconRef.current, {
      rotate: 6,
      scale: 1.08,
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(arrowRef.current, {
      x: 7,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handlePointerLeave = () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(iconWrapRef.current, {
      y: 0,
      scale: 1,
      rotate: 0,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(iconRef.current, {
      rotate: 0,
      scale: 1,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(arrowRef.current, {
      x: 0,
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <Link
      ref={cardRef}
      href={`/contact?service=${service.id}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      data-service-card
      className="group service-card relative isolate flex min-h-[220px] flex-col overflow-hidden rounded-radius-xl border border-border-soft-val bg-white/[0.035] p-5 shadow-shadow-card backdrop-blur-2xl transition-[border-color,background-color,color,opacity,box-shadow] duration-300 hover:border-brand-primary/45 hover:shadow-[0_0_30px_rgba(249,126,26,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60 sm:p-6"
    >
      {/* Dynamic mouse glow overlay */}
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 service-card-glow" />
      
      {/* Light glass reflection gradient */}
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/[0.06] via-transparent to-white/[0.02] opacity-60" />
      
      <div className="relative z-10 flex h-full w-full flex-col text-left">
        {/* Icon block */}
        <div
          ref={iconWrapRef}
          className="mb-4 flex size-11 sm:size-12 items-center justify-center rounded-2xl border border-brand-primary/20 bg-brand-primary/10 text-brand-primary shadow-[0_0_15px_rgba(249,126,26,0.1)]"
        >
          <div ref={iconRef} className="flex items-center justify-center">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-sans text-base sm:text-lg font-extrabold leading-tight tracking-tight text-text-main">
          {service.title}
        </h3>

        {/* Description */}
        <p className="mt-2 font-body text-xs sm:text-sm leading-relaxed text-text-sub flex-1">
          {service.description}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border-soft-val bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted-gray"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA pinned at bottom */}
        <div className="mt-4 flex items-center gap-2 font-sans text-xs sm:text-sm font-bold text-brand-primary transition-colors group-hover:text-brand-secondary">
          <span>Get Started</span>
          <span ref={arrowRef} className="inline-flex">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

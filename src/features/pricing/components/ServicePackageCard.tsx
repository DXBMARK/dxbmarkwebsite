"use client";

import * as React from "react";
import { PackageCopy } from "../types";
import { Check, Compass } from "lucide-react";
import gsap from "gsap";

interface ServicePackageCardProps {
  pkg: PackageCopy;
  onOpenModal: (pkg: PackageCopy, triggerRef: React.RefObject<HTMLButtonElement | null>) => void;
}

export function ServicePackageCard({ pkg, onOpenModal }: ServicePackageCardProps) {
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const isFeatured = pkg.id === "business-presence";

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
  };

  return (
    <div
      ref={cardRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`group service-card relative isolate flex flex-col h-full overflow-hidden rounded-radius-xl border p-5 shadow-shadow-card backdrop-blur-2xl transition-[border-color,background-color,color,opacity,box-shadow] duration-300 ${
        isFeatured
          ? "border-brand-primary bg-white/[0.04] shadow-[0_0_30px_rgba(249,126,26,0.15)] ring-1 ring-brand-primary/30"
          : "border-border-soft-val bg-white/[0.035] hover:border-brand-primary/45 hover:shadow-[0_0_30px_rgba(249,126,26,0.12)]"
      }`}
    >
      {/* Light glass reflection gradient */}
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/[0.06] via-transparent to-white/[0.02] opacity-60" />

      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-0 right-0 bg-brand-primary text-slate-950 text-[9px] font-extrabold px-3 py-1 uppercase tracking-widest rounded-bl-lg z-20">
          Most Credible
        </div>
      )}

      {/* Card Content Wrapper */}
      <div className="relative z-10 flex flex-col h-full text-left">
        {/* Tier Name */}
        <div className="mb-2">
          <h3 className="font-sans text-lg sm:text-xl font-extrabold leading-tight tracking-tight text-text-main">
            {pkg.name}
          </h3>
        </div>

        {/* Short Outcome-focused Description */}
        <p className="text-xs text-brand-primary font-bold mb-1">
          {pkg.outcome}
        </p>

        {/* Best fit customer line */}
        <p className="text-[10px] text-text-muted-gray italic mb-4 leading-normal">
          {pkg.bestFit}
        </p>

        {/* Pricing Placeholder */}
        <div className="mb-4 bg-white/[0.02] p-3 rounded-xl border border-border-soft-val/30">
          <span className="text-[10px] text-[#62C4E1] font-extrabold tracking-wider uppercase block leading-normal">
            Pricing will be shown after configuration
          </span>
        </div>

        {/* Key Benefits Showcase */}
        <div className="space-y-2.5 mb-6 flex-1">
          {pkg.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-text-sub">
              <Check className="h-4 w-4 text-[#62C4E1] shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Scope Delivery Cue / Metadata */}
        <div className="mb-4 flex items-center gap-2 text-[10px] font-bold text-text-muted-gray uppercase tracking-widest border-t border-border-soft-val/20 pt-3">
          <Compass className="w-3.5 h-3.5 text-brand-primary" />
          <span>{pkg.scope.length} key deliverables included</span>
        </div>

        {/* Action Button */}
        <button
          ref={triggerRef}
          onClick={() => onOpenModal(pkg, triggerRef)}
          className={`w-full py-3 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
            isFeatured
              ? "bg-brand-primary text-slate-950 hover:bg-brand-primary/90 hover:shadow-[0_0_15px_rgba(249,126,26,0.3)]"
              : "border border-border-soft-val text-text-main hover:bg-white/[0.04] hover:border-slate-650"
          }`}
        >
          Configure & View Details
        </button>
      </div>
    </div>
  );
}

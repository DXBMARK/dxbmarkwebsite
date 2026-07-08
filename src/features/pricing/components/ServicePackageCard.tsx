"use client";

import * as React from "react";
import { PackageCopy } from "../types";
import { Check } from "lucide-react";
import gsap from "gsap";

interface ServicePackageCardProps {
  pkg: PackageCopy;
  onOpenModal: (pkg: PackageCopy, triggerRef: React.RefObject<HTMLButtonElement | null>) => void;
}

export function ServicePackageCard({ pkg, onOpenModal }: ServicePackageCardProps) {
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const isFeatured = pkg.id === "business-presence";

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
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
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`group service-card relative isolate flex flex-col h-full overflow-hidden rounded-radius-xl border p-5 shadow-shadow-card backdrop-blur-2xl transition-[border-color,background-color,color,opacity,box-shadow] duration-300 ${
        isFeatured
          ? "border-brand-primary bg-white/[0.04] shadow-[0_0_30px_rgba(249,126,26,0.15)] ring-1 ring-brand-primary/30"
          : "border-border-soft-val bg-white/[0.035] hover:border-brand-primary/45 hover:shadow-[0_0_30px_rgba(249,126,26,0.12)]"
      }`}
    >
      {/* Dynamic mouse glow overlay */}
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 service-card-glow" />

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
        <div className="mb-4">
          <h3 className="font-sans text-lg sm:text-xl font-extrabold leading-tight tracking-tight text-text-main">
            {pkg.name}
          </h3>
        </div>

        {/* Pricing Placeholder */}
        <div className="mb-5 bg-white/[0.02] p-3 rounded-xl border border-border-soft-val/30">
          <span className="text-[10px] text-brand-primary font-extrabold tracking-wider uppercase block leading-normal">
            Pricing will be shown after configuration
          </span>
        </div>

        {/* Short Scope Preview */}
        <div className="space-y-3 mb-6 flex-1">
          <p className="text-[10px] font-semibold text-text-muted-gray uppercase tracking-widest border-b border-border-soft-val/30 pb-2">
            Scope Highlights
          </p>
          <ul className="space-y-2.5">
            {pkg.scope.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-text-sub">
                <Check className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                <span className="truncate">{item}</span>
              </li>
            ))}
            {pkg.scope.length > 3 && (
              <li className="text-[10px] text-text-muted-gray italic pl-6">
                + {pkg.scope.length - 3} more items included
              </li>
            )}
          </ul>
        </div>

        {/* Action Button */}
        <button
          ref={triggerRef}
          onClick={() => onOpenModal(pkg, triggerRef)}
          className={`w-full py-3 rounded-lg text-xs font-extrabold tracking-wider uppercase transition-all duration-300 ${
            isFeatured
              ? "bg-brand-primary text-slate-950 hover:bg-brand-primary/90 hover:shadow-[0_0_15px_rgba(249,126,26,0.3)]"
              : "border border-border-soft-val text-text-main hover:bg-white/[0.04] hover:border-slate-650"
          }`}
        >
          View Package
        </button>
      </div>
    </div>
  );
}

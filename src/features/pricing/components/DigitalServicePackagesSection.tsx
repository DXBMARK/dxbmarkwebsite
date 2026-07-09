"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HomeSection } from "@/components/home/sections/HomeSection";
import { Container } from "@/components/ui/layout";
import { HeroBadge } from "@/components/home/hero/HeroBadge";
import { PACKAGES_COPY } from "../data/package-copy";
import { PackageCopy } from "../types";
import { ServicePackageCard } from "./ServicePackageCard";
import { PackageDetailModal } from "./PackageDetailModal";
import { ArrowRight, ShieldCheck, HelpCircle, Layers, Globe } from "lucide-react";

export function DigitalServicePackagesSection() {
  const [selectedPkg, setSelectedPkg] = React.useState<PackageCopy | null>(null);
  const activeTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleOpenModal = (
    pkg: PackageCopy,
    triggerRef: React.RefObject<HTMLButtonElement | null>
  ) => {
    activeTriggerRef.current = triggerRef.current;
    setSelectedPkg(pkg);
  };

  const handleCloseModal = () => {
    setSelectedPkg(null);
  };

  return (
    <HomeSection
      id="digital-packages"
      className="relative overflow-visible bg-transparent border-t border-border-soft-val/30"
      aria-labelledby="home-packages-title"
    >
      {/* Ambient orange glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-glow opacity-10 blur-[160px]"
        aria-hidden="true"
      />

      <Container className="relative z-10 flex min-h-[100svh] w-full flex-col justify-start pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-32 lg:pb-20">
        
        {/* Section Header */}
        <motion.div
          className="mb-8 flex w-full flex-col items-center text-center sm:mb-10 lg:mb-12"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex">
            <HeroBadge label="DIGITAL SERVICE PACKAGES" />
          </div>

          <h2
            id="home-packages-title"
            className="mx-auto mt-3 max-w-4xl font-display text-3xl font-black tracking-tight text-text-main sm:text-4xl lg:text-5xl"
          >
            Choose your package and{" "}
            <span className="bg-gradient-to-r from-[#FFE1C2] via-[#F97E1A] to-[#FF8A1F] bg-clip-text pb-1 text-transparent">
              move faster.
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl font-body text-xs leading-relaxed text-text-sub sm:text-sm md:text-base">
            Website and setup packages built for faster launch, stronger credibility, and a cleaner path to growth.
          </p>
        </motion.div>

        {/* Packages Grid */}
        <motion.div 
          className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          {PACKAGES_COPY.map((pkg) => (
            <ServicePackageCard
              key={pkg.id}
              pkg={pkg}
              onOpenModal={handleOpenModal}
            />
          ))}
        </motion.div>

        {/* Trust Row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mx-auto mt-10 p-4 rounded-xl border border-border-soft-val bg-white/[0.01] text-left"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex items-start gap-2.5">
            <Layers className="h-4.5 w-4.5 text-[#62C4E1] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-text-main">Clear Scope</p>
              <p className="text-[10px] text-text-sub">No unexpected boundaries</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-4.5 w-4.5 text-brand-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-text-main">Secure Checkout</p>
              <p className="text-[10px] text-text-sub">Stripe-hosted checkout</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Globe className="h-4.5 w-4.5 text-[#62C4E1] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-text-main">Stripe-managed pricing</p>
              <p className="text-[10px] text-text-sub">No website-side conversion</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <HelpCircle className="h-4.5 w-4.5 text-brand-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-text-main">DXBMARK Support</p>
              <p className="text-[10px] text-text-sub">Dedicated deployment help</p>
            </div>
          </div>
        </motion.div>

        {/* Section Footer / Custom Consultation CTA */}
        <motion.div 
          className="text-center mt-12 max-w-xl mx-auto p-5 rounded-xl border border-border-soft-val bg-white/[0.02] backdrop-blur-md"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-xs text-text-sub leading-relaxed mb-3">
            Need something more advanced? Custom web apps, portals, and automation systems are handled through a separate project proposal.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 text-xs font-bold text-brand-primary hover:text-brand-secondary transition-all uppercase tracking-wider group"
          >
            <span>Request Custom Proposal</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </Container>

      {/* Package Detail Modal Overlay */}
      {selectedPkg && (
        <PackageDetailModal
          pkg={selectedPkg}
          onClose={handleCloseModal}
          triggerButtonRef={activeTriggerRef}
        />
      )}
    </HomeSection>
  );
}

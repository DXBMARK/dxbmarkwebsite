"use client";

import * as React from "react";
import { PACKAGES_COPY } from "../data/package-copy";
import { PackageCopy } from "../types";
import { ServicePackageCard } from "./ServicePackageCard";
import { PackageDetailModal } from "./PackageDetailModal";
import { ArrowRight } from "lucide-react";

export function DigitalServicePackagesSection() {
  const [selectedPkg, setSelectedPkg] = React.useState<PackageCopy | null>(null);
  const activeTriggerRef = React.useRef<HTMLButtonElement | null>(null);

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
    <section 
      id="digital-packages"
      className="relative w-full py-20 px-4 md:px-8 border-t border-slate-900 bg-gradient-to-b from-slate-950 via-[#0A1F46]/10 to-slate-950 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 text-[10px] font-extrabold tracking-widest text-[#F97E1A] bg-[#F97E1A]/10 border border-[#F97E1A]/20 rounded-full uppercase mb-4">
            DIGITAL SERVICE PACKAGES
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-100 font-display leading-tight">
            Choose a clear digital package and move faster.
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-4 leading-relaxed">
            Website and setup packages for businesses that want to launch faster, look more credible, and move online without the usual development headaches.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PACKAGES_COPY.map((pkg) => (
            <ServicePackageCard
              key={pkg.id}
              pkg={pkg}
              onOpenModal={handleOpenModal}
            />
          ))}
        </div>

        {/* Section Footer / Custom Consultation CTA */}
        <div className="text-center mt-16 max-w-xl mx-auto p-6 rounded-xl border border-slate-900 bg-slate-950/40">
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Need something more advanced? Custom web apps, portals, and automation systems are handled through a separate project proposal.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 text-xs font-extrabold text-[#F97E1A] hover:text-[#F97E1A]/90 transition-all uppercase tracking-wider group"
          >
            <span>Request Custom Proposal</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* Package Detail Modal Overlay */}
      {selectedPkg && (
        <PackageDetailModal
          pkg={selectedPkg}
          onClose={handleCloseModal}
          triggerButtonRef={activeTriggerRef}
        />
      )}
    </section>
  );
}

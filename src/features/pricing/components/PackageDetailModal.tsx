"use client";

import * as React from "react";
import { PackageCopy } from "../types";
import { PackageAddonsSelector } from "./PackageAddonsSelector";
import { ADDONS_COPY } from "../data/package-copy";
import { getAddonRulesForPackage } from "../data/package-rules";
import { X, Check, AlertCircle, Info, Bookmark, PackageOpen } from "lucide-react";

interface PackageDetailModalProps {
  pkg: PackageCopy;
  onClose: () => void;
  triggerButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export function PackageDetailModal({ pkg, onClose, triggerButtonRef }: PackageDetailModalProps) {
  const [selectedAddonIds, setSelectedAddonIds] = React.useState<string[]>([]);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Close on escape key and manage scroll locking
  React.useEffect(() => {
    const currentTrigger = triggerButtonRef.current;
    
    // Lock body scroll to avoid double scrollbars behind modal
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    
    // Focus close button on mount
    closeButtonRef.current?.focus();

    // Trap focus inside modal
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const trapFocus = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };
      window.addEventListener("keydown", trapFocus);
      return () => {
        window.removeEventListener("keydown", trapFocus);
        window.removeEventListener("keydown", handleKeyDown);
        // Restore body scroll
        document.body.style.overflow = originalOverflow;
        // Restore focus to trigger button on unmount
        currentTrigger?.focus();
      };
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      currentTrigger?.focus();
    };
  }, [onClose, triggerButtonRef]);

  // Load and group addon rules dynamically at component level
  const addonRules = React.useMemo(() => {
    return getAddonRulesForPackage(pkg.id);
  }, [pkg.id]);

  const groupedRules = React.useMemo(() => {
    const included: typeof addonRules = [];
    const required: typeof addonRules = [];
    const optional: typeof addonRules = [];

    addonRules.forEach((rule) => {
      if (rule.requirement === "included") included.push(rule);
      else if (rule.requirement === "required") required.push(rule);
      else if (rule.requirement === "optional") optional.push(rule);
    });

    return { included, required, optional };
  }, [addonRules]);

  // Separate first year included rules from standard included rules for Commerce setup
  const commerceFirstYearRules = React.useMemo(() => {
    return groupedRules.included.filter((rule) => rule.coveragePeriod === "first_year");
  }, [groupedRules.included]);

  const standardIncludedRules = React.useMemo(() => {
    if (pkg.id === "commerce-starter-setup") {
      return groupedRules.included.filter((rule) => rule.coveragePeriod !== "first_year");
    }
    return groupedRules.included;
  }, [pkg.id, groupedRules.included]);

  const getAddonName = (addonId: string) => {
    const addon = ADDONS_COPY.find((a) => a.id === addonId);
    return addon ? addon.name : addonId;
  };

  const selectedOptionals = React.useMemo(() => {
    return ADDONS_COPY.filter((addon) => selectedAddonIds.includes(addon.id));
  }, [selectedAddonIds]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 md:p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Box */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-7xl max-h-[86vh] overflow-hidden rounded-xl border border-slate-800 bg-[#0A1F46]/95 shadow-2xl transition-all duration-300 flex flex-col z-10 text-left"
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-colors z-30"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Modal Header (Fixed/No-Scroll, Compact padding) */}
        <div className="flex-shrink-0 py-3 px-5 md:py-3.5 md:px-6 border-b border-slate-800/85 bg-[#091a3b]/40 pr-12">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[9px] font-extrabold tracking-widest text-brand-primary uppercase">
              Package Configuration
            </span>
            <span className="text-[9px] text-[#62C4E1] font-bold uppercase tracking-wider bg-[#62C4E1]/10 px-2 py-0.5 rounded border border-[#62C4E1]/20">
              Pricing will be shown after configuration
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 mt-1">
            <h3 id="modal-title" className="text-lg md:text-xl font-black text-text-main font-display leading-tight">
              {pkg.name}
            </h3>
            <p className="text-brand-primary text-xs font-semibold sm:border-l sm:border-slate-800 sm:pl-3">
              {pkg.outcome}
            </p>
          </div>
          <p className="text-text-sub text-[10px] sm:text-xs mt-1 italic flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span>{pkg.bestFit}</span>
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 scrollbar-thin">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.25fr_0.9fr] gap-5 items-start">
            
            {/* Zone A: Overview Column */}
            <div className="space-y-4">
              {/* Scope (What's Included) */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#62C4E1]">
                  What&apos;s Included
                </h4>
                <ul className="space-y-1.5">
                  {pkg.scope.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-text-sub">
                      <Check className="h-4 w-4 text-[#62C4E1] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                  {/* Dynamically render standard rule-included addons */}
                  {standardIncludedRules.map((rule) => (
                    <li key={rule.addonId} className="flex items-start gap-2 text-xs text-text-sub">
                      <Check className="h-4 w-4 text-[#62C4E1] shrink-0 mt-0.5" />
                      <span>
                        {getAddonName(rule.addonId)}
                        {rule.note ? ` (${rule.note})` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Compact First-Year Included Card for Commerce */}
              {pkg.id === "commerce-starter-setup" && commerceFirstYearRules.length > 0 && (
                <div className="space-y-1.5 p-3 rounded-xl border border-slate-800 bg-[#091a3b]/40">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#62C4E1]">
                    First-Year Included
                  </h4>
                  <ul className="space-y-1">
                    {commerceFirstYearRules.map((rule) => (
                      <li key={rule.addonId} className="text-xs text-text-sub flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-[#62C4E1] shrink-0 mt-0.5" />
                        <span>{getAddonName(rule.addonId)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Display Required Setup Items */}
              {groupedRules.required.length > 0 && (
                <div className="space-y-1.5 p-3 rounded-xl border border-amber-900/30 bg-amber-950/10">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 shrink-0" />
                    Required Setup
                  </h4>
                  <ul className="space-y-1">
                    {groupedRules.required.map((rule) => (
                      <li key={rule.addonId} className="text-xs text-text-sub flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0 mt-1.5" />
                        <span>
                          {getAddonName(rule.addonId)}
                          {rule.note ? ` — ${rule.note}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exclusions */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-text-muted-gray">
                  Important Exclusions
                </h4>
                <ul className="space-y-1">
                  {pkg.exclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-text-muted-gray">
                      <span className="text-slate-650 font-bold shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* WP hosting renewal policy notes */}
              {pkg.id === "commerce-starter-setup" && (
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/30">
                  <p className="text-[9px] font-bold text-brand-primary uppercase tracking-widest mb-0.5">
                    Domain & Hosting Renewals
                  </p>
                  <p className="text-xs text-text-sub leading-normal">
                    Domain and hosting connection are included for the first year only. Renewal is handled separately.
                  </p>
                </div>
              )}
            </div>

            {/* Zone B: Optional Upgrades Column */}
            <div className="border-t lg:border-t-0 lg:border-x border-slate-800/50 pt-4 lg:pt-0 lg:px-5">
              <PackageAddonsSelector
                pkg={pkg}
                selectedAddonIds={selectedAddonIds}
                onChange={setSelectedAddonIds}
              />
            </div>

            {/* Zone C: Selection Summary (Sticky Sidebar, Consolidated UI) */}
            <div className="lg:sticky lg:top-0 space-y-3.5">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted-gray">
                  <PackageOpen className="w-4 h-4 text-brand-primary" />
                  <span>Selection Summary</span>
                </div>

                <div className="space-y-2 text-xs border-y border-slate-800/40 py-2.5">
                  <div className="flex justify-between items-center text-text-main font-bold">
                    <span>{pkg.name}</span>
                    <span className="text-[8px] text-[#62C4E1] font-bold uppercase bg-[#62C4E1]/10 px-1.5 py-0.5 rounded border border-[#62C4E1]/20">Configured</span>
                  </div>

                  {/* Included items */}
                  {standardIncludedRules.map((rule) => (
                    <div key={rule.addonId} className="flex justify-between items-center text-text-sub pl-2 border-l border-slate-800">
                      <span>{getAddonName(rule.addonId)}</span>
                      <span className="text-[8px] text-slate-500 uppercase font-bold">Included</span>
                    </div>
                  ))}

                  {/* Required items */}
                  {groupedRules.required.map((rule) => (
                    <div key={rule.addonId} className="flex justify-between items-center text-text-sub pl-2 border-l border-slate-800">
                      <span>{getAddonName(rule.addonId)}</span>
                      <span className="text-[8px] text-amber-500 uppercase font-bold">Required</span>
                    </div>
                  ))}

                  {/* Commerce First-Year Included */}
                  {pkg.id === "commerce-starter-setup" && commerceFirstYearRules.length > 0 && (
                    <div className="space-y-1 pt-1.5 border-t border-slate-800/20">
                      <p className="text-[9px] font-bold text-[#62C4E1] uppercase tracking-wider">First-Year Included</p>
                      {commerceFirstYearRules.map((rule) => (
                        <div key={rule.addonId} className="flex justify-between items-center text-text-sub pl-2 border-l border-[#62C4E1]/40">
                          <span>{getAddonName(rule.addonId)}</span>
                          <span className="text-[7px] text-[#62C4E1] uppercase font-bold">1st Year / Renewal Sep.</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Selected optional items */}
                  {selectedOptionals.map((addon) => (
                    <div key={addon.id} className="flex justify-between items-center text-text-main pl-2 border-l border-brand-primary/45 font-medium">
                      <span>{addon.name}</span>
                      <span className="text-[8px] text-brand-primary font-bold uppercase">Upgrade</span>
                    </div>
                  ))}

                  {selectedAddonIds.length > 0 && (
                    <div className="text-[10px] text-brand-primary font-bold pt-1 flex justify-between items-center">
                      <span>Selected Upgrades:</span>
                      <span className="bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded text-xs">
                        {selectedAddonIds.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Combined Note & Warning */}
                <div className="space-y-2 text-[10px] text-text-sub leading-normal">
                  <p className="italic">
                    Final pricing will be confirmed through secure Stripe Checkout after configuration.
                  </p>
                  <div className="flex items-start gap-1.5 text-[9px] bg-slate-950/40 p-2.5 rounded-lg border border-slate-900 leading-normal">
                    <AlertCircle className="h-3.5 w-3.5 text-[#F97E1A] shrink-0 mt-0.5" />
                    <span>
                      By continuing, you confirm that you reviewed the package scope, exclusions, and DXBMARK’s Terms.
                    </span>
                  </div>
                </div>

                {/* Pinned CTAs */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <div className="relative group w-full">
                    <button
                      disabled
                      className="w-full px-4 py-2 text-xs font-extrabold tracking-wider uppercase text-slate-350 bg-[#F97E1A]/20 border border-[#F97E1A]/30 rounded-lg cursor-not-allowed transition-all"
                    >
                      Continue to Checkout
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 text-[10px] rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                      Secure checkout will be enabled after Stripe configuration.
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full px-4 py-1.5 text-xs font-bold rounded-lg border border-slate-800 hover:bg-slate-900 text-text-main transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

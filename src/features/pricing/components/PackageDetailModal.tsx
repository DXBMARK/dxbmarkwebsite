"use client";

import * as React from "react";
import { PackageCopy } from "../types";
import { PackageAddonsSelector } from "./PackageAddonsSelector";
import { ADDONS_COPY } from "../data/package-copy";
import { getAddonRulesForPackage } from "../data/package-rules";
import { X, Check, AlertCircle, Info } from "lucide-react";

interface PackageDetailModalProps {
  pkg: PackageCopy;
  onClose: () => void;
  triggerButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export function PackageDetailModal({ pkg, onClose, triggerButtonRef }: PackageDetailModalProps) {
  const [selectedAddonIds, setSelectedAddonIds] = React.useState<string[]>([]);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Close on escape key
  React.useEffect(() => {
    const currentTrigger = triggerButtonRef.current;
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
        // Restore focus to trigger button on unmount
        currentTrigger?.focus();
      };
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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

  const getAddonName = (addonId: string) => {
    const addon = ADDONS_COPY.find((a) => a.id === addonId);
    return addon ? addon.name : addonId;
  };

  const selectedOptionals = React.useMemo(() => {
    return ADDONS_COPY.filter((addon) => selectedAddonIds.includes(addon.id));
  }, [selectedAddonIds]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Box */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-[#0A1F46]/95 p-6 md:p-8 shadow-2xl transition-all duration-300 flex flex-col z-10"
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-xs font-semibold tracking-widest text-[#F97E1A] uppercase">
            Package Details
          </span>
          <h3 id="modal-title" className="text-2xl md:text-3xl font-extrabold text-slate-100 font-display mt-1">
            {pkg.name}
          </h3>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            {pkg.description}
          </p>

          {/* Pricing Placeholder */}
          <div className="mt-4 bg-slate-950/60 p-3 rounded-lg border border-slate-900 inline-block">
            <span className="text-xs text-[#62C4E1] font-bold uppercase tracking-wider">
              Pricing will be shown after configuration
            </span>
          </div>
        </div>

        {/* Modal Body Scroll Container */}
        <div className="space-y-6 overflow-y-auto pr-1 flex-1">
          {/* Scope and Exclusions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scope (Included) */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#62C4E1]">
                Included in this Package
              </h4>
              <ul className="space-y-2">
                {pkg.scope.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Check className="h-4.5 w-4.5 text-[#62C4E1] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
                {/* Dynamically render rule-included addons */}
                {groupedRules.included.map((rule) => (
                  <li key={rule.addonId} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Check className="h-4.5 w-4.5 text-[#62C4E1] shrink-0 mt-0.5" />
                    <span>
                      {getAddonName(rule.addonId)}
                      {rule.note ? ` (${rule.note})` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Important Exclusions
              </h4>
              <ul className="space-y-2">
                {pkg.exclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="text-slate-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Display Required Setup Items */}
          {groupedRules.required.length > 0 && (
            <div className="space-y-3 p-4 rounded-xl border border-amber-900/20 bg-amber-950/5">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Info className="h-4.5 w-4.5 shrink-0" />
                Required Setup Items
              </h4>
              <ul className="space-y-1.5 pl-1">
                {groupedRules.required.map((rule) => (
                  <li key={rule.addonId} className="text-xs text-slate-350 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                    <span>
                      {getAddonName(rule.addonId)}
                      {rule.note ? ` (${rule.note})` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add-ons Selector (optional only) */}
          <PackageAddonsSelector
            pkg={pkg}
            selectedAddonIds={selectedAddonIds}
            onChange={setSelectedAddonIds}
          />

          {/* Selection Summary (No Numeric Calculations) */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Selection Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <span>{pkg.name} (Base Package)</span>
                <span className="text-[10px] text-[#62C4E1] font-bold uppercase">Pricing will be shown after configuration</span>
              </div>
              
              {/* Included items */}
              {groupedRules.included.map((rule) => (
                <div key={rule.addonId} className="flex justify-between items-center text-slate-400 pl-3 border-l border-slate-800">
                  <span>{getAddonName(rule.addonId)}</span>
                  <span className="text-[9px] text-slate-500 uppercase font-bold">Included</span>
                </div>
              ))}

              {/* Required items */}
              {groupedRules.required.map((rule) => (
                <div key={rule.addonId} className="flex justify-between items-center text-slate-400 pl-3 border-l border-slate-800">
                  <span>{getAddonName(rule.addonId)}</span>
                  <span className="text-[9px] text-amber-500 uppercase font-bold">Required</span>
                </div>
              ))}

              {/* Selected optional items */}
              {selectedOptionals.map((addon) => (
                <div key={addon.id} className="flex justify-between items-center text-slate-300 pl-3 border-l border-[#F97E1A]/40">
                  <span>{addon.name}</span>
                  <span className="text-[10px] text-[#62C4E1] font-bold uppercase">Pricing will be shown after configuration</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer (Legal Acknowledgement and CTA) */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-4">
          <div className="flex items-start gap-2.5 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-slate-900">
            <AlertCircle className="h-4 w-4 text-[#F97E1A] shrink-0 mt-0.5" />
            <p>
              By continuing, you confirm that you reviewed the package scope, exclusions, third-party fees, and DXBMARK’s Terms and Refund Policy.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end items-stretch sm:items-center">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <div className="relative group">
              <button
                disabled
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-slate-350 bg-[#F97E1A]/20 border border-[#F97E1A]/30 rounded-lg cursor-not-allowed transition-all"
              >
                Continue to Secure Checkout
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Secure checkout will be enabled after Stripe configuration.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

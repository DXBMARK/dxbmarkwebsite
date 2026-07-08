"use client";

import * as React from "react";
import { PackageCopy } from "../types";
import { Check } from "lucide-react";

interface ServicePackageCardProps {
  pkg: PackageCopy;
  onOpenModal: (pkg: PackageCopy, triggerRef: React.RefObject<HTMLButtonElement | null>) => void;
}

export function ServicePackageCard({ pkg, onOpenModal }: ServicePackageCardProps) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const isFeatured = pkg.id === "business-presence";

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 flex flex-col h-full overflow-hidden ${
        isFeatured
          ? "border-[#F97E1A] bg-[#0A1F46]/80 shadow-[0_0_30px_rgba(249,126,26,0.15)] ring-1 ring-[#F97E1A]"
          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
      }`}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-0 right-0 bg-[#F97E1A] text-slate-950 text-[10px] font-extrabold px-3 py-1 uppercase tracking-widest rounded-bl-lg">
          Most Credible
        </div>
      )}

      {/* Card Padding */}
      <div className="p-6 flex flex-col h-full">
        {/* Tier Name */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-100 font-display">
            {pkg.name}
          </h3>
        </div>

        {/* Pricing Placeholder */}
        <div className="mb-5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
          <span className="text-xs text-[#62C4E1] font-semibold tracking-wide uppercase">
            Pricing will be shown after configuration
          </span>
        </div>

        {/* Short Scope Preview */}
        <div className="space-y-3 mb-8 flex-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">
            Scope Highlights
          </p>
          <ul className="space-y-2.5">
            {pkg.scope.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <Check className="h-4 w-4 text-[#62C4E1] shrink-0 mt-0.5" />
                <span className="truncate">{item}</span>
              </li>
            ))}
            {pkg.scope.length > 3 && (
              <li className="text-[11px] text-slate-500 italic pl-6">
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
              ? "bg-[#F97E1A] text-slate-950 hover:bg-[#F97E1A]/90 hover:shadow-[0_0_15px_rgba(249,126,26,0.3)]"
              : "border border-slate-700 text-slate-200 hover:border-slate-600 hover:bg-slate-800/40"
          }`}
        >
          View Package
        </button>
      </div>
    </div>
  );
}

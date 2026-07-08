"use client";

import * as React from "react";
import { ADDONS_COPY } from "../data/package-copy";
import { getAddonRulesForPackage } from "../data/package-rules";
import { PackageCopy } from "../types";

interface PackageAddonsSelectorProps {
  pkg: PackageCopy;
  selectedAddonIds: string[];
  onChange: (addonIds: string[]) => void;
}

export function PackageAddonsSelector({
  pkg,
  selectedAddonIds,
  onChange,
}: PackageAddonsSelectorProps) {
  // Only optional add-ons should be selectable checkbox list
  const optionalAddons = React.useMemo(() => {
    const rules = getAddonRulesForPackage(pkg.id);
    return rules
      .filter((rule) => rule.requirement === "optional")
      .map((rule) => {
        const addon = ADDONS_COPY.find((a) => a.id === rule.addonId);
        if (!addon) return null;
        return {
          ...addon,
          rule,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [pkg.id]);

  const handleToggle = (addonId: string) => {
    if (selectedAddonIds.includes(addonId)) {
      onChange(selectedAddonIds.filter((id) => id !== addonId));
    } else {
      onChange([...selectedAddonIds, addonId]);
    }
  };

  if (optionalAddons.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F97E1A]">
        Optional Add-ons Available
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {optionalAddons.map(({ id, name }) => {
          const isChecked = selectedAddonIds.includes(id);

          return (
            <label
              key={id}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                isChecked
                  ? "border-[#F97E1A]/40 bg-[#0A1F46]/60 shadow-[0_0_15px_rgba(249,126,26,0.1)]"
                  : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(id)}
                className="mt-1 h-4 w-4 rounded accent-[#F97E1A]"
              />
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-slate-200 select-none">
                  {name}
                </span>
                <span className="block text-[10px] text-[#62C4E1] font-semibold uppercase tracking-wider mt-1">
                  Pricing will be shown after configuration
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

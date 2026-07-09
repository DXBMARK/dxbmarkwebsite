"use client";

import * as React from "react";
import { ADDONS_COPY } from "../data/package-copy";
import { getAddonRulesForPackage } from "../data/package-rules";
import { PackageCopy, AddonCategory } from "../types";

interface PackageAddonsSelectorProps {
  pkg: PackageCopy;
  selectedAddonIds: string[];
  onChange: (addonIds: string[]) => void;
}

function getCategoryLabel(category: AddonCategory): string {
  switch (category) {
    case "google":
      return "Google";
    case "search":
      return "Search";
    case "website_setup":
      return "Website Setup";
    case "contact_tools":
      return "Contact Tools";
    case "content":
      return "Content";
    case "extra_services":
      return "Extra Services";
    case "commerce":
      return "Commerce";
  }
}

export function PackageAddonsSelector({
  pkg,
  selectedAddonIds,
  onChange,
}: PackageAddonsSelectorProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<AddonCategory | null>(null);

  // Load rules and group optional items by category
  const groupedOptionalAddons = React.useMemo(() => {
    const rules = getAddonRulesForPackage(pkg.id);
    const optionalItems = rules
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

    const groups = new Map<AddonCategory, typeof optionalItems>();
    optionalItems.forEach((item) => {
      const cat = item.category;
      const list = groups.get(cat) || [];
      list.push(item);
      groups.set(cat, list);
    });

    return groups;
  }, [pkg.id]);

  const categories = React.useMemo(() => {
    return Array.from(groupedOptionalAddons.keys());
  }, [groupedOptionalAddons]);

  // Derived state: fallback to first category if selectedCategory is invalid/unset
  const activeCategory = React.useMemo(() => {
    if (selectedCategory && categories.includes(selectedCategory)) {
      return selectedCategory;
    }
    return categories[0] || null;
  }, [selectedCategory, categories]);

  const handleToggle = (addonId: string) => {
    if (selectedAddonIds.includes(addonId)) {
      onChange(selectedAddonIds.filter((id) => id !== addonId));
    } else {
      onChange([...selectedAddonIds, addonId]);
    }
  };

  if (categories.length === 0 || !activeCategory) {
    return null;
  }

  const activeItems = groupedOptionalAddons.get(activeCategory) || [];

  return (
    <div className="space-y-3.5">
      {/* Category header with unified placeholder note */}
      <div className="border-b border-slate-800/80 pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5">
        <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#62C4E1]">
          Optional Upgrades
        </h4>
        <span className="text-[9px] text-[#62C4E1] font-bold uppercase tracking-wider bg-[#62C4E1]/10 px-2 py-0.5 rounded-full border border-[#62C4E1]/20">
          Add-on pricing will be shown after configuration
        </span>
      </div>

      {/* Category Pills/Tabs (Natural compact wrap) */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-800/40 pb-2.5">
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          const count = groupedOptionalAddons.get(cat)?.length || 0;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-brand-primary text-slate-950 shadow-[0_0_10px_rgba(249,126,26,0.2)]"
                  : "bg-slate-900/60 border border-slate-800 text-text-sub hover:text-text-main hover:border-slate-700"
              }`}
            >
              {getCategoryLabel(cat)} ({count})
            </button>
          );
        })}
      </div>

      {/* Active Category Addons List */}
      <div className="grid grid-cols-1 gap-2">
        {activeItems.map(({ id, name, description }) => {
          const isChecked = selectedAddonIds.includes(id);

          return (
            <label
              key={id}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                isChecked
                  ? "border-brand-primary/50 bg-[#0A1F46]/70 shadow-[0_0_10px_rgba(249,126,26,0.04)]"
                  : "border-slate-800 bg-slate-900/30 hover:border-slate-700/60"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(id)}
                className="mt-0.5 h-3.5 w-3.5 rounded accent-brand-primary cursor-pointer"
              />
              <div className="flex-1 min-w-0 select-none">
                <p className={`text-xs font-bold transition-colors ${isChecked ? "text-brand-primary" : "text-text-main"}`}>
                  {name}
                </p>
                {description && (
                  <p className="text-[10px] text-text-sub mt-0.5 leading-normal">
                    {description}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

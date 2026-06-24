"use client";

import * as React from "react";
import { IntegrationBrandIcon } from "./IntegrationBrandIcon";
import type { IntegrationFeatureItem } from "@/content/home/integrations";

interface IntegrationFeatureCardProps {
  item: IntegrationFeatureItem;
}

export function IntegrationFeatureCard({ item }: IntegrationFeatureCardProps) {
  return (
    <div className="flex flex-col items-start rounded-radius-lg border border-border-soft-val bg-white/[0.015] p-3 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-brand-primary/20 hover:bg-white/[0.035]">
      {/* Small Icon Header */}
      <div className="mb-2 flex size-6 items-center justify-center rounded-lg border border-brand-primary/20 bg-brand-primary/10 text-brand-primary">
        <IntegrationBrandIcon name={item.icon} className="h-3.5 w-3.5" />
      </div>

      {/* Title */}
      <h4 className="font-sans text-xs sm:text-sm font-extrabold text-text-main">
        {item.title}
      </h4>

      {/* Description */}
      <p className="mt-1 font-body text-[11px] leading-snug text-text-muted-gray sm:text-xs">
        {item.description}
      </p>
    </div>
  );
}

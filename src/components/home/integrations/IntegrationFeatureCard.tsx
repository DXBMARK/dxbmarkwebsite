"use client";

import * as React from "react";
import { IntegrationBrandIcon } from "./IntegrationBrandIcon";
import type { IntegrationFeatureItem } from "@/content/home/integrations";

interface IntegrationFeatureCardProps {
  item: IntegrationFeatureItem;
}

export function IntegrationFeatureCard({ item }: IntegrationFeatureCardProps) {
  return (
    <div className="flex flex-col items-start p-4 rounded-radius-lg border border-border-soft-val bg-white/[0.015] hover:bg-white/[0.035] hover:border-brand-primary/20 shadow-sm backdrop-blur-md transition-all duration-300">
      {/* Small Icon Header */}
      <div className="flex size-7 items-center justify-center rounded-lg border border-brand-primary/20 bg-brand-primary/10 text-brand-primary mb-2.5">
        <IntegrationBrandIcon name={item.icon} className="h-4 w-4" />
      </div>

      {/* Title */}
      <h4 className="font-sans text-xs sm:text-sm font-extrabold text-text-main">
        {item.title}
      </h4>

      {/* Description */}
      <p className="mt-1 font-body text-[11px] sm:text-xs text-text-muted-gray leading-normal">
        {item.description}
      </p>
    </div>
  );
}

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IntegrationBrandIcon, brandColors } from "./IntegrationBrandIcon";
import type { IntegrationTileItem } from "@/content/home/integrations";

interface IntegrationTileProps {
  item: IntegrationTileItem | { id: string; label: string; description: string; icon: string };
  index: number;
  className?: string;
  style?: React.CSSProperties;
  isExpanded?: boolean;
  onClick?: () => void;
  isSubnode?: boolean;
}

export function IntegrationTile({
  item,
  index,
  className,
  style,
  isExpanded = false,
  onClick,
  isSubnode = false,
}: IntegrationTileProps) {
  const [shouldReduceMotion, setShouldReduceMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setShouldReduceMotion(mediaQuery.matches);
    const rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const color = brandColors[item.icon] || "var(--color-accent-primary)";
  const isExpandable = "expandable" in item && item.expandable;

  // Floating animation configs staggered by index (disabled on active expanded state to keep positioning solid)
  const floatTransition = shouldReduceMotion || isExpanded || isSubnode
    ? {}
    : {
        y: {
          duration: 5.5,
          repeat: Infinity,
          repeatType: "mirror" as const,
          ease: "easeInOut" as const,
          delay: index * 0.16,
        },
      };

  const floatAnimation = shouldReduceMotion || isExpanded || isSubnode
    ? {}
    : {
        y: [0, -2.5, 0],
      };

  // Common styles (Strict squircle tile shell mapping)
  const baseClasses = cn(
    "group relative flex items-center justify-center transition-[border-color,box-shadow,background-color] duration-300 select-none outline-none",
    isSubnode
      ? "h-[52px] w-[52px] rounded-[17px] border border-border-soft-val/80 bg-white/[0.05] shadow-shadow-card backdrop-blur-2xl"
      : "h-14 w-14 rounded-[18px] border border-border-soft-val/80 bg-white/[0.045] shadow-shadow-card backdrop-blur-2xl lg:h-16 lg:w-16 lg:rounded-[20px]",
    isExpanded
      ? "border-brand-primary bg-[#0f1b35]/90 shadow-[0_0_20px_rgba(249,126,26,0.5)]"
      : "hover:bg-white/[0.08]",
    isExpandable ? "cursor-pointer pointer-events-auto" : "cursor-default pointer-events-auto",
    className
  );

  // Dynamic tooltip alignment to prevent overlapping/clipping
  let tooltipClasses = "";
  let arrowElement = null;

  if (isSubnode) {
    if (item.id === "hubspot" || item.id === "salesforce" || item.id === "zoho") {
      // CRM child tiles are on the left edge (x: 70), so they should open to the right (towards center) to avoid clipping.
      tooltipClasses = "left-full top-1/2 -translate-y-1/2 ml-5 origin-left";
      arrowElement = <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-4 border-transparent border-r-[#0a1120]" />;
    } else {
      // Payments child tiles open above
      tooltipClasses = "bottom-full left-1/2 -translate-x-1/2 mb-5 origin-bottom";
      arrowElement = <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#0a1120]" />;
    }
  } else if ("group" in item && item.group === "source") {
    tooltipClasses = "left-full top-1/2 -translate-y-1/2 ml-5 origin-left";
    arrowElement = <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-4 border-transparent border-r-[#0a1120]" />;
  } else {
    tooltipClasses = "right-full top-1/2 -translate-y-1/2 mr-5 origin-right";
    arrowElement = <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-[#0a1120]" />;
  }

  const tileContent = (
    <>
      {/* Icon Squircle centered without text labels inside */}
      <div 
        style={{ color: isExpanded ? "var(--color-accent-primary)" : color }}
        className={cn(
          "flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
          isSubnode ? "h-6 w-6 lg:h-7 lg:w-7" : "h-7 w-7 lg:h-8 lg:w-8"
        )}
      >
        <IntegrationBrandIcon name={item.icon} className="h-full w-full object-contain" />
      </div>

      {/* Tooltip Description on hover/focus (layered with z-[100]) */}
      <div className={cn(
        "pointer-events-none absolute w-48 rounded-radius-lg border border-border-soft-val bg-[#0a1120] p-2.5 text-center shadow-2xl opacity-0 scale-95 transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 z-[100]",
        tooltipClasses
      )}>
        <p className="font-sans text-[11px] font-extrabold text-text-main">{item.label}</p>
        <p className="mt-1 font-body text-[9px] text-text-muted-gray leading-normal">{"description" in item ? item.description : ""}</p>
        {arrowElement}
      </div>
    </>
  );

  const hoverEase = [0.22, 1, 0.36, 1] as const;

  // If expandable, render as a button for accessibility
  if (isExpandable) {
    return (
      <motion.button
        type="button"
        role="button"
        aria-expanded={isExpanded}
        onClick={onClick}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        animate={floatAnimation}
        transition={{
          ...floatTransition,
          scale: { duration: 0.35, ease: "easeOut" },
        }}
        whileHover={{
          scale: 1.1,
          y: -3,
          borderColor: "var(--color-accent-primary)",
          boxShadow: "0 0 20px rgba(249, 126, 26, 0.25)",
          transition: { duration: 0.16, ease: hoverEase },
        }}
        whileFocus={{
          scale: 1.1,
          y: -3,
          borderColor: "var(--color-accent-primary)",
          boxShadow: "0 0 20px rgba(249, 126, 26, 0.25)",
          transition: { duration: 0.16, ease: hoverEase },
        }}
        whileTap={{ scale: 0.96 }}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        style={style}
        className={baseClasses}
      >
        {tileContent}
      </motion.button>
    );
  }

  return (
    <motion.div
      tabIndex={0}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      animate={floatAnimation}
      transition={{
        ...floatTransition,
        scale: { duration: 0.35, ease: "easeOut" },
      }}
      whileHover={{
        scale: 1.1,
        y: -3,
        borderColor: color,
        boxShadow: `0 0 20px ${color}20`,
        transition: { duration: 0.16, ease: hoverEase },
      }}
      whileFocus={{
        scale: 1.1,
        y: -3,
        borderColor: color,
        boxShadow: `0 0 20px ${color}20`,
        transition: { duration: 0.16, ease: hoverEase },
      }}
      whileTap={{ scale: 0.96 }}
      style={style}
      className={baseClasses}
    >
      {tileContent}
    </motion.div>
  );
}


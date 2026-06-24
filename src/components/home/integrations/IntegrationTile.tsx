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
}

export function IntegrationTile({
  item,
  index,
  className,
  style,
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

  const floatTransition = shouldReduceMotion
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

  const floatAnimation = shouldReduceMotion
    ? {}
    : {
        y: [0, -2.5, 0],
      };

  const baseClasses = cn(
    "group relative flex items-center justify-center transition-[border-color,box-shadow,background-color] duration-300 select-none outline-none",
    "h-14 w-14 rounded-[18px] border border-border-soft-val/80 bg-white/[0.045] shadow-shadow-card backdrop-blur-2xl hover:bg-white/[0.08] lg:h-16 lg:w-16 lg:rounded-[19px]",
    "cursor-default pointer-events-auto",
    className
  );

  const tileContent = (
    <>
      <div
        style={{ color }}
        className={cn(
          "flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
          "h-7 w-7 lg:h-8 lg:w-8"
        )}
      >
        <IntegrationBrandIcon name={item.icon} className="h-full w-full object-contain" />
      </div>
    </>
  );

  const hoverEase = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.div
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

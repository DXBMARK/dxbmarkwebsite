"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Layers, LayoutDashboard, Users, Zap, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { saasSystemItems } from "@/content/home/saas-systems";
import type { SaasSystemId } from "@/content/home/saas-systems";
import { SaasSystemVisual } from "./SaasSystemVisual";

// ---------------------------------------------------------------------------
// Icon map
// ---------------------------------------------------------------------------
const ICON_MAP = {
  layers: Layers,
  "layout-dashboard": LayoutDashboard,
  users: Users,
  zap: Zap,
  wrench: Wrench,
} as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface SaasSystemPanelProps {
  activeId: SaasSystemId;
  onSelect: (id: SaasSystemId) => void;
}

// ---------------------------------------------------------------------------
// SaasSystemPanel — interactive vertical list
// ---------------------------------------------------------------------------
export function SaasSystemPanel({ activeId, onSelect }: SaasSystemPanelProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <ul className="flex flex-col gap-1.5" role="list" aria-label="SaaS system types">
      {saasSystemItems.map((item, index) => {
        const Icon = ICON_MAP[item.icon];
        const isActive = item.id === activeId;

        return (
          <motion.li
            key={item.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.4,
              delay: index * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            role="presentation"
          >
            <button
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(item.id)}
              className={cn(
                "group w-full rounded-xl border px-4 py-3.5 text-left",
                "transition-all duration-250",
                // Inactive
                "border-transparent bg-white/[0.03]",
                "hover:border-brand-primary/25 hover:bg-white/[0.05]",
                // Active override
                isActive && [
                  "border-brand-primary/50 bg-brand-primary/8",
                  "shadow-[0_0_20px_rgba(249,126,26,0.1),inset_0_0_0_1px_rgba(249,126,26,0.12)]",
                ]
              )}
            >
              <div className="flex items-center gap-3.5">
                {/* Index number */}
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200",
                    isActive
                      ? "bg-brand-primary text-white"
                      : "bg-white/[0.06] text-text-muted-gray group-hover:bg-brand-primary/15 group-hover:text-brand-primary"
                  )}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>

                {/* Icon */}
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-200",
                    isActive
                      ? "border-brand-primary/35 bg-brand-primary/15 text-brand-primary"
                      : "border-white/10 bg-white/[0.04] text-text-muted-gray group-hover:border-brand-primary/20 group-hover:text-brand-primary/70"
                  )}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>

                {/* Title */}
                <span
                  className={cn(
                    "flex-1 font-sans text-sm font-bold tracking-tight transition-colors duration-200 sm:text-base",
                    isActive
                      ? "text-text-main"
                      : "text-text-sub group-hover:text-text-main"
                  )}
                >
                  {item.title}
                </span>

                {/* Active indicator chevron */}
                <span
                  className={cn(
                    "shrink-0 font-code text-xs transition-all duration-200",
                    isActive ? "text-brand-primary" : "text-transparent"
                  )}
                  aria-hidden="true"
                >
                  ›
                </span>
              </div>

              {/* Expandable description under item (visible when active) */}
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={shouldReduceMotion ? {} : { height: "auto", opacity: 1 }}
                    exit={shouldReduceMotion ? {} : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="mt-2.5 pl-[calc(1.75rem+2rem+0.875rem)] font-body text-xs leading-relaxed text-text-sub sm:text-sm">
                      {item.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile visual panel — appears inline below each active item on small screens */}
              <div className="lg:hidden">
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={shouldReduceMotion ? {} : { height: "auto", opacity: 1 }}
                      exit={shouldReduceMotion ? {} : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 h-[280px] sm:h-[320px]">
                        <SaasSystemVisual activeId={activeId} className="h-full w-full" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </motion.li>
        );
      })}
    </ul>
  );
}

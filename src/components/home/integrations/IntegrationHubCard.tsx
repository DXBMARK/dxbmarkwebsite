"use client";

import * as React from "react";
import { motion } from "framer-motion";

export function IntegrationHubCard() {
  const [shouldReduceMotion, setShouldReduceMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setShouldReduceMotion(mediaQuery.matches);
    const rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="flex items-center justify-center relative select-none">
      {/* Background soft orange glow */}
      <div className="absolute size-44 rounded-full bg-brand-primary/10 blur-2xl pointer-events-none" />

      {/* Main Glass Squircle Hub */}
      <motion.div
        animate={shouldReduceMotion ? {} : { scale: [1, 1.01, 1], opacity: [0.94, 1, 0.94] }}
        transition={{ duration: 5.0, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex flex-col items-center justify-center text-center p-5 rounded-[2rem] border border-brand-primary/30 bg-[#0a1120]/90 backdrop-blur-3xl shadow-[0_0_35px_rgba(249,126,26,0.18)] w-[140px] sm:w-[155px] aspect-square pointer-events-auto"
      >
        {/* Corner activity flashing dots */}
        <div className="absolute top-2.5 left-2.5 size-1.5 rounded-full bg-brand-primary/80 animate-pulse" />
        <div className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-brand-secondary/80 animate-pulse delay-75" />
        <div className="absolute bottom-2.5 left-2.5 size-1.5 rounded-full bg-brand-secondary/80 animate-pulse delay-150" />
        <div className="absolute bottom-2.5 right-2.5 size-1.5 rounded-full bg-brand-primary/80 animate-pulse delay-300" />

        {/* Text Details */}
        <span className="font-sans text-xs sm:text-sm font-black tracking-widest text-brand-primary uppercase">
          DXBMARK
        </span>
        <span className="mt-1 font-body text-[9px] sm:text-[10px] font-semibold text-text-muted-gray leading-tight">
          Integration Layer
        </span>
      </motion.div>
    </div>
  );
}

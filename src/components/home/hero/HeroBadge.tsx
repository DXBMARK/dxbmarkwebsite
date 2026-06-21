"use client";

import * as React from "react";

type HeroBadgeProps = {
  label?: string;
};

export function HeroBadge({ label = "Digital Solutions" }: HeroBadgeProps) {
  return (
    <div className="hero-badge-elem relative z-0 bg-white/5 overflow-hidden p-px flex items-center justify-center rounded-full transition duration-300">
      {/* Subtle Rotating Accent Gradient Border inspired by the reference rainbow animation */}
      <div 
        className="absolute -left-1/2 -top-1/2 w-[200%] h-[200%] bg-no-repeat bg-[100%_50%] bg-[length:50%_30%] blur-[4px] animate-[spin_6s_linear_infinite]"
        style={{
          backgroundImage: "linear-gradient(to right, var(--color-accent-primary), var(--color-accent-secondary))",
          transformOrigin: "center",
        }}
      />
      
      {/* Inner Content Container */}
      <div className="relative flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0d2130]/95 backdrop-blur-md border border-border-soft-val shadow-inner">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_6px_var(--color-accent-primary)]" aria-hidden="true" />
        <span className="font-label text-[10px] font-bold text-text-main uppercase tracking-widest">
          {label}
        </span>
      </div>
    </div>
  );
}

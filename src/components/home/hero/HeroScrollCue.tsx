"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface HeroScrollCueProps {
  className?: string;
}

export function HeroScrollCue({ className }: HeroScrollCueProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("services");
    if (target) {
      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });
    }
  };

  return (
    <a 
      href="#services"
      onClick={handleClick}
      className={cn(
        "hero-scroll-cue opacity-0 flex flex-col items-center gap-2 pointer-events-auto cursor-pointer z-10 select-none group",
        className || "absolute bottom-8 left-1/2 -translate-x-1/2"
      )}
      aria-label="Scroll to explore"
    >
      <span className="font-label text-[10px] font-bold text-text-muted-gray group-hover:text-brand-primary uppercase tracking-widest font-sans transition-colors duration-300">
        Scroll to Explore
      </span>
      <div className="h-9 w-5 rounded-radius-full border border-border-soft-val flex justify-center p-1.5 bg-[#0d2130]/30 backdrop-blur-xs group-hover:border-brand-primary/45 transition-colors duration-300">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-bounce" />
      </div>
    </a>
  );
}

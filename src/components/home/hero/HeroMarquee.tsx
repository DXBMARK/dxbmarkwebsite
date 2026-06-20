"use client";

import React from "react";

interface HeroMarqueeProps {
  items: string[];
}

export function HeroMarquee({ items }: HeroMarqueeProps) {
  // Triple the items array to ensure a completely seamless looping scroll
  const tripledItems = [...items, ...items, ...items];

  return (
    <div className="w-full flex flex-col items-center gap-6 mt-16 max-w-5xl mx-auto">
      {/* Centered Small Caption Header */}
      <span className="font-label text-[10px] font-bold text-text-muted-gray uppercase tracking-widest block text-center">
        Trusted by growing businesses
      </span>

      {/* Marquee Container with CSS mask-image for feather fade */}
      <div 
        className="hero-marquee-container relative w-full overflow-hidden pointer-events-auto select-none"
        style={{
          maskImage: "linear-gradient(to right, transparent, rgba(0, 0, 0, 1) 15%, rgba(0, 0, 0, 1) 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, rgba(0, 0, 0, 1) 15%, rgba(0, 0, 0, 1) 85%, transparent)"
        }}
        aria-hidden="true"
      >
        {/* Marquee Track calling custom animation utility from globals.css */}
        <div 
          className="flex gap-6 w-max py-2 animate-dxb-marquee hover:[animation-play-state:paused]"
        >
          {tripledItems.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex-shrink-0 px-5 py-2.5 rounded-radius-full border border-border-soft-val bg-white/5 text-text-muted-gray text-xs sm:text-sm font-label font-bold transition-all duration-300 hover:border-brand-primary/45 hover:text-brand-primary hover:bg-brand-primary/5 cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

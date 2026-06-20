"use client";

import React from "react";
import Image from "next/image";

interface TrustLogo {
  label: string;
  src: string;
}

interface HeroTrustLogosProps {
  logos: TrustLogo[];
  title: string;
}

export function HeroTrustLogos({ logos, title }: HeroTrustLogosProps) {
  // Triple the logos array to ensure a completely seamless looping scroll
  const tripledLogos = [...logos, ...logos, ...logos];

  return (
    <div className="hero-trust-logos-elem w-full flex flex-col items-center gap-6 mt-12 max-w-5xl mx-auto">
      {/* Centered Small Caption Header */}
      <span className="font-label text-[10px] font-bold text-text-muted-gray uppercase tracking-widest block text-center">
        {title}
      </span>

      {/* Marquee Container with CSS mask-image for feather fade */}
      <div 
        className="relative w-full overflow-hidden pointer-events-auto select-none"
        style={{
          maskImage: "linear-gradient(to right, transparent, rgba(0, 0, 0, 1) 15%, rgba(0, 0, 0, 1) 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, rgba(0, 0, 0, 1) 15%, rgba(0, 0, 0, 1) 85%, transparent)"
        }}
        aria-hidden="true"
      >
        {/* Marquee Track calling custom slow animation utility from globals.css */}
        <div 
          className="flex gap-16 w-max py-2 animate-dxb-marquee hover:[animation-play-state:paused]"
        >
          {tripledLogos.map((logo, idx) => (
            <div
              key={`${logo.label}-${idx}`}
              className="flex-shrink-0 w-[140px] h-[40px] relative flex items-center justify-center"
            >
              <Image
                src={logo.src}
                alt={logo.label}
                fill
                sizes="140px"
                className="object-contain filter grayscale brightness-[0.8] contrast-[0.9] opacity-85 hover:scale-[1.03] hover:grayscale-0 hover:brightness-100 hover:contrast-100 hover:opacity-100 transition-all duration-300 ease-out"
                priority={idx < 4}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

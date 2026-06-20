import * as React from "react";
import { Glow } from "@/components/visual";
import { HeroSection } from "@/components/home/hero/HeroSection";
import { NextSectionPlaceholder } from "@/components/home/sections/NextSectionPlaceholder";
import { HomeScrollController } from "@/components/home/scroll/HomeScrollController";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background-slate relative overflow-hidden">
      {/* Blue Radial Glow Background */}
      <Glow className="absolute inset-0 z-0" />

      {/* GSAP Scroll/Snap Controller */}
      <HomeScrollController />

      {/* Main Canvas Area */}
      <main className="relative z-10">
        <HeroSection />
        <NextSectionPlaceholder />
      </main>
    </div>
  );
}


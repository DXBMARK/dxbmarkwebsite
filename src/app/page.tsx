import * as React from "react";
import type { Metadata } from "next";
import { Glow } from "@/components/visual";
import { HeroSection } from "@/components/home/hero/HeroSection";
import { ServicesSection } from "@/components/home/services/ServicesSection";
import { DigitalServicePackagesSection } from "@/features/pricing/components/DigitalServicePackagesSection";
import { HomeClientContent } from "@/components/home/HomeClientContent";
import { HomeScrollController } from "@/components/home/scroll/HomeScrollController";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/site";
import { buildHomeJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: { absolute: "DXBMARK LLC — Custom Software, SaaS & Cloud Systems" },
  description:
    "DXBMARK LLC builds custom software, SaaS, cloud infrastructure, and digital integrations for modern businesses.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd data={buildHomeJsonLd()} />
      <div className="min-h-screen w-full bg-background-slate relative overflow-hidden">
        {/* Blue Radial Glow Background */}
        <Glow className="absolute inset-0 z-0" />

        {/* GSAP Scroll/Snap Controller */}
        <HomeScrollController />

        {/* Main Canvas Area */}
        <main className="relative z-10">
          <HeroSection />
          <ServicesSection />
          <DigitalServicePackagesSection />
          <HomeClientContent />
        </main>
      </div>
    </>
  );
}

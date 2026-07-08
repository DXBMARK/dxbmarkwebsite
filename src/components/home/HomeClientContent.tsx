"use client";

import dynamic from "next/dynamic";

const IntegrationsSection = dynamic(
  () => import("@/components/home/integrations/IntegrationsSection").then((mod) => mod.IntegrationsSection),
  { ssr: false }
);

const SaasSystemsSection = dynamic(
  () => import("@/components/home/saas-systems/SaasSystemsSection").then((mod) => mod.SaasSystemsSection),
  { ssr: false }
);

const StatsSection = dynamic(
  () => import("@/components/home/stats/StatsSection").then((mod) => mod.StatsSection),
  { ssr: false }
);

const TechStackSection = dynamic(
  () => import("@/components/home/tech-stack/TechStackSection").then((mod) => mod.TechStackSection),
  { ssr: false }
);

const DigitalServicePackagesSection = dynamic(
  () => import("@/features/pricing/components/DigitalServicePackagesSection").then((mod) => mod.DigitalServicePackagesSection),
  { ssr: false }
);

export function HomeClientContent() {
  return (
    <>
      <IntegrationsSection />
      <SaasSystemsSection />
      <StatsSection />
      <TechStackSection />
      <DigitalServicePackagesSection />
    </>
  );
}

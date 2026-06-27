import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  PanelsTopLeft,
} from "lucide-react";

import { HeroBadge } from "@/components/home/hero/HeroBadge";
import { Glow } from "@/components/visual";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/layout";
import { createPageMetadata } from "@/lib/seo/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildServicesJsonLd } from "@/lib/seo/structured-data";
import { ServiceCard } from "./ServiceCard";
import { ServicesAnimate } from "./ServicesAnimate";

export const metadata: Metadata = createPageMetadata({
  title: "Software Development, SaaS, Cloud & Automation Services",
  description:
    "Explore DXBMARK LLC services for custom software development, SaaS platforms, business websites, cloud infrastructure, managed hosting, automation workflows, integrations, dashboards, portals, and technical consulting.",
  path: "/services",
  robots: {
    index: true,
    follow: true,
  },
});

const services = [
  {
    id: "web-saas-applications",
    title: "Web & SaaS Applications",
    description:
      "Custom web applications, SaaS platforms, dashboards, portals, and eCommerce systems built around real business workflows.",
    tags: ["SaaS", "Web Apps", "Dashboards"],
    icon: "AppWindow",
  },
  {
    id: "business-websites",
    title: "Business Websites",
    description:
      "Company websites, WordPress builds, landing pages, and content systems designed to communicate clearly and convert better.",
    tags: ["Websites", "WordPress", "CMS"],
    icon: "Globe2",
  },
  {
    id: "business-systems-portals",
    title: "Business Systems & Portals",
    description:
      "Internal tools, client portals, admin dashboards, booking flows, and business systems that organize daily operations.",
    tags: ["Portals", "Admin Tools", "Systems"],
    icon: "PanelsTopLeft",
  },
  {
    id: "cloud-managed-hosting",
    title: "Cloud & Managed Hosting",
    description:
      "Deployment, hosting, monitoring, backups, server setup, and infrastructure support for reliable digital operations.",
    tags: ["Cloud", "Hosting", "Monitoring"],
    icon: "Server",
  },
  {
    id: "automation-workflows",
    title: "Automation & Workflows",
    description:
      "Process automation, notifications, handoffs, integrations, and internal workflows that reduce manual work and improve speed.",
    tags: ["Automation", "Workflows", "Operations"],
    icon: "Workflow",
  },
  {
    id: "integrations-apis",
    title: "Integrations & APIs",
    description:
      "Connect CRMs, payments, analytics, messaging, cloud tools, and internal systems through clean API and webhook workflows.",
    tags: ["APIs", "Webhooks", "Systems"],
    icon: "Cable",
  },
  {
    id: "technical-consulting",
    title: "Technical Consulting",
    description:
      "System reviews, product planning, architecture guidance, and practical next-step recommendations before you build.",
    tags: ["Planning", "Architecture", "Reviews"],
    icon: "Compass",
  },
  {
    id: "dashboards-admin-systems",
    title: "Dashboards & Admin Systems",
    description:
      "Operational dashboards, reporting panels, admin interfaces, and management systems designed for visibility and control.",
    tags: ["Dashboards", "Reporting", "Admin"],
    icon: "LayoutDashboard",
  },
] as const;

const ServicesCallout = () => (
  <div className="relative overflow-hidden rounded-radius-xl border border-border-soft-val bg-white/[0.04] p-6 shadow-shadow-card backdrop-blur-2xl sm:p-8">
    <span
      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary/70 to-transparent"
      aria-hidden="true"
    />
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="flex flex-col gap-5 text-left">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-primary/20 bg-brand-primary/10 text-brand-primary">
          <PanelsTopLeft className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-text-main sm:text-3xl">
            Full service pages are being prepared
          </h2>
          <p className="max-w-2xl font-body text-sm leading-relaxed text-text-sub sm:text-base">
            We are expanding this area with dedicated service pages,
            implementation examples, and future case studies. You can still
            contact DXBMARK LLC now to discuss your project requirements.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="group font-label">
            <Link href="/contact">
              Start a project
              <ArrowRight
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="font-label">
            <Link href="/legal">View legal documents</Link>
          </Button>
        </div>
      </div>

      <div
        className="relative min-h-[220px] overflow-hidden rounded-radius-lg border border-border-soft-val bg-background-slate/55 p-4"
        aria-hidden="true"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-primary" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand-secondary/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </div>
          <span className="rounded-full border border-border-soft-val bg-white/[0.04] px-2 py-1 font-label text-[9px] uppercase tracking-[0.16em] text-text-muted-gray">
            Services
          </span>
        </div>

        <div className="grid gap-3">
          {["Dedicated pages", "Implementation examples", "Case studies"].map(
            (item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-radius-md border border-border-soft-val bg-white/[0.035] px-3 py-2.5"
              >
                <span className="font-label text-[10px] uppercase tracking-[0.14em] text-text-sub">
                  {item}
                </span>
                <span className="h-2 w-12 rounded-full bg-brand-glow" />
              </div>
            )
          )}
        </div>

        <svg
          className="mt-5 h-20 w-full text-brand-primary/70"
          viewBox="0 0 320 84"
          fill="none"
        >
          <path
            d="M6 64 C48 24 78 70 112 42 C146 14 170 48 204 30 C240 10 262 48 314 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6 72 H314"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 8"
            opacity="0.25"
          />
        </svg>
      </div>
    </div>
  </div>
);

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={buildServicesJsonLd()} />
      <ServicesAnimate>
        <Section className="relative min-h-screen overflow-hidden bg-background-slate pb-16 pt-24 text-text-sub sm:py-20 lg:py-24">
          <Glow className="absolute inset-0 z-0" aria-hidden="true" />
          <Container className="relative z-10 flex flex-col gap-12">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <div className="mb-5 inline-flex" data-services-reveal>
                <HeroBadge label="SERVICES" />
              </div>
              <h1 className="font-sans text-3xl font-black leading-[1.05] tracking-tight text-text-main sm:text-4xl md:text-5xl lg:text-[4.25rem]" data-services-reveal>
                Our{" "}
                <span className="bg-gradient-to-r from-text-main via-brand-primary to-brand-secondary bg-clip-text text-transparent">
                  Services
                </span>
              </h1>
              <p className="mt-6 max-w-2xl font-body text-sm leading-relaxed text-text-sub sm:text-base lg:text-lg" data-services-reveal>
                Practical digital systems for businesses that need reliable
                software, websites, automation, cloud infrastructure, and technical
                execution.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            <div data-services-reveal>
              <ServicesCallout />
            </div>
          </Container>
        </Section>
      </ServicesAnimate>
    </>
  );
}


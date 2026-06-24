import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/layout";
import { Card } from "@/components/ui/card";
import { LEGAL_DOCUMENTS } from "@/content/legal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { calculateReadingTime } from "@/components/legal/legal-render-utils";
import fs from "fs";
import path from "path";
import { Glow } from "@/components/visual";
import { createPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = createPageMetadata({
  title: "Legal Documents",
  description:
    "Review DXBMARK LLC legal documents, privacy terms, cookie policy, data processing agreement, security statement, support policy, company information, and service policies.",
  path: "/legal",
});

function getReadingTimeForSlug(filename: string): string {
  try {
    const filePath = path.join(
      process.cwd(),
      "src/content/legal-documents",
      filename
    );
    const content = fs.readFileSync(filePath, "utf-8");
    return calculateReadingTime(content);
  } catch (error) {
    console.error(`Error reading file ${filename} for reading time:`, error);
    return "1 min read";
  }
}
import {
  FileText,
  ShieldCheck,
  Lock,
  Database,
  RefreshCcw,
  Cookie,
  Truck,
  Building2,
  Server,
  Shield,
  LifeBuoy,
  Copyright,
  ArrowRight,
} from "lucide-react";

const iconMap = {
  FileText,
  ShieldCheck,
  Lock,
  Database,
  RefreshCcw,
  Cookie,
  Truck,
  Building2,
  Server,
  Shield,
  LifeBuoy,
  Copyright,
};

export default function LegalIndexPage() {
  const breadcrumbItems = [
    { href: "/", label: "Home" },
    { href: "/legal", label: "Legal" },
  ];

  return (
    <Section className="relative bg-background-slate min-h-[75vh] overflow-hidden">
      <Glow className="absolute inset-0 z-0" />
      <Container className="relative z-10 flex flex-col gap-12 text-left">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <div className="flex flex-col gap-6 max-w-3xl">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold tracking-widest text-brand-primary uppercase">
              LEGAL DOCUMENTATION
            </span>
            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-black text-text-main tracking-tight leading-none">
              Legal Documents
            </h1>
            <p className="font-body text-base md:text-lg text-text-sub leading-relaxed">
              All DXBMARK LLC legal documents, policies, and agreements. These govern your use of our services and protect both parties.
            </p>
          </div>

          {/* Glass Info Badge */}
          <div className="inline-flex max-w-max items-center rounded-radius-md border border-border-soft-val bg-white/5 px-4 py-2 text-xs font-medium text-text-sub backdrop-blur-md">
            DXBMARK LLC &bull; Legal Center &bull; Documents v{LEGAL_DOCUMENTS[0]?.version || "1.0"}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEGAL_DOCUMENTS.map((doc) => {
            const IconComponent = iconMap[doc.iconName] || FileText;
            return (
              <Link key={doc.slug} href={doc.href} className="group h-full">
                <Card className="h-full flex flex-col justify-between hover:border-brand-primary/30 transition-all duration-300">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      {/* Icon Container */}
                      <div className="flex h-10 w-10 items-center justify-center rounded-radius-default bg-brand-glow text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                        <IconComponent className="h-5 w-5" aria-hidden="true" />
                      </div>
                      {/* Version Badge */}
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-radius-full bg-white/5 border border-border-soft-val text-text-muted-gray">
                        v{doc.version}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold tracking-wider text-brand-primary uppercase">
                        {doc.eyebrow}
                      </span>
                      <h3 className="font-sans text-lg font-bold text-text-main group-hover:text-brand-primary transition-colors leading-tight">
                        {doc.title}
                      </h3>
                      <p className="font-body text-xs text-text-muted-gray leading-relaxed">
                        {doc.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-border-soft-val flex items-center justify-between text-xs font-bold text-brand-primary">
                    <span className="text-[10px] text-text-dark-gray font-medium flex flex-wrap items-center gap-1.5">
                      <span>Updated {doc.lastUpdated}</span>
                      <span>&bull;</span>
                      <span>{getReadingTimeForSlug(doc.filename)}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      View document
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

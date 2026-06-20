import * as React from "react";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LEGAL_DOCUMENTS } from "@/content/legal";
import { LegalMetadataPill } from "@/components/legal/LegalMetadataPill";
import { LegalClientWrapper } from "@/components/legal/LegalClientWrapper";
import { calculateReadingTime } from "@/components/legal/legal-render-utils";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Glow } from "@/components/visual";


interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static routes from legal documents list
export async function generateStaticParams() {
  return LEGAL_DOCUMENTS.map((doc) => ({
    slug: doc.slug,
  }));
}

// SEO Dynamic metadata mapping
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const doc = LEGAL_DOCUMENTS.find((d) => d.slug === resolvedParams.slug);

  if (!doc) {
    return {
      title: "Document Not Found | DXBMARK LLC",
    };
  }

  return {
    title: `${doc.title} | DXBMARK LLC`,
    description: doc.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.dxbmark.com"}${doc.href}`,
    },
  };
}

export default async function LegalPlaceholderPage({ params }: PageProps) {
  const resolvedParams = await params;
  const doc = LEGAL_DOCUMENTS.find((d) => d.slug === resolvedParams.slug);

  if (!doc) {
    notFound();
  }

  // Load and parse markdown file content
  let markdownContent = "";
  try {
    const filePath = path.join(
      process.cwd(),
      "src/content/legal-documents",
      doc.filename
    );
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsedMatter = matter(fileContent);
    markdownContent = parsedMatter.content;
  } catch (error) {
    console.error(`Error loading markdown file ${doc.filename}:`, error);
    // Hard fail during build check to identify missing files
    throw new Error(`Critical: Missing markdown file: ${doc.filename}`);
  }

  const readingTime = calculateReadingTime(markdownContent);

  const breadcrumbItems = [
    { href: "/", label: "Home" },
    { href: "/legal", label: "Legal" },
    { href: doc.href, label: doc.title },
  ];

  return (
    <Section className="relative bg-background-slate min-h-[75vh] py-12 overflow-hidden">
      <Glow className="absolute inset-0 z-0" />
      <Container className="relative z-10 flex flex-col gap-8 text-left">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Header */}
        <div className="flex flex-col gap-4 border-b border-border-soft-val pb-8 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold tracking-widest text-brand-primary uppercase">
              LEGAL DOCUMENTATION
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-radius-full bg-white/5 border border-border-soft-val text-text-muted-gray">
              Version {doc.version}
            </span>
          </div>

          <h1 className="font-sans text-3xl md:text-5xl font-black text-text-main tracking-tight">
            {doc.title}
          </h1>
          <p className="font-body text-base md:text-lg text-text-sub leading-relaxed">
            {doc.description}
          </p>

          {/* Metadata pill */}
          <LegalMetadataPill
            effectiveDate={doc.effectiveDate}
            lastUpdated={doc.lastUpdated}
            version={doc.version}
            readTime={readingTime}
          />
        </div>

        {/* Two-Column Layout Wrapper */}
        <LegalClientWrapper content={markdownContent} slug={doc.slug} />
      </Container>
    </Section>
  );
}



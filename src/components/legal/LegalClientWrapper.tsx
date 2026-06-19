"use client";

import * as React from "react";
import { LegalTableOfContents } from "./LegalTableOfContents";
import { LegalDocumentRenderer } from "./LegalDocumentRenderer";
import { CookieDeclaration } from "./CookieDeclaration";

interface LegalClientWrapperProps {
  content: string;
  slug: string;
}

export function LegalClientWrapper({ content, slug }: LegalClientWrapperProps) {
  const [headings, setHeadings] = React.useState<{ id: string; text: string }[]>([]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4 items-start">
      {/* Left Sticky Sidebar: Table of Contents */}
      <LegalTableOfContents headings={headings} />

      {/* Right Content: Document body with tailored markdown elements style rendering */}
      <article className="lg:col-span-8 max-w-3xl font-body text-sm text-text-sub leading-relaxed flex flex-col gap-6">
        <LegalDocumentRenderer
          content={content}
          slug={slug}
          onHeadingsExtracted={setHeadings}
        />
        {slug === "cookie-policy" && <CookieDeclaration />}
      </article>
    </div>
  );
}

import * as React from "react";

interface TOCHeading {
  id: string;
  text: string;
}

interface LegalTableOfContentsProps {
  headings: TOCHeading[];
}

export function LegalTableOfContents({ headings }: LegalTableOfContentsProps) {
  return (
    <aside className="lg:col-span-4 sticky top-28 hidden lg:block bg-background-dark/25 p-6 rounded-radius-lg border border-border-soft-val backdrop-blur-sm">
      <h4 className="font-sans text-xs font-black tracking-widest text-text-main uppercase mb-4">
        ON THIS PAGE
      </h4>
      <nav className="flex flex-col gap-2.5 font-label text-xs">
        {headings.length > 0 ? (
          headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className="text-text-sub hover:text-brand-primary transition-colors leading-relaxed"
            >
              {heading.text}
            </a>
          ))
        ) : (
          <span className="text-text-dark-gray italic">No sections found</span>
        )}
      </nav>
    </aside>
  );
}

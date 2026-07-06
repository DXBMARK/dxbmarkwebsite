import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createMarkdownComponents } from "./LegalMarkdownComponents";
import { deterministicSlugify } from "./legal-render-utils";

interface LegalDocumentRendererProps {
  content: string;
  slug: string;
  onHeadingsExtracted?: (headings: { id: string; text: string }[]) => void;
}

export function LegalDocumentRenderer({
  content,
  slug,
  onHeadingsExtracted,
}: LegalDocumentRendererProps) {
  // Conservative header filtering:
  // Split content by line and find the first real numbered section heading (e.g. ## 1. Acceptance of Terms)
  const lines = content.split("\n");
  let firstNumberedIndex = -1;
  let index = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    // Matches heading starting with numbers like "## 1." or "## 1. Acceptance"
    if (line.startsWith("## ") && /^\d+\.?\s+/.test(line.replace("## ", "").trim())) {
      firstNumberedIndex = index;
      break;
    }
    index++;
  }

  // Filter content starting from the first numbered section (if found)
  const filteredContent = firstNumberedIndex !== -1 
    ? lines.slice(firstNumberedIndex).join("\n") 
    : content;

  // Extract TOC dynamically from filteredContent
  React.useEffect(() => {
    if (onHeadingsExtracted) {
      const headingItems: { id: string; text: string }[] = [];
      const filteredLines = filteredContent.split("\n");
      
      for (const line of filteredLines) {
        if (line.trim().startsWith("## ")) {
          const rawText = line.replace("## ", "").trim();
          const normalized = rawText.toLowerCase();
          const isContact = normalized === "contact" || normalized === "contact information" ||
            /^\d+\.\s+contact$/i.test(rawText) || /^\d+\.\s+contact information$/i.test(rawText);
          const numberMatch = rawText.match(/^(\d+\.\s+)/);
          const prefix = numberMatch ? numberMatch[1] : "";

          const text = isContact 
            ? `${prefix}Contact Information` 
            : rawText;
          const id = isContact ? "contact-information" : deterministicSlugify(text);
          headingItems.push({ id, text });
        }
      }
      onHeadingsExtracted(headingItems);
    }
  }, [filteredContent, onHeadingsExtracted]);

  const customComponents = createMarkdownComponents({ slug });

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={customComponents}
    >
      {filteredContent}
    </ReactMarkdown>
  );
}

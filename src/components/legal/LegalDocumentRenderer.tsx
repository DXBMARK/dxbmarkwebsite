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

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Matches heading starting with numbers like "## 1." or "## 1. Acceptance"
    if (line.startsWith("## ") && /^\d+\.?\s+/.test(line.replace("## ", "").trim())) {
      firstNumberedIndex = i;
      break;
    }
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
      
      filteredLines.forEach((line) => {
        if (line.trim().startsWith("## ")) {
          const rawText = line.replace("## ", "").trim();
          const contactMatch = rawText.match(/^(\d+\.\s*)?Contact(\s+Information)?$/i);
          const text = contactMatch 
            ? `${contactMatch[1] || ""}Contact Information` 
            : rawText;
          const id = contactMatch ? "contact-information" : deterministicSlugify(text);
          headingItems.push({ id, text });
        }
      });
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

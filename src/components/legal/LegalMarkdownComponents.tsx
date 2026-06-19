import * as React from "react";
import { ShieldAlert, Mail, Globe } from "lucide-react";
import { extractKnownFields, deterministicSlugify } from "./legal-render-utils";

interface MarkdownComponentProps {
  children?: React.ReactNode;
}

interface LinkComponentProps {
  children?: React.ReactNode;
  href?: string;
}

interface CustomRendererProps {
  slug: string;
}

export function createMarkdownComponents({ slug }: CustomRendererProps) {
  const isCompanyInfo = slug === "company-information";

  return {
    h2: ({ children }: MarkdownComponentProps) => {
      const getRawText = (node: React.ReactNode): string => {
        if (!node) return "";
        if (typeof node === "string" || typeof node === "number") return String(node);
        if (Array.isArray(node)) return node.map(getRawText).join("");
        if (React.isValidElement(node)) {
          const props = node.props as { children?: React.ReactNode };
          if (props && props.children) {
            return getRawText(props.children);
          }
        }
        return "";
      };
      const rawText = React.Children.toArray(children)
        .map(getRawText)
        .join("");

      const trimmed = rawText.trim();
      const contactMatch = trimmed.match(/^(\d+\.\s*)?Contact(\s+Information)?$/i);
      const displayedText = contactMatch 
        ? `${contactMatch[1] || ""}Contact Information` 
        : rawText;
      const id = contactMatch ? "contact-information" : deterministicSlugify(displayedText);

      return (
        <h2
          id={id}
          className="font-sans text-xl md:text-2xl font-bold text-brand-primary tracking-tight mt-8 mb-4 border-b border-border-soft-val pb-2 scroll-mt-28"
        >
          {displayedText}
        </h2>
      );
    },
    h3: ({ children }: MarkdownComponentProps) => {
      const getRawText = (node: React.ReactNode): string => {
        if (!node) return "";
        if (typeof node === "string" || typeof node === "number") return String(node);
        if (Array.isArray(node)) return node.map(getRawText).join("");
        if (React.isValidElement(node)) {
          const props = node.props as { children?: React.ReactNode };
          if (props && props.children) {
            return getRawText(props.children);
          }
        }
        return "";
      };
      const rawText = React.Children.toArray(children)
        .map(getRawText)
        .join("");

      const trimmed = rawText.trim();
      const contactMatch = trimmed.match(/^(\d+\.\s*)?Contact(\s+Information)?$/i);
      const displayedText = contactMatch 
        ? `${contactMatch[1] || ""}Contact Information` 
        : rawText;
      const id = contactMatch ? "contact-information" : deterministicSlugify(displayedText);

      return (
        <h3
          id={id}
          className="font-sans text-lg font-bold text-text-main tracking-tight mt-6 mb-3 scroll-mt-28"
        >
          {displayedText}
        </h3>
      );
    },
    p: ({ children }: MarkdownComponentProps) => {
      const getRawText = (node: React.ReactNode): string => {
        if (!node) return "";
        if (typeof node === "string" || typeof node === "number") return String(node);
        if (Array.isArray(node)) return node.map(getRawText).join("");
        if (React.isValidElement(node)) {
          const props = node.props as { children?: React.ReactNode };
          if (props && props.children) {
            return getRawText(props.children);
          }
        }
        return "";
      };
      const text = React.Children.toArray(children)
        .map(getRawText)
        .join("")
        .trim();

      // Check if it's the contact section and we need to strip physical address
      if (!isCompanyInfo) {
        const hasAddress =
          text.includes("30 N Gould St") ||
          text.includes("Ste R") ||
          text.includes("Sheridan, Wyoming 82801") ||
          text.includes("United States");

        if (hasAddress) {
          const addressLines = [
            "30 N Gould St",
            "ste r",
            "sheridan, wyoming 82801",
            "united states",
            "wyoming, united states",
          ];
          const isPureAddress = addressLines.some((line) =>
            text.toLowerCase().includes(line.toLowerCase())
          ) && !text.includes("@") && !text.includes("http");

          if (isPureAddress) {
            return null;
          }
        }
      }

      // Check for Registration paragraph containing multiple labels
      if (isCompanyInfo && text.includes("Entity Type:") && text.includes("Registered Address:")) {
        const regLabels = [
          "Entity Type",
          "Jurisdiction of Formation",
          "Formation Date",
          "Wyoming Original ID / Company ID",
          "Registered Address"
        ];
        const extracted = extractKnownFields(text, regLabels);

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
            {regLabels.map((lbl) => {
              const val = extracted[lbl];
              if (!val) return null; // No empty cards

              const isAddress = lbl === "Registered Address";
              return (
                <div
                  key={lbl}
                  className={`flex flex-col gap-1.5 p-5 rounded-radius-lg border border-border-soft-val bg-white/[0.02] hover:border-brand-primary/20 transition-all duration-300 backdrop-blur-sm relative overflow-hidden group text-left ${
                    isAddress ? "sm:col-span-2" : "sm:col-span-1"
                  }`}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary/30 group-hover:bg-brand-primary transition-colors" />
                  <span className="text-[10px] font-bold text-brand-primary tracking-wider uppercase">{lbl}</span>
                  <span className="text-text-main text-sm font-semibold leading-relaxed mt-1">{val}</span>
                  {isAddress && (
                    <span className="text-[10px] text-text-muted-gray italic mt-2 block border-t border-border-soft-val/30 pt-2">
                      * Registered agent corporate office seat. Not for general correspondence, marketing mail, or support tickets.
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        );
      }

      // Check for Legal Name paragraph
      if (isCompanyInfo && text.toLowerCase().startsWith("legal name:")) {
        const match = text.match(/legal name:\s*(.*)/i);
        const val = (match && match[1] ? match[1].replace(/\*/g, "").trim() : "") || "DXBMARK LLC";
        
        return (
          <div className="flex flex-col gap-1.5 p-5 rounded-radius-lg border border-border-soft-val bg-white/[0.02] hover:border-brand-primary/20 transition-all duration-300 backdrop-blur-sm relative overflow-hidden group my-4 text-left">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary/30 group-hover:bg-brand-primary transition-colors" />
            <span className="text-[10px] font-bold text-brand-primary tracking-wider uppercase">Legal Name</span>
            <span className="text-text-main text-base font-bold leading-relaxed mt-1">{val}</span>
          </div>
        );
      }

      // Check for Tax/EIN Notice Block
      if (isCompanyInfo && text.startsWith("Tax or EIN information")) {
        return (
          <div className="my-6 p-5 rounded-radius-lg border border-brand-primary/20 bg-brand-primary/[0.02] backdrop-blur-sm flex gap-4 items-start relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary" />
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-radius-default bg-brand-primary/10 text-brand-primary">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-sans text-xs font-black tracking-wider text-brand-primary uppercase">
                Tax & EIN Information
              </h4>
              <p className="font-body text-xs text-text-sub leading-relaxed m-0">
                {children}
              </p>
            </div>
          </div>
        );
      }

      // Check for Contact Details paragraph containing multiple emails
      if (isCompanyInfo && text.includes("General enquiries:") && text.includes("Support enquiries:")) {
        const contactLabels = [
          "General enquiries",
          "Legal enquiries",
          "Privacy and data protection enquiries",
          "Privacy enquiries",
          "Support enquiries",
          "Billing and payment enquiries",
          "Billing enquiries",
          "Finance and account administration",
          "Website",
          "Copyright Complaints Contact"
        ];
        const extracted = extractKnownFields(text, contactLabels);

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            {contactLabels.map((lbl) => {
              const val = extracted[lbl];
              if (!val) return null; // No empty cards

              const cleanVal = val.replace(/[\[\]()]/g, "").trim();
              const isEmail = cleanVal.includes("@");
              const isUrl = cleanVal.startsWith("http") || cleanVal.startsWith("www.") || cleanVal.includes(".com");
              
              if (!isEmail && !isUrl) return null;

              const Icon = isEmail ? Mail : Globe;
              const href = isEmail 
                ? (cleanVal.toLowerCase().startsWith("mailto:") ? cleanVal : `mailto:${cleanVal}`) 
                : cleanVal;

              return (
                <a
                  key={lbl}
                  href={href}
                  className="flex items-center gap-4 p-4 rounded-radius-md border border-border-soft-val bg-white/[0.01] hover:border-brand-primary/30 transition-all duration-300 group text-left"
                  target={!isEmail ? "_blank" : undefined}
                  rel={!isEmail ? "noopener noreferrer" : undefined}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-radius-default bg-white/5 text-text-sub group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-text-muted-gray uppercase tracking-wider">{lbl}</span>
                    <span className="text-sm font-medium text-text-main group-hover:text-brand-primary transition-colors break-all">
                      {cleanVal}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        );
      }

      return (
        <p className="mb-4 text-text-sub leading-relaxed font-body">
          {children}
        </p>
      );
    },
    ul: ({ children }: MarkdownComponentProps) => {
      if (isCompanyInfo) {
        return (
          <div className="flex flex-wrap gap-3 my-4">
            {children}
          </div>
        );
      }
      return (
        <ul className="list-disc pl-6 mb-4 flex flex-col gap-2 text-text-sub font-body">
          {children}
        </ul>
      );
    },
    ol: ({ children }: MarkdownComponentProps) => (
      <ol className="list-decimal pl-6 mb-4 flex flex-col gap-2 text-text-sub font-body">
        {children}
      </ol>
    ),
    li: ({ children }: MarkdownComponentProps) => {
      const text = React.Children.toArray(children)
        .map((child) => (typeof child === "string" || typeof child === "number" ? String(child) : ""))
        .join("")
        .trim();

      if (isCompanyInfo) {
        const brandNames = ["DXBMARK", "DXBMark", "DXBMARK Solutions", "DXBMARK Technology"];
        if (brandNames.includes(text)) {
          return (
            <span className="inline-flex items-center px-4 py-2 rounded-radius-full border border-border-soft-val bg-white/5 text-xs font-bold text-text-main hover:border-brand-primary/30 transition-all">
              {text}
            </span>
          );
        }
      }

      return <li className="leading-relaxed font-body">{children}</li>;
    },

    a: ({ href, children }: LinkComponentProps) => (
      <a
        href={href}
        className="text-brand-primary hover:underline hover:text-brand-secondary transition-colors font-medium"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    strong: ({ children }: MarkdownComponentProps) => {
      return (
        <strong className="font-bold text-text-main">{children}</strong>
      );
    },
    table: ({ children }: MarkdownComponentProps) => (
      <div className="w-full overflow-x-auto rounded-radius-lg border border-border-soft-val my-6 backdrop-blur-sm bg-white/[0.02]">
        <table className="w-full min-w-[700px] border-collapse text-left text-xs font-body text-text-sub">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: MarkdownComponentProps) => (
      <thead className="bg-white/5 border-b border-border-soft-val text-text-main font-bold uppercase tracking-wider">
        {children}
      </thead>
    ),
    tbody: ({ children }: MarkdownComponentProps) => (
      <tbody className="divide-y divide-border-soft-val/30">
        {children}
      </tbody>
    ),
    tr: ({ children }: MarkdownComponentProps) => (
      <tr className="hover:bg-white/[0.01] transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }: MarkdownComponentProps) => (
      <th className="px-4 py-3.5 font-semibold text-text-main">
        {children}
      </th>
    ),
    td: ({ children }: MarkdownComponentProps) => (
      <td className="px-4 py-3.5 leading-relaxed align-top max-w-[250px] whitespace-normal break-words">
        {children}
      </td>
    ),
    hr: () => <hr className="my-8 border-border-soft-val/50" />,
  };
}


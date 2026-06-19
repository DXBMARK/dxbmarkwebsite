import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  dividerType?: "chevron" | "slash" | "dot";
  className?: string;
}

export function Breadcrumbs({
  items,
  dividerType = "chevron",
  className,
}: BreadcrumbsProps) {
  const renderDivider = () => {
    switch (dividerType) {
      case "slash":
        return <span className="text-text-dark-gray mx-2 select-none">/</span>;
      case "dot":
        return <span className="text-text-dark-gray mx-2 select-none">&bull;</span>;
      case "chevron":
      default:
        return (
          <ChevronRight
            className="h-4 w-4 text-text-dark-gray mx-2 shrink-0 select-none"
            aria-hidden="true"
          />
        );
    }
  };

  return (
    <nav aria-label="Breadcrumb" className={cn("flex w-full py-3", className)}>
      <ol className="inline-flex flex-wrap items-center gap-1 font-label text-xs text-text-muted-gray">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href} className="inline-flex items-center">
              {index > 0 && renderDivider()}
              {isLast ? (
                <span
                  className="font-bold text-text-main"
                  aria-current="page"
                >
                  {item.icon && <span className="mr-1.5 shrink-0">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="inline-flex items-center hover:text-brand-primary transition-colors"
                >
                  {item.icon && <span className="mr-1.5 shrink-0">{item.icon}</span>}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

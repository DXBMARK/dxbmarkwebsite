import * as React from "react";

interface LegalMetadataPillProps {
  effectiveDate: string;
  lastUpdated: string;
  version: string;
  readTime: string;
}

export function LegalMetadataPill({
  effectiveDate,
  lastUpdated,
  version,
  readTime,
}: LegalMetadataPillProps) {
  return (
    <div className="inline-flex flex-wrap max-w-max items-center gap-3 rounded-radius-md border border-border-soft-val bg-white/5 px-3 py-1.5 text-xs text-text-sub mt-2">
      <span>
        Effective Date:{" "}
        <strong className="text-text-main font-bold">{effectiveDate}</strong>
      </span>
      <span className="text-text-dark-gray">|</span>
      <span>
        Last Updated:{" "}
        <strong className="text-text-main font-bold">{lastUpdated}</strong>
      </span>
      <span className="text-text-dark-gray">|</span>
      <span>
        Version: <strong className="text-text-main font-bold">{version}</strong>
      </span>
      <span className="text-text-dark-gray">|</span>
      <span>
        Reading Time: <strong className="text-text-main font-bold">{readTime}</strong>
      </span>
    </div>
  );
}

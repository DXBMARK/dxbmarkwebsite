'use client';

import * as React from 'react';
import { Card } from '@/components/ui/layer-stack';
import type { FAQItem } from '@/content/faqs/contact-faq';

interface FAQCardProps {
  item: FAQItem;
  index: number;
  total: number;
}

export function FAQCard({ item, index, total }: FAQCardProps) {
  return (
    <Card className="overflow-hidden rounded-radius-xl border border-border-soft-val bg-white/[0.035] hover:border-border-strong-val text-text-main shadow-shadow-card backdrop-blur-3xl transition-all duration-300">
      <article className="relative flex h-full flex-col justify-between gap-3 p-5 md:p-6 text-left">
        {/* Subtle decorative spotlight/glare overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,var(--color-accent-glow),transparent_34%)] opacity-[0.06]"
        />

        {/* Card Header */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-brand-primary">
            {item.id}
          </span>
          <span className="h-2 w-2 rounded-full bg-brand-primary/70 shadow-[0_0_8px_var(--color-accent-primary)]" />
        </div>

        {/* Card Body Content */}
        <div className="relative z-10 flex-1 space-y-3">
          <div className="h-px w-10 bg-brand-primary/60" />

          <h3 className="max-w-[26rem] font-sans text-lg font-extrabold sm:text-xl leading-tight tracking-tight text-text-main">
            {item.question}
          </h3>

          {item.answer && (
            <div className="font-body text-xs sm:text-sm leading-relaxed text-text-sub">
              {item.answer}
            </div>
          )}

          {item.bullets && item.bullets.length > 0 && (
            <ul className="grid gap-1.5 font-body text-xs sm:text-sm leading-relaxed text-text-sub">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2 items-start">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {item.closing && (
            <div className="font-body text-xs sm:text-sm leading-relaxed text-text-sub">
              {item.closing}
            </div>
          )}

          {item.links && item.links.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 font-body text-xs sm:text-sm">
              {item.links.map((link, idx) => (
                <React.Fragment key={link.href}>
                  {idx > 0 && <span className="text-text-sub/50">and</span>}
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-brand-primary hover:text-brand-secondary underline underline-offset-4"
                  >
                    {link.label}
                  </a>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="relative z-10 border-t border-border-soft-val pt-3">
          <p className="font-label text-[10px] uppercase tracking-[0.16em] text-text-muted-gray">
            Question {index + 1} of {total}
          </p>
        </div>
      </article>
    </Card>
  );
}

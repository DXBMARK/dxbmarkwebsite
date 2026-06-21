'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { LayerStack } from '@/components/ui/layer-stack';
import { FAQCard } from '@/components/faq/FAQCard';
import type { FAQItem } from '@/content/faqs/contact-faq';

interface FAQStackProps {
  badge?: string;
  title: string;
  description: string;
  supportEmail?: string;
  items: FAQItem[];
  className?: string;
  cardWidth?: number;
  cardGap?: number;
  stageHeight?: number;
  lastCardFullWidth?: boolean;
}

export function FAQStack({
  badge = 'FAQ',
  title,
  description,
  supportEmail,
  items,
  className,
  cardWidth = 360,
  cardGap = 16,
  stageHeight = 460,
  lastCardFullWidth = true,
}: FAQStackProps) {
  const titleWords = title.split(' ');

  return (
    <section
      aria-labelledby="faq-stack-title"
      className={cn(
        'relative w-full overflow-hidden py-20 sm:py-24 lg:py-28',
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Section Badge */}
          {badge && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-primary/25 bg-[#0d2130]/95 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-primary backdrop-blur-md shadow-inner">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_6px_var(--color-accent-primary)]" />
              {badge}
            </div>
          )}

          {/* Section Title with individual word animation */}
          <h2
            id="faq-stack-title"
            className="font-sans text-3xl font-black tracking-tight text-text-main sm:text-4xl md:text-5xl lg:text-[4.25rem] leading-[1.05]"
          >
            {titleWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                initial={{ opacity: 0, filter: 'blur(6px)', y: 12 }}
                whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.06,
                  ease: 'easeOut',
                }}
                className={cn(
                  'mr-3 inline-block',
                  // Highlight the last two words with a gradient
                  index >= titleWords.length - 2 &&
                    'bg-gradient-to-r from-text-main via-brand-primary to-brand-secondary bg-clip-text text-transparent pb-1',
                )}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          {/* Section Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: 0.25, ease: 'easeOut' }}
            className="mx-auto mt-6 max-w-2xl font-body text-xs sm:text-sm leading-relaxed text-text-sub md:text-base"
          >
            {description}{' '}
            {supportEmail && (
              <>
                For direct help, email{' '}
                <a
                  href={`mailto:${supportEmail}`}
                  className="font-bold text-brand-primary underline underline-offset-4 transition-colors hover:text-brand-secondary"
                >
                  {supportEmail}
                </a>
                .
              </>
            )}
          </motion.p>
        </div>

        {/* LayerStack wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, delay: 0.35, ease: 'easeOut' }}
          className="mt-14 sm:mt-16 lg:mt-18"
        >
          <LayerStack
            cardWidth={cardWidth}
            cardGap={cardGap}
            stageHeight={stageHeight}
            lastCardFullWidth={lastCardFullWidth}
            mobileSensitivity={1.6}
          >
            {items.map((item, index) => (
              <FAQCard
                key={item.id}
                item={item}
                index={index}
                total={items.length}
              />
            ))}
          </LayerStack>
        </motion.div>
      </div>
    </section>
  );
}

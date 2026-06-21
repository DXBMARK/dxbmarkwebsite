'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { LayerStack, Card } from '@/components/ui/layer-stack';

interface FAQItem {
  question: string;
  answer?: React.ReactNode;
  bullets?: string[];
  closing?: React.ReactNode;
}

interface ContactFAQStackProps {
  className?: string;
}

const CONTACT_FAQS: FAQItem[] = [
  {
    question: 'Will you help solve my business problem?',
    answer: 'Yes. We start by understanding the real issue before recommending a solution.',
    bullets: [
      'Business goal',
      'Current workflow',
      'Technical gap',
      'Practical next step',
    ],
    closing: 'If we are not the right fit, we will say that clearly.',
  },
  {
    question: 'Do I need a full technical brief before contacting you?',
    answer:
      'No. A short explanation of what you want to build, improve, automate, or fix is enough to start. If more technical detail is needed, we will help define it during the first review.',
  },
  {
    question: 'What happens after I submit the contact form?',
    answer:
      'We review your request, route it to the right department or service path, and reply with the next practical step. Most business inquiries are reviewed within one business day during operating hours, with consideration for time zone differences.',
  },
  {
    question: 'Can you improve an existing website, system, or workflow?',
    answer:
      'Yes. We can review existing websites, SaaS platforms, workflows, integrations, hosting setups, and operational systems. The goal is to decide whether to improve, rebuild, integrate, or simplify what already exists.',
  },
  {
    question: 'What type of projects can you handle?',
    answer:
      'We work on websites, web applications, SaaS platforms, automation workflows, integrations, cloud and hosting infrastructure, dashboards, portals, managed hosting, and technical consulting for startups and growing businesses.',
  },
  {
    question: 'How do we handle customer data?',
    answer: (
      <div className="space-y-3">
        <p className="font-body text-sm leading-relaxed text-text-sub">
          We use customer information only for agreed business purposes:
        </p>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 font-body text-xs sm:text-sm leading-relaxed text-text-sub">
          <li className="flex gap-2 items-start">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
            <span>Service delivery</span>
          </li>
          <li className="flex gap-2 items-start">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
            <span>Support and communication</span>
          </li>
          <li className="flex gap-2 items-start">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
            <span>Billing and security</span>
          </li>
          <li className="flex gap-2 items-start">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
            <span>Project operations</span>
          </li>
        </ul>
      </div>
    ),
    closing: (
      <div className="space-y-2">
        <p>We do not sell personal data or use customer information for unrelated marketing.</p>
        <p className="pt-1">
          <a
            href="/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-primary hover:text-brand-secondary underline underline-offset-4"
          >
            Read the Privacy Policy.
          </a>
        </p>
      </div>
    ),
  },
  {
    question: 'Do we train AI on client data?',
    answer: 'No. We do not use client personal data, payment data, confidential project data, or production data to train public AI models.',
    closing: (
      <div className="space-y-2">
        <p>If AI tools are used in a workflow, they must follow the agreed privacy, security, and customer authorization rules.</p>
        <p className="pt-1">
          <a
            href="/legal/security-statement"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-primary hover:text-brand-secondary underline underline-offset-4"
          >
            Review the Security Statement
          </a>
          {' '}and{' '}
          <a
            href="/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-primary hover:text-brand-secondary underline underline-offset-4"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    ),
  },
  {
    question: 'Do you have a refund or cancellation policy?',
    answer: (
      <div className="space-y-3">
        <p className="font-body text-sm leading-relaxed text-text-sub">
          Yes. Refund and cancellation terms depend on the service type, project stage, and written agreement.
        </p>
        <p className="font-body text-sm leading-relaxed text-text-sub">
          Custom project deposits, setup, onboarding, discovery, and development fees are generally non-refundable once work has started, unless required by law or stated in the agreement.
        </p>
        <p className="font-body text-sm leading-relaxed text-text-sub pt-1">
          <a
            href="/legal/refund-cancellation"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-primary hover:text-brand-secondary underline underline-offset-4"
          >
            Read the Refund and Cancellation Policy.
          </a>
        </p>
      </div>
    ),
  },
];

const SUPPORT_EMAIL = 'support@dxbmark.com';

export function ContactFAQStack({ className }: ContactFAQStackProps) {
  const titleWords = ['Questions', 'before', 'you', 'contact', 'us?'];

  return (
    <section
      aria-labelledby='contact-faq-title'
      className={cn(
        'relative w-full overflow-hidden py-20 sm:py-24 lg:py-28',
        className,
      )}
    >
      <div className='mx-auto max-w-6xl px-4 sm:px-6'>
        <div className='mx-auto max-w-4xl text-center'>
          <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-brand-primary/25 bg-[#0d2130]/95 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-primary backdrop-blur-md shadow-inner'>
            <span className='h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_6px_var(--color-accent-primary)]' />
            FAQ
          </div>

          <h2
            id='contact-faq-title'
            className='font-sans text-3xl font-black tracking-tight text-text-main sm:text-4xl md:text-5xl lg:text-[4.25rem] leading-[1.05]'
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
                  index >= 3 &&
                    'bg-gradient-to-r from-text-main via-brand-primary to-brand-secondary bg-clip-text text-transparent pb-1',
                )}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: 0.25, ease: 'easeOut' }}
            className='mx-auto mt-6 max-w-2xl font-body text-xs sm:text-sm leading-relaxed text-text-sub md:text-base'
          >
            Here are the answers most clients look for before starting a
            project, requesting support, or contacting the right department. For
            direct help, email{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className='font-bold text-brand-primary underline underline-offset-4 transition-colors hover:text-brand-secondary'
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, delay: 0.35, ease: 'easeOut' }}
          className='mt-14 sm:mt-16 lg:mt-18'
        >
          <LayerStack
            cardWidth={390}
            cardGap={18}
            stageHeight={440}
            lastCardFullWidth
            mobileSensitivity={1.6}
          >
            {CONTACT_FAQS.map((item, index) => (
              <Card
                key={item.question}
                className='overflow-hidden rounded-radius-xl border border-border-soft-val bg-white/[0.035] hover:border-border-strong-val text-text-main shadow-shadow-card backdrop-blur-3xl transition-all duration-300'
              >
                <article className='relative flex h-full flex-col justify-between gap-5 p-6 md:p-8 text-left'>
                  <div
                    aria-hidden='true'
                    className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,var(--color-accent-glow),transparent_34%)] opacity-10'
                  />

                  <div className='relative z-10 flex items-center justify-between'>
                    <span className='font-label text-[11px] font-bold uppercase tracking-[0.18em] text-brand-primary'>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className='h-2 w-2 rounded-full bg-brand-primary/70 shadow-[0_0_8px_var(--color-accent-primary)]' />
                  </div>

                  <div className='relative z-10 flex-1 space-y-4'>
                    <div className='h-px w-10 bg-brand-primary/60' />

                    <h3 className='max-w-[26rem] font-sans text-lg font-extrabold sm:text-xl md:text-2xl leading-tight tracking-tight text-text-main'>
                      {item.question}
                    </h3>

                    {item.answer && (
                      <div className='font-body text-sm leading-relaxed text-text-sub'>
                        {item.answer}
                      </div>
                    )}

                    {item.bullets && item.bullets.length > 0 && (
                      <ul className='grid gap-1.5 font-body text-sm leading-relaxed text-text-sub'>
                        {item.bullets.map((bullet) => (
                          <li key={bullet} className='flex gap-2 items-start'>
                            <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary' />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.closing && (
                      <div className='font-body text-sm leading-relaxed text-text-sub'>
                        {item.closing}
                      </div>
                    )}
                  </div>

                  <div className='relative z-10 border-t border-border-soft-val pt-4'>
                    <p className='font-label text-[10px] uppercase tracking-[0.16em] text-text-muted-gray'>
                      Question {index + 1} of {CONTACT_FAQS.length}
                    </p>
                  </div>
                </article>
              </Card>
            ))}
          </LayerStack>
        </motion.div>
      </div>
    </section>
  );
}

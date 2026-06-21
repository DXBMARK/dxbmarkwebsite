'use client';

import * as React from 'react';
import { contactFaqs } from '@/content/faqs/contact-faq';
import { FAQStack } from '@/components/faq/FAQStack';

interface ContactFAQStackProps {
  className?: string;
}

export function ContactFAQStack({ className }: ContactFAQStackProps) {
  return (
    <FAQStack
      badge="FAQ"
      title="Questions before you contact us?"
      description="Here are the answers most clients look for before starting a project, requesting support, or contacting the right department."
      supportEmail="support@dxbmark.com"
      items={contactFaqs}
      className={className}
      cardWidth={360}
      cardGap={16}
      stageHeight={460}
      lastCardFullWidth
    />
  );
}


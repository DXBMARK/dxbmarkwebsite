"use client";

import * as React from "react";
import Link from "next/link";
import { Container, Section } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Glow } from "@/components/visual";

export function NotFoundContent() {
  const [imgError, setImgError] = React.useState(false);

  return (
    <Section className="relative min-h-[80vh] flex items-center justify-center bg-background-slate overflow-hidden py-16">
      <Glow className="absolute inset-0 z-0" />
      
      <Container className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center justify-center">
        {/* Left Column: Visual Illustration with subtle 3D hover depth */}
        <div className="lg:col-span-6 flex items-center justify-center relative w-full h-72 sm:h-96 group">
          {!imgError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src="/assets/illustrations/404-error-amico.svg"
              alt="404 page not found illustration"
              className="h-full max-h-96 w-auto object-contain opacity-85 transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:-translate-y-2 group-hover:rotate-1"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-muted-gray select-none border border-border-soft-val bg-background-dark/20 rounded-radius-xl p-8">
              <span className="font-sans text-9xl font-black tracking-widest text-brand-primary/10 animate-pulse">404</span>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-text-dark-gray">System Path Unreachable</span>
            </div>
          )}
        </div>

        {/* Right Column: Informative Content block */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 max-w-lg mx-auto lg:mx-0">
          <div className="flex flex-col gap-3">
            <span className="inline-flex max-w-max items-center rounded-radius-full bg-brand-glow border border-brand-primary/20 px-3 py-1 text-xs font-bold text-brand-primary uppercase">
              Error Code 404
            </span>
            <h1 className="font-sans text-4xl md:text-5xl font-black text-text-main tracking-tight leading-none">
              Page not found
            </h1>
            <p className="font-body text-sm md:text-base text-text-sub leading-relaxed">
              The page you are looking for does not exist, has moved, or is temporarily unavailable.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
            <Link href="/" className="w-full sm:w-auto" passHref>
              <Button variant="primary" size="lg" className="w-full sm:w-auto font-label">
                Back to home
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto" passHref>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto font-label">
                Contact support
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}

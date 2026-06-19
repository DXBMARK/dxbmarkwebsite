"use client";

import * as React from "react";
import Script from "next/script";

export function CookieDeclaration() {
  return (
    <div className="mt-12 pt-8 border-t border-border-soft-val">
      <h2 className="font-sans text-xl md:text-2xl font-bold text-brand-primary tracking-tight mb-6">
        Cookie Declaration
      </h2>
      <Script
        id="CookieDeclaration"
        src="https://consent.cookiebot.com/99d6ba11-8ea1-490c-aec8-c4fbd0848d5c/cd.js"
        strategy="afterInteractive"
      />
    </div>
  );
}

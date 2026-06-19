"use client";

import * as React from "react";

export function CookieSettingsButton() {
  const handleRenew = () => {
    if (typeof window !== "undefined" && window.Cookiebot) {
      try {
        window.Cookiebot.renew();
      } catch (err) {
        console.error("Failed to renew Cookiebot consent:", err);
      }
    }
  };

  return (
    <button
      onClick={handleRenew}
      className="text-xs font-body text-text-sub hover:text-brand-primary transition-colors text-left"
    >
      Cookie Settings
    </button>
  );
}

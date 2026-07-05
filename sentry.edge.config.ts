// SpecKit Sentry Edge Configuration
// sentry.edge.config.ts

import * as Sentry from "@sentry/nextjs";

const parsedTraceRate = Number.parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0");

const tracesSampleRate =
  Number.isFinite(parsedTraceRate) && parsedTraceRate >= 0 && parsedTraceRate <= 1
    ? parsedTraceRate
    : 0;

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set safe, configurable tracesSampleRate for performance monitoring
  tracesSampleRate,

  // Disable default PII collection to meet strict security and GDPR compliance
  sendDefaultPii: false,

  // Sanitization hook to redact sensitive financial, credentials, headers, and PII details
  beforeSend(event) {
    // Serialize entire event to perform deep regex-based sanitization
    let eventString = JSON.stringify(event);

    const patterns = [
      /sk_live_[a-zA-Z0-9]+/g,                          // Stripe Secret Live Keys
      /sk_test_[a-zA-Z0-9]+/g,                          // Stripe Secret Test Keys
      /rk_live_[a-zA-Z0-9]+/g,                          // Stripe Restricted Live Keys
      /rk_test_[a-zA-Z0-9]+/g,                          // Stripe Restricted Test Keys
      /whsec_[a-zA-Z0-9]+/g,                            // Stripe Webhook Secrets
      /zoho_ref_[a-zA-Z0-9]+/g,                         // Zoho Refresh Tokens
      /postgres(?:ql)?:\/\/[^:]+:[^@]+@[^/]+\/[^\s"]+/g, // Database URLs
      /(?:bearer|basic)\s+[a-zA-Z0-9._~+/=-]+/gi,       // Authorization Headers
      /cookie:\s*[^;"]+/gi,                             // Cookie headers
      /\b\d{13,19}\b/g                                  // Card number patterns (13-19 digits)
    ];

    patterns.forEach((pattern) => {
      eventString = eventString.replace(pattern, "[REDACTED_SENSITIVE_DATA]");
    });

    try {
      return JSON.parse(eventString);
    } catch {
      return event;
    }
  },
});

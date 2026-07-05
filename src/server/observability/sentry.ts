// SpecKit T031 — Add Safe Optional Sentry Error Capture Calls to Stripe Webhook Processing
// src/server/observability/sentry.ts

import * as Sentry from "@sentry/nextjs";

export interface WebhookObservabilityContext {
  route: string;
  stage: string;
  stripeEventId?: string | null;
  stripeEventType?: string | null;
  objectId?: string | null;
  objectType?: string | null;
  processingStatus?: string | null;
  queueStatus?: string | null;
  dbStatus?: string | null;
  retryCount?: number | null;
}

/**
 * Sanitizes the observability context before passing to Sentry or logging.
 * Filters out raw objects, secrets, PII, and full URLs.
 */
function sanitizeContext(context: WebhookObservabilityContext): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {
    route: context.route,
    stage: context.stage,
  };

  if (context.stripeEventId) sanitized.stripeEventId = context.stripeEventId;
  if (context.stripeEventType) sanitized.stripeEventType = context.stripeEventType;
  if (context.objectId) sanitized.objectId = context.objectId;
  if (context.objectType) sanitized.objectType = context.objectType;
  if (context.processingStatus) sanitized.processingStatus = context.processingStatus;
  if (context.queueStatus) sanitized.queueStatus = context.queueStatus;
  if (context.dbStatus) sanitized.dbStatus = context.dbStatus;
  if (typeof context.retryCount === "number") sanitized.retryCount = context.retryCount;

  return sanitized;
}

function summarizeError(error: unknown): Record<string, string> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  return {
    name: "UnknownError",
    message: "Non-Error exception",
  };
}

/**
 * Safely captures an exception during webhook processing, attaching sanitized context.
 * This wrapper is guaranteed never to throw or block runtime processing.
 */
export function captureWebhookException(
  error: unknown,
  context: WebhookObservabilityContext
): void {
  try {
    const hasDsn = !!(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN);
    const sanitized = sanitizeContext(context);
    const errorSummary = summarizeError(error);

    // Logging locally to preserve stdout visibility with sanitized summaries only
    console.error(
      `[OBSERVABILITY EXCEPTION] Webhook exception captured at route: ${context.route}, stage: ${context.stage}`,
      {
        error: errorSummary,
        context: sanitized,
      }
    );

    if (hasDsn) {
      Sentry.withScope((scope) => {
        scope.setTags({
          route: context.route,
          stage: context.stage,
          stripe_event_id: context.stripeEventId || "unknown",
          stripe_event_type: context.stripeEventType || "unknown",
        });
        scope.setExtras(sanitized);
        Sentry.captureException(error);
      });
    }
  } catch (err) {
    // Fail-safe: Swallowing all exceptions to prevent breaking the caller
    console.error(
      "[OBSERVABILITY EXCEPTION FAIL-SAFE] Failed to capture exception safely:",
      summarizeError(err)
    );
  }
}

/**
 * Safely captures a message during webhook processing, attaching sanitized context.
 * This wrapper is guaranteed never to throw or block runtime processing.
 */
export function captureWebhookMessage(
  message: string,
  context: WebhookObservabilityContext,
  level: "info" | "warning" | "error" = "info"
): void {
  try {
    const hasDsn = !!(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN);
    const sanitized = sanitizeContext(context);

    console.log(
      `[OBSERVABILITY MESSAGE] [${level.toUpperCase()}] ${message}\nContext:`,
      JSON.stringify(sanitized, null, 2)
    );

    if (hasDsn) {
      Sentry.withScope((scope) => {
        scope.setTags({
          route: context.route,
          stage: context.stage,
          stripe_event_id: context.stripeEventId || "unknown",
          stripe_event_type: context.stripeEventType || "unknown",
        });
        scope.setExtras(sanitized);
        scope.setLevel(level === "warning" ? "warning" : level === "error" ? "error" : "info");
        Sentry.captureMessage(message);
      });
    }
  } catch (err) {
    // Fail-safe: Swallowing all exceptions to prevent breaking the caller
    console.error(
      "[OBSERVABILITY MESSAGE FAIL-SAFE] Failed to capture message safely:",
      summarizeError(err)
    );
  }
}

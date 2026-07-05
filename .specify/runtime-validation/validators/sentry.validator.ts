// SpecKit Runtime Validation Layer v3 — Sentry Validator
// Real Sentry error injection using Sentry Store API (no SDK required in runner context)

import type { ValidationResult } from "../types.ts";

export async function validateSentry(): Promise<ValidationResult> {
  const start = Date.now();

  const sentryDsn = process.env.SENTRY_DSN;

  if (!sentryDsn) {
    return {
      system: "sentry",
      status: "skip",
      success: false,
      latencyMs: 0,
      details: { error: "SENTRY_DSN not set" },
    };
  }

  // ── Detect placeholder DSN ────────────────────────────────────────────
  if (sentryDsn.includes("placeholder")) {
    return {
      system: "sentry",
      status: "skip",
      success: false,
      latencyMs: 0,
      details: {
        warning: "SENTRY_DSN is a placeholder — skipping real event injection",
        recommendation: "Replace SENTRY_DSN with a real DSN before production",
        dsn: sentryDsn.slice(0, 40) + "...",
      },
    };
  }

  try {
    // ── Parse DSN → extract Store API endpoint ────────────────────────────
    // DSN format: https://{key}@{host}/{project_id}
    const dsnMatch = sentryDsn.match(/^https?:\/\/([^@]+)@([^/]+)\/(\d+)$/);
    if (!dsnMatch) {
      return {
        system: "sentry",
        status: "fail",
        success: false,
        latencyMs: Date.now() - start,
        details: { error: "Could not parse SENTRY_DSN format", dsn: sentryDsn.slice(0, 40) + "..." },
      };
    }

    const [, publicKey, host, projectId] = dsnMatch;
    const storeUrl = `https://${host}/api/${projectId}/store/`;

    // ── Build a minimal Sentry envelope payload ───────────────────────────
    const eventId = crypto.randomUUID().replace(/-/g, "");
    const timestamp = Math.floor(Date.now() / 1000);

    const envelope = JSON.stringify({
      event_id: eventId,
      timestamp,
      platform: "node",
      level: "warning",
      logger: "speckit.runtime-validation",
      transaction: "rv3.sentry.validator",
      message: {
        formatted: `[SpecKit RV3] Runtime validation test — ${new Date().toISOString()}`,
      },
      tags: {
        source: "speckit-runtime-validation",
        environment: "development",
        rv3_test: "true",
      },
      extra: {
        note: "This is a SpecKit preflight test event — safe to ignore in production",
        testId: `rv3_sentry_${Date.now()}`,
      },
    });

    const sentryRes = await fetch(storeUrl, {
      method: "POST",
      headers: {
        "X-Sentry-Auth": `Sentry sentry_version=7, sentry_key=${publicKey}`,
        "Content-Type": "application/json",
      },
      body: envelope,
      signal: AbortSignal.timeout(8000),
    });

    const latencyMs = Date.now() - start;

    if (latencyMs > 5000) {
      return {
        system: "sentry",
        status: "fail",
        success: false,
        latencyMs,
        inflated: true,
        details: { error: "Sentry response exceeded 5000ms" },
      };
    }

    const responseBody = await sentryRes.text().catch(() => "");

    // Sentry Store API returns 200 with event ID on success
    const success = sentryRes.status === 200 || sentryRes.status === 201;

    return {
      system: "sentry",
      status: success ? "pass" : "fail",
      success,
      latencyMs,
      details: {
        httpStatus: sentryRes.status,
        sentEventId: eventId,
        storeUrl,
        responsePreview: responseBody.slice(0, 100),
      },
    };
  } catch (err: unknown) {
    return {
      system: "sentry",
      status: "error",
      success: false,
      latencyMs: Date.now() - start,
      details: { error: err instanceof Error ? err.message : String(err) },
    };
  }
}

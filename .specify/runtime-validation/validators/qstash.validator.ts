// SpecKit Runtime Validation Layer v3 — QStash Validator
// Real publish call to QStash — verifies auth + message delivery acceptance

import type { ValidationResult } from "../types.ts";

export async function validateQStash(): Promise<ValidationResult> {
  const start = Date.now();

  const qstashUrl = process.env.QSTASH_URL;
  const qstashToken = process.env.QSTASH_TOKEN;

  if (!qstashUrl || !qstashToken) {
    return {
      system: "qstash",
      status: "skip",
      success: false,
      latencyMs: 0,
      details: { error: "QSTASH_URL or QSTASH_TOKEN not set" },
    };
  }

  try {
    // ── Step 1: List queues — confirm auth works ───────────────────────────
    const listRes = await fetch(`${qstashUrl}/v2/queues`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${qstashToken}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(8000),
    });

    const listLatency = Date.now() - start;

    if (!listRes.ok) {
      const body = await listRes.text().catch(() => "");
      return {
        system: "qstash",
        status: "fail",
        success: false,
        latencyMs: listLatency,
        details: {
          step: "auth",
          httpStatus: listRes.status,
          error: body.slice(0, 300),
        },
      };
    }

    const queues = await listRes.json().catch(() => []);

    // ── Step 2: Publish a test message to a known callback URL ────────────
    // We publish to https://httpbin.org/post as a no-side-effect sink
    // This verifies QStash actually accepts publish requests with our token
    const testPayload = {
      source: "speckit-rv3",
      testId: `rv3_qstash_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    const publishRes = await fetch(`${qstashUrl}/v2/publish/https://httpbin.org/post`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${qstashToken}`,
        "Content-Type": "application/json",
        // Tell QStash this is a test — no real delivery expected
        "Upstash-Delay": "86400s", // 24h delay → effectively a canary that never fires
      },
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(10000),
    });

    const latencyMs = Date.now() - start;

    if (latencyMs > 5000) {
      return {
        system: "qstash",
        status: "fail",
        success: false,
        latencyMs,
        inflated: true,
        details: { error: "QStash publish exceeded 5000ms — not trustworthy" },
      };
    }

    const publishBody = await publishRes.json().catch(() => ({}));
    const publishAccepted = publishRes.ok;

    // ── Step 3: Cancel the delayed message if we got a messageId ─────────
    const messageId = (publishBody as Record<string, unknown>).messageId as string | undefined;
    if (messageId) {
      // Best-effort cancel — ignore errors
      await fetch(`${qstashUrl}/v2/messages/${messageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${qstashToken}` },
        signal: AbortSignal.timeout(5000),
      }).catch(() => {});
    }

    return {
      system: "qstash",
      status: publishAccepted ? "pass" : "fail",
      success: publishAccepted,
      latencyMs,
      details: {
        authStep: { httpStatus: listRes.status, queueCount: Array.isArray(queues) ? queues.length : "unknown" },
        publishStep: { httpStatus: publishRes.status, messageId, accepted: publishAccepted },
        testPayload,
      },
    };
  } catch (err: unknown) {
    return {
      system: "qstash",
      status: "error",
      success: false,
      latencyMs: Date.now() - start,
      details: { error: err instanceof Error ? err.message : String(err) },
    };
  }
}

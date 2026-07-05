// SpecKit Runtime Validation Layer v3 — Stripe Validator
// Real Stripe API auth + balance retrieval — verifies key is live and valid

import type { ValidationResult } from "../types.ts";

export async function validateStripe(): Promise<ValidationResult> {
  const start = Date.now();

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    return {
      system: "stripe",
      status: "skip",
      success: false,
      latencyMs: 0,
      details: { error: "STRIPE_SECRET_KEY not set" },
    };
  }

  // ── Kill switch: reject non-standard key formats immediately ──────────
  if (!stripeKey.startsWith("sk_test_") && !stripeKey.startsWith("sk_live_")) {
    return {
      system: "stripe",
      status: "fail",
      success: false,
      latencyMs: 0,
      details: {
        error: "STRIPE_SECRET_KEY has invalid format — must start with sk_test_ or sk_live_",
        keyPrefix: stripeKey.slice(0, 8),
      },
    };
  }

  try {
    // ── Step 1: GET /v1/balance — real authenticated API call ────────────
    const balanceRes = await fetch("https://api.stripe.com/v1/balance", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Stripe-Version": "2024-12-18.acacia",
      },
      signal: AbortSignal.timeout(10000),
    });

    const latencyMs = Date.now() - start;

    if (latencyMs > 5000) {
      return {
        system: "stripe",
        status: "fail",
        success: false,
        latencyMs,
        inflated: true,
        details: { error: "Stripe API response exceeded 5000ms" },
      };
    }

    const body = await balanceRes.json().catch(() => ({})) as Record<string, unknown>;

    if (!balanceRes.ok) {
      return {
        system: "stripe",
        status: "fail",
        success: false,
        latencyMs,
        details: {
          httpStatus: balanceRes.status,
          error: (body.error as Record<string, unknown>)?.message ?? "Stripe API rejected the request",
        },
      };
    }

    // ── Step 2: Validate response shape — not just HTTP 200 ──────────────
    const livemode = body.livemode as boolean;
    const available = body.available as Array<{ amount: number; currency: string }>;

    if (!Array.isArray(available)) {
      return {
        system: "stripe",
        status: "fail",
        success: false,
        latencyMs,
        details: { error: "Response shape invalid — missing 'available' array", body },
      };
    }

    // ── Step 3: Mode safety check ─────────────────────────────────────────
    const expectedMode = stripeKey.startsWith("sk_live_") ? true : false;
    const modeConsistent = livemode === expectedMode;

    return {
      system: "stripe",
      status: "pass",
      success: true,
      latencyMs,
      details: {
        httpStatus: balanceRes.status,
        livemode,
        modeConsistent,
        mode: livemode ? "LIVE" : "TEST",
        availableBalances: available.map((b) => `${b.amount / 100} ${b.currency.toUpperCase()}`),
        keyPrefix: stripeKey.slice(0, 12) + "...",
      },
    };
  } catch (err: unknown) {
    return {
      system: "stripe",
      status: "error",
      success: false,
      latencyMs: Date.now() - start,
      details: { error: err instanceof Error ? err.message : String(err) },
    };
  }
}

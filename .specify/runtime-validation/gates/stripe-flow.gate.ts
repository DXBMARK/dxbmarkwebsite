// SpecKit Runtime Validation Layer v3 — Stripe Flow Gate
// Verifies: API auth, response shape, mode consistency

import type { GateResult, ValidationResult } from "../types.ts";

export function stripeFlowGate(result: ValidationResult): GateResult {
  const { success, details, latencyMs, inflated, status } = result;

  if (status === "skip") {
    return { gate: "stripe-flow", passed: false, reason: "STRIPE_SECRET_KEY not set", data: details };
  }

  if (inflated) {
    return { gate: "stripe-flow", passed: false, reason: `Stripe latency ${latencyMs}ms exceeded kill-switch threshold` };
  }

  if (!success) {
    return {
      gate: "stripe-flow",
      passed: false,
      reason: (details.error as string) ?? `Stripe API returned HTTP ${details.httpStatus}`,
      data: details,
    };
  }

  const { livemode, modeConsistent, mode, availableBalances } = details as {
    livemode: boolean;
    modeConsistent: boolean;
    mode: string;
    availableBalances: string[];
  };

  if (!modeConsistent) {
    return {
      gate: "stripe-flow",
      passed: false,
      reason: `Key/mode mismatch — key prefix implies ${livemode ? "test" : "live"} but API returned livemode=${livemode}`,
      data: details,
    };
  }

  return {
    gate: "stripe-flow",
    passed: true,
    reason: `Auth ✅ | Mode: ${mode} | Balances: ${availableBalances?.join(", ") ?? "0"} | ${latencyMs}ms`,
    data: { livemode, mode, latencyMs },
  };
}

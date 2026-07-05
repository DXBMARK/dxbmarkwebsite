// SpecKit Runtime Validation Layer v3 — DB Transaction Gate
// Verifies: idempotency enforcement, write consistency, cleanup success

import type { GateResult, ValidationResult } from "../types.ts";

export function dbTransactionGate(result: ValidationResult): GateResult {
  const { success, details, latencyMs, inflated } = result;

  if (inflated) {
    return { gate: "db-transaction", passed: false, reason: "DB latency exceeded kill-switch threshold (8000ms)", data: { latencyMs } };
  }

  if (!success) {
    return {
      gate: "db-transaction",
      passed: false,
      reason: details.error as string ?? "DB validation failed",
      data: details,
    };
  }

  const { consistent, idempotencyVerified, steps } = details as {
    consistent: boolean;
    idempotencyVerified: boolean;
    steps: string[];
  };

  if (!consistent) {
    return { gate: "db-transaction", passed: false, reason: "Read-back data did not match inserted row", data: details };
  }

  if (!idempotencyVerified) {
    return { gate: "db-transaction", passed: false, reason: "UNIQUE constraint did NOT prevent duplicate insert — idempotency broken", data: details };
  }

  return {
    gate: "db-transaction",
    passed: true,
    reason: `Write→Read→Idempotency→Cleanup verified in ${latencyMs}ms`,
    data: { steps, latencyMs },
  };
}

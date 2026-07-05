// SpecKit Runtime Validation Layer v3 — Queue Flow Gate
// Verifies: QStash auth accepted, publish accepted, latency acceptable

import type { GateResult, ValidationResult } from "../types.ts";

export function queueFlowGate(result: ValidationResult): GateResult {
  const { success, details, latencyMs, inflated } = result;

  if (result.status === "skip") {
    return { gate: "queue-flow", passed: false, reason: "QStash credentials not set — skipped", data: details };
  }

  if (inflated) {
    return { gate: "queue-flow", passed: false, reason: `QStash latency ${latencyMs}ms exceeded kill-switch threshold` };
  }

  if (!success) {
    return {
      gate: "queue-flow",
      passed: false,
      reason: (details.error as string) ?? `QStash ${details.step ?? "publish"} step failed`,
      data: details,
    };
  }

  const { authStep, publishStep } = details as {
    authStep: { httpStatus: number; queueCount: number | string };
    publishStep: { httpStatus: number; accepted: boolean };
  };

  if (!authStep || authStep.httpStatus !== 200) {
    return { gate: "queue-flow", passed: false, reason: `QStash auth returned HTTP ${authStep?.httpStatus}` };
  }

  if (!publishStep?.accepted) {
    return { gate: "queue-flow", passed: false, reason: `QStash publish returned HTTP ${publishStep?.httpStatus} — not accepted` };
  }

  return {
    gate: "queue-flow",
    passed: true,
    reason: `Auth ✅ + Publish ✅ in ${latencyMs}ms`,
    data: { authStep, publishStep, latencyMs },
  };
}

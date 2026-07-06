#!/usr/bin/env node
// SpecKit Runtime Validation Layer v3 — Main Runner
// Run: node --experimental-strip-types .specify/runtime-validation/runner.ts
// Or:  npm run validate:runtime [--strict | --ci | --json]

import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ── Load .env.local from project root ────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "../../");

config({ path: resolve(projectRoot, ".env.local") });
config({ path: resolve(projectRoot, ".env") });

// ── Resolve run mode from CLI args ────────────────────────────────────────
import type { RunMode, GateResult } from "./types.ts";
import { MODE_THRESHOLDS } from "./types.ts";

function resolveMode(): RunMode {
  if (process.argv.includes("--strict")) return "STRICT";
  if (process.argv.includes("--ci")) return "CI";
  return "SAFE";
}

const MODE: RunMode = resolveMode();

// ── Import validators ─────────────────────────────────────────────────────
import { validateNeon } from "./validators/neon.validator.ts";
import { validateQStash } from "./validators/qstash.validator.ts";
import { validateStripe } from "./validators/stripe.validator.ts";
import { validateSentry } from "./validators/sentry.validator.ts";

// ── Import gates ──────────────────────────────────────────────────────────
import { dbTransactionGate } from "./gates/db-transaction.gate.ts";
import { queueFlowGate } from "./gates/queue-flow.gate.ts";
import { stripeFlowGate } from "./gates/stripe-flow.gate.ts";

// ── Import report ─────────────────────────────────────────────────────────
import { buildReport, printReport } from "./report.builder.ts";

// ═══════════════════════════════════════════════════════════════════════════
// KILL SWITCH RULES (enforced per validator):
// ❌ Do NOT trust: HTTP 200 alone | key existence alone | SELECT 1
// ❌ Reject: latencyMs > 5000 per system (marked as inflated → score = 0)
// ❌ Reject: inflated results — treated as FAIL regardless of HTTP status
//
// SCORING RULES:
// PASS    = full weight  (Stripe:40 | Neon:30 | QStash:30 | Sentry:optional in SAFE/CI and required in STRICT)
// SKIP    = 50% weight in STRICT mode penalty; neutral in SAFE/CI mode
// FAIL    = 0 pts
// ERROR   = 0 pts
// inflated = 0 pts       (kill-switch activated)
//
// STRICT MODE: SKIP = 0 pts (no tolerance for missing systems, threshold = 100)
// CI MODE: threshold 100/100 (Core systems must pass, Sentry is neutral)
// SAFE MODE: threshold 100/100 (Core systems must pass, Sentry is neutral, default)
//
// CRITICAL SYSTEMS (weight ≥ 30): Stripe, Neon
// → Critical FAIL blocks "ready" even if score ≥ threshold
// ═══════════════════════════════════════════════════════════════════════════

async function run(): Promise<void> {
  const threshold = MODE === "STRICT"
    ? MODE_THRESHOLDS.STRICT
    : MODE === "CI"
      ? MODE_THRESHOLDS.CI
      : MODE_THRESHOLDS.SAFE;

  console.log(`\n⏳  Running SpecKit Runtime Validation v3...`);
  console.log(`    Mode: ${MODE} | Threshold: ${threshold}/100\n`);

  const start = Date.now();

  // ── Run all validators in parallel ───────────────────────────────────────
  const [neonResult, qstashResult, stripeResult, sentryResult] = await Promise.all([
    validateNeon(),
    validateQStash(),
    validateStripe(),
    validateSentry(),
  ]);

  const totalMs = Date.now() - start;

  // ── Sentry gate — SKIP handling depends on mode ───────────────────────
  // STRICT: SKIP = gate FAIL
  // CI/SAFE: SKIP = warning (not a gate failure, but penalized in score)
  const sentryGatePassed = MODE === "STRICT"
    ? sentryResult.success && !sentryResult.inflated
    : sentryResult.success || sentryResult.status === "skip";

  const sentryGateReason = sentryResult.status === "skip"
    ? MODE === "STRICT"
      ? `STRICT mode — SKIP not tolerated. ${(sentryResult.details.warning as string) ?? "No real DSN configured"}`
      : `Placeholder DSN — Sentry score penalized 50% (${(sentryResult.details.recommendation as string) ?? "replace before production"})`
    : sentryResult.success
      ? `Event delivered in ${sentryResult.latencyMs}ms`
      : `Event delivery FAILED — ${(sentryResult.details.error as string) ?? "unknown error"}`;

  // ── Run gates ─────────────────────────────────────────────────────────────
  const gates: GateResult[] = [
    dbTransactionGate(neonResult),
    queueFlowGate(qstashResult),
    stripeFlowGate(stripeResult),
    {
      gate: "sentry-ingestion",
      passed: sentryGatePassed,
      reason: sentryGateReason,
      data: sentryResult.details,
    },
  ];

  // ── Build & print report ──────────────────────────────────────────────────
  const report = buildReport(
    [neonResult, qstashResult, stripeResult, sentryResult],
    gates,
    MODE,
  );

  printReport(report);

  console.log(` Total elapsed: ${totalMs}ms\n`);

  // ── JSON output for CI/agent consumption ─────────────────────────────────
  if (process.argv.includes("--json")) {
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  }

  // ── Exit code ─────────────────────────────────────────────────────────────
  // Exit 0 = ready (score ≥ threshold AND no critical failures)
  // Exit 1 = not ready
  // Exit 2 = runner crashed (caught by .catch below)
  process.exit(report.ready ? 0 : 1);
}

run().catch((err: unknown) => {
  console.error("\n💥 Runtime Validation runner crashed:");
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(2);
});

// SpecKit Runtime Validation Layer v3 — Report Builder (Weighted & Classified Scoring)

import type {
  RuntimeReport,
  ValidationResult,
  GateResult,
  RunMode,
  SystemScore,
  SystemName,
} from "./types.ts";
import { CORE_DEPENDENCIES, OPTIONAL_DEPENDENCIES } from "./types.ts";

function computeWeights(
  results: ValidationResult[],
  mode: RunMode,
): SystemScore[] {
  return results.map((r) => {
    const isCore = CORE_DEPENDENCIES.includes(r.system);
    
    // Core systems weights
    let maxScore = 0;
    if (r.system === "stripe") maxScore = 40;
    if (r.system === "neon") maxScore = 30;
    if (r.system === "qstash") maxScore = 30;
    if (r.system === "sentry") {
      maxScore = mode === "STRICT" ? 10 : 0; // Exclude sentry weight from CI/SAFE mode total score denominator
    }

    if (r.inflated || r.status === "error" || r.status === "fail" || !r.success) {
      return {
        system: r.system,
        maxScore,
        earnedScore: 0,
        reason: r.inflated ? "inflated" : "fail",
      };
    }

    if (r.status === "skip") {
      if (isCore) {
        // Core system skipped is a hard failure (0 score)
        return {
          system: r.system,
          maxScore,
          earnedScore: 0,
          reason: "fail",
        };
      } else {
        // Optional system (sentry)
        if (mode === "STRICT") {
          // STRICT mode: SKIP is penalized (0 points)
          return {
            system: r.system,
            maxScore,
            earnedScore: 0,
            reason: "skip_penalty",
          };
        } else {
          // CI / SAFE mode: SKIP is neutral (does not affect core score, but gets skip_neutral)
          return {
            system: r.system,
            maxScore: 0, // Set maxScore to 0 to exclude from calculation denominator
            earnedScore: 0,
            reason: "skip_neutral",
          };
        }
      }
    }

    // PASS
    return { system: r.system, maxScore, earnedScore: maxScore, reason: "pass" };
  });
}

const ICONS: Record<string, string> = {
  pass: "✅",
  fail: "❌",
  skip: "⏭ ",
  error: "💥",
  true: "✅",
  false: "❌",
  skip_penalty: "⚠️ ",
  skip_neutral: "⏭ ",
  inflated: "🚫",
};

function icon(val: boolean | string): string {
  return ICONS[String(val)] ?? "❓";
}

function padR(s: string, n: number): string { return s.padEnd(n, " "); }
function padL(s: string, n: number): string { return s.padStart(n, " "); }

export function buildReport(
  results: ValidationResult[],
  gates: GateResult[],
  mode: RunMode = "SAFE",
): RuntimeReport {
  const weights = computeWeights(results, mode);
  const totalEarned = weights.reduce((acc, w) => acc + w.earnedScore, 0);
  const totalMax = weights.reduce((acc, w) => acc + w.maxScore, 0);

  // Normalize to 100 based on evaluated maximum score
  const score = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;
  
  // Under CI/SAFE modes, threshold is 100 (which corresponds to 100% of core).
  // Sentry under STRICT mode adds 10 to maxScore, so total Max is 110. A perfect score is still 100% (110/110).
  const threshold = 100;

  // Hard block if any CORE dependency failed
  const hasCoreFailure = results.some(
    (r) =>
      (r.status === "fail" || r.status === "error" || r.inflated || !r.success) &&
      CORE_DEPENDENCIES.includes(r.system),
  );

  const ready = score >= threshold && !hasCoreFailure;

  const summary = Object.fromEntries(
    results.map((r) => [
      r.system,
      r.status === "skip" ? "skip" : r.success && !r.inflated ? "pass" : "fail",
    ]),
  ) as Record<SystemName, "pass" | "fail" | "skip">;

  return {
    timestamp: new Date().toISOString(),
    mode,
    score,
    threshold,
    ready,
    results,
    gates,
    weights,
    summary,
  };
}

export function printReport(report: RuntimeReport): void {
  const LINE = "═".repeat(60);
  const line = "─".repeat(60);

  const readyLabel = report.ready
    ? "TRUE — all systems operational"
    : report.score >= report.threshold
      ? "FALSE — core system(s) failed"
      : `FALSE — score ${report.score} < threshold ${report.threshold}`;

  console.log(`\n${LINE}`);
  console.log(` SpecKit Runtime Validation v3 (Dependency Classified)`);
  console.log(`${LINE}`);
  console.log(` Timestamp : ${report.timestamp}`);
  console.log(` Mode      : ${report.mode}  (threshold: ${report.threshold}/100)`);
  console.log(` Score     : ${report.score} / 100`);
  console.log(` Ready     : ${icon(report.ready)} ${readyLabel}`);
  console.log(`${LINE}\n`);

  console.log(` ${"System".padEnd(10)} ${"Status".padEnd(10)} ${"Weight".padEnd(12)} ${"Earned".padEnd(10)} ${"Latency".padStart(8)}`);
  console.log(` ${line}`);

  for (const r of report.results) {
    const w = report.weights.find((x) => x.system === r.system)!;
    const statusIcon = ICONS[r.status] ?? "❓";
    const latency = r.status === "skip" ? "—" : `${r.latencyMs}ms`;

    let scorePart = `${w.earnedScore}/${w.maxScore}`;
    if (w.reason === "skip_neutral") {
      scorePart = "NEUTRAL (SKIP)";
    } else if (w.reason === "skip_penalty") {
      scorePart = `0/${w.maxScore} (PENALTY)`;
    } else if (w.reason === "inflated") {
      scorePart = `0/${w.maxScore} (INFLATED)`;
    }

    const typeLabel = CORE_DEPENDENCIES.includes(r.system) ? "[CORE]" : "[OPTIONAL]";
    console.log(
      ` ${padR(r.system.toUpperCase() + " " + typeLabel, 20)} ${padR(statusIcon + " " + r.status.toUpperCase(), 10)} ${padR(scorePart, 20)} ${padL(latency, 8)}`,
    );
  }

  console.log(`\n ${line}`);
  console.log(" Correctness Gates\n");

  for (const g of report.gates) {
    const gIcon = g.passed ? "✅" : "❌";
    console.log(` ${gIcon} ${padR(g.gate, 26)}  ${g.reason}`);
  }

  console.log(`\n${LINE}`);

  if (report.ready) {
    console.log(` ✅  SCORE ${report.score}/100 ≥ ${report.threshold} — READY`);
  } else {
    const failedResults = report.results.filter(
      (r) => (r.status === "fail" || r.status === "error") && !r.success,
    );
    if (failedResults.length > 0) {
      console.log(` ❌  ${failedResults.length} SYSTEM(S) FAILED:`);
      for (const f of failedResults) {
        console.log(`     ▸ ${f.system.toUpperCase()}: ${(f.details.error as string) ?? f.status}`);
      }
    }
  }
  console.log(`${LINE}\n`);
}

// SpecKit Runtime Validation Layer v3 — Core Types

export type SystemName = "stripe" | "qstash" | "neon" | "sentry";

export type ValidationStatus = "pass" | "fail" | "skip" | "error";

/**
 * Run modes control score thresholds and SKIP tolerance:
 *  STRICT — all systems must PASS (no SKIP tolerated even for OPTIONAL, threshold = 100)
 *  CI     — CORE systems must pass, OPTIONAL skipped is neutral (threshold = 100 of CORE)
 *  SAFE   — CORE systems must pass, OPTIONAL skipped is neutral (threshold = 100 of CORE, default)
 */
export type RunMode = "STRICT" | "CI" | "SAFE";

export interface ValidationResult {
  system: SystemName;
  status: ValidationStatus;
  success: boolean;
  latencyMs: number;
  details: Record<string, unknown>;
  /** If set, the validation is meaningless (too slow or structurally invalid) */
  inflated?: boolean;
}

export interface GateResult {
  gate: string;
  passed: boolean;
  reason: string;
  data?: Record<string, unknown>;
}

export interface SystemScore {
  system: SystemName;
  maxScore: number;
  earnedScore: number;
  reason: "pass" | "skip_neutral" | "skip_penalty" | "fail" | "inflated";
}

export interface RuntimeReport {
  timestamp: string;
  mode: RunMode;
  score: number;           // 0–100 weighted
  threshold: number;       // passing threshold for this mode
  ready: boolean;          // score >= threshold AND no critical failures
  results: ValidationResult[];
  gates: GateResult[];
  weights: SystemScore[];
  summary: Record<SystemName, "pass" | "fail" | "skip">;
}

// ── Dependency Classification ─────────────────────────────────────────────
export const CORE_DEPENDENCIES: SystemName[] = ["stripe", "neon", "qstash"];
export const OPTIONAL_DEPENDENCIES: SystemName[] = ["sentry"];

// ── Max Weight Score allocation (sums to 100) ──────────────────────────────
export const SYSTEM_WEIGHTS: Record<SystemName, number> = {
  stripe: 40,
  neon:   30,
  qstash: 30, // Adjusted to make core sum to 100
  sentry: 0,  // Dynamic / optional in default calculations
};

// ── Mode thresholds ────────────────────────────────────────────────────────
export const MODE_THRESHOLDS: Record<RunMode, number> = {
  STRICT: 100,
  CI:      100, // Core only
  SAFE:    100, // Core only
};

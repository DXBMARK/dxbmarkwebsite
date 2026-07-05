// SpecKit Runtime Validation Layer v3 — Neon Validator
// Real DB write → read → idempotency check → cleanup
// Namespace isolation: all test rows use prefix "rv3_neon_test_" and are ALWAYS cleaned up via try/finally

import type { ValidationResult } from "../types.ts";

// ── Test namespace prefix — never collides with real Stripe event IDs ──────
// Real Stripe IDs start with: evt_, pi_, ch_, etc.
// Our test IDs start with:    rv3_neon_test_
const TEST_PREFIX = "rv3_neon_test_";

export async function validateNeon(): Promise<ValidationResult> {
  const start = Date.now();
  const testEventId = `${TEST_PREFIX}${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  // Tracks inserted ID for guaranteed cleanup even on crash
  let insertedId: number | null = null;

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return {
      system: "neon",
      status: "skip",
      success: false,
      latencyMs: 0,
      details: { error: "DATABASE_URL not set" },
    };
  }

  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(databaseUrl);

  try {
    // ── Step 1: INSERT ────────────────────────────────────────────────────
    // Payload hash must be exactly 64 chars (char(64) column constraint)
    const dummyHash = "rv3test000000000000000000000000000000000000000000000000000000001";

    const insertResult = await sql`
      INSERT INTO stripe_webhook_events
        (stripe_event_id, event_type, livemode, payload_hash,
         processing_status, webhook_status, db_status, queue_status,
         received_at, created_at, updated_at)
      VALUES
        (${testEventId}, 'validation.test', false, ${dummyHash},
         'received', 'received', 'pending', 'pending',
         NOW(), NOW(), NOW())
      RETURNING id, stripe_event_id, processing_status
    `;

    if (!insertResult || insertResult.length === 0) {
      throw new Error("INSERT returned no rows — schema may have changed");
    }

    insertedId = insertResult[0].id as number;

    // ── Step 2: READ BACK and verify consistency ──────────────────────────
    const readResult = await sql`
      SELECT id, stripe_event_id, processing_status, created_at
      FROM stripe_webhook_events
      WHERE stripe_event_id = ${testEventId}
      LIMIT 1
    `;

    if (!readResult || readResult.length === 0) {
      throw new Error("READ-BACK returned no rows — write may have silently failed");
    }

    const fetched = readResult[0];
    const consistent =
      fetched.stripe_event_id === testEventId &&
      fetched.processing_status === "received" &&
      fetched.id === insertedId;

    // ── Step 3: Idempotency — second INSERT must be rejected by UNIQUE constraint
    let idempotencyVerified = false;
    let idempotencyError: string | null = null;

    try {
      await sql`
        INSERT INTO stripe_webhook_events
          (stripe_event_id, event_type, livemode, payload_hash,
           processing_status, webhook_status, db_status, queue_status,
           received_at, created_at, updated_at)
        VALUES
          (${testEventId}, 'validation.test.dupe', false, ${dummyHash},
           'received', 'received', 'pending', 'pending',
           NOW(), NOW(), NOW())
      `;
      // Reaching here = UNIQUE constraint did NOT fire = idempotency broken
      idempotencyVerified = false;
      idempotencyError = "Duplicate INSERT succeeded — UNIQUE constraint on stripe_event_id is missing or broken";
    } catch (dupeErr: unknown) {
      const msg = dupeErr instanceof Error ? dupeErr.message : String(dupeErr);
      if (msg.includes("duplicate key") || msg.includes("unique") || msg.includes("23505")) {
        idempotencyVerified = true;
      } else {
        idempotencyError = `Unexpected error during idempotency check: ${msg}`;
      }
    }

    const latencyMs = Date.now() - start;

    // ── Kill switch: reject if too slow ───────────────────────────────────
    if (latencyMs > 8000) {
      return {
        system: "neon",
        status: "fail",
        success: false,
        latencyMs,
        inflated: true,
        details: {
          error: `DB round-trip exceeded 8000ms kill-switch (${latencyMs}ms) — result not trustworthy`,
          testEventId,
        },
      };
    }


    const success = consistent && idempotencyVerified;

    return {
      system: "neon",
      status: success ? "pass" : "fail",
      success,
      latencyMs,
      details: {
        testEventId,
        insertedId,
        consistent,
        idempotencyVerified,
        ...(idempotencyError ? { idempotencyError } : {}),
        steps: [
          "INSERT ✅",
          `READ-BACK ${consistent ? "✅" : "❌"}`,
          `IDEMPOTENCY ${idempotencyVerified ? "✅" : "❌"}`,
          "CLEANUP → guaranteed via try/finally",
        ],
      },
    };
  } catch (err: unknown) {
    return {
      system: "neon",
      status: "error",
      success: false,
      latencyMs: Date.now() - start,
      details: {
        error: err instanceof Error ? err.message : String(err),
        testEventId,
        note: "Cleanup will still run in finally block",
      },
    };
  } finally {
    // ── GUARANTEED CLEANUP — runs even if test throws or crashes ─────────
    // This prevents orphan rows contaminating production schema
    if (insertedId !== null) {
      try {
        await sql`
          DELETE FROM stripe_webhook_events
          WHERE id = ${insertedId}
            AND stripe_event_id LIKE ${TEST_PREFIX + "%"}
        `;
        // Double-check: also sweep any orphans older than 1 hour with our prefix
        await sql`
          DELETE FROM stripe_webhook_events
          WHERE stripe_event_id LIKE ${TEST_PREFIX + "%"}
            AND created_at < NOW() - INTERVAL '1 hour'
        `;
      } catch {
        // Cleanup failure is non-fatal — log to stderr only
        process.stderr.write(
          `[rv3][neon] ⚠️  Cleanup failed for id=${insertedId} (${testEventId}). Run manual cleanup if needed.\n`,
        );
      }
    }
  }
}

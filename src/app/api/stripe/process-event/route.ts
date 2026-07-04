import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import {
  mapStripeSubscriptionStatus,
  mapStripePaymentStatus,
  updateEventStatus,
  updateWebhookTracking,
} from "@/server/stripe/v1/state-machine";
import { incrementRetry } from "@/server/stripe/v1/failure-store";

export const runtime = "nodejs";

/**
 * Internal QStash payload schema.
 * This is the shape published by the webhook route to the queue,
 * and forwarded by QStash to this processor endpoint.
 *
 * DO NOT use StripeEventSchema here — that belongs at the webhook layer only.
 */
const ProcessEventPayloadSchema = z.object({
  eventId: z.string().min(1),
  type: z.string().min(1),
  objectId: z.string().nullable().optional(),
  receivedAt: z.string().min(1),
});

/**
 * Stub helper for executing downstream logic hooks.
 */
async function executeLogicHooks(
  eventId: string,
  type: string,
  objectId: string | null | undefined
): Promise<void> {
  console.log(
    `[PROCESS EVENT] Executing logic hooks stub for event ${eventId} (${type}), objectId: ${objectId ?? "none"}`
  );
}

export async function POST(request: NextRequest) {
  // --- Step 1: Parse JSON ---
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch (parseError: unknown) {
    const msg = parseError instanceof Error ? parseError.message : "Parse error";
    console.error(`[PROCESS EVENT] Failed to parse request body: ${msg}`);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // --- Step 2: Validate internal QStash payload shape ---
  const parsed = ProcessEventPayloadSchema.safeParse(rawBody);
  if (!parsed.success) {
    console.warn("[PROCESS EVENT] Invalid payload structure received:", {
      issues: parsed.error.issues,
      receivedAt: new Date().toISOString(),
    });
    return NextResponse.json({ error: "Invalid payload structure" }, { status: 400 });
  }

  const { eventId, type, objectId = null } = parsed.data;

  console.log("[PROCESS EVENT] Commencing processing of Stripe event:", {
    eventId,
    type,
    objectId,
  });

  // --- Step 3: Processing ---
  try {
    // Call state-machine mapping based on Stripe event type
    if (type.startsWith("customer.subscription.")) {
      const mapped = mapStripeSubscriptionStatus(type);
      console.log(`[PROCESS EVENT] Subscription status mapped: ${type} -> ${mapped}`);
    } else if (type.startsWith("payment_intent.")) {
      const mapped = mapStripePaymentStatus(type);
      console.log(`[PROCESS EVENT] Payment status mapped: ${type} -> ${mapped}`);
    } else {
      console.log(`[PROCESS EVENT] Untracked Stripe event type: ${type}`);
    }

    // Execute logic hooks (stub only — no side effects in Phase 1)
    await executeLogicHooks(eventId, type, objectId);

    // Mark as successfully processed in database (guarded — row may not exist in test scenarios)
    try {
      await updateEventStatus(eventId, "processed");
      // Update truth layer: processing confirmed
      await updateWebhookTracking(eventId, { dbStatus: "committed" });
    } catch (dbErr) {
      console.warn("[PROCESS EVENT] updateEventStatus(processed) failed (event may not exist in DB):", dbErr);
    }

    return NextResponse.json({
      received: true,
      status: "processed",
    });
  } catch (error: unknown) {
    console.error("[PROCESS EVENT ERROR]", error);

    // Increment retry count atomically — guard individually so a missing row never throws
    try {
      await incrementRetry(eventId);
    } catch (retryErr) {
      console.warn("[PROCESS EVENT] incrementRetry failed (event may not exist in DB yet):", retryErr);
    }

    // Capture in Sentry safely (no PII, no raw payload, no secrets)
    Sentry.captureException(error, {
      tags: { eventId, type },
    });

    // Update event status to failed — guard individually
    try {
      await updateEventStatus(eventId, "failed");
      // Update truth layer: processing failed
      await updateWebhookTracking(eventId, {
        dbStatus: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown processing error",
      });
    } catch (statusErr) {
      console.warn("[PROCESS EVENT] updateEventStatus(failed) failed:", statusErr);
    }

    return NextResponse.json({
      received: true,
      status: "failed",
    });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import {
  mapStripeSubscriptionStatus,
  mapStripePaymentStatus,
  updateEventStatus,
  updateWebhookTracking,
  acquireProcessingLock,
} from "@/server/stripe/v1/state-machine";
import { incrementRetry } from "@/server/stripe/v1/failure-store";
import { publishToQueue } from "@/server/queue/qstash";

import { handleCheckoutSessionCompleted } from "@/server/stripe/v1/handlers/checkout";
import { handleSubscriptionEvent } from "@/server/stripe/v1/handlers/subscription";
import { isFutureSubscriptionEvent } from "@/server/stripe/v1/events";

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

  const { eventId, type, objectId = null, receivedAt } = parsed.data;

  // Logging requirement: [PROCESS STARTED]
  console.log(`[PROCESS STARTED] Stripe event: ${eventId} (${type})`);

  // -------------------------------------------------------------------------
  // 1. Processing Lock (Idempotency Guard)
  // -------------------------------------------------------------------------
  let lockAcquired = false;
  try {
    lockAcquired = await acquireProcessingLock(eventId);
  } catch (lockError) {
    console.error("[PROCESS EVENT ERROR] Failed to acquire lock:", lockError);
    // Continue below where lockAcquired = false returns 200 OK
  }

  if (!lockAcquired) {
    // Logging requirement: [LOCK ACQUISITION SKIPPED] (Log level DEBUG/INFO to suppress production noise)
    console.log(`[LOCK ACQUISITION SKIPPED] Event ${eventId} is already processed or currently being processed`);
    return NextResponse.json({
      received: true,
      status: "ignored",
      reason: "already_processed_or_locked",
    });
  }

  // Logging requirement: [LOCK ACQUIRED]
  console.log(`[LOCK ACQUIRED] processing lock obtained for event: ${eventId}`);

  // -------------------------------------------------------------------------
  // 2. Business Logic Execution & Atomic Processing Flow
  // -------------------------------------------------------------------------
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

    // T027: Handle checkout.session.completed
    if (type === "checkout.session.completed") {
      // We need the data.object payload. Since QStash payload does not contain the raw Stripe event,
      // and we did not store the raw payload in DB (we only stored metadata and SHA-256 hash),
      // we retrieve the checkout session object via Stripe API.
      const { getStripeClient } = await import("@/server/stripe/v1/client");
      const stripe = getStripeClient();
      
      if (!objectId) {
        throw new Error("[PROCESS EVENT] Missing objectId (session ID) for checkout.session.completed");
      }
      
      console.log(`[PROCESS EVENT] Fetching checkout session details from Stripe: ${objectId}`);
      const session = await stripe.checkout.sessions.retrieve(objectId);
      
      await handleCheckoutSessionCompleted({
        id: eventId,
        type,
        data: { object: session },
      });
    } else if (isFutureSubscriptionEvent(type)) {
      // Future subscription handler mapping. These events are not active in Stripe webhook allowlist until subscription products are launched.
      const { getStripeClient } = await import("@/server/stripe/v1/client");
      const stripe = getStripeClient();
      
      if (!objectId) {
        throw new Error(`[PROCESS EVENT] Missing objectId (subscription ID) for ${type}`);
      }
      
      console.log(`[PROCESS EVENT] Fetching subscription details from Stripe: ${objectId}`);
      const subscriptionObj = await stripe.subscriptions.retrieve(objectId);
      
      await handleSubscriptionEvent({
        id: eventId,
        type,
        data: { object: subscriptionObj },
      });
    } else {
      // Execute logic hooks (stub only — no side effects in Phase 1)
      await executeLogicHooksStub(eventId, type, objectId);
    }

    // Logging requirement: [BUSINESS LOGIC EXECUTED]
    console.log(`[BUSINESS LOGIC EXECUTED] logic hook completed for event: ${eventId}`);

    // -------------------------------------------------------------------------
    // 3. Success Path — Atomic Final State Update (FIX 1: dbStatus frozen/removed)
    // -------------------------------------------------------------------------
    try {
      // Single DB update (status transitions: received -> processing -> processed)
      await updateEventStatus(eventId, "processed");
      // Logging requirement: [STATE UPDATED]
      console.log(`[STATE UPDATED] Event ${eventId} marked as processed`);
    } catch (dbErr) {
      console.warn("[PROCESS EVENT] Failed to update final status in DB:", dbErr);
    }

    // Logging requirement: [PROCESS SUCCESS]
    console.log(`[PROCESS SUCCESS] Successfully completed processing for event: ${eventId}`);

    return NextResponse.json({
      received: true,
      status: "processed",
    });
  } catch (error: unknown) {
    // Logging requirement: [PROCESS FAILED]
    console.error(`[PROCESS FAILED] Event processing exception for event ${eventId}:`, error);

    const errorMessage = error instanceof Error ? error.message : "Unknown processing error";

    // Capture in Sentry safely (no PII, no raw payload, no secrets)
    Sentry.captureException(error, {
      tags: { eventId, type },
    });

    // -------------------------------------------------------------------------
    // 4. Failure Path & Retry System (FIX 2: retryCount safety fallback)
    // -------------------------------------------------------------------------
    let retryCount = 1;
    try {
      const retryResult = await incrementRetry(eventId).catch(() => null);
      retryCount = retryResult?.retryCount ?? 1;
    } catch (retryErr) {
      console.warn("[PROCESS EVENT] incrementRetry failed (non-blocking):", retryErr);
    }

    if (retryCount < 3) {
      console.log(`[PROCESS EVENT] Event ${eventId} failed (Attempt ${retryCount}/3). Re-queuing...`);
      
      // Update database status to failed to allow subsequent lock retry attempts
      try {
        await updateEventStatus(eventId, "failed", errorMessage);
        console.log(`[STATE UPDATED] Event ${eventId} marked as failed (retry count: ${retryCount})`);
      } catch (dbErr) {
        console.warn("[PROCESS EVENT] Failed to update retry status in DB:", dbErr);
      }

      // -------------------------------------------------------------------------
      // FIX 3 — Queue + DB Atomic Consistency (requeue first, then update status)
      // -------------------------------------------------------------------------
      try {
        const queueSuccess = await publishToQueue({ eventId, type, objectId, receivedAt });
        await updateWebhookTracking(eventId, { queueStatus: queueSuccess ? "sent" : "failed" });
      } catch (queueError) {
        console.error("[PROCESS EVENT] Re-queue publishing exception:", queueError);
        await updateWebhookTracking(eventId, { queueStatus: "failed" }).catch(() => {});
      }
    } else {
      console.error(`[PROCESS EVENT] Event ${eventId} reached maximum retry threshold (${retryCount}). Dead-lettering.`);
      
      // Update database status to dead_letter
      try {
        await updateEventStatus(eventId, "dead_letter", `Max retries reached. Error: ${errorMessage}`);
        console.log(`[STATE UPDATED] Event ${eventId} marked as dead_letter`);
      } catch (dbErr) {
        console.warn("[PROCESS EVENT] Failed to update dead-letter status in DB:", dbErr);
      }
    }

    // Always return 200 to QStash to acknowledge delivery
    return NextResponse.json({
      received: true,
      status: "failed",
    });
  }
}

/**
 * Stub helper for executing downstream logic hooks.
 */
async function executeLogicHooksStub(
  eventId: string,
  type: string,
  objectId: string | null | undefined
): Promise<void> {
  console.log(
    `[PROCESS EVENT] Executing logic hooks stub for event ${eventId} (${type}), objectId: ${objectId ?? "none"}`
  );
}

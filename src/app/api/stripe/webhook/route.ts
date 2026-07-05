import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, WebhookVerificationError } from "@/server/stripe/v1/webhook-security";
import { persistStripeEvent } from "@/server/stripe/v1/event-store";
import { updateWebhookTracking } from "@/server/stripe/v1/state-machine";
import { publishToQueue } from "@/server/queue/qstash";
import { checkDatabaseConnection } from "@/db/client";
import { env } from "@/server/env";
import { isActiveStripeEvent } from "@/server/stripe/v1/events";
import { captureWebhookException, captureWebhookMessage } from "@/server/observability/sentry";

export const runtime = "nodejs";

/**
 * Resolves the correct HTTP response when the database is unavailable.
 *
 * strict mode   → 503 Service Unavailable (Stripe will retry the webhook)
 * degraded mode → 200 with { processed: false, reason: "db_unavailable" }
 */
function dbUnavailableResponse(): NextResponse {
  if (env.WEBHOOK_MODE === "strict") {
    console.error("[STRIPE WEBHOOK] [STRICT MODE] DB unavailable → returning 503 to trigger Stripe retry");
    return new NextResponse("Service Unavailable", { status: 503 });
  }
  console.error("[STRIPE WEBHOOK] [DEGRADED MODE] DB unavailable → returning 200 with processed:false");
  return NextResponse.json({ received: true, processed: false, reason: "db_unavailable" }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const receivedAt = new Date().toISOString();

  // -----------------------------------------------------------------------
  // FIX 1 — Hard fail on missing DATABASE_URL (before any processing)
  // -----------------------------------------------------------------------
  if (!env.DATABASE_URL) {
    console.error("[CRITICAL] DATABASE_URL is missing — webhook pipeline is disabled");
    return new NextResponse("Service Unavailable", { status: 503 });
  }

  // -----------------------------------------------------------------------
  // Step 1 — Signature header check (only hard 400 in this route)
  // -----------------------------------------------------------------------
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    captureWebhookMessage("Missing stripe-signature header", {
      route: "/api/stripe/webhook",
      stage: "signature_check",
    }, "warning");
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  // -----------------------------------------------------------------------
  // Step 2 — Read raw body
  // -----------------------------------------------------------------------
  let rawBody = "";
  try {
    rawBody = await request.text();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[STRIPE WEBHOOK] Failed to read request body:", msg);
    captureWebhookException(err, {
      route: "/api/stripe/webhook",
      stage: "body_read",
    });
    return NextResponse.json({ received: true, processed: false, reason: "body_read_failure" }, { status: 200 });
  }

  // -----------------------------------------------------------------------
  // Step 3 — Cryptographic signature verification (400 if invalid)
  // -----------------------------------------------------------------------
  let event;
  try {
    event = verifyWebhookSignature(rawBody, signature);
  } catch (error: unknown) {
    const errorType = error instanceof WebhookVerificationError ? "WebhookVerificationError" : "UnknownError";
    console.warn("[STRIPE WEBHOOK] Signature verification failed:", { receivedAt, errorType });
    captureWebhookException(error, {
      route: "/api/stripe/webhook",
      stage: "signature_verification",
    });
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  // -----------------------------------------------------------------------
  // Step 4 — Safe field extraction (works across ALL Stripe event types)
  // -----------------------------------------------------------------------
  const eventId = event?.id ?? null;
  const eventType = event?.type ?? null;
  const obj =
    event?.data?.object && typeof event.data.object === "object"
      ? (event.data.object as unknown as Record<string, unknown>)
      : null;
  const objectId = obj && typeof obj["id"] === "string" ? obj["id"] : null;

  if (!eventId || !eventType) {
    console.warn("[STRIPE WEBHOOK] Invalid payload — missing id or type:", { receivedAt });
    return NextResponse.json({ received: true, processed: false, reason: "missing_event_fields" }, { status: 200 });
  }

  // -----------------------------------------------------------------------
  // FIX 3 — Runtime DB health gate (runs BEFORE any DB write attempt)
  // -----------------------------------------------------------------------
  const isDbHealthy = await checkDatabaseConnection();
  if (!isDbHealthy) {
    console.error("[STRIPE WEBHOOK SKIPPED - DB UNAVAILABLE]", { eventId, eventType, receivedAt });
    captureWebhookMessage("Database health gate check failed", {
      route: "/api/stripe/webhook",
      stage: "db_health_check",
      stripeEventId: eventId,
      stripeEventType: eventType,
    }, "error");
    return dbUnavailableResponse();
  }

  // -----------------------------------------------------------------------
  // Step 5 — Unsupported event filter (acknowledge without DB write)
  // -----------------------------------------------------------------------
  if (!isActiveStripeEvent(eventType)) {
    console.warn("[STRIPE WEBHOOK SKIPPED - UNSUPPORTED EVENT]", { eventType, eventId, receivedAt });
    return NextResponse.json({ received: true, ignored: true }, { status: 200 });
  }

  // -----------------------------------------------------------------------
  // Step 6 — Persist event to DB (idempotency enforced via UNIQUE stripe_event_id)
  // FIX 2 — DB failure returns { processed: false, reason: "db_failure" }, NOT { received: true }
  // -----------------------------------------------------------------------
  try {
    const persistenceResult = await persistStripeEvent(event, rawBody);

    if (!persistenceResult.shouldProcess) {
      console.warn("[STRIPE WEBHOOK] Duplicate event detected:", { id: eventId, receivedAt });
      return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
    }

    // Mark db_status as committed in the truth layer (non-critical — fire-and-forget)
    updateWebhookTracking(eventId, { dbStatus: "committed" }).catch((e: unknown) => {
      const msg = e instanceof Error ? e.message : "Unknown error";
      console.warn("[STRIPE WEBHOOK] Truth layer dbStatus=committed update failed (non-critical):", msg);
    });
  } catch (dbError: unknown) {
    const msg = dbError instanceof Error ? dbError.message : "Unknown DB error";
    console.error("[STRIPE WEBHOOK SKIPPED - DB UNAVAILABLE]", { eventId, eventType, error: msg });
    captureWebhookException(dbError, {
      route: "/api/stripe/webhook",
      stage: "persistence",
      stripeEventId: eventId,
      stripeEventType: eventType,
      objectId,
    });
    // FIX 2: Never pretend success — surface the real state
    return NextResponse.json(
      { received: true, processed: false, reason: "db_failure" },
      { status: 200 }
    );
  }

  // -----------------------------------------------------------------------
  // Step 7 — Safe structured log after successful persistence
  // -----------------------------------------------------------------------
  console.log("[STRIPE WEBHOOK PROCESSED]", { id: eventId, type: eventType, objectId, receivedAt });

  // -----------------------------------------------------------------------
  // Step 8 — Enqueue async processing (non-blocking fire-and-forget)
  // -----------------------------------------------------------------------
  publishToQueue({ eventId, type: eventType, objectId, receivedAt })
    .then((success) => {
      updateWebhookTracking(eventId, { queueStatus: success ? "sent" : "failed" }).catch(() => {});
      if (!success) {
        console.warn("[STRIPE WEBHOOK] Queue publish returned false for event:", eventId);
        captureWebhookMessage("Queue publish returned false", {
          route: "/api/stripe/webhook",
          stage: "queue_publish",
          stripeEventId: eventId,
          stripeEventType: eventType,
          objectId,
        }, "warning");
      }
    })
    .catch((queueError: unknown) => {
      const msg = queueError instanceof Error ? queueError.message : "Unknown queue error";
      console.error("[STRIPE WEBHOOK] Queue publish exception:", msg);
      updateWebhookTracking(eventId, { queueStatus: "failed" }).catch(() => {});
      captureWebhookException(queueError, {
        route: "/api/stripe/webhook",
        stage: "queue_publish",
        stripeEventId: eventId,
        stripeEventType: eventType,
        objectId,
      });
    });

  // -----------------------------------------------------------------------
  // Step 9 — Return 200 (queue is async, never block on it)
  // -----------------------------------------------------------------------
  return NextResponse.json({ received: true, processed: true }, { status: 200 });
}

import { getDb } from "@/db/client";
import { stripeWebhookEvents } from "@/db/schema";
import crypto from "node:crypto";
import Stripe from "stripe";

/**
 * Persists a verified Stripe event metadata to the database, enforcing idempotency.
 * Calculates a SHA-256 hash of the raw payload for verification and integrity audits.
 * Does not store the raw payload.
 *
 * @param event The verified Stripe event.
 * @param rawBody The raw request body string.
 * @returns Object deciding whether the event is new and should be processed.
 */
export async function persistStripeEvent(
  event: Stripe.Event,
  rawBody: string
): Promise<{ shouldProcess: boolean; reason: "new_event" | "duplicate_event" }> {
  const payloadHash = crypto.createHash("sha256").update(rawBody).digest("hex");
  const stripeEventId = event.id;

  // Safely extract object ID and type if available
  const obj = event.data.object as unknown as Record<string, unknown> | undefined;
  const objectId = obj && typeof obj.id === "string" ? obj.id : null;
  const objectType = obj && typeof obj.object === "string" ? obj.object : null;

  // Convert Unix seconds timestamp to Date
  const stripeCreatedAt = new Date(event.created * 1000);

  try {
    const db = getDb();
    // Atomically insert event metadata, resolving conflicts safely via DB unique constraint
    const result = await db
      .insert(stripeWebhookEvents)
      .values({
        stripeEventId,
        eventType: event.type,
        objectId,
        objectType,
        livemode: event.livemode,
        payloadHash,
        processingStatus: "received",
        stripeCreatedAt,
      })
      .onConflictDoNothing({ target: stripeWebhookEvents.stripeEventId })
      .returning({ id: stripeWebhookEvents.id });

    if (result.length === 0) {
      return { shouldProcess: false, reason: "duplicate_event" };
    }

    return { shouldProcess: true, reason: "new_event" };
  } catch (error: unknown) {
    const pgError = error as { code?: string };
    // Fallback detection for unique constraint violation (Code 23505)
    if (pgError.code === "23505") {
      return { shouldProcess: false, reason: "duplicate_event" };
    }
    throw error;
  }
}

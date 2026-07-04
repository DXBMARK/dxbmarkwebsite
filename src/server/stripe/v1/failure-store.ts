import { getDb } from "@/db/client";
import { stripeWebhookEvents } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

if (typeof window !== "undefined") {
  throw new Error("Failure store can only be used on the server side.");
}

export interface RetryResult {
  retryCount: number;
  isDeadLetter: boolean;
}

/**
 * Increments the retry counter for a specific Stripe webhook event atomically.
 * Returns the updated retry count and whether the threshold for dead-lettering is met.
 *
 * @param eventId The Stripe Event ID (stripe_event_id).
 * @returns Promise<{ retryCount: number; isDeadLetter: boolean }>
 */
export async function incrementRetry(eventId: string): Promise<RetryResult> {
  const db = getDb();
  const results = await db
    .update(stripeWebhookEvents)
    .set({
      retryCount: sql`COALESCE(${stripeWebhookEvents.retryCount}, 0) + 1`,
      updatedAt: new Date(),
    })
    .where(eq(stripeWebhookEvents.stripeEventId, eventId))
    .returning({
      retryCount: sql<number>`COALESCE(${stripeWebhookEvents.retryCount}, 0) + 1`,
    });

  const retryCount = results[0]?.retryCount ?? 1;
  const isDeadLetter = retryCount >= 5;

  return {
    retryCount,
    isDeadLetter,
  };
}


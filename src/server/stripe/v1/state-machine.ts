import { getDb } from "@/db/client";
import { stripeWebhookEvents } from "@/db/schema";
import { eq } from "drizzle-orm";

type WebhookStatus = "received" | "failed" | "invalid_signature";
type DbStatus = "pending" | "committed" | "failed";
type QueueStatus = "pending" | "sent" | "failed";

/**
 * Updates the truth layer tracking fields for a Stripe webhook event.
 * These fields record the infrastructure-level outcome of each processing stage,
 * independent of the business-level processingStatus.
 *
 * Authority: webhook/route.ts only.
 *
 * @param eventId Stripe Event ID.
 * @param updates Partial truth layer state to patch.
 */
export async function updateWebhookTracking(
  eventId: string,
  updates: {
    webhookStatus?: WebhookStatus;
    dbStatus?: DbStatus;
    queueStatus?: QueueStatus;
    errorMessage?: string;
  }
): Promise<void> {
  const db = getDb();
  const patch: Record<string, unknown> = { updatedAt: new Date() };

  if (updates.webhookStatus !== undefined) patch.webhookStatus = updates.webhookStatus;
  if (updates.dbStatus !== undefined) patch.dbStatus = updates.dbStatus;
  if (updates.queueStatus !== undefined) patch.queueStatus = updates.queueStatus;
  if (updates.errorMessage !== undefined) patch.errorMessage = updates.errorMessage;

  await db
    .update(stripeWebhookEvents)
    .set(patch)
    .where(eq(stripeWebhookEvents.stripeEventId, eventId));
}



/**
 * Maps official Stripe subscription status strings into allowed internal billing_states.state values.
 * Internal states are constrained by database CHECK constraints.
 *
 * @param stripeStatus Status string received from Stripe subscription payload.
 * @returns Allowed internal billing state string.
 */
export function mapStripeSubscriptionStatus(stripeStatus: string): string {
  switch (stripeStatus) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "unpaid":
      return "unpaid";
    case "canceled":
      return "canceled";
    case "paused":
      return "paused";
    case "incomplete":
      return "incomplete";
    case "incomplete_expired":
      return "incomplete_expired";
    default:
      return "unknown";
  }
}

/**
 * Maps official Stripe payment status strings (from PaymentIntent, Charge, etc.)
 * into allowed internal system status representations.
 *
 * @param stripeStatus Payment status string received from Stripe.
 * @returns Mapped internal status string.
 */
export function mapStripePaymentStatus(stripeStatus: string): string {
  switch (stripeStatus) {
    case "succeeded":
      return "succeeded";
    case "processing":
      return "processing";
    case "requires_payment_method":
      return "requires_payment_method";
    case "requires_confirmation":
      return "requires_confirmation";
    case "requires_action":
      return "requires_action";
    case "requires_capture":
      return "requires_capture";
    case "canceled":
      return "canceled";
    default:
      return "unknown";
  }
}

/**
 * Updates the processing status and error messages of Stripe webhook events in the database.
 * This function is the sole authority for database-level event status transitions.
 *
 * @param eventId Stripe Event ID.
 * @param status The target status for the event.
 * @param errorMessage Optional failure reason details.
 */
export async function updateEventStatus(
  eventId: string,
  status: "received" | "processing" | "processed" | "failed" | "dead_letter",
  errorMessage?: string
): Promise<void> {
  const db = getDb();
  const updateData: Record<string, unknown> = {
    processingStatus: status,
    updatedAt: new Date(),
  };

  if (errorMessage !== undefined) {
    updateData.errorMessage = errorMessage;
  }

  if (status === "processed") {
    updateData.processedAt = new Date();
  }

  await db
    .update(stripeWebhookEvents)
    .set(updateData)
    .where(eq(stripeWebhookEvents.stripeEventId, eventId));
}


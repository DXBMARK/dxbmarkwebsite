// SpecKit T028 — Implement Log-Only Stripe Subscription Event Handler
// src/server/stripe/v1/handlers/subscription.ts

export interface SubscriptionHandlerResult {
  handled: boolean;
  handler: string;
  eventType: string;
  eventId: string;
  subscriptionId: string;
  logOnly: boolean;
}

/**
 * Log-only handler for future Stripe subscription lifecycle events.
 * Extracts metadata, logs structured info safely, and returns a result payload.
 *
 * @param event The verified Stripe event wrapper.
 */
export async function handleSubscriptionEvent(
  event: {
    id: string;
    type: string;
    data: {
      object: unknown;
    };
  }
): Promise<SubscriptionHandlerResult> {
  const eventId = event.id;
  const eventType = event.type;

  if (!eventId || !eventType) {
    throw new Error("[SUBSCRIPTION HANDLER ERROR] Missing event identity (id/type)");
  }

  // Robust object guard for event.data.object
  const rawObject = event.data.object;
  if (typeof rawObject !== "object" || rawObject === null || Array.isArray(rawObject)) {
    throw new Error("[SUBSCRIPTION HANDLER ERROR] event.data.object must be a non-null object");
  }

  const subscription = rawObject as Record<string, unknown>;

  // Required core field for subscription completion
  const subscriptionId = subscription.id;
  if (typeof subscriptionId !== "string" || !subscriptionId) {
    throw new Error("[SUBSCRIPTION HANDLER ERROR] subscription.id is missing or invalid");
  }

  // Extract optional metadata and fields safely
  const customerId = typeof subscription.customer === "string" ? subscription.customer : null;
  const status = typeof subscription.status === "string" ? subscription.status : null;
  
  const currentPeriodStart = typeof subscription.current_period_start === "number"
    ? new Date(subscription.current_period_start * 1000).toISOString()
    : null;
  const currentPeriodEnd = typeof subscription.current_period_end === "number"
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;
  const cancelAtPeriodEnd = typeof subscription.cancel_at_period_end === "boolean"
    ? subscription.cancel_at_period_end
    : null;
  const trialEnd = typeof subscription.trial_end === "number"
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null;
  const metadata = typeof subscription.metadata === "object" && subscription.metadata !== null
    ? subscription.metadata
    : null;

  // Safe structured console logging (logs must not include raw payloads, secrets, or card data)
  console.log(
    `[SUBSCRIPTION HANDLER] subscription event received:\n` +
    `  Event ID:           ${eventId}\n` +
    `  Event Type:         ${eventType}\n` +
    `  Subscription ID:    ${subscriptionId}\n` +
    `  Customer ID:        ${customerId ?? "none"}\n` +
    `  Status:             ${status ?? "none"}\n` +
    `  Period Start:       ${currentPeriodStart ?? "none"}\n` +
    `  Period End:         ${currentPeriodEnd ?? "none"}\n` +
    `  Cancel At End:      ${cancelAtPeriodEnd !== null ? cancelAtPeriodEnd : "none"}\n` +
    `  Trial End:          ${trialEnd ?? "none"}\n` +
    `  Has Metadata:       ${metadata !== null ? "yes" : "no"}`
  );

  return {
    handled: true,
    handler: "subscription",
    eventType,
    eventId,
    subscriptionId,
    logOnly: true,
  };
}

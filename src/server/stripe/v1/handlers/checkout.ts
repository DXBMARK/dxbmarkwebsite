// SpecKit T027 — Implement Log-Only Stripe Checkout Event Handler
// src/server/stripe/v1/handlers/checkout.ts


export interface CheckoutHandlerResult {
  handled: boolean;
  handler: string;
  eventType: string;
  eventId: string;
  checkoutSessionId: string;
  logOnly: boolean;
}

/**
 * Log-only handler for stripe checkout.session.completed (and related optional checkout events).
 * Extracts metadata, logs structured information safely, and returns a result payload.
 *
 * @param event The verified Stripe event wrapper (or similar payload with ID, Type and Data.Object).
 */
export async function handleCheckoutSessionCompleted(
  event: {
    id: string;
    type: string;
    data: {
      object: unknown;
    };
  }
): Promise<CheckoutHandlerResult> {
  const eventId = event.id;
  const eventType = event.type;

  if (!eventId || !eventType) {
    throw new Error("[CHECKOUT HANDLER ERROR] Missing event identity (id/type)");
  }

  // Robust object guard for event.data.object
  const rawObject = event.data.object;
  if (typeof rawObject !== "object" || rawObject === null || Array.isArray(rawObject)) {
    throw new Error("[CHECKOUT HANDLER ERROR] event.data.object must be a non-null object");
  }

  const session = rawObject as Record<string, unknown>;

  // Required core field for checkout completion
  const checkoutSessionId = session.id;
  if (typeof checkoutSessionId !== "string" || !checkoutSessionId) {
    throw new Error("[CHECKOUT HANDLER ERROR] data.object.id (checkoutSessionId) is missing or invalid");
  }

  // Extract optional metadata and fields safely
  const customerId = typeof session.customer === "string" ? session.customer : null;
  const customerEmail = typeof session.customer_details === "object" && session.customer_details !== null
    ? (session.customer_details as Record<string, unknown>).email as string | null
    : null;
  const paymentStatus = typeof session.payment_status === "string" ? session.payment_status : null;
  const mode = typeof session.mode === "string" ? session.mode : null;
  const amountTotal = typeof session.amount_total === "number" ? session.amount_total : null;
  const currency = typeof session.currency === "string" ? session.currency : null;
  const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;
  const metadata = typeof session.metadata === "object" && session.metadata !== null ? session.metadata : null;

  // Mask email for production logging safety (if present)
  let maskedEmail = "none";
  if (customerEmail && typeof customerEmail === "string") {
    const parts = customerEmail.split("@");
    if (parts.length === 2) {
      const local = parts[0];
      const domain = parts[1];
      const maskedLocal = local.length > 2 ? `${local.slice(0, 2)}***` : "***";
      maskedEmail = `${maskedLocal}@${domain}`;
    }
  }

  // Safe structured console logging (logs must not include raw payloads, card data, or unmasked PII)
  console.log(
    `[CHECKOUT HANDLER] ${eventType} received:\n` +
    `  Event ID:           ${eventId}\n` +
    `  Session ID:         ${checkoutSessionId}\n` +
    `  Customer ID:        ${customerId ?? "none"}\n` +
    `  Customer Email:     ${maskedEmail}\n` +
    `  Payment Status:     ${paymentStatus ?? "none"}\n` +
    `  Mode:               ${mode ?? "none"}\n` +
    `  Amount Total:       ${amountTotal !== null ? amountTotal / 100 : "none"} ${currency?.toUpperCase() ?? ""}\n` +
    `  Payment Intent:     ${paymentIntentId ?? "none"}\n` +
    `  Subscription ID:    ${subscriptionId ?? "none"}\n` +
    `  Has Metadata:       ${metadata !== null ? "yes" : "no"}`
  );

  return {
    handled: true,
    handler: "checkout",
    eventType,
    eventId,
    checkoutSessionId,
    logOnly: true,
  };
}

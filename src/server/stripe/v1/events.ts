// Phase 1 production events for DXBMARK.
// Covers one-time Checkout, Payment Links, invoices, refunds, disputes,
// and failed/cancelled payments. Active means signature-verified,
// persisted, queued, and log-only processed unless a handler already exists.

export const ACTIVE_STRIPE_EVENTS = [
  "checkout.session.completed",
  "checkout.session.expired",

  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",

  "invoice.paid",
  "invoice.payment_failed",

  "refund.created",
  "refund.updated",
  "refund.failed",

  "charge.refunded",
  "charge.dispute.created",
  "charge.dispute.updated",
  "charge.dispute.closed",
] as const;

export type ActiveStripeEvent = (typeof ACTIVE_STRIPE_EVENTS)[number];

// Future recurring/SaaS support.
// Do not enable these in Stripe Dashboard until DXBMARK launches
// subscription products, SaaS access, or recurring maintenance plans.
export const FUTURE_SUBSCRIPTION_EVENTS = [
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.trial_will_end",

  "invoice.payment_action_required",
  "invoice.finalized",
  "invoice.finalization_failed",
] as const;

export type FutureSubscriptionEvent =
  (typeof FUTURE_SUBSCRIPTION_EVENTS)[number];

export const activeStripeEvents = new Set<string>(ACTIVE_STRIPE_EVENTS);

export function isActiveStripeEvent(eventType: string): boolean {
  return activeStripeEvents.has(eventType);
}

export const futureSubscriptionEvents = new Set<string>(
  FUTURE_SUBSCRIPTION_EVENTS
);

export function isFutureSubscriptionEvent(eventType: string): boolean {
  return futureSubscriptionEvents.has(eventType);
}

export const invoiceEvents = new Set<string>([
  "invoice.paid",
  "invoice.payment_failed",
]);

export function isInvoiceEvent(eventType: string): boolean {
  return invoiceEvents.has(eventType);
}

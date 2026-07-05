// SpecKit T029 — Implement Log-Only Stripe Invoice Event Handler
// src/server/stripe/v1/handlers/invoices.ts

export interface InvoiceHandlerResult {
  handled: boolean;
  handler: string;
  eventType: string;
  eventId: string;
  invoiceId: string;
  status: string;
  logOnly: boolean;
}

/**
 * Log-only handler for Stripe invoice.paid and invoice.payment_failed events.
 * Extracts metadata, logs structured information safely, and returns a result payload.
 *
 * @param event The verified Stripe event wrapper.
 */
export async function handleInvoiceEvent(
  event: {
    id: string;
    type: string;
    data: {
      object: unknown;
    };
  }
): Promise<InvoiceHandlerResult> {
  const eventId = event.id;
  const eventType = event.type;

  if (!eventId || !eventType) {
    throw new Error("[INVOICE HANDLER ERROR] Missing event identity (id/type)");
  }

  // Allowed invoice events guard
  if (eventType !== "invoice.paid" && eventType !== "invoice.payment_failed") {
    return {
      handled: false,
      handler: "invoice",
      eventType,
      eventId,
      invoiceId: "",
      status: "ignored",
      logOnly: true,
    };
  }

  // Robust object guard for event.data.object
  const rawObject = event.data.object;
  if (typeof rawObject !== "object" || rawObject === null || Array.isArray(rawObject)) {
    throw new Error("[INVOICE HANDLER ERROR] event.data.object must be a non-null object");
  }

  const invoice = rawObject as Record<string, unknown>;

  // Required core field for invoice handling
  const invoiceId = invoice.id;
  if (typeof invoiceId !== "string" || !invoiceId) {
    throw new Error("[INVOICE HANDLER ERROR] invoice.id is missing or invalid");
  }

  // Extract optional metadata and fields safely
  const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
  const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : null;
  const paymentIntent = typeof invoice.payment_intent === "string" ? invoice.payment_intent : null;
  const charge = typeof invoice.charge === "string" ? invoice.charge : null;
  const status = typeof invoice.status === "string" ? invoice.status : "unknown";
  const billingReason = typeof invoice.billing_reason === "string" ? invoice.billing_reason : null;
  const collectionMethod = typeof invoice.collection_method === "string" ? invoice.collection_method : null;
  const amountPaid = typeof invoice.amount_paid === "number" ? invoice.amount_paid : null;
  const amountDue = typeof invoice.amount_due === "number" ? invoice.amount_due : null;
  const amountRemaining = typeof invoice.amount_remaining === "number" ? invoice.amount_remaining : null;
  const currency = typeof invoice.currency === "string" ? invoice.currency : null;
  
  const hasHostedInvoiceUrl = typeof invoice.hosted_invoice_url === "string" && invoice.hosted_invoice_url.length > 0;
  const hasInvoicePdf = typeof invoice.invoice_pdf === "string" && invoice.invoice_pdf.length > 0;
  
  const metadata =
    typeof invoice.metadata === "object" &&
    invoice.metadata !== null &&
    !Array.isArray(invoice.metadata)
      ? invoice.metadata
      : null;

  // Safe structured console logging (logs must not include raw payloads, secrets, or card data)
  console.log(
    `[INVOICE HANDLER] invoice event received:\n` +
    `  Event ID:           ${eventId}\n` +
    `  Event Type:         ${eventType}\n` +
    `  Invoice ID:         ${invoiceId}\n` +
    `  Customer ID:        ${customerId ?? "none"}\n` +
    `  Subscription ID:    ${subscriptionId ?? "none"}\n` +
    `  Payment Intent:     ${paymentIntent ?? "none"}\n` +
    `  Charge ID:          ${charge ?? "none"}\n` +
    `  Status:             ${status}\n` +
    `  Billing Reason:     ${billingReason ?? "none"}\n` +
    `  Collection Method:  ${collectionMethod ?? "none"}\n` +
    `  Amount Paid:        ${amountPaid !== null ? amountPaid / 100 : "none"} ${currency?.toUpperCase() ?? ""}\n` +
    `  Amount Due:         ${amountDue !== null ? amountDue / 100 : "none"} ${currency?.toUpperCase() ?? ""}\n` +
    `  Amount Remaining:   ${amountRemaining !== null ? amountRemaining / 100 : "none"} ${currency?.toUpperCase() ?? ""}\n` +
    `  Has Hosted URL:     ${hasHostedInvoiceUrl ? "yes" : "no"}\n` +
    `  Has PDF URL:        ${hasInvoicePdf ? "yes" : "no"}\n` +
    `  Has Metadata:       ${metadata !== null ? "yes" : "no"}`
  );

  if (eventType === "invoice.paid") {
    console.log(`[INVOICE HANDLER] invoice paid log-only: ${invoiceId}`);
  } else if (eventType === "invoice.payment_failed") {
    console.log(`[INVOICE HANDLER] invoice payment failed log-only: ${invoiceId}`);
  }

  return {
    handled: true,
    handler: "invoice",
    eventType,
    eventId,
    invoiceId,
    status,
    logOnly: true,
  };
}

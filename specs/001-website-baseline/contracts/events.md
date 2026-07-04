# Event Contracts: Approved Stripe & Internal Integration Events

This document defines the interface contracts for approved Stripe webhook events and asynchronous background jobs.

---

## 1. Approved Stripe Webhook Events

The webhook endpoint only processes the following events. All other event types must be logged as `ignored` with a 200 OK status.

### Checkout & Payment Intent Events
- **`checkout.session.completed`**: Sent when a customer completes a checkout session.
- **`checkout.session.expired`**: Sent when a checkout session expires before payment.
- **`payment_intent.succeeded`**: Sent when a payment intent completes successfully.
- **`payment_intent.payment_failed`**: Sent when a payment attempt fails.

### Invoicing Events
- **`invoice.finalized`**: Sent when an invoice is created and ready for payment.
- **`invoice.paid`**: Sent when an invoice is successfully paid.
- **`invoice.payment_failed`**: Sent when an invoice payment attempt fails.

### Subscription Events
- **`customer.subscription.created`**: Sent when a new subscription is initiated.
- **`customer.subscription.updated`**: Sent when a subscription is modified (e.g. upgrades, downgrades, cancellations).
- **`customer.subscription.deleted`**: Sent when a subscription is fully terminated.

---

## 2. Event Payload Schema Contracts (Sanitized)

To comply with database space limitations and security rules, handlers extract only the following fields from event payloads for logging and state mapping.

### Contract: Checkout Completed
```json
{
  "stripe_event_id": "evt_1OpABC2eZvKYlo2C",
  "event_type": "checkout.session.completed",
  "data": {
    "object_id": "cs_test_a1B2c3D4",
    "customer_id": "cus_123456",
    "invoice_id": "in_123456",
    "amount_total": 15000,
    "currency": "usd",
    "payment_status": "paid",
    "metadata": {
      "zoho_invoice_id": "zoho_inv_998877"
    }
  }
}
```

### Contract: Invoice Paid
```json
{
  "stripe_event_id": "evt_1OpXYZ2eZvKYlo2D",
  "event_type": "invoice.paid",
  "data": {
    "object_id": "in_123456",
    "customer_id": "cus_123456",
    "subscription_id": "sub_123456",
    "amount_paid": 15000,
    "currency": "usd",
    "billing_reason": "subscription_cycle",
    "status": "paid"
  }
}
```

### Contract: Subscription Updated
```json
{
  "stripe_event_id": "evt_1OpSUB2eZvKYlo2E",
  "event_type": "customer.subscription.updated",
  "data": {
    "object_id": "sub_123456",
    "customer_id": "cus_123456",
    "status": "past_due",
    "cancel_at_period_end": false,
    "current_period_end": 1782782782
  }
}
```

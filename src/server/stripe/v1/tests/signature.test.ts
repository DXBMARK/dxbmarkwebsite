import assert from "node:assert";
import test from "node:test";

test("Webhook Signature Verification Unit Tests", async (t) => {
  // Set required base test environment variables once at startup
  process.env.STRIPE_RESTRICTED_KEY = "rk_test_mock_restricted_key_for_testing";
  process.env.STRIPE_WEBHOOK_TOLERANCE_SECONDS = "300";

  // Dynamically import target modules to ensure environment vars are parsed first
  const { verifyWebhookSignatureWithSecret, WebhookVerificationError } = await import("../webhook-security");
  const { getStripeClient } = await import("../client");

  const stripe = getStripeClient();
  const rawPayload = JSON.stringify({ id: "evt_test", object: "event" });
  const mockSecret = "whsec_mock_webhook_secret_for_testing";

  await t.test("should pass for a correctly signed raw payload", () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const header = stripe.webhooks.generateTestHeaderString({
      payload: rawPayload,
      secret: mockSecret,
      timestamp,
    });

    const event = verifyWebhookSignatureWithSecret(rawPayload, header, mockSecret);
    assert.strictEqual(event.id, "evt_test");
  });

  await t.test("should throw WebhookVerificationError if signature header is missing", () => {
    assert.throws(
      () => verifyWebhookSignatureWithSecret(rawPayload, "", mockSecret),
      WebhookVerificationError
    );
  });

  await t.test("should throw WebhookVerificationError if webhookSecret argument is missing/undefined", () => {
    assert.throws(
      () => verifyWebhookSignatureWithSecret(rawPayload, "t=123,v1=456", undefined),
      WebhookVerificationError
    );
  });

  await t.test("should fail with WebhookVerificationError for a mutated payload", () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const header = stripe.webhooks.generateTestHeaderString({
      payload: rawPayload,
      secret: mockSecret,
      timestamp,
    });

    assert.throws(
      () => verifyWebhookSignatureWithSecret(rawPayload + "mutated", header, mockSecret),
      WebhookVerificationError
    );
  });

  await t.test("should fail with WebhookVerificationError for a wrong webhook secret", () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const header = stripe.webhooks.generateTestHeaderString({
      payload: rawPayload,
      secret: "whsec_wrong_secret_12345",
      timestamp,
    });

    assert.throws(
      () => verifyWebhookSignatureWithSecret(rawPayload, header, mockSecret),
      WebhookVerificationError
    );
  });
});

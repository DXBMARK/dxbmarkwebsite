import assert from "node:assert";
import test from "node:test";
import { mapStripeSubscriptionStatus } from "../state-machine";

test("Stripe Subscription State Mapping Tests", async (t) => {
  await t.test("should map standard Stripe status types correctly", () => {
    assert.strictEqual(mapStripeSubscriptionStatus("active"), "active");
    assert.strictEqual(mapStripeSubscriptionStatus("trialing"), "trialing");
    assert.strictEqual(mapStripeSubscriptionStatus("past_due"), "past_due");
    assert.strictEqual(mapStripeSubscriptionStatus("unpaid"), "unpaid");
    assert.strictEqual(mapStripeSubscriptionStatus("canceled"), "canceled");
    assert.strictEqual(mapStripeSubscriptionStatus("paused"), "paused");
    assert.strictEqual(mapStripeSubscriptionStatus("incomplete"), "incomplete");
    assert.strictEqual(mapStripeSubscriptionStatus("incomplete_expired"), "incomplete_expired");
  });

  await t.test("should default unknown Stripe status types to unknown", () => {
    assert.strictEqual(mapStripeSubscriptionStatus("some_random_status"), "unknown");
    assert.strictEqual(mapStripeSubscriptionStatus(""), "unknown");
  });
});

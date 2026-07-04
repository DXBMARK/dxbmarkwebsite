import assert from "node:assert";
import test from "node:test";
import { decideEventProcessing } from "../idempotency";

test("Idempotency Rejection Logic Tests", async (t) => {
  await t.test("should allow processing for a new event ID", () => {
    const decision = decideEventProcessing("evt_new_12345", false);
    assert.deepStrictEqual(decision, {
      shouldProcess: true,
      reason: "new_event",
    });
  });

  await t.test("should reject processing for an already existing event ID", () => {
    const decision = decideEventProcessing("evt_duplicate_67890", true);
    assert.deepStrictEqual(decision, {
      shouldProcess: false,
      reason: "duplicate_event",
    });
  });
});

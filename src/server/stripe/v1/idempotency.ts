export interface IdempotencyDecision {
  shouldProcess: boolean;
  reason: "new_event" | "duplicate_event";
}

/**
 * Pure function to decide if a Stripe event should be processed.
 *
 * @param eventId Stripe Event ID.
 * @param existsInDb Whether the event ID is already recorded in the local event store database.
 * @returns Idempotency decision with reasoning.
 */
export function decideEventProcessing(
  eventId: string,
  existsInDb: boolean
): IdempotencyDecision {
  if (existsInDb) {
    return { shouldProcess: false, reason: "duplicate_event" };
  }
  return { shouldProcess: true, reason: "new_event" };
}

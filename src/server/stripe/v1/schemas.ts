import { z } from "zod";

/**
 * Schema representing a raw Stripe event object.
 * Used for test fixtures and direct Stripe event validation.
 */
export const StripeEventSchema = z.object({
  id: z.string(),
  object: z.literal("event"),
  type: z.string(),
  created: z.number(),
  data: z.object({
    object: z.record(z.string(), z.unknown()),
  }),
});

export type StripeEvent = z.infer<typeof StripeEventSchema>;

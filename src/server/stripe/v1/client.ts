import Stripe from "stripe";
import { env } from "../../env";

if (typeof window !== "undefined") {
  throw new Error("Stripe client must only be initialized on the server side.");
}

let stripeClientInstance: Stripe | null = null;

/**
 * Lazily retrieves the initialized Stripe client instance.
 * Throws a runtime error if key configuration is missing.
 */
export function getStripeClient(): Stripe {
  if (stripeClientInstance) {
    return stripeClientInstance;
  }

  const stripeKey = env.STRIPE_RESTRICTED_KEY;

  if (!stripeKey) {
    throw new Error(
      "STRIPE_RESTRICTED_KEY is not defined. Cannot initialize Stripe client."
    );
  }

  stripeClientInstance = new Stripe(stripeKey, {
    apiVersion: "2026-06-24.dahlia", // Matches package types requirement
    typescript: true,
  });

  return stripeClientInstance;
}

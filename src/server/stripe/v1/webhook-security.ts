import Stripe from "stripe";
import { getStripeClient } from "./client";
import { env } from "../../env";

export class WebhookVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WebhookVerificationError";
  }
}

/**
 * Cryptographically verifies an incoming Stripe webhook signature using a specific secret.
 * Useful for test mock injections and multi-environment setups.
 *
 * @param rawBody The unparsed request body string.
 * @param signature The signature header (stripe-signature) sent by Stripe.
 * @param webhookSecret The Stripe webhook signing secret key.
 * @returns The verified Stripe.Event object.
 * @throws WebhookVerificationError with safe message suitable for public response.
 */
export function verifyWebhookSignatureWithSecret(
  rawBody: string,
  signature: string,
  webhookSecret?: string
): Stripe.Event {
  if (!rawBody) {
    throw new WebhookVerificationError("Webhook payload is empty.");
  }

  if (!signature) {
    throw new WebhookVerificationError("Invalid webhook signature.");
  }

  if (!webhookSecret) {
    console.error("Webhook verification failed: Secret is not configured.");
    throw new WebhookVerificationError("Webhook configuration error.");
  }

  try {
    const stripe = getStripeClient();

    // Construct and verify cryptographic signature
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
      env.STRIPE_WEBHOOK_TOLERANCE_SECONDS
    );

    return event;
  } catch (error: unknown) {
    // Log the actual error details internally
    const internalMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Internal Webhook verification failure: ${internalMessage}`);

    // Throw safe message for the API response
    throw new WebhookVerificationError("Invalid webhook signature.");
  }
}

/**
 * Cryptographically verifies an incoming Stripe webhook signature.
 * Uses the default configured webhook secret from environment variables.
 *
 * @param rawBody The unparsed request body string.
 * @param signature The signature header (stripe-signature) sent by Stripe.
 * @returns The verified Stripe.Event object.
 * @throws WebhookVerificationError with safe message suitable for public response.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): Stripe.Event {
  return verifyWebhookSignatureWithSecret(
    rawBody,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );
}

import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://www.dxbmark.com"),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  ZOHO_CLIENT_ID: z.string().optional(),
  ZOHO_CLIENT_SECRET: z.string().optional(),
  ZOHO_REFRESH_TOKEN: z.string().optional(),
  ZOHO_ORG_ID: z.string().optional(),
  DATABASE_URL: z.string().optional(),

  // Stripe Configuration (Optional for foundation builds; required for live webhook routing in production)
  STRIPE_RESTRICTED_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_WEBHOOK_TOLERANCE_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .min(60)
    .max(600)
    .default(300),

  // Upstash QStash Configuration (Scaffolded for future use)
  QSTASH_URL: z.string().url().default("https://qstash.upstash.io"),
  QSTASH_TOKEN: z.string().optional(),
  QSTASH_CURRENT_SIGNING_KEY: z.string().optional(),
  QSTASH_NEXT_SIGNING_KEY: z.string().optional(),

  // Sentry Configuration
  SENTRY_DSN: z.string().optional(),

  // Modes
  WEBHOOK_PROCESSING_MODE: z.enum(["log_only", "live"]).default("log_only"),

  /**
   * WEBHOOK_MODE controls DB failure response behaviour:
   *   strict   → 503 Service Unavailable (Stripe will retry — correct for finance systems)
   *   degraded → 200 with { processed: false, reason: "db_unavailable" } (silent degradation)
   */
  WEBHOOK_MODE: z.enum(["strict", "degraded"]).default("strict"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  ZOHO_CLIENT_ID: process.env.ZOHO_CLIENT_ID,
  ZOHO_CLIENT_SECRET: process.env.ZOHO_CLIENT_SECRET,
  ZOHO_REFRESH_TOKEN: process.env.ZOHO_REFRESH_TOKEN,
  ZOHO_ORG_ID: process.env.ZOHO_ORG_ID,
  DATABASE_URL: process.env.DATABASE_URL,

  STRIPE_RESTRICTED_KEY: process.env.STRIPE_RESTRICTED_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_WEBHOOK_TOLERANCE_SECONDS: process.env.STRIPE_WEBHOOK_TOLERANCE_SECONDS,

  QSTASH_URL: process.env.QSTASH_URL,
  QSTASH_TOKEN: process.env.QSTASH_TOKEN,
  QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY,
  QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY,

  SENTRY_DSN: process.env.SENTRY_DSN,

  WEBHOOK_PROCESSING_MODE: process.env.WEBHOOK_PROCESSING_MODE,
  WEBHOOK_MODE: process.env.WEBHOOK_MODE,
});

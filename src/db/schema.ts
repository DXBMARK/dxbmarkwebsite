import { pgTable, serial, varchar, boolean, char, text, timestamp, integer } from "drizzle-orm/pg-core";

export const stripeWebhookEvents = pgTable("stripe_webhook_events", {
  id: serial("id").primaryKey(),
  stripeEventId: varchar("stripe_event_id", { length: 255 }).notNull().unique(),
  eventType: varchar("event_type", { length: 255 }).notNull(),
  objectId: varchar("object_id", { length: 255 }),
  objectType: varchar("object_type", { length: 100 }),
  livemode: boolean("livemode").notNull(),
  payloadHash: char("payload_hash", { length: 64 }).notNull(),

  // Processing pipeline status (authority: state-machine.ts)
  processingStatus: varchar("processing_status", { length: 100 }).notNull().default("received"),
  errorMessage: text("error_message"),
  retryCount: integer("retry_count").notNull().default(0),

  // Truth layer tracking (authority: webhook/route.ts)
  webhookStatus: varchar("webhook_status", { length: 50 }).notNull().default("received"),
  dbStatus: varchar("db_status", { length: 50 }).notNull().default("pending"),
  queueStatus: varchar("queue_status", { length: 50 }).notNull().default("pending"),

  processingStartedAt: timestamp("processing_started_at", { withTimezone: true }),
  stripeCreatedAt: timestamp("stripe_created_at", { withTimezone: true }),
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});


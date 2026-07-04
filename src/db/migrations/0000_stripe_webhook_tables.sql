-- Migration: Stripe Webhook Events, Billing States, and Integration Jobs
-- Date: 2026-07-03

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id SERIAL PRIMARY KEY,
  stripe_event_id VARCHAR(255) NOT NULL UNIQUE,
  event_type VARCHAR(255) NOT NULL,
  object_id VARCHAR(255) NULL,
  object_type VARCHAR(100) NULL,
  livemode BOOLEAN NOT NULL,
  payload_hash CHAR(64) NOT NULL,
  processing_status VARCHAR(100) NOT NULL DEFAULT 'received',
  error_message TEXT NULL,
  stripe_created_at TIMESTAMPTZ NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_processing_status CHECK (processing_status IN ('received', 'processing', 'processed', 'ignored', 'failed', 'duplicate'))
);

CREATE INDEX IF NOT EXISTS idx_stripe_event_type_received_at ON stripe_webhook_events (event_type, received_at);
CREATE INDEX IF NOT EXISTS idx_stripe_processing_status_received_at ON stripe_webhook_events (processing_status, received_at);
CREATE INDEX IF NOT EXISTS idx_stripe_object_id ON stripe_webhook_events (object_id);

CREATE TABLE IF NOT EXISTS billing_states (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(100) NOT NULL DEFAULT 'stripe',
  provider_customer_id VARCHAR(255) NULL,
  provider_subscription_id VARCHAR(255) NULL UNIQUE,
  customer_email_hash CHAR(64) NULL,
  state VARCHAR(100) NOT NULL DEFAULT 'unknown',
  current_period_end TIMESTAMPTZ NULL,
  last_event_id VARCHAR(255) NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_billing_state CHECK (state IN ('trialing', 'active', 'past_due', 'unpaid', 'cancel_pending', 'canceled', 'paused', 'incomplete', 'incomplete_expired', 'unknown'))
);

CREATE INDEX IF NOT EXISTS idx_billing_states_state_updated_at ON billing_states (state, updated_at);
CREATE INDEX IF NOT EXISTS idx_billing_states_customer_email_hash ON billing_states (customer_email_hash);
CREATE INDEX IF NOT EXISTS idx_billing_states_last_event_id ON billing_states (last_event_id);

CREATE TABLE IF NOT EXISTS integration_jobs (
  id SERIAL PRIMARY KEY,
  source_event_id VARCHAR(255) NOT NULL,
  job_type VARCHAR(255) NOT NULL,
  status VARCHAR(100) NOT NULL DEFAULT 'pending',
  attempts INT NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ NULL,
  last_error TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_source_event_job_type UNIQUE (source_event_id, job_type),
  CONSTRAINT chk_job_status CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'dead_letter'))
);

CREATE INDEX IF NOT EXISTS idx_integration_jobs_source_event_id ON integration_jobs (source_event_id);
CREATE INDEX IF NOT EXISTS idx_integration_jobs_status_next_attempt ON integration_jobs (status, next_attempt_at);

-- Migration: Extend stripe_webhook_events with Truth Layer columns
-- Date: 2026-07-04
-- Fixes:
--   1. Adds retry_count column (was missing from DB despite being in ORM schema)
--   2. Adds webhook_status, db_status, queue_status for full event traceability

-- 1. Add retry_count if not present (safe — idempotent)
ALTER TABLE stripe_webhook_events
  ADD COLUMN IF NOT EXISTS retry_count INTEGER NOT NULL DEFAULT 0;

-- 2. Add truth layer tracking columns
ALTER TABLE stripe_webhook_events
  ADD COLUMN IF NOT EXISTS webhook_status VARCHAR(50) NOT NULL DEFAULT 'received',
  ADD COLUMN IF NOT EXISTS db_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS queue_status VARCHAR(50) NOT NULL DEFAULT 'pending';

-- 3. Add check constraints (safe drop-and-add pattern)
ALTER TABLE stripe_webhook_events DROP CONSTRAINT IF EXISTS chk_webhook_status;
ALTER TABLE stripe_webhook_events
  ADD CONSTRAINT chk_webhook_status
    CHECK (webhook_status IN ('received', 'failed', 'invalid_signature'));

ALTER TABLE stripe_webhook_events DROP CONSTRAINT IF EXISTS chk_db_status;
ALTER TABLE stripe_webhook_events
  ADD CONSTRAINT chk_db_status
    CHECK (db_status IN ('pending', 'committed', 'failed'));

ALTER TABLE stripe_webhook_events DROP CONSTRAINT IF EXISTS chk_queue_status;
ALTER TABLE stripe_webhook_events
  ADD CONSTRAINT chk_queue_status
    CHECK (queue_status IN ('pending', 'sent', 'failed'));

-- 4. Add indexes for observability queries
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_status ON stripe_webhook_events (webhook_status);
CREATE INDEX IF NOT EXISTS idx_stripe_db_status ON stripe_webhook_events (db_status);
CREATE INDEX IF NOT EXISTS idx_stripe_queue_status ON stripe_webhook_events (queue_status);
CREATE INDEX IF NOT EXISTS idx_stripe_retry_count ON stripe_webhook_events (retry_count) WHERE retry_count > 0;

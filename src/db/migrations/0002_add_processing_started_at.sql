-- Migration: Add processing_started_at to stripe_webhook_events
-- Date: 2026-07-05

ALTER TABLE stripe_webhook_events
  ADD COLUMN IF NOT EXISTS processing_started_at TIMESTAMPTZ NULL;

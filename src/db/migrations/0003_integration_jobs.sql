-- Migration: Scaffold Inactive QStash Job Queue Table Schema
-- Date: 2026-07-05
-- Task: T030

CREATE TABLE IF NOT EXISTS integration_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority INTEGER NOT NULL DEFAULT 100,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  run_after TIMESTAMPTZ NOT NULL DEFAULT now(),
  locked_at TIMESTAMPTZ NULL,
  locked_by TEXT NULL,
  completed_at TIMESTAMPTZ NULL,
  failed_at TIMESTAMPTZ NULL,
  last_error TEXT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  source_system TEXT NULL,
  source_id TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_job_status CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'dead_letter', 'cancelled')),
  CONSTRAINT chk_attempts CHECK (attempts >= 0),
  CONSTRAINT chk_max_attempts CHECK (max_attempts > 0),
  CONSTRAINT chk_priority CHECK (priority >= 0)
);

CREATE INDEX IF NOT EXISTS idx_integration_jobs_status ON integration_jobs (status);
CREATE INDEX IF NOT EXISTS idx_integration_jobs_run_after ON integration_jobs (run_after);
CREATE INDEX IF NOT EXISTS idx_integration_jobs_job_type ON integration_jobs (job_type);
CREATE INDEX IF NOT EXISTS idx_integration_jobs_source ON integration_jobs (source_system, source_id);
CREATE INDEX IF NOT EXISTS idx_integration_jobs_runnable ON integration_jobs (priority, run_after) WHERE status = 'pending';

-- =========================================================================
-- Resourcemania: Jobs Table Schema & Migration
-- Run this query once in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- =========================================================================

-- 1. Ensure Table Exists
CREATE TABLE IF NOT EXISTS jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id text UNIQUE,
  company_id text NOT NULL,
  company_name text,
  company_email text,
  title text NOT NULL,
  description text NOT NULL,
  skills_required jsonb DEFAULT '[]'::jsonb,
  other_skills text,
  experience text,
  job_type text DEFAULT 'Full-time',
  location text DEFAULT 'Remote',
  salary_range text,
  status text DEFAULT 'pending_approval', -- 'pending_approval' | 'active' | 'rejected' | 'closed'
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Add columns if table already existed without them
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_id text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_email text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending_approval';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS other_skills text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS skills_required jsonb DEFAULT '[]'::jsonb;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 3. Row Level Security (RLS) Configuration
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select for all" ON jobs;
CREATE POLICY "Allow select for all" ON jobs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert for all" ON jobs;
CREATE POLICY "Allow insert for all" ON jobs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update for all" ON jobs;
CREATE POLICY "Allow update for all" ON jobs FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete for all" ON jobs;
CREATE POLICY "Allow delete for all" ON jobs FOR DELETE USING (true);

-- Index for fast lookup by job_id and status
CREATE INDEX IF NOT EXISTS idx_jobs_job_id ON jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);

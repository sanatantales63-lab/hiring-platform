-- =========================================================================
-- Resourcemania: Referral Partners & Candidate Attribution Migration
-- Run this query once in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- =========================================================================

-- 1. Create Referral Partners Table
CREATE TABLE IF NOT EXISTS referral_partners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_name text NOT NULL,
  contact_person text,
  email text,
  phone text,
  referral_code text UNIQUE NOT NULL,
  commission_rate numeric DEFAULT 20, -- Default 20% commission on net revenue
  status text DEFAULT 'active', -- 'active' | 'inactive'
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Add referral tracking column to profiles if not present
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code text;

-- 3. Row Level Security Policies
ALTER TABLE referral_partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select for all partners" ON referral_partners;
CREATE POLICY "Allow select for all partners" ON referral_partners FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert for all partners" ON referral_partners;
CREATE POLICY "Allow insert for all partners" ON referral_partners FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update for all partners" ON referral_partners;
CREATE POLICY "Allow update for all partners" ON referral_partners FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete for all partners" ON referral_partners;
CREATE POLICY "Allow delete for all partners" ON referral_partners FOR DELETE USING (true);

-- Index for instant lookup by referral code
CREATE INDEX IF NOT EXISTS idx_referral_partners_code ON referral_partners(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

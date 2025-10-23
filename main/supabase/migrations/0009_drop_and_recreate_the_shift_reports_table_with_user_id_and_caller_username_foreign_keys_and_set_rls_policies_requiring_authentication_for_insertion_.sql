-- Drop existing table
DROP TABLE IF EXISTS public.shift_reports CASCADE;

-- Recreate shift_reports table with user_id and caller_username
CREATE TABLE public.shift_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid () PRIMARY KEY,
  working_hours SMALLINT NULL,
  total_calls INTEGER NULL DEFAULT 0,
  total_pickups INTEGER NULL DEFAULT 0,
  total_appointments INTEGER NULL DEFAULT 0,
  report_notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  user_id UUID NULL,
  caller_username TEXT NULL,
  CONSTRAINT shift_reports_caller_username_fkey FOREIGN KEY (caller_username) REFERENCES profiles (username) ON DELETE SET NULL,
  CONSTRAINT shift_reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.shift_reports ENABLE ROW LEVEL SECURITY;

-- Policy 1: Authenticated users must set their ID on insert
CREATE POLICY "Authenticated users must set their ID on insert" ON public.shift_reports
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Policy 2: Authenticated users can read their own reports
CREATE POLICY "Authenticated users can read their own reports" ON public.shift_reports
FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Policy 3: Public users can read reports (allowing public visibility of reports)
CREATE POLICY "Public users can read reports" ON public.shift_reports
FOR SELECT USING (true);
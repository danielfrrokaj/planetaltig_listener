-- Drop existing table
DROP TABLE IF EXISTS public.shift_reports CASCADE;

-- Recreate shift_reports table with nullable user_id
CREATE TABLE public.shift_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  caller_name public.caller_enum NOT NULL,
  working_hours TEXT NULL,
  total_calls INTEGER NULL DEFAULT 0,
  total_pickups INTEGER NULL DEFAULT 0,
  total_appointments INTEGER NULL DEFAULT 0,
  report_notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  user_id UUID NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS (REQUIRED for security, even if policies are permissive)
ALTER TABLE public.shift_reports ENABLE ROW LEVEL SECURITY;

-- Policy allowing anonymous users to insert data (public access)
CREATE POLICY "Public users can insert reports" ON public.shift_reports
FOR INSERT TO public WITH CHECK (true);

-- Policy allowing anonymous users to read reports (public access)
CREATE POLICY "Public users can read reports" ON public.shift_reports
FOR SELECT USING (true);
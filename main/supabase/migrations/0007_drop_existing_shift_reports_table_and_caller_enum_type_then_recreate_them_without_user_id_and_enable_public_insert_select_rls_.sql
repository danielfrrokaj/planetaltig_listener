-- Drop existing table and type if they exist
DROP TABLE IF EXISTS public.shift_reports CASCADE;
DROP TYPE IF EXISTS public.caller_enum;

-- Create caller_enum type
CREATE TYPE public.caller_enum AS ENUM ('caller1', 'caller2', 'caller3');

-- Create shift_reports table without user_id
CREATE TABLE public.shift_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  caller_name public.caller_enum NOT NULL,
  working_hours TEXT NULL,
  total_calls INTEGER NULL DEFAULT 0,
  total_searches INTEGER NULL DEFAULT 0,
  total_pickups INTEGER NULL DEFAULT 0,
  total_appointments INTEGER NULL DEFAULT 0,
  report_notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security, even if policies are permissive)
ALTER TABLE public.shift_reports ENABLE ROW LEVEL SECURITY;

-- Policy allowing anonymous users to insert data (public access)
CREATE POLICY "Public users can insert reports" ON public.shift_reports
FOR INSERT TO public WITH CHECK (true);

-- Policy allowing anonymous users to read data (public access)
CREATE POLICY "Public users can read reports" ON public.shift_reports
FOR SELECT USING (true);
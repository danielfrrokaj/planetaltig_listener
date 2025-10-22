-- Drop existing policies
DROP POLICY IF EXISTS "Allow anon inserts" ON public.shift_reports;
DROP POLICY IF EXISTS "Allow public read access" ON public.shift_reports;

-- Drop the existing table
DROP TABLE IF EXISTS public.shift_reports;

-- Create the new shift_reports table using total_searches instead of total_clicks
CREATE TABLE public.shift_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caller_name caller_enum NOT NULL,
  working_hours TEXT NULL,
  total_calls INTEGER NULL DEFAULT 0,
  total_searches INTEGER NULL DEFAULT 0, -- Renamed from total_clicks
  total_pickups INTEGER NULL DEFAULT 0,
  total_appointments INTEGER NULL DEFAULT 0,
  report_notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.shift_reports ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anonymous users to insert reports
CREATE POLICY "Allow anon inserts" ON public.shift_reports 
FOR INSERT TO anon WITH CHECK (true);

-- Policy 2: Allow public read access
CREATE POLICY "Allow public read access" ON public.shift_reports 
FOR SELECT USING (true);
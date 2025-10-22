-- Drop existing policies
DROP POLICY IF EXISTS "Users can delete their own reports" ON public.shift_reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.shift_reports;
DROP POLICY IF EXISTS "Users can insert their own reports" ON public.shift_reports;
DROP POLICY IF EXISTS "Authenticated users can view all reports" ON public.shift_reports;

-- Drop the existing table
DROP TABLE IF EXISTS public.shift_reports;

-- Drop the existing ENUM type if it exists (unlikely, but safe)
DROP TYPE IF EXISTS caller_enum;

-- Create the new ENUM type for caller names
CREATE TYPE caller_enum AS ENUM ('caller1', 'caller2', 'caller3');

-- Create the new shift_reports table using caller_name instead of user_id
CREATE TABLE public.shift_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caller_name caller_enum NOT NULL,
  working_hours TEXT NULL,
  total_calls INTEGER NULL DEFAULT 0,
  total_clicks INTEGER NULL DEFAULT 0,
  total_pickups INTEGER NULL DEFAULT 0,
  total_appointments INTEGER NULL DEFAULT 0,
  report_notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.shift_reports ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anonymous users to insert reports (since we removed auth dependency)
CREATE POLICY "Allow anon inserts" ON public.shift_reports 
FOR INSERT TO anon WITH CHECK (true);

-- Policy 2: Allow public read access (since data is not user-specific)
CREATE POLICY "Allow public read access" ON public.shift_reports 
FOR SELECT USING (true);
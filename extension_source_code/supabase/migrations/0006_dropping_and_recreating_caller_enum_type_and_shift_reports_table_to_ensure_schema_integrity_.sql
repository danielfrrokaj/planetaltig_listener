-- Drop the existing table
DROP TABLE IF EXISTS public.shift_reports;

-- Drop the existing ENUM type
DROP TYPE IF EXISTS public.caller_enum;

-- Create the new ENUM type for caller names
CREATE TYPE public.caller_enum AS ENUM ('caller1', 'caller2', 'caller3');

-- Create the shift_reports table
CREATE TABLE public.shift_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caller_name public.caller_enum NOT NULL,
  working_hours TEXT NULL,
  total_calls INTEGER NULL DEFAULT 0,
  total_searches INTEGER NULL DEFAULT 0,
  total_pickups INTEGER NULL DEFAULT 0,
  total_appointments INTEGER NULL DEFAULT 0,
  report_notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS (as requested, to ensure public insertion)
ALTER TABLE public.shift_reports DISABLE ROW LEVEL SECURITY;
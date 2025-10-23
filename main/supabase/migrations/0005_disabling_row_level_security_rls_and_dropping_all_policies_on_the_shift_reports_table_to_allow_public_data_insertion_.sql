-- Drop existing policies
DROP POLICY IF EXISTS "Allow anon inserts" ON public.shift_reports;
DROP POLICY IF EXISTS "Allow public read access" ON public.shift_reports;

-- Disable RLS on the table
ALTER TABLE public.shift_reports DISABLE ROW LEVEL SECURITY;
-- Create shift_reports table
CREATE TABLE public.shift_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  working_hours TEXT,
  total_calls INT DEFAULT 0,
  total_clicks INT DEFAULT 0,
  total_pickups INT DEFAULT 0,
  total_appointments INT DEFAULT 0,
  report_notes TEXT, -- Storing the final formatted summary text
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.shift_reports ENABLE ROW LEVEL SECURITY;

-- Policy 1: Authenticated users (managers/reviewers) can read ALL reports
CREATE POLICY "Authenticated users can view all reports" ON public.shift_reports 
FOR SELECT TO authenticated USING (true);

-- Policy 2: Users can only insert their own reports
CREATE POLICY "Users can insert their own reports" ON public.shift_reports 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can only update their own reports
CREATE POLICY "Users can update their own reports" ON public.shift_reports 
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Policy 4: Users can only delete their own reports
CREATE POLICY "Users can delete their own reports" ON public.shift_reports 
FOR DELETE TO authenticated USING (auth.uid() = user_id);
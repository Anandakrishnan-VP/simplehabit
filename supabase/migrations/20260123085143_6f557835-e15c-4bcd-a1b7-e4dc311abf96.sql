-- Add day_of_week column to habits table to associate habits with specific days
ALTER TABLE public.habits ADD COLUMN day_of_week text;

-- Create an index for faster lookups by day
CREATE INDEX idx_habits_day_of_week ON public.habits(day_of_week);

-- Update existing habits to be available all days (null means available every day for backwards compat)
-- New habits will have a specific day_of_week set
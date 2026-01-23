-- Add a date column to track completions by specific calendar date
ALTER TABLE public.habit_completions ADD COLUMN completion_date date;

-- Create an index for faster date lookups
CREATE INDEX idx_habit_completions_date ON public.habit_completions(completion_date);

-- Migrate existing data: combine week_start + day_of_week into actual date
UPDATE public.habit_completions 
SET completion_date = week_start + 
  CASE day_of_week
    WHEN 'Mon' THEN 0
    WHEN 'Tue' THEN 1
    WHEN 'Wed' THEN 2
    WHEN 'Thu' THEN 3
    WHEN 'Fri' THEN 4
    WHEN 'Sat' THEN 5
    WHEN 'Sun' THEN 6
    ELSE 0
  END
WHERE completion_date IS NULL;
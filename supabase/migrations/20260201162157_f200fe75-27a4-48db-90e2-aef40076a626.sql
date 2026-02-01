-- Create table to track streak revivals
CREATE TABLE public.streak_revivals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  revivals_available INTEGER NOT NULL DEFAULT 0,
  revivals_earned_total INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create table to track which dates were revived
CREATE TABLE public.revived_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  revived_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, revived_date)
);

-- Enable RLS
ALTER TABLE public.streak_revivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revived_dates ENABLE ROW LEVEL SECURITY;

-- RLS policies for streak_revivals
CREATE POLICY "Users can view their own revivals" ON public.streak_revivals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own revivals" ON public.streak_revivals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own revivals" ON public.streak_revivals FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for revived_dates
CREATE POLICY "Users can view their own revived dates" ON public.revived_dates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own revived dates" ON public.revived_dates FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_streak_revivals_updated_at
BEFORE UPDATE ON public.streak_revivals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
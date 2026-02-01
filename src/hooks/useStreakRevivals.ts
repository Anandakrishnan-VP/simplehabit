import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface StreakRevivalData {
  revivalsAvailable: number;
  revivalsEarnedTotal: number;
  revivedDates: string[];
}

export const useStreakRevivals = () => {
  const { user } = useAuth();
  const [data, setData] = useState<StreakRevivalData>({
    revivalsAvailable: 0,
    revivalsEarnedTotal: 0,
    revivedDates: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch revival data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      // Fetch revivals
      const { data: revivalData } = await supabase
        .from('streak_revivals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch revived dates
      const { data: revivedDatesData } = await supabase
        .from('revived_dates')
        .select('revived_date')
        .eq('user_id', user.id);

      setData({
        revivalsAvailable: revivalData?.revivals_available || 0,
        revivalsEarnedTotal: revivalData?.revivals_earned_total || 0,
        revivedDates: (revivedDatesData || []).map(d => d.revived_date)
      });

      setLoading(false);
    };

    fetchData();
  }, [user]);

  // Update revivals earned based on streak
  const updateRevivalsFromStreak = useCallback(async (currentStreak: number) => {
    if (!user) return;

    const newRevivalsEarned = Math.floor(currentStreak / 7);
    
    // Only update if we've earned more revivals than before
    if (newRevivalsEarned > data.revivalsEarnedTotal) {
      const newRevivalsToAdd = newRevivalsEarned - data.revivalsEarnedTotal;
      
      // Check if record exists
      const { data: existing } = await supabase
        .from('streak_revivals')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existing) {
        await supabase
          .from('streak_revivals')
          .update({
            revivals_available: data.revivalsAvailable + newRevivalsToAdd,
            revivals_earned_total: newRevivalsEarned
          })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('streak_revivals')
          .insert({
            user_id: user.id,
            revivals_available: newRevivalsToAdd,
            revivals_earned_total: newRevivalsEarned
          });
      }

      setData(prev => ({
        ...prev,
        revivalsAvailable: prev.revivalsAvailable + newRevivalsToAdd,
        revivalsEarnedTotal: newRevivalsEarned
      }));
    }
  }, [user, data.revivalsAvailable, data.revivalsEarnedTotal]);

  // Use a revival to save a missed date
  const useRevival = useCallback(async (missedDate: string): Promise<boolean> => {
    if (!user || data.revivalsAvailable <= 0) return false;

    // Insert revived date
    const { error: insertError } = await supabase
      .from('revived_dates')
      .insert({
        user_id: user.id,
        revived_date: missedDate
      });

    if (insertError) return false;

    // Decrement available revivals
    await supabase
      .from('streak_revivals')
      .update({
        revivals_available: data.revivalsAvailable - 1
      })
      .eq('user_id', user.id);

    setData(prev => ({
      ...prev,
      revivalsAvailable: prev.revivalsAvailable - 1,
      revivedDates: [...prev.revivedDates, missedDate]
    }));

    return true;
  }, [user, data.revivalsAvailable]);

  return {
    data,
    loading,
    updateRevivalsFromStreak,
    useRevival
  };
};

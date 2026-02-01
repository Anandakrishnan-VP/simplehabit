import { useMemo } from 'react';
import { Flame } from 'lucide-react';
import type { Habit } from '@/hooks/useHabitData';

interface StreakCounterProps {
  habitCompletions: Record<string, Record<string, boolean>>;
  habitList: Habit[];
}

// Check if any habit was completed on a specific date
const hasAnyHabitCompletedOnDate = (
  date: string,
  habitCompletions: Record<string, Record<string, boolean>>,
  habitList: Habit[]
): boolean => {
  for (const habit of habitList) {
    if (habitCompletions[habit.id]?.[date]) {
      return true;
    }
  }
  return false;
};

// Get date string in YYYY-MM-DD format
const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const StreakCounter = ({ habitCompletions, habitList }: StreakCounterProps) => {
  const streak = useMemo(() => {
    if (habitList.length === 0) return 0;

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Start from today and go backwards
    let checkDate = new Date(today);
    
    // Check if today has any completions
    const todayStr = getDateString(checkDate);
    const hasToday = hasAnyHabitCompletedOnDate(todayStr, habitCompletions, habitList);
    
    // If no completion today, start checking from yesterday
    if (!hasToday) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    // Count consecutive days with at least one habit completed
    while (true) {
      const dateStr = getDateString(checkDate);
      if (hasAnyHabitCompletedOnDate(dateStr, habitCompletions, habitList)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return currentStreak;
  }, [habitCompletions, habitList]);

  return (
    <div className="border border-foreground p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Flame 
              className={`w-8 h-8 ${streak > 0 ? 'text-[#ff6b00]' : 'text-muted-foreground/30'}`}
              fill={streak > 0 ? '#ff6b00' : 'transparent'}
            />
            {streak > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff6b00] rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Current Streak
            </p>
            <p className="font-mono text-3xl font-bold text-foreground">
              {streak}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {streak === 1 ? 'day' : 'days'}
              </span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {streak > 0 ? 'Keep it going!' : 'Start today!'}
          </p>
          {streak >= 7 && (
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#00ff87]">
              🔥 On fire!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

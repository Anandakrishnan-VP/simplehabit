import { useMemo, useEffect, useState } from 'react';
import { Flame, Heart, Zap } from 'lucide-react';
import type { Habit } from '@/hooks/useHabitData';
import { useStreakRevivals } from '@/hooks/useStreakRevivals';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface StreakCounterProps {
  habitCompletions: Record<string, Record<string, boolean>>;
  habitList: Habit[];
}

// Get date string in YYYY-MM-DD format
const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const StreakCounter = ({ habitCompletions, habitList }: StreakCounterProps) => {
  const { data: revivalData, updateRevivalsFromStreak, useRevival } = useStreakRevivals();
  const [missedDate, setMissedDate] = useState<string | null>(null);

  // Check if any habit was completed on a specific date OR if it was revived
  const hasActivityOnDate = (date: string): boolean => {
    // Check if date was revived
    if (revivalData.revivedDates.includes(date)) {
      return true;
    }
    // Check if any habit was completed
    for (const habit of habitList) {
      if (habitCompletions[habit.id]?.[date]) {
        return true;
      }
    }
    return false;
  };

  const { streak, firstMissedDate } = useMemo(() => {
    if (habitList.length === 0) return { streak: 0, firstMissedDate: null };

    let currentStreak = 0;
    let foundMissedDate: string | null = null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let checkDate = new Date(today);
    
    // Check if today has any activity
    const todayStr = getDateString(checkDate);
    const hasToday = hasActivityOnDate(todayStr);
    
    // If no activity today, check if we can show revival option for today
    if (!hasToday) {
      foundMissedDate = todayStr;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    // Count consecutive days with activity
    while (true) {
      const dateStr = getDateString(checkDate);
      if (hasActivityOnDate(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Found a gap - this is where streak would break
        if (!foundMissedDate && currentStreak > 0) {
          foundMissedDate = dateStr;
        }
        break;
      }
    }
    
    return { streak: currentStreak, firstMissedDate: foundMissedDate };
  }, [habitCompletions, habitList, revivalData.revivedDates]);

  // Update revivals earned based on current streak
  useEffect(() => {
    if (streak > 0) {
      updateRevivalsFromStreak(streak);
    }
  }, [streak, updateRevivalsFromStreak]);

  // Track missed date for revival option
  useEffect(() => {
    setMissedDate(firstMissedDate);
  }, [firstMissedDate]);

  const handleUseRevival = async () => {
    if (!missedDate) return;
    
    const success = await useRevival(missedDate);
    if (success) {
      toast({
        title: "Revival Used!",
        description: `Your streak has been saved! You used a revival for ${missedDate}.`,
      });
      setMissedDate(null);
    } else {
      toast({
        title: "Failed",
        description: "Could not use revival. Please try again.",
        variant: "destructive"
      });
    }
  };

  const nextRevivalIn = 7 - (streak % 7);
  const showRevivalOption = missedDate && revivalData.revivalsAvailable > 0 && streak > 0;

  return (
    <div className="border border-foreground p-4">
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

      {/* Revival Powers Section */}
      <div className="mt-4 pt-4 border-t border-foreground/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#ff0080]" fill="#ff0080" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Revival Powers
            </span>
          </div>
          <Badge variant="outline" className="font-mono text-xs border-[#ff0080] text-[#ff0080]">
            {revivalData.revivalsAvailable}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
          <Zap className="w-3 h-3 text-[#ffcc00]" />
          <span>Next revival in {nextRevivalIn} {nextRevivalIn === 1 ? 'day' : 'days'}</span>
        </div>

        {/* Revival Option */}
        {showRevivalOption && (
          <div className="mt-3 p-2 bg-[#ff0080]/10 border border-[#ff0080]/30 rounded">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#ff0080] mb-2">
              ⚠️ Streak at risk! Use revival?
            </p>
            <Button 
              size="sm" 
              onClick={handleUseRevival}
              className="w-full font-mono text-xs uppercase bg-[#ff0080] hover:bg-[#ff0080]/80 text-white"
            >
              <Heart className="w-3 h-3 mr-1" />
              Save Streak
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

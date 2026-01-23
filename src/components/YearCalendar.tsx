import { getDaysInMonth, getMonthName, formatDateKey, getDayOfWeek } from '@/lib/dateUtils';
import type { Habit } from '@/hooks/useHabitData';

interface YearCalendarProps {
  year: number;
  habitCompletions: Record<string, Record<string, boolean>>;
  habitList: Habit[];
}

const safeHabitList = (list: Habit[] | undefined): Habit[] => list ?? [];

// Map day numbers to day names
const getDayName = (dayIndex: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayIndex];
};

// Get date string in YYYY-MM-DD format
const getDateString = (year: number, month: number, day: number): string => {
  const m = (month + 1).toString().padStart(2, '0');
  const d = day.toString().padStart(2, '0');
  return `${year}-${m}-${d}`;
};

// Calculate completion percentage for a specific date
const calculateDayCompletion = (
  year: number,
  month: number,
  day: number,
  habitCompletions: Record<string, Record<string, boolean>>,
  habitList: Habit[]
): number => {
  const habits = safeHabitList(habitList);
  const dateStr = getDateString(year, month, day);
  const dayIndex = getDayOfWeek(year, month, day);
  const dayName = getDayName(dayIndex);
  
  // Get habits that are scheduled for this day of week
  const habitsForDay = habits.filter(h => h.dayOfWeek === dayName);
  if (habitsForDay.length === 0) return -1; // No habits scheduled

  let completed = 0;
  habitsForDay.forEach(habit => {
    if (habitCompletions[habit.id]?.[dateStr]) {
      completed++;
    }
  });

  return completed / habitsForDay.length;
};

// Check if date is today or in the past
const isDatePastOrToday = (year: number, month: number, day: number): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(year, month, day);
  return checkDate <= today;
};

export const YearCalendar = ({ year, habitCompletions, habitList }: YearCalendarProps) => {
  const months = Array.from({ length: 12 }, (_, i) => i);
  const habits = safeHabitList(habitList);

  return (
    <section className="mb-16">
      <h2 className="section-title">Year {year}</h2>
      
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {months.map(month => {
          const daysInMonth = getDaysInMonth(year, month);
          const firstDayOfWeek = getDayOfWeek(year, month, 1);
          // Adjust for Monday start (0 = Monday, 6 = Sunday)
          const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
          
          return (
            <div key={month} className="min-w-0">
              <h3 className="font-mono text-xs font-semibold mb-2 uppercase tracking-wider">
                {getMonthName(month)}
              </h3>
              
              {/* Day labels */}
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <span key={i} className="text-[8px] font-mono text-center text-muted-foreground">
                    {day}
                  </span>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {/* Empty cells for offset */}
                {Array.from({ length: startOffset }, (_, i) => (
                  <div key={`empty-${i}`} className="day-cell empty" />
                ))}
                
                {/* Day cells */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const isPastOrToday = isDatePastOrToday(year, month, day);
                  
                  let statusClass = '';
                  if (isPastOrToday) {
                    const completion = calculateDayCompletion(year, month, day, habitCompletions, habits);
                    if (completion >= 0) { // Only color if there are habits scheduled
                      statusClass = completion >= 0.5 ? 'status-success' : 'status-danger';
                    }
                  }
                  
                  return (
                    <div
                      key={day}
                      className={`day-cell ${statusClass}`}
                      aria-label={`${getMonthName(month)} ${day}, ${year}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

import { getDaysInMonth, getMonthName, formatDateKey, getDayOfWeek } from '@/lib/dateUtils';
import type { Habit } from '@/hooks/useHabitData';

interface YearCalendarProps {
  year: number;
  weeklyHabits: Record<string, Record<string, boolean>>;
  habitList: Habit[];
}

const safeHabitList = (list: Habit[] | undefined): Habit[] => list ?? [];

// Map day numbers to day names
const getDayName = (year: number, month: number, day: number): string => {
  const dayIndex = getDayOfWeek(year, month, day);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayIndex];
};

// Calculate completion percentage for a specific day
const calculateDayCompletion = (
  year: number,
  month: number,
  day: number,
  weeklyHabits: Record<string, Record<string, boolean>>,
  habitList: Habit[]
): number => {
  const habits = safeHabitList(habitList);
  if (habits.length === 0) return 0;

  const dayName = getDayName(year, month, day);
  let completed = 0;

  habits.forEach(habit => {
    if (weeklyHabits[habit.id]?.[dayName]) {
      completed++;
    }
  });

  return completed / habits.length;
};

// Check if date is today or in the past
const isDatePastOrToday = (year: number, month: number, day: number): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(year, month, day);
  return checkDate <= today;
};

export const YearCalendar = ({ year, weeklyHabits, habitList }: YearCalendarProps) => {
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
                  const dateKey = formatDateKey(year, month, day);
                  const isPastOrToday = isDatePastOrToday(year, month, day);
                  
                  let statusClass = '';
                  if (isPastOrToday && habits.length > 0) {
                    const completion = calculateDayCompletion(year, month, day, weeklyHabits, habits);
                    statusClass = completion >= 0.5 ? 'status-success' : 'status-danger';
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

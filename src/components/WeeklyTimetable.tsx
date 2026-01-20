import { useState } from 'react';
import { getWeekDays } from '@/lib/dateUtils';

interface WeeklyTimetableProps {
  habits: Record<string, Record<string, boolean>>;
  onToggle: (habitId: string, day: string) => void;
}

const DEFAULT_HABITS = [
  { id: 'exercise', name: 'Exercise' },
  { id: 'reading', name: 'Reading' },
  { id: 'meditation', name: 'Meditation' },
  { id: 'journaling', name: 'Journaling' },
  { id: 'deep-work', name: 'Deep Work' },
];

export const WeeklyTimetable = ({ habits, onToggle }: WeeklyTimetableProps) => {
  const days = getWeekDays();
  const [habitList] = useState(DEFAULT_HABITS);

  return (
    <section className="mb-16">
      <h2 className="section-title">Weekly Habits</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left font-mono text-xs font-semibold uppercase tracking-wider pb-3 pr-8 min-w-[120px]">
                Habit
              </th>
              {days.map(day => (
                <th 
                  key={day} 
                  className="font-mono text-xs font-semibold uppercase tracking-wider pb-3 px-2 text-center min-w-[40px]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habitList.map(habit => (
              <tr key={habit.id} className="border-t border-foreground">
                <td className="py-3 pr-8 font-mono text-sm">
                  {habit.name}
                </td>
                {days.map(day => {
                  const isChecked = habits[habit.id]?.[day] || false;
                  return (
                    <td key={day} className="py-3 px-2 text-center">
                      <button
                        onClick={() => onToggle(habit.id, day)}
                        className={`habit-checkbox mx-auto ${isChecked ? 'checked' : ''}`}
                        aria-label={`${habit.name} on ${day}${isChecked ? ' - completed' : ''}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

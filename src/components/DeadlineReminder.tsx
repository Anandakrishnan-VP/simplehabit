import { useMemo } from 'react';
import { Bell, Clock } from 'lucide-react';
import type { Todo } from '@/hooks/useHabitData';

interface DeadlineReminderProps {
  todos: Todo[];
}

// Get date string in YYYY-MM-DD format
const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get tomorrow's date string
const getTomorrowDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getDateString(tomorrow);
};

// Get today's date string
const getTodayDate = (): string => {
  return getDateString(new Date());
};

export const DeadlineReminder = ({ todos }: DeadlineReminderProps) => {
  const reminders = useMemo(() => {
    const tomorrow = getTomorrowDate();
    const today = getTodayDate();
    
    // Get todos that are due tomorrow or today and not completed
    const upcomingTodos = todos.filter(todo => {
      if (todo.completed) return false;
      return todo.deadline === tomorrow || todo.deadline === today;
    });

    // Sort by deadline (today first, then tomorrow)
    return upcomingTodos.sort((a, b) => {
      if (a.deadline === today && b.deadline !== today) return -1;
      if (b.deadline === today && a.deadline !== today) return 1;
      return 0;
    });
  }, [todos]);

  if (reminders.length === 0) {
    return null;
  }

  return (
    <div className="border border-foreground p-4 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-[#ff6b00]" />
        <h3 className="font-mono text-xs uppercase tracking-wider font-bold">
          Deadline Reminders
        </h3>
      </div>
      
      <div className="space-y-2">
        {reminders.map(todo => {
          const isToday = todo.deadline === getTodayDate();
          
          return (
            <div 
              key={todo.id}
              className={`flex items-center justify-between p-2 border ${
                isToday 
                  ? 'border-[#ff0040] bg-[#ff0040]/10' 
                  : 'border-[#ff6b00] bg-[#ff6b00]/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className={`w-3 h-3 ${isToday ? 'text-[#ff0040]' : 'text-[#ff6b00]'}`} />
                <span className="font-mono text-xs text-foreground">
                  {todo.title}
                </span>
              </div>
              <span className={`font-mono text-[10px] uppercase tracking-wider font-bold ${
                isToday ? 'text-[#ff0040]' : 'text-[#ff6b00]'
              }`}>
                {isToday ? 'Due Today!' : 'Due Tomorrow'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

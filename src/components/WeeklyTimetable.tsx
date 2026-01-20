import { useState } from 'react';
import { getWeekDays } from '@/lib/dateUtils';
import { Plus, X, Pencil, Check } from 'lucide-react';
import type { Habit } from '@/hooks/useHabitData';

interface WeeklyTimetableProps {
  habits: Record<string, Record<string, boolean>>;
  habitList: Habit[];
  onToggle: (habitId: string, day: string) => void;
  onAddHabit: (name: string) => void;
  onEditHabit: (id: string, newName: string) => void;
  onDeleteHabit: (id: string) => void;
}

export const WeeklyTimetable = ({ 
  habits, 
  habitList = [],
  onToggle, 
  onAddHabit,
  onEditHabit, 
  onDeleteHabit 
}: WeeklyTimetableProps) => {
  const days = getWeekDays();
  const [newHabitName, setNewHabitName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim());
      setNewHabitName('');
    }
  };

  const handleStartEdit = (habit: Habit) => {
    setEditingId(habit.id);
    setEditingName(habit.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      onEditHabit(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <section className="mb-16">
      <h2 className="section-title">Weekly Habits</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left font-mono text-xs font-semibold uppercase tracking-wider pb-3 pr-8 min-w-[180px]">
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
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody>
            {habitList.map(habit => (
              <tr key={habit.id} className="border-t border-foreground">
                <td className="py-3 pr-8 font-mono text-sm">
                  {editingId === habit.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        className="bg-background border border-foreground px-2 py-1 font-mono text-sm w-full"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="p-1 border border-foreground hover:bg-foreground hover:text-background"
                        aria-label="Save"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    habit.name
                  )}
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
                <td className="py-3 pl-4">
                  {editingId !== habit.id && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(habit)}
                        className="p-1 border border-foreground hover:bg-foreground hover:text-background"
                        aria-label={`Edit ${habit.name}`}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDeleteHabit(habit.id)}
                        className="p-1 border border-foreground hover:bg-foreground hover:text-background"
                        aria-label={`Delete ${habit.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add new habit */}
      <div className="flex items-center gap-3 mt-6">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddHabit();
          }}
          placeholder="New habit..."
          className="bg-background border border-foreground px-3 py-2 font-mono text-sm flex-1 max-w-xs"
        />
        <button
          onClick={handleAddHabit}
          disabled={!newHabitName.trim()}
          className="p-2 border border-foreground hover:bg-foreground hover:text-background disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Add habit"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

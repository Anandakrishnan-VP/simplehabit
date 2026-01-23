import { useState } from 'react';
import { Plus, X, Check, Pencil } from 'lucide-react';
import type { Habit } from '@/hooks/useHabitData';

interface DailyHabitsProps {
  habits: Record<string, Record<string, boolean>>;
  habitList: Habit[];
  onToggle: (habitId: string, day: string) => void;
  onAddHabit: (name: string, dayOfWeek: string) => void;
  onEditHabit: (id: string, newName: string) => void;
  onDeleteHabit: (id: string) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const DailyHabits = ({
  habits,
  habitList,
  onToggle,
  onAddHabit,
  onEditHabit,
  onDeleteHabit
}: DailyHabitsProps) => {
  const [expandedDay, setExpandedDay] = useState<string | null>(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [newHabitName, setNewHabitName] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const getHabitsForDay = (day: string) => {
    return habitList.filter(h => h.dayOfWeek === day);
  };

  const handleAddHabit = (day: string) => {
    const name = newHabitName[day]?.trim();
    if (name) {
      onAddHabit(name, day);
      setNewHabitName(prev => ({ ...prev, [day]: '' }));
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
      <h2 className="section-title">Daily Habits</h2>
      
      <div className="space-y-4">
        {DAYS.map(day => {
          const dayHabits = getHabitsForDay(day);
          const isExpanded = expandedDay === day;
          const completedCount = dayHabits.filter(h => habits[h.id]?.[day]).length;
          
          return (
            <div key={day} className="border border-foreground">
              {/* Day Header */}
              <button
                onClick={() => setExpandedDay(isExpanded ? null : day)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-foreground/5 transition-colors"
              >
                <span className="font-mono text-sm font-semibold uppercase tracking-wider">
                  {day}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {dayHabits.length > 0 ? `${completedCount}/${dayHabits.length}` : 'No habits'}
                </span>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-foreground px-4 py-3">
                  {/* Habit List */}
                  {dayHabits.length > 0 ? (
                    <ul className="space-y-2 mb-4">
                      {dayHabits.map(habit => {
                        const isChecked = habits[habit.id]?.[day] || false;
                        const isEditing = editingId === habit.id;

                        return (
                          <li key={habit.id} className="flex items-center gap-3">
                            <button
                              onClick={() => onToggle(habit.id, day)}
                              className={`habit-checkbox flex-shrink-0 ${isChecked ? 'checked' : ''}`}
                              aria-label={`${habit.name}${isChecked ? ' - completed' : ''}`}
                            />
                            
                            {isEditing ? (
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="text"
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit();
                                    if (e.key === 'Escape') handleCancelEdit();
                                  }}
                                  className="bg-background border border-foreground px-2 py-1 font-mono text-sm flex-1"
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
                              <>
                                <span className={`font-mono text-sm flex-1 ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                                  {habit.name}
                                </span>
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
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="font-mono text-xs text-muted-foreground mb-4">
                      No habits for {day} yet
                    </p>
                  )}

                  {/* Add New Habit */}
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newHabitName[day] || ''}
                      onChange={(e) => setNewHabitName(prev => ({ ...prev, [day]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddHabit(day);
                      }}
                      placeholder="Add habit..."
                      className="bg-background border border-foreground px-3 py-2 font-mono text-sm flex-1"
                    />
                    <button
                      onClick={() => handleAddHabit(day)}
                      disabled={!newHabitName[day]?.trim()}
                      className="p-2 border border-foreground hover:bg-foreground hover:text-background disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Add habit"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

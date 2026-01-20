import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Todo } from '@/hooks/useHabitData';

interface TodoListProps {
  todos: Todo[];
  onAdd: (title: string, deadline: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

const isOverdue = (deadline: string, completed: boolean): boolean => {
  if (completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  return deadlineDate < today;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export const TodoList = ({ todos, onAdd, onToggle, onRemove }: TodoListProps) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const handleAdd = () => {
    if (newTitle.trim() && newDeadline) {
      onAdd(newTitle.trim(), newDeadline);
      setNewTitle('');
      setNewDeadline('');
    }
  };

  // Sort: incomplete first (overdue at top), then completed
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (!a.completed && !b.completed) {
      const aOverdue = isOverdue(a.deadline, a.completed);
      const bOverdue = isOverdue(b.deadline, b.completed);
      if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
    }
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <section className="mb-16">
      <h2 className="section-title">Todo</h2>
      
      <div className="space-y-0">
        {sortedTodos.map(todo => {
          const overdue = isOverdue(todo.deadline, todo.completed);
          return (
            <div 
              key={todo.id} 
              className={`todo-item ${overdue ? 'overdue' : ''}`}
            >
              <button
                onClick={() => onToggle(todo.id)}
                className={`habit-checkbox ${todo.completed ? 'checked' : ''}`}
                aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
              />
              <div className="flex-1 min-w-0">
                <span className={`font-mono text-sm block ${todo.completed ? 'line-through opacity-50' : ''}`}>
                  {todo.title}
                </span>
                <span className="font-mono text-xs opacity-60">
                  {formatDate(todo.deadline)}
                  {overdue && ' — Overdue'}
                </span>
              </div>
              <button
                onClick={() => onRemove(todo.id)}
                className="p-1 border border-foreground hover:bg-foreground hover:text-background flex-shrink-0"
                aria-label={`Remove "${todo.title}"`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add new todo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-6">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New todo..."
          className="bg-background border border-foreground px-3 py-2 font-mono text-sm flex-1 w-full sm:max-w-xs"
        />
        <input
          type="date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
          className="bg-background border border-foreground px-3 py-2 font-mono text-sm w-full sm:w-auto"
        />
        <button
          onClick={handleAdd}
          disabled={!newTitle.trim() || !newDeadline}
          className="p-2 border border-foreground hover:bg-foreground hover:text-background disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Add todo"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

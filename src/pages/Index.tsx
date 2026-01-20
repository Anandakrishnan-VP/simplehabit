import { useState } from 'react';
import { YearCalendar } from '@/components/YearCalendar';
import { WeeklyTimetable } from '@/components/WeeklyTimetable';
import { BucketList } from '@/components/BucketList';
import { TodoList } from '@/components/TodoList';
import { YearSelector } from '@/components/YearSelector';
import { useHabitData } from '@/hooks/useHabitData';

const Index = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  
  const {
    data,
    toggleWeeklyHabit,
    addHabit,
    editHabit,
    deleteHabit,
    addBucketItem,
    toggleBucketItem,
    removeBucketItem,
    addTodo,
    toggleTodo,
    removeTodo
  } = useHabitData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-foreground">
        <div className="container max-w-6xl mx-auto px-6 py-8">
          <h1 className="font-mono text-lg font-bold uppercase tracking-widest">
            Habit Tracker
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-6xl mx-auto px-6 py-12">
        <YearSelector year={year} onYearChange={setYear} />
        
        <YearCalendar
          year={year}
          weeklyHabits={data.weeklyHabits}
          habitList={data.habitList}
        />

        <div className="section-divider" />

        <WeeklyTimetable
          habits={data.weeklyHabits}
          habitList={data.habitList}
          onToggle={toggleWeeklyHabit}
          onAddHabit={addHabit}
          onEditHabit={editHabit}
          onDeleteHabit={deleteHabit}
        />

        <div className="section-divider" />

        <TodoList
          todos={data.todos}
          onAdd={addTodo}
          onToggle={toggleTodo}
          onRemove={removeTodo}
        />

        <div className="section-divider" />

        <BucketList
          year={year}
          items={data.bucketList}
          onAdd={addBucketItem}
          onToggle={toggleBucketItem}
          onRemove={removeBucketItem}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-foreground mt-24">
        <div className="container max-w-6xl mx-auto px-6 py-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Built for discipline
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

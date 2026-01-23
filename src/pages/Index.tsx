import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { YearCalendar } from '@/components/YearCalendar';
import { DailyHabits } from '@/components/DailyHabits';
import { BucketList } from '@/components/BucketList';
import { TodoList } from '@/components/TodoList';
import { YearSelector } from '@/components/YearSelector';
import { RealTimeClock } from '@/components/RealTimeClock';
import { useHabitData } from '@/hooks/useHabitData';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const {
    data,
    loading: dataLoading,
    toggleHabitCompletion,
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

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="font-mono text-sm uppercase tracking-wider">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-foreground">
        <div className="container max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <h1 className="font-mono text-lg font-bold uppercase tracking-widest">
            Habit Tracker
          </h1>
          <button
            onClick={signOut}
            className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground border border-foreground px-3 py-1"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-6xl mx-auto px-6 py-12">
        <RealTimeClock />
        
        <YearSelector year={year} onYearChange={setYear} />
        
        <YearCalendar
          year={year}
          habitCompletions={data.habitCompletions}
          habitList={data.habitList}
        />

        <div className="section-divider" />

        <DailyHabits
          habitCompletions={data.habitCompletions}
          habitList={data.habitList}
          onToggle={toggleHabitCompletion}
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

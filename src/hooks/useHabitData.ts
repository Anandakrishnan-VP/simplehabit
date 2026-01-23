import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Habit {
  id: string;
  name: string;
  dayOfWeek: string | null;
}

export interface Todo {
  id: string;
  title: string;
  deadline: string;
  completed: boolean;
}

export interface BucketItem {
  id: string;
  text: string;
  year: number;
  completed: boolean;
}

export interface HabitData {
  weeklyHabits: Record<string, Record<string, boolean>>;
  habitList: Habit[];
  bucketList: BucketItem[];
  todos: Todo[];
}

// Get the Monday of the current week
const getWeekStart = (): string => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
};

export const useHabitData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<HabitData>({
    weeklyHabits: {},
    habitList: [],
    bucketList: [],
    todos: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const weekStart = getWeekStart();

      // Fetch habits
      const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .order('sort_order', { ascending: true });

      // Fetch habit completions for this week
      const { data: completions } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('week_start', weekStart);

      // Fetch todos
      const { data: todos } = await supabase
        .from('todos')
        .select('*')
        .order('deadline', { ascending: true });

      // Fetch bucket list
      const { data: bucketItems } = await supabase
        .from('bucket_list')
        .select('*')
        .order('created_at', { ascending: true });

      // Build weeklyHabits map
      const weeklyHabits: Record<string, Record<string, boolean>> = {};
      (completions || []).forEach(c => {
        if (!weeklyHabits[c.habit_id]) {
          weeklyHabits[c.habit_id] = {};
        }
        weeklyHabits[c.habit_id][c.day_of_week] = c.completed;
      });

      setData({
        habitList: (habits || []).map(h => ({ id: h.id, name: h.name, dayOfWeek: h.day_of_week })),
        weeklyHabits,
        todos: (todos || []).map(t => ({
          id: t.id,
          title: t.title,
          deadline: t.deadline,
          completed: t.completed
        })),
        bucketList: (bucketItems || []).map(b => ({
          id: b.id,
          text: b.text,
          year: b.year,
          completed: b.completed
        }))
      });

      setLoading(false);
    };

    fetchData();
  }, [user]);

  // Toggle weekly habit completion
  const toggleWeeklyHabit = useCallback(async (habitId: string, day: string) => {
    if (!user) return;
    
    const weekStart = getWeekStart();
    const currentValue = data.weeklyHabits[habitId]?.[day] || false;

    // Optimistic update
    setData(prev => ({
      ...prev,
      weeklyHabits: {
        ...prev.weeklyHabits,
        [habitId]: {
          ...prev.weeklyHabits[habitId],
          [day]: !currentValue
        }
      }
    }));

    if (currentValue) {
      // Delete the completion
      await supabase
        .from('habit_completions')
        .delete()
        .eq('habit_id', habitId)
        .eq('day_of_week', day)
        .eq('week_start', weekStart);
    } else {
      // Insert/upsert completion
      await supabase
        .from('habit_completions')
        .upsert({
          user_id: user.id,
          habit_id: habitId,
          day_of_week: day,
          week_start: weekStart,
          completed: true
        }, { onConflict: 'habit_id,day_of_week,week_start' });
    }
  }, [user, data.weeklyHabits]);

  // Add new habit
  const addHabit = useCallback(async (name: string, dayOfWeek?: string) => {
    if (!user) return;

    const { data: newHabit, error } = await supabase
      .from('habits')
      .insert({ 
        user_id: user.id, 
        name, 
        sort_order: data.habitList.length,
        day_of_week: dayOfWeek || null
      })
      .select()
      .single();

    if (!error && newHabit) {
      setData(prev => ({
        ...prev,
        habitList: [...prev.habitList, { id: newHabit.id, name: newHabit.name, dayOfWeek: newHabit.day_of_week }]
      }));
    }
  }, [user, data.habitList.length]);

  // Edit habit
  const editHabit = useCallback(async (id: string, newName: string) => {
    if (!user) return;

    await supabase
      .from('habits')
      .update({ name: newName })
      .eq('id', id);

    setData(prev => ({
      ...prev,
      habitList: prev.habitList.map(h => 
        h.id === id ? { ...h, name: newName } : h
      )
    }));
  }, []);

  // Delete habit
  const deleteHabit = useCallback(async (id: string) => {
    if (!user) return;

    await supabase
      .from('habits')
      .delete()
      .eq('id', id);

    setData(prev => {
      const { [id]: removed, ...remainingWeeklyHabits } = prev.weeklyHabits;
      return {
        ...prev,
        habitList: prev.habitList.filter(h => h.id !== id),
        weeklyHabits: remainingWeeklyHabits
      };
    });
  }, [user]);

  // Add bucket item
  const addBucketItem = useCallback(async (text: string, year: number) => {
    if (!user) return;

    const { data: newItem, error } = await supabase
      .from('bucket_list')
      .insert({ user_id: user.id, text, year, completed: false })
      .select()
      .single();

    if (!error && newItem) {
      setData(prev => ({
        ...prev,
        bucketList: [...prev.bucketList, {
          id: newItem.id,
          text: newItem.text,
          year: newItem.year,
          completed: newItem.completed
        }]
      }));
    }
  }, [user]);

  // Toggle bucket item
  const toggleBucketItem = useCallback(async (id: string) => {
    if (!user) return;

    const item = data.bucketList.find(b => b.id === id);
    if (!item) return;

    await supabase
      .from('bucket_list')
      .update({ completed: !item.completed })
      .eq('id', id);

    setData(prev => ({
      ...prev,
      bucketList: prev.bucketList.map(b =>
        b.id === id ? { ...b, completed: !b.completed } : b
      )
    }));
  }, [user, data.bucketList]);

  // Remove bucket item
  const removeBucketItem = useCallback(async (id: string) => {
    if (!user) return;

    await supabase
      .from('bucket_list')
      .delete()
      .eq('id', id);

    setData(prev => ({
      ...prev,
      bucketList: prev.bucketList.filter(b => b.id !== id)
    }));
  }, [user]);

  // Add todo
  const addTodo = useCallback(async (title: string, deadline: string) => {
    if (!user) return;

    const { data: newTodo, error } = await supabase
      .from('todos')
      .insert({ user_id: user.id, title, deadline, completed: false })
      .select()
      .single();

    if (!error && newTodo) {
      setData(prev => ({
        ...prev,
        todos: [...prev.todos, {
          id: newTodo.id,
          title: newTodo.title,
          deadline: newTodo.deadline,
          completed: newTodo.completed
        }]
      }));
    }
  }, [user]);

  // Toggle todo
  const toggleTodo = useCallback(async (id: string) => {
    if (!user) return;

    const todo = data.todos.find(t => t.id === id);
    if (!todo) return;

    await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', id);

    setData(prev => ({
      ...prev,
      todos: prev.todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    }));
  }, [user, data.todos]);

  // Remove todo
  const removeTodo = useCallback(async (id: string) => {
    if (!user) return;

    await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    setData(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t.id !== id)
    }));
  }, [user]);

  return {
    data,
    loading,
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
  };
};

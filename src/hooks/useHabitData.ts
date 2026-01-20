import { useState, useCallback } from 'react';

export interface Habit {
  id: string;
  name: string;
}

export interface Todo {
  id: string;
  title: string;
  deadline: string; // YYYY-MM-DD format
  completed: boolean;
}

export interface HabitData {
  yearCalendar: Record<string, boolean>;
  weeklyHabits: Record<string, Record<string, boolean>>;
  habitList: Habit[];
  bucketList: Array<{ id: string; text: string; completed: boolean }>;
  todos: Todo[];
}

const STORAGE_KEY = 'habit-tracker-data';

const DEFAULT_HABITS: Habit[] = [
  { id: 'exercise', name: 'Exercise' },
  { id: 'reading', name: 'Reading' },
  { id: 'meditation', name: 'Meditation' },
  { id: 'journaling', name: 'Journaling' },
  { id: 'deep-work', name: 'Deep Work' },
];

const getInitialData = (): HabitData => {
  if (typeof window === 'undefined') {
    return { yearCalendar: {}, weeklyHabits: {}, habitList: DEFAULT_HABITS, bucketList: [], todos: [] };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Ensure habitList exists (migration from old data structure)
      if (!parsed.habitList) {
        parsed.habitList = DEFAULT_HABITS;
      }
      if (!parsed.todos) {
        parsed.todos = [];
      }
      return parsed;
    } catch {
      return { yearCalendar: {}, weeklyHabits: {}, habitList: DEFAULT_HABITS, bucketList: [], todos: [] };
    }
  }
  
  return { yearCalendar: {}, weeklyHabits: {}, habitList: DEFAULT_HABITS, bucketList: [], todos: [] };
};

export const useHabitData = () => {
  const [data, setData] = useState<HabitData>(getInitialData);

  const saveData = useCallback((newData: HabitData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setData(newData);
  }, []);

  const toggleYearDay = useCallback((dateKey: string) => {
    setData(prev => {
      const newData = {
        ...prev,
        yearCalendar: {
          ...prev.yearCalendar,
          [dateKey]: !prev.yearCalendar[dateKey]
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const toggleWeeklyHabit = useCallback((habitId: string, day: string) => {
    setData(prev => {
      const habitData = prev.weeklyHabits[habitId] || {};
      const newData = {
        ...prev,
        weeklyHabits: {
          ...prev.weeklyHabits,
          [habitId]: {
            ...habitData,
            [day]: !habitData[day]
          }
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  // Habit management
  const addHabit = useCallback((name: string) => {
    setData(prev => {
      const newData = {
        ...prev,
        habitList: [
          ...prev.habitList,
          { id: Date.now().toString(), name }
        ]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const editHabit = useCallback((id: string, newName: string) => {
    setData(prev => {
      const newData = {
        ...prev,
        habitList: prev.habitList.map(h => 
          h.id === id ? { ...h, name: newName } : h
        )
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setData(prev => {
      // Also remove the habit's tracking data
      const { [id]: removed, ...remainingWeeklyHabits } = prev.weeklyHabits;
      const newData = {
        ...prev,
        habitList: prev.habitList.filter(h => h.id !== id),
        weeklyHabits: remainingWeeklyHabits
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  // Bucket list
  const addBucketItem = useCallback((text: string) => {
    setData(prev => {
      const newData = {
        ...prev,
        bucketList: [
          ...prev.bucketList,
          { id: Date.now().toString(), text, completed: false }
        ]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const toggleBucketItem = useCallback((id: string) => {
    setData(prev => {
      const newData = {
        ...prev,
        bucketList: prev.bucketList.map(item =>
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const removeBucketItem = useCallback((id: string) => {
    setData(prev => {
      const newData = {
        ...prev,
        bucketList: prev.bucketList.filter(item => item.id !== id)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  // Todo management
  const addTodo = useCallback((title: string, deadline: string) => {
    setData(prev => {
      const newData = {
        ...prev,
        todos: [
          ...prev.todos,
          { id: Date.now().toString(), title, deadline, completed: false }
        ]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setData(prev => {
      const newData = {
        ...prev,
        todos: prev.todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const removeTodo = useCallback((id: string) => {
    setData(prev => {
      const newData = {
        ...prev,
        todos: prev.todos.filter(todo => todo.id !== id)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  return {
    data,
    toggleYearDay,
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

import { useState, useCallback } from 'react';

export interface HabitData {
  yearCalendar: Record<string, boolean>;
  weeklyHabits: Record<string, Record<string, boolean>>;
  bucketList: Array<{ id: string; text: string; completed: boolean }>;
}

const STORAGE_KEY = 'habit-tracker-data';

const getInitialData = (): HabitData => {
  if (typeof window === 'undefined') {
    return { yearCalendar: {}, weeklyHabits: {}, bucketList: [] };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { yearCalendar: {}, weeklyHabits: {}, bucketList: [] };
    }
  }
  
  return { yearCalendar: {}, weeklyHabits: {}, bucketList: [] };
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

  return {
    data,
    toggleYearDay,
    toggleWeeklyHabit,
    addBucketItem,
    toggleBucketItem,
    removeBucketItem
  };
};

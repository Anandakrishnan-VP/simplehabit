import { useState, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { Habit } from '@/hooks/useHabitData';

interface HabitRadarChartProps {
  habitCompletions: Record<string, Record<string, boolean>>;
  habitList: Habit[];
  year: number;
}

type ViewMode = 'year' | 'month';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const FULL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Neon colors for each habit
const NEON_COLORS = [
  '#00ff87', // Neon green
  '#ff00ff', // Neon magenta
  '#00ffff', // Neon cyan
  '#ffff00', // Neon yellow
  '#ff6b00', // Neon orange
  '#00ff00', // Lime
  '#ff0080', // Hot pink
  '#80ff00', // Chartreuse
  '#0080ff', // Sky blue
  '#ff0040', // Red-pink
];

// Get all dates for a specific month
const getDatesForMonth = (year: number, month: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    // Only include dates up to today
    if (date <= today) {
      dates.push(date.toISOString().split('T')[0]);
    }
  }
  
  return dates;
};

// Get all dates for a specific year
const getDatesForYear = (year: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);
  const endDate = endOfYear < today ? endOfYear : today;
  
  for (let date = new Date(startOfYear); date <= endDate; date.setDate(date.getDate() + 1)) {
    dates.push(new Date(date).toISOString().split('T')[0]);
  }
  
  return dates;
};

// Calculate consistency score for a habit
const calculateConsistency = (
  habitId: string,
  habitCompletions: Record<string, Record<string, boolean>>,
  dates: string[]
): number => {
  if (dates.length === 0) return 0;
  
  const completions = habitCompletions[habitId] || {};
  let completedCount = 0;
  
  for (const date of dates) {
    if (completions[date]) {
      completedCount++;
    }
  }
  
  return Math.round((completedCount / dates.length) * 100);
};

export const HabitRadarChart = ({ habitCompletions, habitList, year }: HabitRadarChartProps) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getFullYear() === year ? currentDate.getMonth() : 11;
  
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const chartData = useMemo(() => {
    if (habitList.length === 0) return [];
    
    const dates = viewMode === 'year' 
      ? getDatesForYear(year)
      : getDatesForMonth(year, selectedMonth);
    
    return habitList.map((habit, index) => ({
      habit: habit.name.length > 12 ? habit.name.slice(0, 12) + '...' : habit.name,
      fullName: habit.name,
      consistency: calculateConsistency(habit.id, habitCompletions, dates),
      color: NEON_COLORS[index % NEON_COLORS.length],
    }));
  }, [habitCompletions, habitList, year, viewMode, selectedMonth]);

  // Check if a month has any data (is in the past or current)
  const isMonthAccessible = (monthIndex: number): boolean => {
    const today = new Date();
    const monthDate = new Date(year, monthIndex, 1);
    return monthDate <= today;
  };

  if (habitList.length === 0) {
    return (
      <div className="border border-foreground p-6 h-full flex items-center justify-center">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider text-center">
          Add habits to see<br />consistency analytics
        </p>
      </div>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { fullName: string; consistency: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-foreground px-3 py-2">
          <p className="font-mono text-xs text-foreground">{data.fullName}</p>
          <p className="font-mono text-sm font-bold text-foreground">{data.consistency}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border border-foreground p-4 h-full">
      {/* Header with view mode toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title">
          {viewMode === 'year' ? `${year} Consistency` : `${FULL_MONTHS[selectedMonth]} ${year}`}
        </h3>
        <div className="flex border border-foreground">
          <button
            onClick={() => setViewMode('month')}
            className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 transition-colors ${
              viewMode === 'month'
                ? 'bg-foreground text-background'
                : 'bg-background text-foreground hover:bg-foreground/10'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode('year')}
            className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 transition-colors ${
              viewMode === 'year'
                ? 'bg-foreground text-background'
                : 'bg-background text-foreground hover:bg-foreground/10'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Month selector - only show in month view */}
      {viewMode === 'month' && (
        <div className="grid grid-cols-6 gap-1 mb-4">
          {MONTHS.map((month, index) => {
            const accessible = isMonthAccessible(index);
            const isSelected = selectedMonth === index;
            
            return (
              <button
                key={month}
                onClick={() => accessible && setSelectedMonth(index)}
                disabled={!accessible}
                className={`font-mono text-[10px] uppercase tracking-wider py-1.5 transition-colors border ${
                  isSelected
                    ? 'bg-foreground text-background border-foreground'
                    : accessible
                      ? 'bg-background text-foreground border-foreground/30 hover:border-foreground'
                      : 'bg-background text-muted-foreground/30 border-foreground/10 cursor-not-allowed'
                }`}
              >
                {month}
              </button>
            );
          })}
        </div>
      )}

      {/* Radar Chart */}
      <div className="w-full h-[250px] lg:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="hsl(0 0% 100% / 0.3)" />
            <PolarAngleAxis
              dataKey="habit"
              tick={{ fill: 'hsl(0 0% 100%)', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              tickLine={{ stroke: 'hsl(0 0% 100% / 0.5)' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: 'hsl(0 0% 100% / 0.6)', fontSize: 8, fontFamily: 'IBM Plex Mono' }}
              tickCount={5}
              axisLine={{ stroke: 'hsl(0 0% 100% / 0.3)' }}
            />
            <Radar
              name="Consistency"
              dataKey="consistency"
              stroke="#00ff87"
              fill="#00ff87"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend with neon colors */}
      <div className="mt-3 flex flex-wrap gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div
              className="w-2 h-2"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-mono text-[10px] text-muted-foreground">
              {item.habit}: {item.consistency}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

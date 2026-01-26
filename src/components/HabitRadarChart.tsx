import { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Habit } from '@/hooks/useHabitData';

interface HabitRadarChartProps {
  habitCompletions: Record<string, Record<string, boolean>>;
  habitList: Habit[];
}

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

// Get dates for last 30 days
const getLast30Days = (): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

// Calculate consistency score for a habit (% of days completed in last 30 days)
const calculateConsistency = (
  habitId: string,
  habitCompletions: Record<string, Record<string, boolean>>,
  dates: string[]
): number => {
  const completions = habitCompletions[habitId] || {};
  let completedCount = 0;
  
  for (const date of dates) {
    if (completions[date]) {
      completedCount++;
    }
  }
  
  return Math.round((completedCount / dates.length) * 100);
};

export const HabitRadarChart = ({ habitCompletions, habitList }: HabitRadarChartProps) => {
  const chartData = useMemo(() => {
    if (habitList.length === 0) return [];
    
    const dates = getLast30Days();
    
    return habitList.map((habit, index) => ({
      habit: habit.name.length > 12 ? habit.name.slice(0, 12) + '...' : habit.name,
      fullName: habit.name,
      consistency: calculateConsistency(habit.id, habitCompletions, dates),
      color: NEON_COLORS[index % NEON_COLORS.length],
    }));
  }, [habitCompletions, habitList]);

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
      <h3 className="section-title mb-4">30-Day Consistency</h3>
      <div className="w-full h-[300px] lg:h-[350px]">
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
      <div className="mt-4 flex flex-wrap gap-2">
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

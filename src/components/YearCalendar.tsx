import { getDaysInMonth, getMonthName, formatDateKey, getDayOfWeek } from '@/lib/dateUtils';

interface YearCalendarProps {
  year: number;
  checkedDays: Record<string, boolean>;
  onToggleDay: (dateKey: string) => void;
}

export const YearCalendar = ({ year, checkedDays, onToggleDay }: YearCalendarProps) => {
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <section className="mb-16">
      <h2 className="section-title">Year {year}</h2>
      
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {months.map(month => {
          const daysInMonth = getDaysInMonth(year, month);
          const firstDayOfWeek = getDayOfWeek(year, month, 1);
          // Adjust for Monday start (0 = Monday, 6 = Sunday)
          const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
          
          return (
            <div key={month} className="min-w-0">
              <h3 className="font-mono text-xs font-semibold mb-2 uppercase tracking-wider">
                {getMonthName(month)}
              </h3>
              
              {/* Day labels */}
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <span key={i} className="text-[8px] font-mono text-center text-muted-foreground">
                    {day}
                  </span>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {/* Empty cells for offset */}
                {Array.from({ length: startOffset }, (_, i) => (
                  <div key={`empty-${i}`} className="day-cell empty" />
                ))}
                
                {/* Day cells */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dateKey = formatDateKey(year, month, day);
                  const isChecked = checkedDays[dateKey] || false;
                  
                  return (
                    <button
                      key={day}
                      onClick={() => onToggleDay(dateKey)}
                      className={`day-cell ${isChecked ? 'checked' : ''}`}
                      aria-label={`${getMonthName(month)} ${day}, ${year}${isChecked ? ' - completed' : ''}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

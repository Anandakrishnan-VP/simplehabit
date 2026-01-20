interface YearSelectorProps {
  year: number;
  onYearChange: (year: number) => void;
}

export const YearSelector = ({ year, onYearChange }: YearSelectorProps) => {
  return (
    <div className="flex items-center gap-4 mb-12">
      <button
        onClick={() => onYearChange(year - 1)}
        className="font-mono text-sm font-semibold uppercase tracking-wider px-3 py-1 border border-foreground bg-background hover:bg-foreground hover:text-background"
        aria-label="Previous year"
      >
        ←
      </button>
      
      <span className="font-mono text-2xl font-bold tracking-tight">
        {year}
      </span>
      
      <button
        onClick={() => onYearChange(year + 1)}
        className="font-mono text-sm font-semibold uppercase tracking-wider px-3 py-1 border border-foreground bg-background hover:bg-foreground hover:text-background"
        aria-label="Next year"
      >
        →
      </button>
    </div>
  );
};

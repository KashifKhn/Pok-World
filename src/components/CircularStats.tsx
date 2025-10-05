interface CircularStatsProps {
  stats: Array<{ stat: { name: string }; base_stat: number }>;
}

const CircularStats = ({ stats }: CircularStatsProps) => {
  const getColor = (value: number) => {
    if (value >= 100) return "text-secondary";
    if (value >= 70) return "text-primary";
    if (value >= 50) return "text-accent";
    return "text-muted-foreground";
  };

  const getStrokeColor = (value: number) => {
    if (value >= 100) return "hsl(var(--secondary))";
    if (value >= 70) return "hsl(var(--primary))";
    if (value >= 50) return "hsl(var(--accent))";
    return "hsl(var(--muted-foreground))";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {stats.map((s) => {
        const percentage = (s.base_stat / 150) * 100;
        const circumference = 2 * Math.PI * 45;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
          <div key={s.stat.name} className="flex flex-col items-center gap-3 group">
            <div className="relative w-32 h-32">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke={getStrokeColor(s.base_stat)}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: "drop-shadow(0 0 8px currentColor)",
                  }}
                />
              </svg>
              
              {/* Center value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${getColor(s.base_stat)} transition-colors duration-300`}>
                  {s.base_stat}
                </span>
                <span className="text-xs text-muted-foreground">/ 150</span>
              </div>
            </div>
            
            {/* Stat name */}
            <p className="text-sm font-bold text-foreground uppercase tracking-wide text-center capitalize group-hover:text-primary transition-colors">
              {s.stat.name.replace("-", " ")}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default CircularStats;

import { Progress } from "@/components/ui/progress";

interface StatBarProps {
  name: string;
  value: number;
  maxValue?: number;
}

const StatBar = ({ name, value, maxValue = 255 }: StatBarProps) => {
  const percentage = (value / maxValue) * 100;
  
  const getStatColor = () => {
    if (percentage >= 80) return "bg-gradient-to-r from-[hsl(var(--type-grass))] to-[hsl(var(--type-grass))]/80";
    if (percentage >= 50) return "bg-gradient-to-r from-[hsl(var(--type-electric))] to-[hsl(var(--type-electric))]/80";
    return "bg-gradient-to-r from-[hsl(var(--type-fire))] to-[hsl(var(--type-fire))]/80";
  };
  
  return (
    <div className="space-y-2 group" role="group" aria-label={`${name} stat`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-foreground uppercase tracking-wide group-hover:text-primary transition-colors">
          {name}
        </span>
        <span className="font-bold text-foreground tabular-nums text-base">
          {value}
        </span>
      </div>
      <div className="relative h-4 bg-muted rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden group-hover:shadow-lg ${getStatColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={maxValue}
          aria-label={`${name}: ${value} out of ${maxValue}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default StatBar;
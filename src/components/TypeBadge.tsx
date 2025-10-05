import { cn } from "@/lib/utils";

interface TypeBadgeProps {
  type: string;
  className?: string;
  size?: "sm" | "md";
}

const typeColors: Record<string, string> = {
  fire: "bg-[hsl(var(--type-fire))]",
  water: "bg-[hsl(var(--type-water))]",
  grass: "bg-[hsl(var(--type-grass))]",
  electric: "bg-[hsl(var(--type-electric))]",
  psychic: "bg-[hsl(var(--type-psychic))]",
  ice: "bg-[hsl(var(--type-ice))]",
  dragon: "bg-[hsl(var(--type-dragon))]",
  dark: "bg-[hsl(var(--type-dark))]",
  fairy: "bg-[hsl(var(--type-fairy))]",
  normal: "bg-[hsl(var(--type-normal))]",
  fighting: "bg-[hsl(var(--type-fighting))]",
  flying: "bg-[hsl(var(--type-flying))]",
  poison: "bg-[hsl(var(--type-poison))]",
  ground: "bg-[hsl(var(--type-ground))]",
  rock: "bg-[hsl(var(--type-rock))]",
  bug: "bg-[hsl(var(--type-bug))]",
  ghost: "bg-[hsl(var(--type-ghost))]",
  steel: "bg-[hsl(var(--type-steel))]",
};

const TypeBadge = ({ type, className, size = "md" }: TypeBadgeProps) => {
  const colorClass = typeColors[type.toLowerCase()] || "bg-muted";
  const isDark = ["dark", "ghost", "poison", "fighting", "dragon", "rock"].includes(type.toLowerCase());
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs";
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold uppercase tracking-wide",
        sizeClasses,
        colorClass,
        isDark ? "text-white" : "text-foreground",
        className
      )}
      role="img"
      aria-label={`${type} type`}
    >
      {type}
    </span>
  );
};

export default TypeBadge;
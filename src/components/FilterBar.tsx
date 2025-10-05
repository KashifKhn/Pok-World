import { Badge } from "./ui/badge";

interface FilterBarProps {
  selectedType: string | null;
  sortBy: string;
  onTypeChange: (type: string | null) => void;
  onSortChange: (sort: string) => void;
}

const POKEMON_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

const SORT_OPTIONS = [
  { value: "id", label: "ID" },
  { value: "name", label: "Name" },
];

const FilterBar = ({ selectedType, sortBy, onTypeChange, onSortChange }: FilterBarProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
          Filter by Type
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedType === null ? "default" : "outline"}
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onTypeChange(null)}
          >
            All Types
          </Badge>
          {POKEMON_TYPES.map((type) => (
            <Badge
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              className="cursor-pointer hover:scale-105 transition-transform capitalize"
              onClick={() => onTypeChange(type)}
              style={{
                backgroundColor: selectedType === type ? `hsl(var(--type-${type}))` : undefined,
                borderColor: `hsl(var(--type-${type}))`,
                color: selectedType === type ? "white" : `hsl(var(--type-${type}))`,
              }}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
          Sort By
        </h3>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => (
            <Badge
              key={option.value}
              variant={sortBy === option.value ? "default" : "outline"}
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onSortChange(option.value)}
            >
              {option.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

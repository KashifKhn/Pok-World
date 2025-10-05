import { Link } from "react-router-dom";
import TypeBadge from "./TypeBadge";
import { cn } from "@/lib/utils";

interface PokemonCardProps {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
  className?: string;
}

const PokemonCard = ({ id, name, types, imageUrl, className }: PokemonCardProps) => {
  return (
    <Link to={`/pokemon/${id}`} aria-label={`View details for ${name}`}>
      <article
        className={cn(
          "group relative bg-gradient-to-br from-card to-card/80 rounded-2xl shadow-lg overflow-hidden border-2 border-border",
          "hover:shadow-2xl hover:-translate-y-3 hover:scale-105 transition-all duration-300",
          "focus-within:ring-4 focus-within:ring-primary focus-within:ring-offset-2",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:via-accent/5 before:to-secondary/5 before:opacity-0 before:group-hover:opacity-100 before:transition-opacity before:duration-300",
          className
        )}
      >
        {/* Pokemon Number Badge */}
        <div className="absolute top-3 right-3 z-10 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full border border-border shadow-md">
          <span className="text-xs font-mono font-bold text-muted-foreground">
            #{String(id).padStart(3, "0")}
          </span>
        </div>

        <div className="aspect-square bg-gradient-to-br from-muted via-transparent to-accent/10 flex items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-muted via-transparent to-accent/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
          <img
            src={imageUrl}
            alt={`${name} sprite`}
            className="w-full h-full object-contain relative z-10 group-hover:scale-125 transition-transform duration-500 drop-shadow-lg"
            loading="lazy"
          />
        </div>
        
        <div className="p-5 space-y-3 relative z-10">
          <h3 className="text-xl font-bold capitalize text-foreground group-hover:text-primary transition-colors duration-200">
            {name}
          </h3>
          
          <div className="flex gap-2 flex-wrap">
            {types.map((type) => (
              <TypeBadge key={type} type={type} size="sm" />
            ))}
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </article>
    </Link>
  );
};

export default PokemonCard;
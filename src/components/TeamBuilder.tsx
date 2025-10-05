import { Link } from "react-router-dom";
import { useTeamBuilder } from "@/hooks/useTeamBuilder";
import { X, Plus } from "lucide-react";
import { Button } from "./ui/button";
import TypeBadge from "./TypeBadge";

const TeamBuilder = () => {
  const { team, removeFromTeam } = useTeamBuilder();

  return (
    <div className="bg-gradient-to-br from-accent/20 via-primary/20 to-secondary/20 rounded-2xl p-6 border-2 border-accent/30 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Team</h2>
          <p className="text-sm text-muted-foreground">Build your dream team (max 6)</p>
        </div>
        <span className="text-lg font-bold text-foreground">
          {team.length} / 6
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {team.map((pokemon) => (
          <div
            key={pokemon.id}
            className="relative group bg-card rounded-xl border-2 border-border overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-lg"
          >
            <button
              onClick={() => removeFromTeam(pokemon.id)}
              className="absolute top-1 right-1 z-10 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
              aria-label={`Remove ${pokemon.name} from team`}
            >
              <X className="w-4 h-4" />
            </button>

            <Link to={`/pokemon/${pokemon.id}`}>
              <div className="aspect-square bg-muted/50 p-3">
                <img
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-2 space-y-1">
                <p className="text-sm font-bold capitalize text-foreground truncate">
                  {pokemon.name}
                </p>
                <div className="flex gap-1 flex-wrap">
                  {pokemon.types.map((type) => (
                    <TypeBadge key={type} type={type} size="sm" />
                  ))}
                </div>
              </div>
            </Link>
          </div>
        ))}

        {[...Array(6 - team.length)].map((_, i) => (
          <Link
            key={`empty-${i}`}
            to="/browse"
            className="aspect-square bg-muted/30 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-muted/50 transition-all duration-300 group"
          >
            <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
              Add Pokémon
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TeamBuilder;

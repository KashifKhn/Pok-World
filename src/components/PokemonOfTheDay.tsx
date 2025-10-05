import { Link } from "react-router-dom";
import { Star, Sparkles } from "lucide-react";
import { usePokemonOfTheDay } from "@/hooks/usePokemonOfTheDay";
import { pokemonApi } from "@/services/pokemonApi";
import TypeBadge from "./TypeBadge";
import { Button } from "./ui/button";

const PokemonOfTheDay = () => {
  const { pokemonOfTheDay, isLoading } = usePokemonOfTheDay();

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-2xl p-8 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
        <div className="h-64 bg-muted rounded-2xl"></div>
      </div>
    );
  }

  if (!pokemonOfTheDay) return null;

  return (
    <div className="relative bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-3xl p-8 overflow-hidden border-4 border-primary/40 shadow-2xl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="absolute top-6 right-6 animate-float">
        <Sparkles className="w-10 h-10 text-secondary drop-shadow-glow" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <Star className="w-10 h-10 text-secondary animate-pulse" />
            <div className="absolute inset-0 bg-secondary/30 rounded-full blur-xl"></div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-foreground">Daily Spotlight</h2>
            <p className="text-sm text-muted-foreground">Today's Featured Pokémon</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative aspect-square bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm rounded-3xl flex items-center justify-center p-8 border-2 border-primary/20">
              <img
                src={pokemonApi.getImageUrl(pokemonOfTheDay.id)}
                alt={`${pokemonOfTheDay.name} official artwork`}
                className="w-full h-full object-contain animate-float drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-5xl font-bold capitalize bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  {pokemonOfTheDay.name}
                </h3>
                <span className="text-3xl font-mono font-bold text-primary">
                  #{String(pokemonOfTheDay.id).padStart(3, "0")}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {pokemonOfTheDay.types.map((t: any) => (
                  <TypeBadge key={t.type.name} type={t.type.name} />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-primary/20 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                <p className="text-sm font-bold text-foreground uppercase tracking-wider">Physical Stats</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Height</p>
                  <p className="text-2xl font-bold text-foreground">{pokemonOfTheDay.height / 10}m</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Weight</p>
                  <p className="text-2xl font-bold text-foreground">{pokemonOfTheDay.weight / 10}kg</p>
                </div>
              </div>
            </div>

            <Link to={`/pokemon/${pokemonOfTheDay.id}`}>
              <Button className="w-full h-14 bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 text-primary-foreground text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                <Sparkles className="w-5 h-5 mr-2" />
                Explore This Pokémon
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonOfTheDay;

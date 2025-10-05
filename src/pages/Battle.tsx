import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PokemonSearchAutocomplete from "@/components/PokemonSearchAutocomplete";
import { Button } from "@/components/ui/button";
import { pokemonApi } from "@/services/pokemonApi";
import { usePokemonCollection } from "@/hooks/usePokemonCollection";
import { useToast } from "@/hooks/use-toast";
import TypeBadge from "@/components/TypeBadge";
import { Swords, Trophy, Zap, Library, Shuffle, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import confetti from "canvas-confetti";

const Battle = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [pokemon1, setPokemon1] = useState<any>(null);
  const [pokemon2, setPokemon2] = useState<any>(null);
  const [winner, setWinner] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState<1 | 2 | null>(null);
  const [battleStats, setBattleStats] = useState<{ stats1: number; stats2: number; difference: number } | null>(null);
  const { collection } = usePokemonCollection();
  const { toast } = useToast();

  // Load Pokemon from URL params
  useState(() => {
    const pokemonId = searchParams.get('pokemon');
    if (pokemonId) {
      loadPokemonById(parseInt(pokemonId), 1);
    }
  });

  const loadPokemonById = async (id: number, slot: 1 | 2) => {
    try {
      const pokemon = await pokemonApi.getPokemonDetails(id);
      if (slot === 1) {
        setPokemon1(pokemon);
      } else {
        setPokemon2(pokemon);
      }
      setWinner(null);
      setBattleStats(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Pokémon",
        variant: "destructive",
      });
    }
  };

  const selectFromCollection = async (pokemonId: number, slot: 1 | 2) => {
    await loadPokemonById(pokemonId, slot);
    setShowCollectionModal(null);
    toast({
      title: "Pokémon Selected",
      description: "Ready to battle!",
    });
  };

  const calculateStats = (pokemon: any) => {
    return pokemon.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0);
  };

  const selectRandomPokemon = async (slot: 1 | 2) => {
    const randomId = Math.floor(Math.random() * 151) + 1;
    await loadPokemonById(randomId, slot);
    toast({
      title: "Random Pokémon Selected!",
      description: "Ready to battle!",
    });
  };

  const startBattle = () => {
    if (!pokemon1 || !pokemon2) {
      toast({
        title: "Select Both Pokémon",
        description: "You need to select two Pokémon to battle!",
      });
      return;
    }

    const stats1 = calculateStats(pokemon1);
    const stats2 = calculateStats(pokemon2);
    const difference = Math.abs(stats1 - stats2);

    const winnerId = stats1 > stats2 ? 1 : stats2 > stats1 ? 2 : 0;
    setWinner(winnerId);
    setBattleStats({ stats1, stats2, difference });

    if (winnerId !== 0) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#DC0A2D', '#FFCB05', '#3B4CCA', '#00FF00'],
        ticks: 200,
      });
    }
  };

  const PokemonSlot = ({ pokemon, slot }: { pokemon: any; slot: 1 | 2 }) => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <PokemonSearchAutocomplete
            value=""
            onChange={() => {}}
            onSelect={(p) => {
              if (slot === 1) {
                setPokemon1(p);
              } else {
                setPokemon2(p);
              }
              setWinner(null);
              setBattleStats(null);
            }}
            placeholder={`Search Player ${slot} Pokémon...`}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => selectRandomPokemon(slot)}
            title="Random Pokémon"
          >
            <Shuffle className="w-5 h-5" />
          </Button>
          <Dialog open={showCollectionModal === slot} onOpenChange={(open) => setShowCollectionModal(open ? slot : null)}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-12 w-12 hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Library className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Select from Your Collection</DialogTitle>
                <DialogDescription>
                  Choose a Pokémon from your Pokédex to battle
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {collection.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <p>Your collection is empty!</p>
                    <Link to="/browse">
                      <Button className="mt-4">Browse Pokémon</Button>
                    </Link>
                  </div>
                ) : (
                  collection.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => selectFromCollection(p.id, slot)}
                      className="bg-card rounded-xl p-3 border-2 border-border hover:border-primary transition-all duration-200 hover:scale-105 group"
                    >
                      <div className="aspect-square bg-muted/50 rounded-lg mb-2">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                        />
                      </div>
                      <p className="text-sm font-bold capitalize text-foreground truncate">
                        {p.name}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {pokemon ? (
        <Link to={`/pokemon/${pokemon.id}`}>
          <div
            className={`relative bg-gradient-to-br from-card via-card to-muted rounded-3xl p-4 sm:p-6 border-4 transition-all duration-500 hover:scale-[1.02] cursor-pointer ${
              winner === slot
                ? "border-secondary shadow-[0_0_40px_rgba(255,203,5,0.5)] scale-105"
                : winner === 0 && winner !== null
                ? "border-accent shadow-[0_0_30px_rgba(59,76,202,0.4)]"
                : "border-border hover:border-primary/50"
            }`}
          >
            {winner === slot && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-secondary via-yellow-400 to-secondary text-secondary-foreground px-6 py-2 rounded-full font-bold text-lg shadow-lg animate-bounce z-10 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                WINNER!
              </div>
            )}
            
            {winner === 0 && winner !== null && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-6 py-2 rounded-full font-bold text-lg shadow-lg animate-pulse z-10">
                TIE!
              </div>
            )}

            <div className="aspect-square bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl flex items-center justify-center p-4 sm:p-6 mb-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src={pokemonApi.getImageUrl(pokemon.id)}
                alt={pokemon.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 relative z-10 drop-shadow-2xl"
              />
            </div>

            <div className="space-y-3">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold capitalize text-foreground mb-1">
                  {pokemon.name}
                </h3>
                <p className="text-sm text-muted-foreground font-mono">#{String(pokemon.id).padStart(3, "0")}</p>
              </div>

              <div className="flex gap-2 justify-center flex-wrap">
                {pokemon.types.map((t: any) => (
                  <TypeBadge key={t.type.name} type={t.type.name} />
                ))}
              </div>

              <div className="bg-gradient-to-br from-muted/50 to-muted rounded-xl p-3 sm:p-4 space-y-2 border border-border/50">
                <p className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wide">
                  Combat Stats
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {pokemon.stats.slice(0, 3).map((s: any) => (
                    <div key={s.stat.name} className="bg-card/50 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground capitalize truncate">
                        {s.stat.name.split('-')[0]}
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-foreground">{s.base_stat}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t-2 border-primary/30 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-bold text-sm sm:text-base">Total Power</span>
                    <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      {calculateStats(pokemon)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-3xl p-8 sm:p-12 border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 min-h-[300px] sm:min-h-[400px]">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-pulse">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-card border-4 border-foreground/30"></div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-muted-foreground font-medium">Player {slot}</p>
            <p className="text-sm text-muted-foreground/70">Select a Pokémon to battle</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Swords className="w-10 h-10 sm:w-12 sm:h-12 text-primary animate-pulse" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Battle Arena
              </h1>
              <Swords className="w-10 h-10 sm:w-12 sm:h-12 text-secondary animate-pulse" />
            </div>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Choose your fighters and let the battle begin!
            </p>
          </div>

          {/* Battle Result */}
          {winner !== null && battleStats && (
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-4 sm:p-6 border-2 border-primary/30 animate-fade-in">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-secondary animate-bounce" />
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                    {winner === 0 ? "It's a Tie!" : `${winner === 1 ? pokemon1.name : pokemon2.name} Wins!`}
                  </h2>
                  <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-secondary animate-bounce" />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-base sm:text-lg">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-xl sm:text-2xl ${winner === 1 ? 'text-secondary' : 'text-muted-foreground'}`}>
                      {battleStats.stats1}
                    </span>
                    <span className="text-muted-foreground">vs</span>
                    <span className={`font-bold text-xl sm:text-2xl ${winner === 2 ? 'text-secondary' : 'text-muted-foreground'}`}>
                      {battleStats.stats2}
                    </span>
                  </div>
                  {winner !== 0 && (
                    <div className="flex items-center gap-2 bg-card/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                      <span className="font-semibold text-secondary text-sm sm:text-base">
                        Won by {battleStats.difference} points!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Battle Grid */}
          <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 sm:gap-8 items-center">
            {/* Player 1 */}
            <PokemonSlot pokemon={pokemon1} slot={1} />

            {/* VS Divider */}
            <div className="flex lg:flex-col items-center justify-center gap-4 lg:gap-6 py-4">
              <div className="hidden lg:block relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(220,10,45,0.5)]">
                  <Zap className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-xl"></div>
              </div>
              <div className="lg:hidden w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                VS
              </p>
              <div className="lg:hidden w-full h-px bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
            </div>

            {/* Player 2 */}
            <PokemonSlot pokemon={pokemon2} slot={2} />
          </div>

          {/* Battle Button */}
          <div className="text-center pb-4 sm:pb-8">
            <Button
              size="lg"
              onClick={startBattle}
              disabled={!pokemon1 || !pokemon2}
              className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white px-8 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl font-bold rounded-2xl shadow-[0_0_30px_rgba(220,10,45,0.4)] hover:shadow-[0_0_50px_rgba(220,10,45,0.6)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Swords className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Start Battle!
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Battle;

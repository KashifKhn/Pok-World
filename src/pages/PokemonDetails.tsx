import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Swords } from "lucide-react";
import confetti from "canvas-confetti";
import Navigation from "@/components/Navigation";
import TypeBadge from "@/components/TypeBadge";
import StatBar from "@/components/StatBar";
import StatsRadar from "@/components/StatsRadar";
import CircularStats from "@/components/CircularStats";
import EvolutionChain from "@/components/EvolutionChain";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pokemonApi } from "@/services/pokemonApi";
import { usePokemonCollection } from "@/hooks/usePokemonCollection";
import { useTeamBuilder } from "@/hooks/useTeamBuilder";
import { useToast } from "@/hooks/use-toast";

const PokemonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCatching, setIsCatching] = useState(false);
  const { catchPokemon, releasePokemon, isPokemonCaught } = usePokemonCollection();
  const { addToTeam, removeFromTeam, isInTeam } = useTeamBuilder();
  const { toast } = useToast();

  const isCaught = pokemon ? isPokemonCaught(pokemon.id) : false;
  const inTeam = pokemon ? isInTeam(pokemon.id) : false;

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await pokemonApi.getPokemonDetails(id);
        setPokemon(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load Pokémon details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemon();
  }, [id, toast]);

  const handleCatch = () => {
    if (!pokemon) return;

    setIsCatching(true);
    
    // Pokéball shake animation delay
    setTimeout(() => {
      catchPokemon({
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map((t: any) => t.type.name),
        imageUrl: pokemonApi.getImageUrl(pokemon.id),
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#DC0A2D', '#FFCB05', '#3B4CCA'],
      });

      toast({
        title: "Pokémon Caught!",
        description: `${pokemon.name} has been added to your Pokédex!`,
      });
      
      setIsCatching(false);
    }, 800);
  };

  const handleRelease = () => {
    if (!pokemon) return;

    releasePokemon(pokemon.id);
    toast({
      title: "Pokémon Released",
      description: `${pokemon.name} has been released from your Pokédex.`,
    });
  };

  const handleTeamToggle = () => {
    if (!pokemon) return;

    if (inTeam) {
      removeFromTeam(pokemon.id);
      toast({
        title: "Removed from Team",
        description: `${pokemon.name} has been removed from your team.`,
      });
    } else {
      const result = addToTeam({
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map((t: any) => t.type.name),
        imageUrl: pokemonApi.getImageUrl(pokemon.id),
      });
      
      toast({
        title: result.success ? "Added to Team!" : "Cannot Add",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    }
  };

  const handleBattle = () => {
    navigate('/battle');
    setTimeout(() => {
      // This would be handled by Battle page if we pass state through navigation
      toast({
        title: "Battle Mode!",
        description: `Select an opponent to battle ${pokemon.name}!`,
      });
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            <div className="h-12 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-64 bg-muted rounded-2xl"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Pokémon not found</p>
            <Link to="/browse">
              <Button className="mt-4">Browse Pokémon</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 sm:py-8" role="main">
        <Link to="/browse" className="inline-flex items-center gap-2 text-primary hover:underline mb-4 sm:mb-6">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span className="text-sm sm:text-base">Back to Browse</span>
        </Link>

        <article className="max-w-6xl mx-auto animate-fade-in space-y-4 sm:space-y-6">
          {/* Hero Section with Image and Main Info */}
          <div className="relative bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-primary/20 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)]"></div>
            
            <div className="relative grid md:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8">
              {/* Left Side - Pokemon Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-2xl blur-3xl"></div>
                <div className="relative aspect-square bg-gradient-to-br from-card/50 to-transparent backdrop-blur-sm rounded-2xl flex items-center justify-center p-8 border-2 border-white/10">
                  <img
                    src={pokemonApi.getImageUrl(pokemon.id)}
                    alt={`${pokemon.name} official artwork`}
                    className="w-full h-full object-contain animate-float drop-shadow-2xl"
                  />
                </div>
                
                {/* Pokemon Number Badge */}
                <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-primary/30 shadow-lg">
                  <span className="text-2xl font-mono font-bold text-primary">
                    #{String(pokemon.id).padStart(3, "0")}
                  </span>
                </div>
              </div>

              {/* Right Side - Pokemon Info */}
              <div className="space-y-4 sm:space-y-6 flex flex-col justify-center">
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold capitalize text-foreground mb-3 sm:mb-4 drop-shadow-lg">
                    {pokemon.name}
                  </h1>
                  <div className="flex gap-2 flex-wrap">
                    {pokemon.types.map((t: any) => (
                      <TypeBadge key={t.type.name} type={t.type.name} />
                    ))}
                  </div>
                </div>

                {/* Physical Stats Cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 sm:p-5 border-2 border-border shadow-lg group hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-1">Height</p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">{pokemon.height / 10}m</p>
                    <div className="h-1 w-full bg-muted rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-3/4"></div>
                    </div>
                  </div>
                  <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 sm:p-5 border-2 border-border shadow-lg group hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-1">Weight</p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">{pokemon.weight / 10}kg</p>
                    <div className="h-1 w-full bg-muted rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-secondary rounded-full w-2/3"></div>
                    </div>
                  </div>
                </div>

                {/* Abilities Section */}
                <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 sm:p-5 border-2 border-border shadow-lg">
                  <h2 className="text-base sm:text-lg font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                    Abilities
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    {pokemon.abilities.map((a: any) => (
                      <span
                        key={a.ability.name}
                        className="px-4 py-2 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg text-sm font-medium capitalize text-foreground border border-accent/30 hover:scale-105 transition-transform duration-200"
                      >
                        {a.ability.name.replace("-", " ")}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-3">
                  <Button
                    onClick={isCaught ? handleRelease : handleCatch}
                    size="lg"
                    disabled={isCatching}
                    className={`w-full h-12 sm:h-14 text-base sm:text-lg font-bold shadow-lg ${
                      isCaught
                        ? "bg-gradient-to-r from-muted to-muted/80 hover:from-muted/90 hover:to-muted/70 text-foreground"
                        : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
                    } ${isCatching ? "animate-shake" : ""}`}
                    aria-label={isCaught ? `Release ${pokemon.name}` : `Catch ${pokemon.name}`}
                  >
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-card border-3 border-current mr-2 sm:mr-3 ${isCatching ? "animate-spin" : ""}`}></div>
                    {isCatching ? "Catching..." : isCaught ? "Release Pokémon" : "Catch Pokémon"}
                  </Button>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <Button
                      onClick={handleBattle}
                      size="lg"
                      variant="outline"
                      className="h-12 sm:h-14 text-base sm:text-lg font-bold shadow-lg border-2 border-secondary hover:bg-secondary/10"
                    >
                      <Swords className="w-6 h-6 mr-2" />
                      Battle
                    </Button>
                    
                    {isCaught && (
                      <Button
                        onClick={handleTeamToggle}
                        size="lg"
                        variant={inTeam ? "outline" : "default"}
                        className="h-12 sm:h-14 text-base sm:text-lg font-bold shadow-lg"
                      >
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                        {inTeam ? "Remove" : "Add Team"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <section 
            className="bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-border"
            aria-labelledby="stats-heading"
          >
            <h2 id="stats-heading" className="text-3xl font-bold text-foreground mb-6 uppercase tracking-wide flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              Base Stats
            </h2>
            
            <Tabs defaultValue="circular" className="space-y-6">
              <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 h-12 bg-muted/50">
                <TabsTrigger value="circular" className="text-base">Circular</TabsTrigger>
                <TabsTrigger value="bars" className="text-base">Bars</TabsTrigger>
                <TabsTrigger value="radar" className="text-base">Radar</TabsTrigger>
              </TabsList>

              <TabsContent value="circular" className="pt-4">
                <CircularStats stats={pokemon.stats} />
              </TabsContent>

              <TabsContent value="bars" className="space-y-4 pt-4">
                {pokemon.stats.map((s: any) => (
                  <StatBar
                    key={s.stat.name}
                    name={s.stat.name.replace("-", " ")}
                    value={s.base_stat}
                  />
                ))}
              </TabsContent>

              <TabsContent value="radar" className="pt-4">
                <StatsRadar stats={pokemon.stats} />
              </TabsContent>
            </Tabs>
          </section>

          {/* Evolution Chain */}
          <EvolutionChain pokemonId={pokemon.id} />
        </article>
      </main>
    </div>
  );
};

export default PokemonDetails;
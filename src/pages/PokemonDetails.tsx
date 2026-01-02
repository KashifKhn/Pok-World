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
    if (!pokemon) return;
    
    // Navigate to battle page with this Pokemon pre-selected
    navigate(`/battle?pokemon=${pokemon.id}`);
    toast({
      title: "Battle Mode!",
      description: `${pokemon.name} is ready! Select an opponent to battle!`,
    });
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
          <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border shadow-2xl">
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50" />
            
            <div className="relative grid lg:grid-cols-[45%_55%] gap-8 p-6 lg:p-10">
              {/* Left Side - Pokemon Image Area */}
              <div className="relative group perspective-1000">
                <div className="absolute inset-4 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-[2rem] blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                
                <div className="relative aspect-square bg-gradient-to-b from-muted/50 to-muted/10 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-inner flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-[1.02]">
                  <img
                    src={pokemonApi.getImageUrl(pokemon.id)}
                    alt={`${pokemon.name} official artwork`}
                    className="w-full h-full object-contain animate-float drop-shadow-2xl z-10"
                  />
                  
                  {/* Decorative Elements */}
                  <div className="absolute bottom-0 w-3/4 h-4 bg-black/20 blur-xl rounded-full" />
                </div>
                
                {/* ID Badge */}
                <div className="absolute top-6 right-6 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm z-20">
                  <span className="text-xl font-mono font-bold text-foreground/70">
                    #{String(pokemon.id).padStart(3, "0")}
                  </span>
                </div>
              </div>

              {/* Right Side - Info & Actions */}
              <div className="flex flex-col justify-center space-y-8">
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black capitalize text-foreground mb-4 tracking-tight leading-none">
                    {pokemon.name}
                  </h1>
                  <div className="flex gap-3 flex-wrap">
                    {pokemon.types.map((t: any) => (
                      <TypeBadge key={t.type.name} type={t.type.name} className="px-4 py-1.5 text-base shadow-sm" />
                    ))}
                  </div>
                </div>

                {/* Measurements Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-2xl p-5 border border-border/50 hover:bg-muted/50 transition-colors">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Height</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-light text-foreground">{pokemon.height / 10}</span>
                      <span className="text-base text-muted-foreground font-medium mb-1">m</span>
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-2xl p-5 border border-border/50 hover:bg-muted/50 transition-colors">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Weight</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-light text-foreground">{pokemon.weight / 10}</span>
                      <span className="text-base text-muted-foreground font-medium mb-1">kg</span>
                    </div>
                  </div>
                </div>

                {/* Abilities */}
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Abilities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map((a: any) => (
                      <span
                        key={a.ability.name}
                        className="px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium capitalize text-foreground shadow-sm hover:border-primary/50 transition-colors cursor-default"
                      >
                        {a.ability.name.replace("-", " ")}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    onClick={isCaught ? handleRelease : handleCatch}
                    size="lg"
                    disabled={isCatching}
                    className={`
                      w-full h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5
                      ${isCaught
                        ? "bg-muted text-foreground hover:bg-destructive hover:text-destructive-foreground border-2 border-transparent"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                      } 
                      ${isCatching ? "scale-95 opacity-90" : ""}
                    `}
                  >
                    <div className={`w-6 h-6 rounded-full bg-current border-[3px] border-background mr-3 ${isCatching ? "animate-spin" : ""}`} />
                    {isCatching ? "Catching..." : isCaught ? "Release Pokémon" : "Catch Pokémon"}
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleBattle}
                      size="lg"
                      variant="outline"
                      className="h-12 text-base font-bold rounded-xl border-2 hover:bg-secondary/5 hover:border-secondary hover:text-secondary transition-all"
                    >
                      <Swords className="w-5 h-5 mr-2" />
                      Battle
                    </Button>
                    
                    {isCaught && (
                      <Button
                        onClick={handleTeamToggle}
                        size="lg"
                        variant={inTeam ? "secondary" : "outline"}
                        className={`h-12 text-base font-bold rounded-xl border-2 transition-all ${
                          inTeam 
                            ? "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20" 
                            : "hover:bg-primary/5 hover:border-primary/50 hover:text-primary"
                        }`}
                      >
                        <Users className="w-5 h-5 mr-2" />
                        {inTeam ? "In Team" : "Add to Team"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <section 
            className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-border"
            aria-labelledby="stats-heading"
          >
            <h2 id="stats-heading" className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              Base Stats
            </h2>
            
            <Tabs defaultValue="circular" className="space-y-8">
              <TabsList className="w-full max-w-xl mx-auto grid grid-cols-3 h-12 bg-muted/50 p-1 rounded-full">
                <TabsTrigger 
                  value="circular" 
                  className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="bars" 
                  className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                >
                  Breakdown
                </TabsTrigger>
                <TabsTrigger 
                  value="radar" 
                  className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                >
                  Analysis
                </TabsTrigger>
              </TabsList>

              <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 shadow-inner">
                <TabsContent value="circular" className="mt-0 focus-visible:ring-0">
                  <CircularStats stats={pokemon.stats} />
                </TabsContent>

                <TabsContent value="bars" className="space-y-6 mt-0 focus-visible:ring-0">
                  {pokemon.stats.map((s: any) => (
                    <StatBar
                      key={s.stat.name}
                      name={s.stat.name.replace("-", " ")}
                      value={s.base_stat}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="radar" className="mt-0 focus-visible:ring-0">
                  <StatsRadar stats={pokemon.stats} />
                </TabsContent>
              </div>
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
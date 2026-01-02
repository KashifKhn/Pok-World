import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import PokemonSearchAutocomplete from "@/components/PokemonSearchAutocomplete";
import { Button } from "@/components/ui/button";
import { pokemonApi } from "@/services/pokemonApi";
import { usePokemonCollection } from "@/hooks/usePokemonCollection";
import { useBattleHistory } from "@/hooks/useBattleHistory";
import { useToast } from "@/hooks/use-toast";
import TypeBadge from "@/components/TypeBadge";
import { Swords, Library, Shuffle, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BattleArena } from "@/components/battle/BattleArena";
import { BattleResult } from "@/types/battle";

const Battle = () => {
  const [searchParams] = useSearchParams();
  const [pokemon1, setPokemon1] = useState<any>(null);
  const [pokemon2, setPokemon2] = useState<any>(null);
  const [showCollectionModal, setShowCollectionModal] = useState<1 | 2 | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [lastResult, setLastResult] = useState<BattleResult | null>(null);
  const { collection } = usePokemonCollection();
  const { addBattle } = useBattleHistory();
  const { toast } = useToast();

  // Load Pokemon from URL params
  useEffect(() => {
    const pokemonId = searchParams.get('pokemon');
    if (pokemonId) {
      loadPokemonById(parseInt(pokemonId), 1);
    }
  }, [searchParams]);

  const loadPokemonById = async (id: number, slot: 1 | 2) => {
    try {
      const pokemon = await pokemonApi.getPokemonDetails(id);
      if (slot === 1) {
        setPokemon1(pokemon);
      } else {
        setPokemon2(pokemon);
      }
      setLastResult(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Pokemon",
        variant: "destructive",
      });
    }
  };

  const selectFromCollection = async (pokemonId: number, slot: 1 | 2) => {
    await loadPokemonById(pokemonId, slot);
    setShowCollectionModal(null);
    toast({
      title: "Pokemon Selected",
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
      title: "Random Pokemon Selected!",
      description: "Ready to battle!",
    });
  };

  const startBattle = () => {
    if (!pokemon1 || !pokemon2) {
      toast({
        title: "Select Both Pokemon",
        description: "You need to select two Pokemon to battle!",
      });
      return;
    }
    setIsBattling(true);
  };

  const handleBattleComplete = (result: BattleResult) => {
    setLastResult(result);
    // Save battle to history
    if (pokemon1 && pokemon2) {
      addBattle(result, pokemon1, pokemon2);
    }
  };

  const handleCloseBattle = () => {
    setIsBattling(false);
  };

const PokemonSlot = ({ pokemon, slot }: { pokemon: any; slot: 1 | 2 }) => (
    <div className="space-y-4 group">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <PokemonSearchAutocomplete
            onSelect={(p) => {
              if (slot === 1) {
                setPokemon1(p);
              } else {
                setPokemon2(p);
              }
              setLastResult(null);
            }}
            placeholder={`Search Player ${slot} Pokemon...`}
          />
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-primary/10 hover:text-primary transition-colors gap-2"
            onClick={() => selectRandomPokemon(slot)}
          >
            <Shuffle className="w-4 h-4" />
            <span className="text-xs font-medium">Random</span>
          </Button>
          
          <Dialog open={showCollectionModal === slot} onOpenChange={(open) => setShowCollectionModal(open ? slot : null)}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors gap-2">
                <Library className="w-4 h-4" />
                <span className="text-xs font-medium">My Collection</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Select from Your Collection</DialogTitle>
                <DialogDescription>
                  Choose a formidable companion for battle
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                {collection.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/30 rounded-xl border-2 border-dashed">
                    <Library className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">Your collection is empty!</p>
                    <Link to="/browse">
                      <Button variant="link" className="mt-2 text-primary">Browse Pokemon to catch some!</Button>
                    </Link>
                  </div>
                ) : (
                  collection.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => selectFromCollection(p.id, slot)}
                      className="group/card relative flex flex-col items-center p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="w-24 h-24 mb-3 relative">
                         <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl group-hover/card:bg-primary/10 transition-colors" />
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-contain relative z-10 group-hover/card:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <p className="font-bold capitalize text-foreground">{p.name}</p>
                      <span className="text-xs text-muted-foreground font-mono">#{String(p.id).padStart(3, "0")}</span>
                    </button>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {pokemon ? (
        <Link to={`/pokemon/${pokemon.id}`} className="block relative z-10">
          <div
            className={`
              relative overflow-hidden rounded-[2rem] p-6 transition-all duration-500
              bg-card border-2
              ${lastResult && lastResult.winner === slot
                ? "border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)] scale-[1.02]"
                : lastResult && lastResult.winner !== slot
                ? "border-transparent opacity-80 grayscale-[0.5]"
                : "border-border/50 hover:border-primary/30 hover:shadow-xl shadow-lg"
              }
            `}
          >
            {/* Background Decor */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Winner Badge */}
            {lastResult && lastResult.winner === slot && (
              <div className="absolute top-4 right-4 z-20">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                </span>
              </div>
            )}

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative w-48 h-48 mb-6 group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/20 dark:from-white/5 dark:to-white/10 rounded-full blur-2xl transform scale-75 translate-y-4" />
                <img
                  src={pokemonApi.getImageUrl(pokemon.id)}
                  alt={pokemon.name}
                  className="w-full h-full object-contain drop-shadow-2xl relative z-10"
                />
              </div>

              <div className="text-center w-full space-y-4">
                <div>
                  <h3 className="text-3xl font-black capitalize text-foreground tracking-tight mb-1">
                    {pokemon.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                    <span>#{String(pokemon.id).padStart(3, "0")}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  {pokemon.types.map((t: any) => (
                    <TypeBadge key={t.type.name} type={t.type.name} className="px-3 py-1 text-xs" />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 w-full pt-4 border-t border-border/50">
                  <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">HP</span>
                    <span className="text-lg font-bold text-foreground">{pokemon.stats[0].base_stat}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">ATK</span>
                    <span className="text-lg font-bold text-foreground">{pokemon.stats[1].base_stat}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">SPD</span>
                    <span className="text-lg font-bold text-foreground">{pokemon.stats[5].base_stat}</span>
                  </div>
                </div>

                <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden mt-4">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary" 
                    style={{ width: `${Math.min((calculateStats(pokemon) / 700) * 100, 100)}%` }} 
                  />
                </div>
                <div className="flex justify-between text-xs font-medium text-muted-foreground px-1">
                  <span>Combat Power</span>
                  <span className="text-foreground font-bold">{calculateStats(pokemon)}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div 
          onClick={() => document.getElementById(`search-trigger-${slot}`)?.focus()}
          className="
            group relative h-[400px] rounded-[2rem] border-2 border-dashed border-muted-foreground/20 
            hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer
            flex flex-col items-center justify-center text-center p-8 gap-6
          "
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg">
               <span className="text-4xl font-black text-muted-foreground/50 group-hover:text-primary/50 transition-colors">?</span>
            </div>
            {slot === 1 && (
               <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg">1</div>
            )}
            {slot === 2 && (
               <div className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg">2</div>
            )}
          </div>
          <div className="space-y-2 max-w-[200px]">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">Select Fighter</h3>
            <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80">
              Choose a Pokemon to enter the arena
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navigation */}
      <Navigation />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]" />
      </div>
      
      <main className="container relative mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header Section */}
          <div className="relative text-center space-y-6 py-8">
            <div className="flex items-center justify-center gap-6 relative z-10">
              <Swords 
                className="w-12 h-12 lg:w-16 lg:h-16 text-primary animate-[spin_3s_linear_infinite_reverse]" 
                style={{ filter: "drop-shadow(0 0 10px rgba(220, 38, 38, 0.5))" }}
              />
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter">
                <span className="bg-gradient-to-r from-primary via-red-500 to-orange-500 bg-clip-text text-transparent drop-shadow-sm">
                  BATTLE
                </span>
                <span className="block text-2xl md:text-3xl font-medium tracking-widest text-muted-foreground uppercase mt-2">
                  Arena
                </span>
              </h1>
              <Swords 
                className="w-12 h-12 lg:w-16 lg:h-16 text-secondary animate-[spin_3s_linear_infinite]" 
                style={{ filter: "drop-shadow(0 0 10px rgba(37, 99, 235, 0.5))" }}
              />
            </div>
          </div>

          {/* Last Battle Result Alert */}
          {lastResult && (
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 max-w-2xl mx-auto shadow-sm">
              <div className="flex flex-col items-center text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  Last Battle Report
                </span>
                <h2 className="text-2xl font-bold">
                  {lastResult.winnerName} <span className="text-muted-foreground font-normal">dominated in</span> {lastResult.totalRounds} rounds
                </h2>
                <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> {lastResult.totalDamageDealt.pokemon1 + lastResult.totalDamageDealt.pokemon2} dmg</span>
                  <span className="w-px h-4 bg-border" />
                  <span>{lastResult.criticalHits.pokemon1 + lastResult.criticalHits.pokemon2} crits</span>
                </div>
              </div>
            </div>
          )}

          {/* Main Battle Grid */}
          <div className="relative grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-stretch">
            {/* Player 1 */}
            <div className="relative z-10">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 -z-10 text-[10rem] font-black text-muted/20 select-none hidden xl:block">01</div>
              <PokemonSlot pokemon={pokemon1} slot={1} />
            </div>

            {/* VS Divider */}
            <div className="flex lg:flex-col items-center justify-center py-6 relative z-0">
               <div className="relative">
                 <div className="absolute inset-0 bg-gradient-to-b from-primary via-purple-500 to-secondary opacity-20 blur-2xl" />
                 <div className="w-16 h-16 md:w-20 md:h-20 bg-background border-4 border-muted rounded-full flex items-center justify-center shadow-xl z-10 relative">
                   <span className="font-black text-2xl md:text-3xl italic bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent pr-1">VS</span>
                 </div>
               </div>
               
               {/* Connecting Lines (Desktop) */}
               <div className="hidden lg:block absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent -z-10" />
               
               {/* Connecting Lines (Mobile) */}
               <div className="lg:hidden absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent -z-10" />
            </div>

            {/* Player 2 */}
            <div className="relative z-10">
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 -z-10 text-[10rem] font-black text-muted/20 select-none hidden xl:block">02</div>
              <PokemonSlot pokemon={pokemon2} slot={2} />
            </div>
          </div>

          {/* Action Area */}
          <div className="flex justify-center pt-8 pb-16">
            <Button
              size="lg"
              onClick={startBattle}
              disabled={!pokemon1 || !pokemon2}
              className={`
                relative overflow-hidden group px-12 py-8 rounded-full text-xl font-black tracking-wide shadow-2xl transition-all duration-300
                ${(!pokemon1 || !pokemon2) 
                  ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed" 
                  : "bg-foreground text-background hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                }
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-3">
                {(!pokemon1 || !pokemon2) ? "SELECT FIGHTERS" : "START BATTLE"}
                {!(!pokemon1 || !pokemon2) && <Swords className="w-6 h-6 animate-pulse" />}
              </span>
            </Button>
          </div>
        </div>
      </main>

      {/* Battle Arena Overlay */}
      <AnimatePresence>
        {isBattling && pokemon1 && pokemon2 && (
          <BattleArena
            pokemon1Data={pokemon1}
            pokemon2Data={pokemon2}
            onBattleComplete={handleBattleComplete}
            onClose={handleCloseBattle}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Battle;

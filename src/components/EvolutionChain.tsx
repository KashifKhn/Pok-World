import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { pokemonApi } from "@/services/pokemonApi";
import { Link } from "react-router-dom";
import TypeBadge from "./TypeBadge";
import axios from "axios";

interface EvolutionChainProps {
  pokemonId: number;
}

interface EvolutionStage {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
}

const EvolutionChain = ({ pokemonId }: EvolutionChainProps) => {
  const [evolutionChain, setEvolutionChain] = useState<EvolutionStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState(0);
  const [isEvolving, setIsEvolving] = useState(false);

  useEffect(() => {
    fetchEvolutionChain();
  }, [pokemonId]);

  const fetchEvolutionChain = async () => {
    setIsLoading(true);
    try {
      // Get species data to find evolution chain
      const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
      const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
      
      // Get evolution chain
      const chainResponse = await axios.get(evolutionChainUrl);
      const chain = chainResponse.data.chain;

      // Parse evolution chain
      const stages: EvolutionStage[] = [];
      let current = chain;

      while (current) {
        const speciesName = current.species.name;
        const id = parseInt(current.species.url.split("/").slice(-2, -1)[0]);
        const pokemon = await pokemonApi.getPokemonDetails(id);

        stages.push({
          id,
          name: speciesName,
          imageUrl: pokemonApi.getImageUrl(id),
          types: pokemon.types.map((t: any) => t.type.name),
        });

        current = current.evolves_to[0];
      }

      setEvolutionChain(stages);
      
      // Find current stage
      const stage = stages.findIndex(s => s.id === pokemonId);
      setCurrentStage(stage >= 0 ? stage : 0);
    } catch (error) {
      console.error("Failed to fetch evolution chain:", error);
      setEvolutionChain([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvolve = () => {
    if (currentStage >= evolutionChain.length - 1) return;

    setIsEvolving(true);
    
    setTimeout(() => {
      setCurrentStage(currentStage + 1);
      setIsEvolving(false);
    }, 2000);
  };

  const handleDevolve = () => {
    if (currentStage <= 0) return;

    setIsEvolving(true);
    
    setTimeout(() => {
      setCurrentStage(currentStage - 1);
      setIsEvolving(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-8 border-2 border-border animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
        <div className="h-64 bg-muted rounded-xl"></div>
      </div>
    );
  }

  if (evolutionChain.length <= 1) {
    return (
      <div className="bg-card rounded-2xl p-8 border-2 border-border text-center">
        <p className="text-muted-foreground">This Pokémon does not evolve</p>
      </div>
    );
  }

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-border">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <span className="w-2 h-8 bg-accent rounded-full"></span>
          Evolution Chain
        </h2>
        <div className="flex gap-3">
          {currentStage > 0 && (
            <Button
              onClick={handleDevolve}
              disabled={isEvolving}
              variant="outline"
              className="rounded-xl border-2 border-accent text-accent hover:bg-accent/10 hover:text-accent"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span className="capitalize hidden sm:inline">{evolutionChain[currentStage - 1].name}</span>
            </Button>
          )}
          {currentStage < evolutionChain.length - 1 && (
            <Button
              onClick={handleEvolve}
              disabled={isEvolving}
              className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
            >
              <span className="capitalize hidden sm:inline">Evolve to {evolutionChain[currentStage + 1].name}</span>
              <span className="sm:hidden">Evolve</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-start md:justify-center gap-4 lg:gap-8 overflow-x-auto pb-12 pt-4 px-4 min-h-[350px] snap-x snap-mandatory scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
          {evolutionChain.map((stage, index) => (
            <div key={stage.id} className="flex items-center gap-4 lg:gap-8 snap-center">
              <Link
                to={`/pokemon/${stage.id}`}
                className={`group relative transition-all duration-500 flex-shrink-0 outline-none focus:outline-none ${
                  index === currentStage
                    ? "scale-100 z-10"
                    : index < currentStage
                    ? "opacity-70 scale-95 grayscale-[0.3] hover:opacity-100 hover:scale-100 hover:grayscale-0"
                    : "opacity-50 scale-95 grayscale-[0.6] hover:opacity-80 hover:scale-100 hover:grayscale-0"
                }`}
              >
                <div
                  className={`
                    relative bg-card rounded-[2rem] p-6 transition-all duration-500 w-[240px] flex flex-col items-center
                    border
                    ${index === currentStage
                      ? "border-accent shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.1)] ring-4 ring-accent/10"
                      : "border-border shadow-sm hover:border-accent/50 hover:shadow-md"
                    }
                  `}
                >
                  {isEvolving && index === currentStage && (
                    <div className="absolute inset-0 bg-accent/20 rounded-[2rem] animate-ping duration-1000"></div>
                  )}
                  
                  {index === currentStage && (
                    <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground rounded-full p-2.5 shadow-xl z-20 scale-110">
                      <Sparkles className="w-5 h-5 animate-[spin_3s_linear_infinite]" />
                    </div>
                  )}

                  <div className="w-40 h-40 mb-6 relative z-10 mt-2">
                    <div className={`
                      absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl transition-all duration-500
                      ${index === currentStage ? "opacity-100 scale-125" : "opacity-0 scale-75 group-hover:opacity-50 group-hover:scale-100"}
                    `} />
                    <img
                      src={stage.imageUrl}
                      alt={stage.name}
                      className={`
                        w-full h-full object-contain relative z-10 drop-shadow-xl transition-transform duration-500 
                        ${index === currentStage ? "group-hover:scale-110" : "group-hover:scale-110"}
                        ${isEvolving && index === currentStage ? "animate-pulse brightness-150" : ""}
                      `}
                    />
                  </div>

                  <div className="text-center w-full relative z-10 mb-2">
                    <p className={`font-black capitalize text-xl mb-3 transition-colors ${
                      index === currentStage ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    }`}>
                      {stage.name}
                    </p>
                    <div className="flex gap-1.5 justify-center flex-wrap">
                      {stage.types.map((type) => (
                        <TypeBadge key={type} type={type} className="px-2.5 py-1 text-xs shadow-sm" />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>

              {index < evolutionChain.length - 1 && (
                <div className="flex flex-col items-center justify-center">
                   <ArrowRight className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-500 ${
                     index < currentStage ? "text-accent" : "text-border"
                   }`} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">
            <span>Progress</span>
            <span>{Math.round(((currentStage + 1) / evolutionChain.length) * 100)}%</span>
          </div>
          <div className="bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-accent h-full transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]"
              style={{
                width: `${((currentStage + 1) / evolutionChain.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvolutionChain;

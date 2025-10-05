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
    <div className="bg-gradient-to-br from-accent/20 via-primary/20 to-secondary/20 rounded-2xl p-8 border-2 border-accent/30 shadow-lg">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-accent" />
          Evolution Chain
        </h2>
        <div className="flex gap-2">
          {currentStage > 0 && (
            <Button
              onClick={handleDevolve}
              disabled={isEvolving}
              variant="outline"
              className="border-accent text-accent hover:bg-accent/10"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {isEvolving ? "Changing..." : `Back to ${evolutionChain[currentStage - 1].name}`}
            </Button>
          )}
          {currentStage < evolutionChain.length - 1 && (
            <Button
              onClick={handleEvolve}
              disabled={isEvolving}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isEvolving ? "Evolving..." : `Evolve to ${evolutionChain[currentStage + 1].name}`}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        {/* Evolution stages display */}
        <div className="flex items-center justify-center gap-4 overflow-x-auto pb-4 px-4">
          {evolutionChain.map((stage, index) => (
            <div key={stage.id} className="flex items-center gap-4">
              <Link
                to={`/pokemon/${stage.id}`}
                className={`group relative transition-all duration-500 flex-shrink-0 ${
                  index === currentStage
                    ? "scale-110 z-10"
                    : index < currentStage
                    ? "opacity-60 scale-95"
                    : "opacity-40 scale-90"
                }`}
              >
                <div
                  className={`relative bg-card rounded-2xl p-6 border-4 transition-all duration-500 min-w-[200px] ${
                    index === currentStage
                      ? "border-accent shadow-2xl shadow-accent/50"
                      : "border-border"
                  } ${
                    isEvolving && (index === currentStage + 1 || index === currentStage - 1)
                      ? "animate-pulse"
                      : ""
                  }`}
                >
                  {isEvolving && index === currentStage && (
                    <div className="absolute inset-0 bg-accent/20 rounded-2xl animate-ping"></div>
                  )}
                  
                  {index === currentStage && (
                    <div className="absolute -top-3 -right-3 bg-accent text-accent-foreground rounded-full p-2 shadow-lg">
                      <Sparkles className="w-5 h-5 animate-spin" />
                    </div>
                  )}

                  <div className="w-32 h-32 bg-gradient-to-br from-muted to-transparent rounded-xl flex items-center justify-center p-4 mb-3">
                    <img
                      src={stage.imageUrl}
                      alt={stage.name}
                      className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 ${
                        isEvolving && index === currentStage
                          ? "animate-pulse brightness-150"
                          : ""
                      }`}
                    />
                  </div>

                  <div className="text-center space-y-2">
                    <p className="font-bold capitalize text-foreground text-lg">
                      {stage.name}
                    </p>
                    <div className="flex gap-1 justify-center flex-wrap">
                      {stage.types.map((type) => (
                        <TypeBadge key={type} type={type} size="sm" />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>

              {index < evolutionChain.length - 1 && (
                <div className={`transition-all duration-500 ${
                  index < currentStage ? "text-accent" : "text-muted-foreground"
                }`}>
                  <ArrowRight
                    className={`w-8 h-8 ${
                      isEvolving && index === currentStage ? "animate-pulse" : ""
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="mt-6 bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-accent via-primary to-secondary h-full transition-all duration-1000 rounded-full"
            style={{
              width: `${((currentStage + 1) / evolutionChain.length) * 100}%`,
            }}
          />
        </div>

        <p className="text-center mt-3 text-sm text-muted-foreground">
          Stage {currentStage + 1} of {evolutionChain.length}
        </p>
      </div>
    </div>
  );
};

export default EvolutionChain;

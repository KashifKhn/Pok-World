import { useState } from "react";
import { Button } from "./ui/button";
import { Gift, Sparkles } from "lucide-react";
import { pokemonApi } from "@/services/pokemonApi";
import { useToast } from "@/hooks/use-toast";
import { usePokemonCollection } from "@/hooks/usePokemonCollection";
import TypeBadge from "./TypeBadge";
import confetti from "canvas-confetti";
import { Link } from "react-router-dom";

const MysteryBox = () => {
  const [isOpening, setIsOpening] = useState(false);
  const [revealedPokemon, setRevealedPokemon] = useState<any>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const { catchPokemon } = usePokemonCollection();
  const { toast } = useToast();

  const openMysteryBox = async () => {
    setIsOpening(true);
    setIsRevealed(false);
    setRevealedPokemon(null);

    try {
      // Random pokemon from gen 1
      const randomId = Math.floor(Math.random() * 151) + 1;
      const pokemon = await pokemonApi.getPokemonDetails(randomId);

      // Simulate opening animation
      setTimeout(() => {
        setRevealedPokemon(pokemon);
        setIsOpening(false);
        
        // Wait for box to open, then reveal
        setTimeout(() => {
          setIsRevealed(true);
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#DC0A2D', '#FFCB05', '#3B4CCA', '#FFD700'],
          });
        }, 500);
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open mystery box",
        variant: "destructive",
      });
      setIsOpening(false);
    }
  };

  const handleCatch = () => {
    if (!revealedPokemon) return;

    catchPokemon({
      id: revealedPokemon.id,
      name: revealedPokemon.name,
      types: revealedPokemon.types.map((t: any) => t.type.name),
      imageUrl: pokemonApi.getImageUrl(revealedPokemon.id),
    });

    toast({
      title: "Added to Collection!",
      description: `${revealedPokemon.name} has been added to your Pokédex!`,
    });

    // Reset for next opening
    setTimeout(() => {
      setRevealedPokemon(null);
      setIsRevealed(false);
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-br from-secondary/20 via-primary/20 to-accent/20 rounded-2xl p-8 border-2 border-secondary/30 shadow-lg relative overflow-hidden">
      <div className="absolute top-4 right-4 animate-pulse">
        <Sparkles className="w-8 h-8 text-secondary" />
      </div>

      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gift className="w-10 h-10 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Mystery Box</h2>
        </div>
        <p className="text-muted-foreground text-lg">
          Open the mystery box for a chance to discover a random Pokémon!
        </p>

        <div className="relative min-h-[300px] flex items-center justify-center">
          {!revealedPokemon && !isOpening && (
            <div className="relative group cursor-pointer" onClick={openMysteryBox}>
              <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-accent rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-secondary/30 to-primary/30 rounded-2xl p-12 border-4 border-secondary/50 hover:scale-105 transition-transform duration-300">
                <Gift className="w-32 h-32 text-secondary animate-float" />
              </div>
            </div>
          )}

          {isOpening && (
            <div className="relative">
              <div className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-primary to-accent rounded-2xl p-12 animate-pokeball-bounce">
                <Gift className="w-32 h-32 text-primary-foreground animate-spin" />
              </div>
              <p className="text-center mt-6 text-2xl font-bold text-foreground animate-pulse">
                Opening...
              </p>
            </div>
          )}

          {revealedPokemon && (
            <div className={`space-y-6 transition-all duration-1000 ${isRevealed ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/30 to-secondary/30 rounded-2xl blur-2xl animate-pulse"></div>
                <div className="relative bg-card rounded-2xl p-8 border-4 border-secondary shadow-2xl">
                  <div className="aspect-square w-64 mx-auto bg-gradient-to-br from-muted to-transparent rounded-xl flex items-center justify-center p-8 mb-4">
                    <img
                      src={pokemonApi.getImageUrl(revealedPokemon.id)}
                      alt={revealedPokemon.name}
                      className="w-full h-full object-contain animate-float"
                    />
                  </div>

                  <div className="text-center space-y-3">
                    <h3 className="text-3xl font-bold capitalize text-foreground">
                      {revealedPokemon.name}
                    </h3>
                    <p className="text-muted-foreground">
                      #{String(revealedPokemon.id).padStart(3, "0")}
                    </p>

                    <div className="flex gap-2 justify-center flex-wrap">
                      {revealedPokemon.types.map((t: any) => (
                        <TypeBadge key={t.type.name} type={t.type.name} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleCatch}
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Add to Collection
                </Button>
                <Link to={`/pokemon/${revealedPokemon.id}`} className="flex-1">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                  >
                    View Details
                  </Button>
                </Link>
              </div>

              <Button
                onClick={() => {
                  setRevealedPokemon(null);
                  setIsRevealed(false);
                }}
                variant="ghost"
                className="w-full"
              >
                Open Another Box
              </Button>
            </div>
          )}
        </div>

        {!revealedPokemon && !isOpening && (
          <Button
            onClick={openMysteryBox}
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-12"
          >
            <Gift className="w-6 h-6 mr-2" />
            Open Mystery Box
          </Button>
        )}
      </div>
    </div>
  );
};

export default MysteryBox;

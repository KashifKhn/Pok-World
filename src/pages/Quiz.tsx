import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pokemonApi } from "@/services/pokemonApi";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import confetti from "canvas-confetti";

const Quiz = () => {
  const [currentPokemon, setCurrentPokemon] = useState<any>(null);
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showTypeHint, setShowTypeHint] = useState(false);
  const [showFirstCharHint, setShowFirstCharHint] = useState(false);
  const [showLastCharHint, setShowLastCharHint] = useState(false);
  const { toast } = useToast();

  const loadRandomPokemon = async () => {
    setIsLoading(true);
    setRevealed(false);
    setGuess("");
    setShowTypeHint(false);
    setShowFirstCharHint(false);
    setShowLastCharHint(false);
    
    try {
      const randomId = Math.floor(Math.random() * 151) + 1;
      const pokemon = await pokemonApi.getPokemonDetails(randomId);
      setCurrentPokemon(pokemon);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Pokémon",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRandomPokemon();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guess.trim() || !currentPokemon) return;

    const isCorrect = guess.toLowerCase().trim() === currentPokemon.name.toLowerCase();
    
    setRevealed(true);

    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#DC0A2D', '#FFCB05', '#3B4CCA'],
      });

      toast({
        title: "Correct! 🎉",
        description: `It's ${currentPokemon.name}!`,
      });
    } else {
      setStreak(0);
      toast({
        title: "Not quite!",
        description: `It was ${currentPokemon.name}`,
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    loadRandomPokemon();
  };

  const useTypeHint = () => {
    if (showTypeHint) return;
    setShowTypeHint(true);
    setHintsUsed(hintsUsed + 1);
    toast({
      title: "Type Hint Revealed!",
      description: "Check the types below the silhouette",
    });
  };

  const useFirstCharHint = () => {
    if (showFirstCharHint || !currentPokemon) return;
    setShowFirstCharHint(true);
    setHintsUsed(hintsUsed + 1);
    toast({
      title: "First Letter Revealed!",
      description: `Starts with: ${currentPokemon.name[0].toUpperCase()}`,
    });
  };

  const useLastCharHint = () => {
    if (showLastCharHint || !currentPokemon) return;
    setShowLastCharHint(true);
    setHintsUsed(hintsUsed + 1);
    toast({
      title: "Last Letter Revealed!",
      description: `Ends with: ${currentPokemon.name[currentPokemon.name.length - 1].toUpperCase()}`,
    });
  };

  if (isLoading || !currentPokemon) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-8 animate-pulse">
            <div className="h-12 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded-2xl"></div>
          </div>
        </main>
      </div>
    );
  }

  const isCorrect = revealed && guess.toLowerCase().trim() === currentPokemon.name.toLowerCase();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <HelpCircle className="w-12 h-12 text-primary animate-pulse" />
              <h1 className="text-5xl font-bold text-foreground">Who's That Pokémon?</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Guess the Pokémon from its silhouette!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-xl p-4 border-2 border-border text-center">
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Score</p>
              <p className="text-3xl font-bold text-primary">{score}</p>
            </div>
            <div className="bg-card rounded-xl p-4 border-2 border-border text-center">
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Streak</p>
              <p className="text-3xl font-bold text-secondary">{streak} 🔥</p>
            </div>
            <div className="bg-card rounded-xl p-4 border-2 border-border text-center">
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Hints Used</p>
              <p className="text-3xl font-bold text-accent">{hintsUsed}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-2xl p-8 border-2 border-primary/30">
            <div className="aspect-square bg-gradient-to-br from-muted to-transparent rounded-2xl flex items-center justify-center p-12 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
              <img
                src={pokemonApi.getImageUrl(currentPokemon.id)}
                alt={revealed ? currentPokemon.name : "Mystery Pokémon"}
                className={`w-full h-full object-contain transition-all duration-500 ${
                  revealed ? "brightness-100" : "brightness-0"
                }`}
                style={{
                  filter: revealed ? "none" : "brightness(0) drop-shadow(0 0 10px rgba(0,0,0,0.5))",
                }}
              />
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 w-full max-w-md px-4">
                {showTypeHint && !revealed && (
                  <div className="bg-accent/90 backdrop-blur-sm px-6 py-3 rounded-xl border-2 border-accent shadow-lg animate-fade-in">
                    <p className="text-accent-foreground font-bold text-sm uppercase tracking-wide mb-2">Type Hint:</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {currentPokemon.types.map((t: any) => (
                        <span
                          key={t.type.name}
                          className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-accent-foreground/20 text-accent-foreground"
                        >
                          {t.type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {(showFirstCharHint || showLastCharHint) && !revealed && (
                  <div className="bg-primary/90 backdrop-blur-sm px-6 py-3 rounded-xl border-2 border-primary shadow-lg animate-fade-in">
                    <p className="text-primary-foreground font-bold text-sm uppercase tracking-wide mb-2">Letter Hints:</p>
                    <div className="flex gap-4 justify-center text-primary-foreground">
                      {showFirstCharHint && (
                        <div className="text-center">
                          <p className="text-xs opacity-80">First</p>
                          <p className="text-2xl font-bold">{currentPokemon.name[0].toUpperCase()}</p>
                        </div>
                      )}
                      {showLastCharHint && (
                        <div className="text-center">
                          <p className="text-xs opacity-80">Last</p>
                          <p className="text-2xl font-bold">{currentPokemon.name[currentPokemon.name.length - 1].toUpperCase()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!revealed ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Enter Pokémon name..."
                  className="h-14 text-lg text-center"
                  autoFocus
                />
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={useTypeHint}
                      disabled={showTypeHint}
                      className="h-12 text-sm"
                    >
                      <Lightbulb className="w-4 h-4 mr-1" />
                      Type
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={useFirstCharHint}
                      disabled={showFirstCharHint}
                      className="h-12 text-sm"
                    >
                      <Lightbulb className="w-4 h-4 mr-1" />
                      First
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={useLastCharHint}
                      disabled={showLastCharHint}
                      className="h-12 text-sm"
                    >
                      <Lightbulb className="w-4 h-4 mr-1" />
                      Last
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg"
                    disabled={!guess.trim()}
                  >
                    Submit Guess
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div
                  className={`flex items-center justify-center gap-3 p-6 rounded-xl ${
                    isCorrect ? "bg-secondary/20" : "bg-destructive/20"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-8 h-8 text-secondary" />
                  ) : (
                    <XCircle className="w-8 h-8 text-destructive" />
                  )}
                  <div className="text-center">
                    <p className="text-2xl font-bold capitalize text-foreground">
                      {currentPokemon.name}
                    </p>
                    <p className="text-muted-foreground">
                      {isCorrect ? "You got it right!" : `Your guess: ${guess}`}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground text-lg"
                >
                  Next Pokémon →
                </Button>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={loadRandomPokemon}
              className="px-8"
            >
              Skip this Pokémon
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quiz;

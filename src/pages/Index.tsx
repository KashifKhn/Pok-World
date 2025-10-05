import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trophy, Search, HelpCircle, Package } from "lucide-react";
import Navigation from "@/components/Navigation";
import PokemonCard from "@/components/PokemonCard";
import PokemonOfTheDay from "@/components/PokemonOfTheDay";
import PokemonSearchAutocomplete from "@/components/PokemonSearchAutocomplete";
import { Button } from "@/components/ui/button";
import { pokemonApi } from "@/services/pokemonApi";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [featuredPokemon, setFeaturedPokemon] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeaturedPokemon = async () => {
      try {
        setIsLoading(true);
        const randomIds = Array.from({ length: 6 }, () => Math.floor(Math.random() * 151) + 1);
        const promises = randomIds.map(id => pokemonApi.getPokemonDetails(id));
        const results = await Promise.all(promises);
        setFeaturedPokemon(results);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load featured Pokémon",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPokemon();
  }, [toast]);

  const handlePokemonSelect = (pokemon: any) => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main role="main">
        {/* Hero Section */}
        <section 
          className="relative py-20 px-4 overflow-hidden"
          aria-labelledby="hero-heading"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10"></div>
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg animate-float">
                  <div className="w-16 h-16 rounded-full bg-card border-4 border-foreground"></div>
                </div>
              </div>
              
              <h1 id="hero-heading" className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                Explore the World of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-pulse">Pokémon</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Search, discover, catch, battle, and test your knowledge! Build your ultimate collection!
              </p>
              
              <div className="max-w-2xl mx-auto">
                <PokemonSearchAutocomplete
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSelect={handlePokemonSelect}
                  placeholder="Search for any Pokémon..."
                  className="w-full"
                />
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/mystery-box">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Package className="w-5 h-5" />
                    Try Mystery Box
                  </Button>
                </Link>
                <Link to="/battle">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Trophy className="w-5 h-5" />
                    Battle Mode
                  </Button>
                </Link>
                <Link to="/quiz">
                  <Button variant="outline" size="lg" className="gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Quiz Game
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pokémon of the Day */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <PokemonOfTheDay />
          </div>
        </section>

        {/* Featured Pokémon Section */}
        <section 
          className="py-16 px-4"
          aria-labelledby="featured-heading"
        >
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 id="featured-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Pokémon
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover these amazing Pokémon
              </p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-80 bg-muted rounded-2xl animate-pulse"
                    role="status"
                    aria-label="Loading Pokémon"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                {featuredPokemon.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    id={pokemon.id}
                    name={pokemon.name}
                    types={pokemon.types.map((t: any) => t.type.name)}
                    imageUrl={pokemonApi.getImageUrl(pokemon.id)}
                  />
                ))}
              </div>
            )}
            
            <div className="text-center mt-12">
              <Link to="/browse">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-8"
                >
                  Browse All Pokémon
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
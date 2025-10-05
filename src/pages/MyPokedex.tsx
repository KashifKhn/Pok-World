import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PokemonCard from "@/components/PokemonCard";
import TeamBuilder from "@/components/TeamBuilder";
import AchievementCard from "@/components/AchievementCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePokemonCollection } from "@/hooks/usePokemonCollection";
import { useAchievements } from "@/hooks/useAchievements";
import { Trophy, Star } from "lucide-react";

const MyPokedex = () => {
  const { collection } = usePokemonCollection();
  const { achievements } = useAchievements();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8" role="main">
        <div className="mb-6 sm:mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                My Pokédex
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                You have caught {collection.length} Pokémon • {unlockedCount} achievements unlocked
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none bg-primary/10 rounded-xl px-4 sm:px-6 py-3 text-center border-2 border-primary/30">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1" />
                <p className="text-xl sm:text-2xl font-bold text-foreground">{unlockedCount}</p>
                <p className="text-xs text-muted-foreground uppercase">Achievements</p>
              </div>
              <div className="flex-1 sm:flex-none bg-secondary/10 rounded-xl px-4 sm:px-6 py-3 text-center border-2 border-secondary/30">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-secondary mx-auto mb-1" />
                <p className="text-xl sm:text-2xl font-bold text-foreground">{collection.length}</p>
                <p className="text-xs text-muted-foreground uppercase">Caught</p>
              </div>
            </div>
          </div>

          <TeamBuilder />
        </div>

        <Tabs defaultValue="collection" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="collection" className="space-y-6">
            {collection.length === 0 ? (
              <div className="text-center py-16 space-y-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center opacity-50">
                  <div className="w-20 h-20 rounded-full bg-card border-4 border-foreground"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-foreground">
                    Your Pokédex is empty
                  </p>
                  <p className="text-muted-foreground">
                    Start catching Pokémon to build your collection!
                  </p>
                </div>
                <Link to="/browse">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Browse Pokémon
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                {collection.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    id={pokemon.id}
                    name={pokemon.name}
                    types={pokemon.types}
                    imageUrl={pokemon.imageUrl}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-fade-in">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MyPokedex;
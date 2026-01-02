import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PokemonCard from "@/components/PokemonCard";
import TeamBuilder from "@/components/TeamBuilder";
import AchievementCard from "@/components/AchievementCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePokemonCollection } from "@/hooks/usePokemonCollection";
import { useAchievements } from "@/hooks/useAchievements";
import { useBattleHistory } from "@/hooks/useBattleHistory";
import { Trophy, Star, Swords, Trash2, Crown } from "lucide-react";

const MyPokedex = () => {
  const { collection } = usePokemonCollection();
  const { achievements } = useAchievements();
  const { history, clearHistory, getStats } = useBattleHistory();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const battleStats = getStats();

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8" role="main">
          <div className="grid gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  My Pokédex
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                  Track your journey to become a Pokémon Master. Manage your collection, build your dream team, and review your battle history.
                </p>
              </div>
              
              <div className="flex gap-4 w-full md:w-auto">
                <div className="flex-1 md:flex-none bg-card/50 backdrop-blur-sm rounded-2xl px-6 py-4 border border-border shadow-sm flex flex-col items-center min-w-[100px] hover:border-primary/50 transition-colors">
                  <div className="bg-primary/10 p-2 rounded-full mb-2">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">{unlockedCount}</span>
                  <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Awards</span>
                </div>
                
                <div className="flex-1 md:flex-none bg-card/50 backdrop-blur-sm rounded-2xl px-6 py-4 border border-border shadow-sm flex flex-col items-center min-w-[100px] hover:border-secondary/50 transition-colors">
                  <div className="bg-secondary/10 p-2 rounded-full mb-2">
                    <Star className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">{collection.length}</span>
                  <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Caught</span>
                </div>
                
                <div className="flex-1 md:flex-none bg-card/50 backdrop-blur-sm rounded-2xl px-6 py-4 border border-border shadow-sm flex flex-col items-center min-w-[100px] hover:border-accent/50 transition-colors">
                  <div className="bg-accent/10 p-2 rounded-full mb-2">
                    <Swords className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">{battleStats.totalBattles}</span>
                  <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Battles</span>
                </div>
              </div>
            </div>

            <TeamBuilder />
          </div>

          <Tabs defaultValue="collection" className="space-y-8">
            <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-3 h-12 bg-muted/50 p-1 rounded-full">
              <TabsTrigger 
                value="collection" 
                className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                Collection
              </TabsTrigger>
              <TabsTrigger 
                value="battles" 
                className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                Battle History
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                Achievements
              </TabsTrigger>
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

          <TabsContent value="battles" className="space-y-6">
            {/* Battle Stats Summary */}
            {battleStats.totalBattles > 0 && (
              <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-4 sm:p-6 border-2 border-primary/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground">Battle Statistics</h3>
                    <p className="text-sm text-muted-foreground">
                      {battleStats.totalBattles} total battles fought
                      {battleStats.mostBattled && (
                        <> • Most battled: <span className="capitalize font-medium text-foreground">{battleStats.mostBattled.name}</span> ({battleStats.mostBattled.count} battles)</>
                      )}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearHistory}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear History
                  </Button>
                </div>
              </div>
            )}

            {/* Battle History List */}
            {history.length === 0 ? (
              <div className="text-center py-16 space-y-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center opacity-50">
                  <Swords className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-foreground">
                    No battles yet
                  </p>
                  <p className="text-muted-foreground">
                    Head to the Battle Arena to start fighting!
                  </p>
                </div>
                <Link to="/battle">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Swords className="w-5 h-5 mr-2" />
                    Go to Battle Arena
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 animate-fade-in">
                {history.map((battle) => {
                  return (
                    <div
                      key={battle.id}
                      className="bg-card rounded-xl p-4 border-2 border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Pokemon 1 */}
                        <Link to={`/pokemon/${battle.pokemon1.id}`} className="flex-shrink-0 group">
                          <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden ${
                            battle.winner === 1 ? "ring-2 ring-secondary ring-offset-2 ring-offset-card" : "opacity-70"
                          }`}>
                            <img
                              src={battle.pokemon1.imageUrl}
                              alt={battle.pokemon1.name}
                              className="w-full h-full object-contain bg-muted/50 group-hover:scale-110 transition-transform"
                            />
                            {battle.winner === 1 && (
                              <div className="absolute -top-1 -right-1 bg-secondary rounded-full p-1">
                                <Crown className="w-3 h-3 text-secondary-foreground" />
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Battle Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`capitalize font-bold ${battle.winner === 1 ? "text-foreground" : "text-muted-foreground"}`}>
                              {battle.pokemon1.name}
                            </span>
                            <span className="text-muted-foreground font-medium">vs</span>
                            <span className={`capitalize font-bold ${battle.winner === 2 ? "text-foreground" : "text-muted-foreground"}`}>
                              {battle.pokemon2.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{battle.totalRounds} rounds</span>
                            <span>•</span>
                            <span>{formatDate(battle.timestamp)}</span>
                          </div>
                        </div>

                        {/* Pokemon 2 */}
                        <Link to={`/pokemon/${battle.pokemon2.id}`} className="flex-shrink-0 group">
                          <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden ${
                            battle.winner === 2 ? "ring-2 ring-secondary ring-offset-2 ring-offset-card" : "opacity-70"
                          }`}>
                            <img
                              src={battle.pokemon2.imageUrl}
                              alt={battle.pokemon2.name}
                              className="w-full h-full object-contain bg-muted/50 group-hover:scale-110 transition-transform"
                            />
                            {battle.winner === 2 && (
                              <div className="absolute -top-1 -right-1 bg-secondary rounded-full p-1">
                                <Crown className="w-3 h-3 text-secondary-foreground" />
                              </div>
                            )}
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
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

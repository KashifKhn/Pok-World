import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PokemonCard from "@/components/PokemonCard";
import FilterBar from "@/components/FilterBar";
import PokemonSearchAutocomplete from "@/components/PokemonSearchAutocomplete";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { pokemonApi } from "@/services/pokemonApi";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 20;

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("id");
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initialSearch = searchParams.get("search");
    if (initialSearch) {
      handleSearch(initialSearch);
    } else {
      fetchPokemonList();
    }
  }, [currentPage]);

  useEffect(() => {
    filterAndSortPokemon();
  }, [pokemonList, selectedType, sortBy]);

  const filterAndSortPokemon = () => {
    // Filter out any invalid pokemon
    let filtered = pokemonList.filter(p => p && p.types && Array.isArray(p.types));

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter((p) =>
        p.types.some((t: any) => t.type.name === selectedType)
      );
    }

    // Sort (only ID and name are working)
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      return (a.id || 0) - (b.id || 0);
    });

    setFilteredList(filtered);
  };

  const fetchPokemonList = async () => {
    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const listResponse = await pokemonApi.getPokemonList(ITEMS_PER_PAGE, offset);
      setTotalCount(listResponse.count);

      const detailsPromises = listResponse.results.map(async (item) => {
        const id = parseInt(item.url.split("/").slice(-2, -1)[0]);
        return pokemonApi.getPokemonDetails(id);
      });

      const details = await Promise.all(detailsPromises);
      setPokemonList(details);
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

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) {
      setSearchParams({});
      fetchPokemonList();
      return;
    }

    setIsLoading(true);
    try {
      const result = await pokemonApi.searchPokemon(searchTerm);
      if (result) {
        setPokemonList([result]);
        setTotalCount(1);
      } else {
        setPokemonList([]);
        setTotalCount(0);
        toast({
          title: "Not Found",
          description: "No Pokémon found with that name or ID",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Search failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8" role="main">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-foreground">Browse Pokémon</h1>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>

          {showFilters && (
            <div className="bg-card rounded-xl p-6 border-2 border-border shadow-lg animate-fade-in">
              <FilterBar
                selectedType={selectedType}
                sortBy={sortBy}
                onTypeChange={setSelectedType}
                onSortChange={setSortBy}
              />
            </div>
          )}
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="max-w-2xl"
            role="search"
          >
            <div className="flex gap-2 items-start">
              <PokemonSearchAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                onSelect={(pokemon) => {
                  setPokemonList([pokemon]);
                  setTotalCount(1);
                  setSearchQuery(pokemon.name);
                }}
                className="flex-1"
              />
              <Button 
                type="submit"
                size="lg"
                className="bg-primary hover:bg-primary/90 h-12"
              >
                Search
              </Button>
              {searchParams.get("search") && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchParams({});
                    setCurrentPage(1);
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </form>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div 
                key={i} 
                className="h-80 bg-muted rounded-2xl animate-pulse"
                role="status"
                aria-label="Loading Pokémon"
              />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              {selectedType ? `No ${selectedType} type Pokémon found` : "No Pokémon found"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {filteredList.map((pokemon) => (
                pokemon && pokemon.types ? (
                  <PokemonCard
                    key={pokemon.id}
                    id={pokemon.id}
                    name={pokemon.name}
                    types={pokemon.types.map((t: any) => t.type.name)}
                    imageUrl={pokemonApi.getImageUrl(pokemon.id)}
                  />
                ) : null
              ))}
            </div>

            {!searchParams.get("search") && totalPages > 1 && (
              <nav 
                className="flex items-center justify-center gap-4"
                role="navigation"
                aria-label="Pagination"
              >
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
                  Previous
                </Button>
                
                <span className="text-sm text-muted-foreground" aria-live="polite">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                </Button>
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Browse;
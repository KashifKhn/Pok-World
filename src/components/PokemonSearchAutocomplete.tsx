import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { pokemonApi } from "@/services/pokemonApi";
import { cn } from "@/lib/utils";

interface PokemonSearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (pokemon: any) => void;
  placeholder?: string;
  className?: string;
}

const PokemonSearchAutocomplete = ({
  value,
  onChange,
  onSelect,
  placeholder = "Search Pokémon by name or ID...",
  className,
}: PokemonSearchAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.length < 1) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch pokemon list and filter by name
        const response = await pokemonApi.getPokemonList(151, 0);
        const filtered = response.results.filter((p: any) =>
          p.name.toLowerCase().includes(value.toLowerCase())
        );

        // Get details for top 5 matches
        const detailsPromises = filtered.slice(0, 5).map(async (item: any) => {
          const id = parseInt(item.url.split("/").slice(-2, -1)[0]);
          return pokemonApi.getPokemonDetails(id);
        });

        const details = await Promise.all(detailsPromises);
        setSuggestions(details);
        setIsOpen(true);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  const handleSelect = (pokemon: any) => {
    onSelect(pokemon);
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          className="pl-10 pr-10 h-12 text-lg border-2 focus-visible:ring-primary"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-card border-2 border-border rounded-xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="max-h-80 overflow-y-auto">
            {suggestions.map((pokemon) => (
              <button
                key={pokemon.id}
                onClick={() => handleSelect(pokemon)}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors duration-200 border-b border-border last:border-b-0 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-muted to-transparent rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <img
                    src={pokemonApi.getImageUrl(pokemon.id)}
                    alt={pokemon.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg capitalize text-foreground group-hover:text-primary transition-colors">
                      {pokemon.name}
                    </p>
                    <span className="text-sm font-mono text-muted-foreground">
                      #{String(pokemon.id).padStart(3, "0")}
                    </span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {pokemon.types.map((t: any) => (
                      <span
                        key={t.type.name}
                        className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground capitalize"
                      >
                        {t.type.name}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonSearchAutocomplete;

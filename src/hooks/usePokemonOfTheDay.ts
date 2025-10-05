import { useState, useEffect } from "react";
import { pokemonApi } from "@/services/pokemonApi";

const POTD_KEY = "pokemon_of_the_day";

interface PokemonOfTheDay {
  pokemon: any;
  date: string;
}

export const usePokemonOfTheDay = () => {
  const [pokemonOfTheDay, setPokemonOfTheDay] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonOfTheDay = async () => {
      const today = new Date().toDateString();
      const stored = localStorage.getItem(POTD_KEY);

      if (stored) {
        try {
          const data: PokemonOfTheDay = JSON.parse(stored);
          if (data.date === today) {
            setPokemonOfTheDay(data.pokemon);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error("Failed to parse POTD:", error);
        }
      }

      // Generate new Pokémon of the day
      try {
        const seed = new Date().getDate() + new Date().getMonth() * 31;
        const id = (seed % 151) + 1;
        const pokemon = await pokemonApi.getPokemonDetails(id);
        
        const potd: PokemonOfTheDay = {
          pokemon,
          date: today,
        };
        
        localStorage.setItem(POTD_KEY, JSON.stringify(potd));
        setPokemonOfTheDay(pokemon);
      } catch (error) {
        console.error("Failed to fetch POTD:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonOfTheDay();
  }, []);

  return { pokemonOfTheDay, isLoading };
};

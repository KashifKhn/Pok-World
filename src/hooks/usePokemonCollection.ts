import { useState, useEffect } from "react";

const COLLECTION_KEY = "pokemon_collection";

export interface CaughtPokemon {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
  caughtAt: string;
}

export const usePokemonCollection = () => {
  const [collection, setCollection] = useState<CaughtPokemon[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(COLLECTION_KEY);
    if (stored) {
      try {
        setCollection(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse collection:", error);
      }
    }
  }, []);

  const saveCollection = (newCollection: CaughtPokemon[]) => {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(newCollection));
    setCollection(newCollection);
  };

  const catchPokemon = (pokemon: Omit<CaughtPokemon, "caughtAt">) => {
    const newPokemon: CaughtPokemon = {
      ...pokemon,
      caughtAt: new Date().toISOString(),
    };
    const updated = [...collection, newPokemon];
    saveCollection(updated);
    return true;
  };

  const releasePokemon = (pokemonId: number) => {
    const updated = collection.filter((p) => p.id !== pokemonId);
    saveCollection(updated);
  };

  const isPokemonCaught = (pokemonId: number) => {
    return collection.some((p) => p.id === pokemonId);
  };

  return {
    collection,
    catchPokemon,
    releasePokemon,
    isPokemonCaught,
  };
};
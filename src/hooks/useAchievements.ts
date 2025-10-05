import { useState, useEffect } from "react";
import { usePokemonCollection } from "./usePokemonCollection";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

const ACHIEVEMENT_DEFINITIONS = [
  { id: "rookie", name: "Rookie Trainer", description: "Catch 5 Pokémon", icon: "🏅", target: 5 },
  { id: "explorer", name: "Explorer", description: "Catch 10 Pokémon", icon: "🗺️", target: 10 },
  { id: "collector", name: "Collector", description: "Catch 25 Pokémon", icon: "💎", target: 25 },
  { id: "master", name: "Pokémon Master", description: "Catch 50 Pokémon", icon: "👑", target: 50 },
  { id: "water-master", name: "Water Master", description: "Catch 10 Water types", icon: "🌊", target: 10, type: "water" },
  { id: "fire-master", name: "Fire Master", description: "Catch 10 Fire types", icon: "🔥", target: 10, type: "fire" },
  { id: "grass-master", name: "Grass Master", description: "Catch 10 Grass types", icon: "🌿", target: 10, type: "grass" },
  { id: "electric-master", name: "Electric Master", description: "Catch 10 Electric types", icon: "⚡", target: 10, type: "electric" },
];

export const useAchievements = () => {
  const { collection } = usePokemonCollection();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const updatedAchievements = ACHIEVEMENT_DEFINITIONS.map((def) => {
      let progress = 0;
      
      if (def.type) {
        progress = collection.filter((p) => p.types.includes(def.type!)).length;
      } else {
        progress = collection.length;
      }

      return {
        ...def,
        progress,
        unlocked: progress >= def.target,
      };
    });

    setAchievements(updatedAchievements);
  }, [collection]);

  return { achievements };
};

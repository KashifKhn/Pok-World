import { useState, useEffect } from "react";

const TEAM_KEY = "pokemon_team";

export interface TeamMember {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
}

export const useTeamBuilder = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(TEAM_KEY);
    if (stored) {
      try {
        setTeam(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse team:", error);
      }
    }
  }, []);

  const saveTeam = (newTeam: TeamMember[]) => {
    localStorage.setItem(TEAM_KEY, JSON.stringify(newTeam));
    setTeam(newTeam);
  };

  const addToTeam = (pokemon: TeamMember) => {
    if (team.length >= 6) {
      return { success: false, message: "Team is full (max 6 Pokémon)" };
    }
    if (team.some((p) => p.id === pokemon.id)) {
      return { success: false, message: "Already in team" };
    }
    const updated = [...team, pokemon];
    saveTeam(updated);
    return { success: true, message: "Added to team!" };
  };

  const removeFromTeam = (pokemonId: number) => {
    const updated = team.filter((p) => p.id !== pokemonId);
    saveTeam(updated);
  };

  const isInTeam = (pokemonId: number) => {
    return team.some((p) => p.id === pokemonId);
  };

  return {
    team,
    addToTeam,
    removeFromTeam,
    isInTeam,
  };
};

import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
  };
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export const pokemonApi = {
  async getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
    const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  async getPokemonDetails(idOrName: string | number): Promise<PokemonDetails> {
    const response = await axios.get(`${BASE_URL}/pokemon/${idOrName}`);
    return response.data;
  },

  async searchPokemon(query: string): Promise<PokemonDetails | null> {
    try {
      const response = await axios.get(`${BASE_URL}/pokemon/${query.toLowerCase()}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  getImageUrl(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  },
};
import { useState, useCallback, useEffect } from 'react';
import { BattleHistoryRecord, BattleResult } from '@/types/battle';

const STORAGE_KEY = 'pokemon_battle_history';
const MAX_HISTORY = 50;

interface UseBattleHistoryReturn {
  history: BattleHistoryRecord[];
  addBattle: (result: BattleResult, pokemon1Data: any, pokemon2Data: any) => void;
  clearHistory: () => void;
  getStats: () => {
    totalBattles: number;
    wins: { [pokemonId: number]: number };
    mostBattled: { id: number; name: string; count: number } | null;
    winRate: { [pokemonId: number]: number };
  };
}

export function useBattleHistory(): UseBattleHistoryReturn {
  const [history, setHistory] = useState<BattleHistoryRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save battle history:', e);
    }
  }, [history]);

  const addBattle = useCallback(
    (result: BattleResult, pokemon1Data: any, pokemon2Data: any) => {
      const record: BattleHistoryRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        pokemon1: {
          id: pokemon1Data.id,
          name: pokemon1Data.name,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon1Data.id}.png`,
        },
        pokemon2: {
          id: pokemon2Data.id,
          name: pokemon2Data.name,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon2Data.id}.png`,
        },
        winner: result.winner,
        totalRounds: result.totalRounds,
        timestamp: result.timestamp,
      };

      setHistory((prev) => {
        const updated = [record, ...prev].slice(0, MAX_HISTORY);
        return updated;
      });
    },
    []
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getStats = useCallback(() => {
    const wins: { [pokemonId: number]: number } = {};
    const appearances: { [pokemonId: number]: { name: string; count: number } } = {};

    history.forEach((battle) => {
      // Track wins
      const winnerId = battle.winner === 1 ? battle.pokemon1.id : battle.pokemon2.id;
      wins[winnerId] = (wins[winnerId] || 0) + 1;

      // Track appearances
      [battle.pokemon1, battle.pokemon2].forEach((p) => {
        if (!appearances[p.id]) {
          appearances[p.id] = { name: p.name, count: 0 };
        }
        appearances[p.id].count++;
      });
    });

    // Calculate win rates
    const winRate: { [pokemonId: number]: number } = {};
    Object.keys(appearances).forEach((idStr) => {
      const id = parseInt(idStr);
      const winsCount = wins[id] || 0;
      const totalAppearances = appearances[id].count;
      winRate[id] = totalAppearances > 0 ? (winsCount / totalAppearances) * 100 : 0;
    });

    // Find most battled
    let mostBattled: { id: number; name: string; count: number } | null = null;
    Object.entries(appearances).forEach(([idStr, data]) => {
      if (!mostBattled || data.count > mostBattled.count) {
        mostBattled = { id: parseInt(idStr), name: data.name, count: data.count };
      }
    });

    return {
      totalBattles: history.length,
      wins,
      mostBattled,
      winRate,
    };
  }, [history]);

  return {
    history,
    addBattle,
    clearHistory,
    getStats,
  };
}

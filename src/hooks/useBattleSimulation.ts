import { useState, useCallback, useRef, useEffect } from 'react';
import {
  BattleState,
  BattlePokemonData,
  BattleLogEntry,
  BattleResult,
  BattleSpeed,
  PokemonType,
} from '@/types/battle';
import { BATTLE_TIMINGS, BATTLE_CONFIG, POKEMON_CRY_URL, POKEMON_SPRITES } from '@/utils/battleConstants';
import {
  calculateDamage,
  calculateBattleHP,
  determineFirstAttacker,
  getPrimaryType,
} from '@/utils/typeEffectiveness';
import { useBattleAudio } from './useBattleAudio';

interface UseBattleSimulationProps {
  pokemon1Data: any; // Raw Pokemon data from API
  pokemon2Data: any;
  onBattleComplete?: (result: BattleResult) => void;
  audioEnabled?: boolean;
}

interface UseBattleSimulationReturn {
  state: BattleState;
  startBattle: () => void;
  setSpeed: (speed: BattleSpeed) => void;
  skipToEnd: () => void;
  reset: () => void;
  pause: () => void;
  resume: () => void;
}

// Convert raw API data to battle-ready format
function convertToBattlePokemon(rawPokemon: any): BattlePokemonData {
  const types: PokemonType[] = rawPokemon.types.map(
    (t: any) => t.type.name as PokemonType
  );

  const getStatValue = (statName: string) => {
    const stat = rawPokemon.stats.find((s: any) => s.stat.name === statName);
    return stat ? stat.base_stat : 50;
  };

  return {
    id: rawPokemon.id,
    name: rawPokemon.name,
    types,
    stats: {
      hp: getStatValue('hp'),
      attack: getStatValue('attack'),
      defense: getStatValue('defense'),
      specialAttack: getStatValue('special-attack'),
      specialDefense: getStatValue('special-defense'),
      speed: getStatValue('speed'),
    },
    sprites: {
      front: POKEMON_SPRITES.frontAnimated(rawPokemon.id) || POKEMON_SPRITES.front(rawPokemon.id),
      back: POKEMON_SPRITES.backAnimated(rawPokemon.id) || POKEMON_SPRITES.back(rawPokemon.id),
      official: POKEMON_SPRITES.official(rawPokemon.id),
    },
    cryUrl: POKEMON_CRY_URL(rawPokemon.id),
  };
}

const initialState: BattleState = {
  phase: 'idle',
  combatSubPhase: null,
  round: 0,
  currentAttacker: null,
  pokemon1: null,
  pokemon2: null,
  pokemon1HP: 0,
  pokemon2HP: 0,
  pokemon1MaxHP: 0,
  pokemon2MaxHP: 0,
  lastDamage: 0,
  lastAttackType: null,
  lastEffectiveness: null,
  lastIsCritical: false,
  winner: null,
  battleLog: [],
  result: null,
  speed: 1,
  isPaused: false,
};

export function useBattleSimulation({
  pokemon1Data,
  pokemon2Data,
  onBattleComplete,
  audioEnabled = true,
}: UseBattleSimulationProps): UseBattleSimulationReturn {
  const [state, setState] = useState<BattleState>(initialState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skipRequestedRef = useRef(false);
  const battleLogRef = useRef<BattleLogEntry[]>([]);
  const speedRef = useRef<BattleSpeed>(1);
  const statsRef = useRef({
    pokemon1TotalDamage: 0,
    pokemon2TotalDamage: 0,
    pokemon1Crits: 0,
    pokemon2Crits: 0,
    pokemon1SuperEffective: 0,
    pokemon2SuperEffective: 0,
  });

  const { playSound, playCry, stopAll } = useBattleAudio(audioEnabled);

  // Keep speedRef in sync with state
  useEffect(() => {
    speedRef.current = state.speed;
  }, [state.speed]);

  // Get timing based on current speed
  const getTiming = useCallback((timing: number) => {
    return timing / speedRef.current;
  }, []);

  // Clear any pending timeouts
  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Schedule next phase transition
  const scheduleTransition = useCallback(
    (callback: () => void, delay: number) => {
      clearPendingTimeout();
      timeoutRef.current = setTimeout(callback, delay);
    },
    [clearPendingTimeout]
  );

  // Pre-calculate the entire battle result
  const simulateFullBattle = useCallback(
    (p1: BattlePokemonData, p2: BattlePokemonData) => {
      let p1HP = calculateBattleHP(p1.stats.hp);
      let p2HP = calculateBattleHP(p2.stats.hp);
      const p1MaxHP = p1HP;
      const p2MaxHP = p2HP;

      const log: BattleLogEntry[] = [];
      const stats = {
        pokemon1TotalDamage: 0,
        pokemon2TotalDamage: 0,
        pokemon1Crits: 0,
        pokemon2Crits: 0,
        pokemon1SuperEffective: 0,
        pokemon2SuperEffective: 0,
      };

      // Determine first attacker based on speed
      let currentAttacker = determineFirstAttacker(p1.stats.speed, p2.stats.speed);
      let round = 0;

      while (p1HP > 0 && p2HP > 0 && round < BATTLE_CONFIG.MAX_ROUNDS) {
        round++;
        const attacker = currentAttacker === 1 ? p1 : p2;
        const defender = currentAttacker === 1 ? p2 : p1;
        const attackType = getPrimaryType(attacker.types);

        const result = calculateDamage(
          attacker.stats,
          defender.stats,
          attackType,
          defender.types
        );

        // Apply damage to defender
        if (currentAttacker === 1) {
          p2HP = Math.max(0, p2HP - result.damage);
          stats.pokemon1TotalDamage += result.damage;
          if (result.isCritical) stats.pokemon1Crits++;
          if (result.effectiveness === 'super_effective') stats.pokemon1SuperEffective++;
        } else {
          p1HP = Math.max(0, p1HP - result.damage);
          stats.pokemon2TotalDamage += result.damage;
          if (result.isCritical) stats.pokemon2Crits++;
          if (result.effectiveness === 'super_effective') stats.pokemon2SuperEffective++;
        }

        log.push({
          round,
          attacker: currentAttacker,
          attackerName: attacker.name,
          defenderName: defender.name,
          damage: result.damage,
          isCritical: result.isCritical,
          effectiveness: result.effectiveness,
          attackType,
          attackerHPAfter: currentAttacker === 1 ? p1HP : p2HP,
          defenderHPAfter: currentAttacker === 1 ? p2HP : p1HP,
        });

        // Switch attacker
        currentAttacker = currentAttacker === 1 ? 2 : 1;
      }

      const winner: 1 | 2 = p1HP > 0 ? 1 : 2;
      const loser: 1 | 2 = winner === 1 ? 2 : 1;

      return {
        log,
        stats,
        winner,
        loser,
        winnerName: winner === 1 ? p1.name : p2.name,
        loserName: loser === 1 ? p1.name : p2.name,
        totalRounds: round,
        p1FinalHP: p1HP,
        p2FinalHP: p2HP,
        p1MaxHP,
        p2MaxHP,
      };
    },
    []
  );

  // Run combat round animation
  const runCombatRound = useCallback(
    (roundIndex: number) => {
      const log = battleLogRef.current;
      
      if (roundIndex >= log.length || skipRequestedRef.current) {
        // Battle over, transition to knockout
        if (log.length === 0) return;
        
        const lastEntry = log[log.length - 1];
        const winner: 1 | 2 = lastEntry.defenderHPAfter === 0 
          ? lastEntry.attacker 
          : (lastEntry.attacker === 1 ? 2 : 1);
        
        setState((prev) => ({
          ...prev,
          phase: 'knockout',
          combatSubPhase: null,
          winner,
          pokemon1HP: lastEntry.attacker === 1 ? lastEntry.attackerHPAfter : lastEntry.defenderHPAfter,
          pokemon2HP: lastEntry.attacker === 2 ? lastEntry.attackerHPAfter : lastEntry.defenderHPAfter,
        }));
        return;
      }

      const entry = log[roundIndex];

      // Turn start
      setState((prev) => ({
        ...prev,
        round: entry.round,
        currentAttacker: entry.attacker,
        combatSubPhase: 'turn_start',
        lastAttackType: entry.attackType,
      }));

      scheduleTransition(() => {
        // Charging
        playSound('charge');
        setState((prev) => ({ ...prev, combatSubPhase: 'charging' }));

        scheduleTransition(() => {
          // Attacking
          playSound('attack');
          setState((prev) => ({
            ...prev,
            combatSubPhase: 'attacking',
          }));

          scheduleTransition(() => {
            // Impact
            if (entry.isCritical) {
              playSound('criticalHit');
            } else {
              playSound('hit');
            }

            if (entry.effectiveness === 'super_effective') {
              playSound('superEffective');
            } else if (entry.effectiveness === 'not_effective') {
              playSound('notEffective');
            }

            setState((prev) => ({
              ...prev,
              combatSubPhase: 'impact',
              lastDamage: entry.damage,
              lastIsCritical: entry.isCritical,
              lastEffectiveness: entry.effectiveness,
            }));

            scheduleTransition(() => {
              // HP drain - update the defender's HP
              playSound('hpDecrease');
              setState((prev) => {
                const newP1HP = entry.attacker === 1 ? prev.pokemon1HP : entry.defenderHPAfter;
                const newP2HP = entry.attacker === 2 ? prev.pokemon2HP : entry.defenderHPAfter;
                return {
                  ...prev,
                  combatSubPhase: 'hp_drain',
                  pokemon1HP: newP1HP,
                  pokemon2HP: newP2HP,
                };
              });

              scheduleTransition(() => {
                // Turn end
                setState((prev) => ({
                  ...prev,
                  combatSubPhase: 'turn_end',
                  battleLog: [...prev.battleLog, entry],
                }));

                // Check if defender is knocked out
                const defenderHP = entry.defenderHPAfter;
                if (defenderHP <= 0) {
                  // Defender knocked out, go to knockout phase
                  scheduleTransition(() => {
                    setState((prev) => ({
                      ...prev,
                      phase: 'knockout',
                      combatSubPhase: null,
                      winner: entry.attacker,
                    }));
                  }, getTiming(BATTLE_TIMINGS.turnEnd));
                } else {
                  // Continue to next round
                  scheduleTransition(() => {
                    runCombatRound(roundIndex + 1);
                  }, getTiming(BATTLE_TIMINGS.turnEnd));
                }
              }, getTiming(BATTLE_TIMINGS.hpDrain));
            }, getTiming(BATTLE_TIMINGS.impact));
          }, getTiming(BATTLE_TIMINGS.attacking));
        }, getTiming(BATTLE_TIMINGS.charging));
      }, getTiming(BATTLE_TIMINGS.turnStart));
    },
    [scheduleTransition, getTiming, playSound]
  );

  // Handle phase transitions
  useEffect(() => {
    if (state.isPaused) return;

    switch (state.phase) {
      case 'preparing':
        playSound('battleStart');
        scheduleTransition(() => {
          setState((prev) => ({ ...prev, phase: 'arena_enter' }));
        }, getTiming(BATTLE_TIMINGS.preparing));
        break;

      case 'arena_enter':
        // Play both Pokemon cries
        if (state.pokemon1) playCry(state.pokemon1.id);
        setTimeout(() => {
          if (state.pokemon2) playCry(state.pokemon2.id);
        }, 500);

        scheduleTransition(() => {
          setState((prev) => ({
            ...prev,
            phase: 'combat',
            combatSubPhase: 'turn_start',
          }));
          // Start combat with first round
          runCombatRound(0);
        }, getTiming(BATTLE_TIMINGS.arenaEnter));
        break;

      case 'knockout':
        playSound('faint');
        scheduleTransition(() => {
          setState((prev) => ({ ...prev, phase: 'victory' }));
        }, getTiming(BATTLE_TIMINGS.knockout));
        break;

      case 'victory':
        playSound('victory');
        scheduleTransition(() => {
          // Create final result
          const winner = state.winner!;
          const loser: 1 | 2 = winner === 1 ? 2 : 1;
          const stats = statsRef.current;

          const result: BattleResult = {
            winner,
            loser,
            winnerName: winner === 1 ? state.pokemon1!.name : state.pokemon2!.name,
            loserName: loser === 1 ? state.pokemon1!.name : state.pokemon2!.name,
            totalRounds: battleLogRef.current.length,
            totalDamageDealt: {
              pokemon1: stats.pokemon1TotalDamage,
              pokemon2: stats.pokemon2TotalDamage,
            },
            criticalHits: {
              pokemon1: stats.pokemon1Crits,
              pokemon2: stats.pokemon2Crits,
            },
            superEffectiveHits: {
              pokemon1: stats.pokemon1SuperEffective,
              pokemon2: stats.pokemon2SuperEffective,
            },
            battleLog: battleLogRef.current,
            timestamp: new Date().toISOString(),
          };

          setState((prev) => ({ ...prev, phase: 'complete', result }));
          onBattleComplete?.(result);
        }, getTiming(BATTLE_TIMINGS.victory));
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.isPaused]);

  // Start the battle
  const startBattle = useCallback(() => {
    if (!pokemon1Data || !pokemon2Data) return;

    clearPendingTimeout();
    skipRequestedRef.current = false;

    const p1 = convertToBattlePokemon(pokemon1Data);
    const p2 = convertToBattlePokemon(pokemon2Data);

    // Pre-simulate the battle
    const simulation = simulateFullBattle(p1, p2);
    battleLogRef.current = simulation.log;
    statsRef.current = simulation.stats;

    setState({
      ...initialState,
      phase: 'preparing',
      pokemon1: p1,
      pokemon2: p2,
      pokemon1HP: simulation.p1MaxHP,
      pokemon2HP: simulation.p2MaxHP,
      pokemon1MaxHP: simulation.p1MaxHP,
      pokemon2MaxHP: simulation.p2MaxHP,
    });
  }, [pokemon1Data, pokemon2Data, clearPendingTimeout, simulateFullBattle]);

  // Set battle speed
  const setSpeed = useCallback((speed: BattleSpeed) => {
    setState((prev) => ({ ...prev, speed }));
  }, []);

  // Skip to end
  const skipToEnd = useCallback(() => {
    skipRequestedRef.current = true;
    clearPendingTimeout();

    const log = battleLogRef.current;
    if (log.length === 0) return;

    const lastEntry = log[log.length - 1];
    const winner: 1 | 2 = lastEntry.defenderHPAfter === 0 
      ? lastEntry.attacker 
      : (lastEntry.attacker === 1 ? 2 : 1);
    const loser: 1 | 2 = winner === 1 ? 2 : 1;
    const stats = statsRef.current;

    const result: BattleResult = {
      winner,
      loser,
      winnerName: winner === 1 ? state.pokemon1!.name : state.pokemon2!.name,
      loserName: loser === 1 ? state.pokemon1!.name : state.pokemon2!.name,
      totalRounds: log.length,
      totalDamageDealt: {
        pokemon1: stats.pokemon1TotalDamage,
        pokemon2: stats.pokemon2TotalDamage,
      },
      criticalHits: {
        pokemon1: stats.pokemon1Crits,
        pokemon2: stats.pokemon2Crits,
      },
      superEffectiveHits: {
        pokemon1: stats.pokemon1SuperEffective,
        pokemon2: stats.pokemon2SuperEffective,
      },
      battleLog: log,
      timestamp: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      phase: 'complete',
      winner,
      pokemon1HP: lastEntry.attacker === 1 ? lastEntry.attackerHPAfter : lastEntry.defenderHPAfter,
      pokemon2HP: lastEntry.attacker === 2 ? lastEntry.attackerHPAfter : lastEntry.defenderHPAfter,
      battleLog: log,
      result,
    }));

    onBattleComplete?.(result);
  }, [state.pokemon1, state.pokemon2, clearPendingTimeout, onBattleComplete]);

  // Reset battle
  const reset = useCallback(() => {
    clearPendingTimeout();
    stopAll();
    skipRequestedRef.current = false;
    battleLogRef.current = [];
    statsRef.current = {
      pokemon1TotalDamage: 0,
      pokemon2TotalDamage: 0,
      pokemon1Crits: 0,
      pokemon2Crits: 0,
      pokemon1SuperEffective: 0,
      pokemon2SuperEffective: 0,
    };
    setState(initialState);
  }, [clearPendingTimeout, stopAll]);

  // Pause battle
  const pause = useCallback(() => {
    clearPendingTimeout();
    setState((prev) => ({ ...prev, isPaused: true }));
  }, [clearPendingTimeout]);

  // Resume battle
  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: false }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearPendingTimeout();
      stopAll();
    };
  }, [clearPendingTimeout, stopAll]);

  return {
    state,
    startBattle,
    setSpeed,
    skipToEnd,
    reset,
    pause,
    resume,
  };
}

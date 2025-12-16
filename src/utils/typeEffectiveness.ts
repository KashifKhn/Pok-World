import { PokemonType, TypeEffectiveness } from '@/types/battle';
import { BATTLE_CONFIG } from './battleConstants';

/**
 * Complete Pokémon Type Effectiveness Chart
 * Values: 0 = immune, 0.5 = not effective, 1 = normal, 2 = super effective
 * 
 * Row = Attacking type, Column = Defending type
 */
const TYPE_CHART: Record<PokemonType, Record<PokemonType, number>> = {
  normal: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1,
    rock: 0.5, ghost: 0, dragon: 1, dark: 1, steel: 0.5, fairy: 1,
  },
  fire: {
    normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 2,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2,
    rock: 0.5, ghost: 1, dragon: 0.5, dark: 1, steel: 2, fairy: 1,
  },
  water: {
    normal: 1, fire: 2, water: 0.5, electric: 1, grass: 0.5, ice: 1,
    fighting: 1, poison: 1, ground: 2, flying: 1, psychic: 1, bug: 1,
    rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1,
  },
  electric: {
    normal: 1, fire: 1, water: 2, electric: 0.5, grass: 0.5, ice: 1,
    fighting: 1, poison: 1, ground: 0, flying: 2, psychic: 1, bug: 1,
    rock: 1, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1,
  },
  grass: {
    normal: 1, fire: 0.5, water: 2, electric: 1, grass: 0.5, ice: 1,
    fighting: 1, poison: 0.5, ground: 2, flying: 0.5, psychic: 1, bug: 0.5,
    rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 0.5, fairy: 1,
  },
  ice: {
    normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 0.5,
    fighting: 1, poison: 1, ground: 2, flying: 2, psychic: 1, bug: 1,
    rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 1,
  },
  fighting: {
    normal: 2, fire: 1, water: 1, electric: 1, grass: 1, ice: 2,
    fighting: 1, poison: 0.5, ground: 1, flying: 0.5, psychic: 0.5, bug: 0.5,
    rock: 2, ghost: 0, dragon: 1, dark: 2, steel: 2, fairy: 0.5,
  },
  poison: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 2, ice: 1,
    fighting: 1, poison: 0.5, ground: 0.5, flying: 1, psychic: 1, bug: 1,
    rock: 0.5, ghost: 0.5, dragon: 1, dark: 1, steel: 0, fairy: 2,
  },
  ground: {
    normal: 1, fire: 2, water: 1, electric: 2, grass: 0.5, ice: 1,
    fighting: 1, poison: 2, ground: 1, flying: 0, psychic: 1, bug: 0.5,
    rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1,
  },
  flying: {
    normal: 1, fire: 1, water: 1, electric: 0.5, grass: 2, ice: 1,
    fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2,
    rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1,
  },
  psychic: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 2, poison: 2, ground: 1, flying: 1, psychic: 0.5, bug: 1,
    rock: 1, ghost: 1, dragon: 1, dark: 0, steel: 0.5, fairy: 1,
  },
  bug: {
    normal: 1, fire: 0.5, water: 1, electric: 1, grass: 2, ice: 1,
    fighting: 0.5, poison: 0.5, ground: 1, flying: 0.5, psychic: 2, bug: 1,
    rock: 1, ghost: 0.5, dragon: 1, dark: 2, steel: 0.5, fairy: 0.5,
  },
  rock: {
    normal: 1, fire: 2, water: 1, electric: 1, grass: 1, ice: 2,
    fighting: 0.5, poison: 1, ground: 0.5, flying: 2, psychic: 1, bug: 2,
    rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1,
  },
  ghost: {
    normal: 0, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1,
    rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 1,
  },
  dragon: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1,
    rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 0,
  },
  dark: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 0.5, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1,
    rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 0.5,
  },
  steel: {
    normal: 1, fire: 0.5, water: 0.5, electric: 0.5, grass: 1, ice: 2,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1,
    rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 2,
  },
  fairy: {
    normal: 1, fire: 0.5, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 2, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 1,
    rock: 1, ghost: 1, dragon: 2, dark: 2, steel: 0.5, fairy: 1,
  },
};

/**
 * Get the type effectiveness multiplier for an attack
 * @param attackType - The type of the attacking move
 * @param defenderTypes - Array of the defender's types
 * @returns The combined effectiveness multiplier
 */
export function getTypeEffectivenessMultiplier(
  attackType: PokemonType,
  defenderTypes: PokemonType[]
): number {
  let multiplier = 1;
  
  for (const defType of defenderTypes) {
    const effectiveness = TYPE_CHART[attackType]?.[defType] ?? 1;
    multiplier *= effectiveness;
  }
  
  return multiplier;
}

/**
 * Get the type effectiveness category
 */
export function getTypeEffectivenessCategory(multiplier: number): TypeEffectiveness {
  if (multiplier === 0) return 'immune';
  if (multiplier < 1) return 'not_effective';
  if (multiplier > 1) return 'super_effective';
  return 'normal';
}

/**
 * Calculate damage for an attack
 * @param attacker - The attacking Pokémon's battle data
 * @param defender - The defending Pokémon's battle data
 * @param attackType - The type of attack being used
 */
export function calculateDamage(
  attackerStats: { attack: number; specialAttack: number },
  defenderStats: { defense: number; specialDefense: number },
  attackType: PokemonType,
  defenderTypes: PokemonType[]
): {
  damage: number;
  isCritical: boolean;
  effectiveness: TypeEffectiveness;
  multiplier: number;
} {
  // Determine if using physical or special attack
  const useSpecial = attackerStats.specialAttack > attackerStats.attack;
  const attackStat = useSpecial ? attackerStats.specialAttack : attackerStats.attack;
  const defenseStat = useSpecial ? defenderStats.specialDefense : defenderStats.defense;
  
  // Base damage formula (simplified from main series games)
  let damage = ((attackStat / defenseStat) * BATTLE_CONFIG.BASE_DAMAGE);
  
  // Type effectiveness
  const typeMultiplier = getTypeEffectivenessMultiplier(attackType, defenderTypes);
  damage *= typeMultiplier;
  
  // Critical hit check
  const isCritical = Math.random() < BATTLE_CONFIG.CRITICAL_HIT_CHANCE;
  if (isCritical) {
    damage *= BATTLE_CONFIG.CRITICAL_HIT_MULTIPLIER;
  }
  
  // Random factor
  const randomFactor = BATTLE_CONFIG.RANDOM_FACTOR_MIN + 
    Math.random() * (BATTLE_CONFIG.RANDOM_FACTOR_MAX - BATTLE_CONFIG.RANDOM_FACTOR_MIN);
  damage *= randomFactor;
  
  // Minimum damage is 1 (unless immune)
  damage = Math.max(1, Math.floor(damage));
  if (typeMultiplier === 0) {
    damage = 0;
  }
  
  return {
    damage,
    isCritical,
    effectiveness: getTypeEffectivenessCategory(typeMultiplier),
    multiplier: typeMultiplier,
  };
}

/**
 * Calculate initial HP for battle
 * Formula: base_hp * multiplier + base
 */
export function calculateBattleHP(baseHP: number): number {
  return Math.floor(baseHP * BATTLE_CONFIG.HP_MULTIPLIER + BATTLE_CONFIG.HP_BASE);
}

/**
 * Determine which Pokémon attacks first based on speed
 * Returns 1 for pokemon1, 2 for pokemon2
 */
export function determineFirstAttacker(
  speed1: number,
  speed2: number
): 1 | 2 {
  if (speed1 > speed2) return 1;
  if (speed2 > speed1) return 2;
  // Tie: random
  return Math.random() < 0.5 ? 1 : 2;
}

/**
 * Get the primary type of a Pokémon (first type in array)
 */
export function getPrimaryType(types: PokemonType[]): PokemonType {
  return types[0] || 'normal';
}

/**
 * Get effectiveness message for display
 */
export function getEffectivenessMessage(effectiveness: TypeEffectiveness): string {
  switch (effectiveness) {
    case 'super_effective':
      return "It's super effective!";
    case 'not_effective':
      return "It's not very effective...";
    case 'immune':
      return "It doesn't affect the target...";
    default:
      return '';
  }
}

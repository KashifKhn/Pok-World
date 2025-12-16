// Battle System Type Definitions

export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export type BattlePhase =
  | 'idle'
  | 'preparing'
  | 'arena_enter'
  | 'combat'
  | 'knockout'
  | 'victory'
  | 'complete';

export type CombatSubPhase =
  | 'turn_start'
  | 'charging'
  | 'attacking'
  | 'impact'
  | 'hp_drain'
  | 'turn_end';

export type TypeEffectiveness = 'immune' | 'not_effective' | 'normal' | 'super_effective';

export type BattleSpeed = 1 | 2;

export interface BattlePokemonData {
  id: number;
  name: string;
  types: PokemonType[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  sprites: {
    front: string;
    back: string;
    official: string;
  };
  cryUrl: string;
}

export interface BattleLogEntry {
  round: number;
  attacker: 1 | 2;
  attackerName: string;
  defenderName: string;
  damage: number;
  isCritical: boolean;
  effectiveness: TypeEffectiveness;
  attackType: PokemonType;
  attackerHPAfter: number;
  defenderHPAfter: number;
}

export interface BattleResult {
  winner: 1 | 2;
  loser: 1 | 2;
  winnerName: string;
  loserName: string;
  totalRounds: number;
  totalDamageDealt: {
    pokemon1: number;
    pokemon2: number;
  };
  criticalHits: {
    pokemon1: number;
    pokemon2: number;
  };
  superEffectiveHits: {
    pokemon1: number;
    pokemon2: number;
  };
  battleLog: BattleLogEntry[];
  timestamp: string;
}

export interface BattleState {
  phase: BattlePhase;
  combatSubPhase: CombatSubPhase | null;
  round: number;
  currentAttacker: 1 | 2 | null;
  
  pokemon1: BattlePokemonData | null;
  pokemon2: BattlePokemonData | null;
  
  pokemon1HP: number;
  pokemon2HP: number;
  pokemon1MaxHP: number;
  pokemon2MaxHP: number;
  
  lastDamage: number;
  lastAttackType: PokemonType | null;
  lastEffectiveness: TypeEffectiveness | null;
  lastIsCritical: boolean;
  
  winner: 1 | 2 | null;
  battleLog: BattleLogEntry[];
  result: BattleResult | null;
  
  speed: BattleSpeed;
  isPaused: boolean;
}

export interface BattleActions {
  startBattle: () => void;
  setSpeed: (speed: BattleSpeed) => void;
  skipToEnd: () => void;
  reset: () => void;
  pause: () => void;
  resume: () => void;
}

export interface BattleHistoryRecord {
  id: string;
  pokemon1: {
    id: number;
    name: string;
    imageUrl: string;
  };
  pokemon2: {
    id: number;
    name: string;
    imageUrl: string;
  };
  winner: 1 | 2;
  totalRounds: number;
  timestamp: string;
}

export interface BattleArenaProps {
  pokemon1: any; // Raw Pokemon data from API
  pokemon2: any;
  onBattleComplete: (result: BattleResult) => void;
  onClose: () => void;
}

// Animation timing configuration
export interface BattleTimings {
  preparing: number;
  arenaEnter: number;
  turnStart: number;
  charging: number;
  attacking: number;
  impact: number;
  hpDrain: number;
  turnEnd: number;
  knockout: number;
  victory: number;
}

// Type-based visual configuration
export interface TypeVisualConfig {
  color: string;
  gradient: string;
  particleColor: string;
  attackName: string;
  attackAnimation: 'projectile' | 'beam' | 'wave' | 'strike' | 'special';
}

// Battle arena background configuration
export interface ArenaBackground {
  type: PokemonType;
  gradient: string;
  particleType: 'fire' | 'water' | 'leaves' | 'sparks' | 'stars' | 'dust' | 'snow' | 'bubbles' | 'shadows' | 'sparkles';
  ambientColor: string;
}

import { BattleTimings, TypeVisualConfig, ArenaBackground, PokemonType } from '@/types/battle';

// Animation timings in milliseconds (for 1x speed)
export const BATTLE_TIMINGS: BattleTimings = {
  preparing: 500,
  arenaEnter: 1500,
  turnStart: 300,
  charging: 400,
  attacking: 500,
  impact: 300,
  hpDrain: 400,
  turnEnd: 300,
  knockout: 1500,
  victory: 2000,
};

// Battle configuration
export const BATTLE_CONFIG = {
  // HP calculation: base_hp * HP_MULTIPLIER + HP_BASE
  HP_MULTIPLIER: 2,
  HP_BASE: 100,
  
  // Damage calculation
  BASE_DAMAGE: 20,
  CRITICAL_HIT_CHANCE: 0.0625, // 6.25% chance (1/16)
  CRITICAL_HIT_MULTIPLIER: 1.5,
  RANDOM_FACTOR_MIN: 0.85,
  RANDOM_FACTOR_MAX: 1.0,
  
  // Type effectiveness multipliers
  SUPER_EFFECTIVE: 2.0,
  NOT_EFFECTIVE: 0.5,
  IMMUNE: 0,
  NORMAL: 1.0,
  
  // Maximum rounds before forced end (safety)
  MAX_ROUNDS: 20,
};

// Pokémon cry URL template
export const POKEMON_CRY_URL = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;

// Sprite URLs
export const POKEMON_SPRITES = {
  front: (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
  back: (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`,
  frontAnimated: (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`,
  backAnimated: (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/versions/generation-v/black-white/animated/${id}.gif`,
  official: (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
};

// Type-based visual configurations
export const TYPE_VISUALS: Record<PokemonType, TypeVisualConfig> = {
  normal: {
    color: '#A8A878',
    gradient: 'linear-gradient(135deg, #A8A878 0%, #C6C6A7 100%)',
    particleColor: '#A8A878',
    attackName: 'Tackle',
    attackAnimation: 'strike',
  },
  fire: {
    color: '#F08030',
    gradient: 'linear-gradient(135deg, #F08030 0%, #F5AC78 100%)',
    particleColor: '#FF6B35',
    attackName: 'Flamethrower',
    attackAnimation: 'beam',
  },
  water: {
    color: '#6890F0',
    gradient: 'linear-gradient(135deg, #6890F0 0%, #9DB7F5 100%)',
    particleColor: '#5090D6',
    attackName: 'Hydro Pump',
    attackAnimation: 'beam',
  },
  electric: {
    color: '#F8D030',
    gradient: 'linear-gradient(135deg, #F8D030 0%, #FAE078 100%)',
    particleColor: '#F2D94E',
    attackName: 'Thunderbolt',
    attackAnimation: 'beam',
  },
  grass: {
    color: '#78C850',
    gradient: 'linear-gradient(135deg, #78C850 0%, #A7DB8D 100%)',
    particleColor: '#5FBD58',
    attackName: 'Solar Beam',
    attackAnimation: 'beam',
  },
  ice: {
    color: '#98D8D8',
    gradient: 'linear-gradient(135deg, #98D8D8 0%, #BCE6E6 100%)',
    particleColor: '#73CEC0',
    attackName: 'Ice Beam',
    attackAnimation: 'beam',
  },
  fighting: {
    color: '#C03028',
    gradient: 'linear-gradient(135deg, #C03028 0%, #D67873 100%)',
    particleColor: '#CE416B',
    attackName: 'Close Combat',
    attackAnimation: 'strike',
  },
  poison: {
    color: '#A040A0',
    gradient: 'linear-gradient(135deg, #A040A0 0%, #C183C1 100%)',
    particleColor: '#AA6BC8',
    attackName: 'Sludge Bomb',
    attackAnimation: 'projectile',
  },
  ground: {
    color: '#E0C068',
    gradient: 'linear-gradient(135deg, #E0C068 0%, #EBD69D 100%)',
    particleColor: '#D97845',
    attackName: 'Earthquake',
    attackAnimation: 'wave',
  },
  flying: {
    color: '#A890F0',
    gradient: 'linear-gradient(135deg, #A890F0 0%, #C6B7F5 100%)',
    particleColor: '#89AAE3',
    attackName: 'Air Slash',
    attackAnimation: 'wave',
  },
  psychic: {
    color: '#F85888',
    gradient: 'linear-gradient(135deg, #F85888 0%, #FA92B2 100%)',
    particleColor: '#FA7179',
    attackName: 'Psychic',
    attackAnimation: 'wave',
  },
  bug: {
    color: '#A8B820',
    gradient: 'linear-gradient(135deg, #A8B820 0%, #C6D16E 100%)',
    particleColor: '#91C12F',
    attackName: 'Bug Buzz',
    attackAnimation: 'wave',
  },
  rock: {
    color: '#B8A038',
    gradient: 'linear-gradient(135deg, #B8A038 0%, #D1C17D 100%)',
    particleColor: '#C5B78C',
    attackName: 'Rock Slide',
    attackAnimation: 'projectile',
  },
  ghost: {
    color: '#705898',
    gradient: 'linear-gradient(135deg, #705898 0%, #A292BC 100%)',
    particleColor: '#5269AD',
    attackName: 'Shadow Ball',
    attackAnimation: 'projectile',
  },
  dragon: {
    color: '#7038F8',
    gradient: 'linear-gradient(135deg, #7038F8 0%, #A27DFA 100%)',
    particleColor: '#0B6DC3',
    attackName: 'Dragon Pulse',
    attackAnimation: 'beam',
  },
  dark: {
    color: '#705848',
    gradient: 'linear-gradient(135deg, #705848 0%, #A29288 100%)',
    particleColor: '#5A5465',
    attackName: 'Dark Pulse',
    attackAnimation: 'wave',
  },
  steel: {
    color: '#B8B8D0',
    gradient: 'linear-gradient(135deg, #B8B8D0 0%, #D1D1E0 100%)',
    particleColor: '#5A8EA2',
    attackName: 'Flash Cannon',
    attackAnimation: 'beam',
  },
  fairy: {
    color: '#EE99AC',
    gradient: 'linear-gradient(135deg, #EE99AC 0%, #F4BDC9 100%)',
    particleColor: '#EC8FE6',
    attackName: 'Moonblast',
    attackAnimation: 'special',
  },
};

// Arena backgrounds based on Pokémon type
export const ARENA_BACKGROUNDS: Record<PokemonType, ArenaBackground> = {
  normal: {
    type: 'normal',
    gradient: 'linear-gradient(180deg, #87CEEB 0%, #E0E0E0 50%, #A8A878 100%)',
    particleType: 'dust',
    ambientColor: 'rgba(168, 168, 120, 0.2)',
  },
  fire: {
    type: 'fire',
    gradient: 'linear-gradient(180deg, #FF4500 0%, #FF6B35 30%, #8B0000 70%, #2D0000 100%)',
    particleType: 'fire',
    ambientColor: 'rgba(255, 107, 53, 0.3)',
  },
  water: {
    type: 'water',
    gradient: 'linear-gradient(180deg, #0077BE 0%, #1E90FF 40%, #006994 70%, #003D5B 100%)',
    particleType: 'bubbles',
    ambientColor: 'rgba(30, 144, 255, 0.3)',
  },
  electric: {
    type: 'electric',
    gradient: 'linear-gradient(180deg, #2C3E50 0%, #34495E 40%, #F8D030 90%, #F5AC78 100%)',
    particleType: 'sparks',
    ambientColor: 'rgba(248, 208, 48, 0.3)',
  },
  grass: {
    type: 'grass',
    gradient: 'linear-gradient(180deg, #87CEEB 0%, #90EE90 40%, #228B22 70%, #006400 100%)',
    particleType: 'leaves',
    ambientColor: 'rgba(120, 200, 80, 0.3)',
  },
  ice: {
    type: 'ice',
    gradient: 'linear-gradient(180deg, #E0FFFF 0%, #B0E0E6 40%, #87CEEB 70%, #4682B4 100%)',
    particleType: 'snow',
    ambientColor: 'rgba(152, 216, 216, 0.3)',
  },
  fighting: {
    type: 'fighting',
    gradient: 'linear-gradient(180deg, #8B4513 0%, #A0522D 40%, #D2691E 70%, #8B0000 100%)',
    particleType: 'dust',
    ambientColor: 'rgba(192, 48, 40, 0.3)',
  },
  poison: {
    type: 'poison',
    gradient: 'linear-gradient(180deg, #4B0082 0%, #800080 40%, #9932CC 70%, #301934 100%)',
    particleType: 'bubbles',
    ambientColor: 'rgba(160, 64, 160, 0.3)',
  },
  ground: {
    type: 'ground',
    gradient: 'linear-gradient(180deg, #87CEEB 0%, #DEB887 40%, #D2B48C 70%, #8B4513 100%)',
    particleType: 'dust',
    ambientColor: 'rgba(224, 192, 104, 0.3)',
  },
  flying: {
    type: 'flying',
    gradient: 'linear-gradient(180deg, #87CEEB 0%, #B0C4DE 40%, #ADD8E6 70%, #E0E0E0 100%)',
    particleType: 'dust',
    ambientColor: 'rgba(168, 144, 240, 0.3)',
  },
  psychic: {
    type: 'psychic',
    gradient: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #F85888 70%, #0f3460 100%)',
    particleType: 'stars',
    ambientColor: 'rgba(248, 88, 136, 0.3)',
  },
  bug: {
    type: 'bug',
    gradient: 'linear-gradient(180deg, #228B22 0%, #32CD32 40%, #90EE90 70%, #006400 100%)',
    particleType: 'leaves',
    ambientColor: 'rgba(168, 184, 32, 0.3)',
  },
  rock: {
    type: 'rock',
    gradient: 'linear-gradient(180deg, #696969 0%, #808080 40%, #A9A9A9 70%, #2F4F4F 100%)',
    particleType: 'dust',
    ambientColor: 'rgba(184, 160, 56, 0.3)',
  },
  ghost: {
    type: 'ghost',
    gradient: 'linear-gradient(180deg, #1a1a2e 0%, #2D2D44 40%, #705898 70%, #0D0D1A 100%)',
    particleType: 'shadows',
    ambientColor: 'rgba(112, 88, 152, 0.3)',
  },
  dragon: {
    type: 'dragon',
    gradient: 'linear-gradient(180deg, #1a1a2e 0%, #2C3E50 40%, #7038F8 70%, #0D0D1A 100%)',
    particleType: 'stars',
    ambientColor: 'rgba(112, 56, 248, 0.3)',
  },
  dark: {
    type: 'dark',
    gradient: 'linear-gradient(180deg, #0D0D0D 0%, #1a1a1a 40%, #2D2D2D 70%, #000000 100%)',
    particleType: 'shadows',
    ambientColor: 'rgba(112, 88, 72, 0.3)',
  },
  steel: {
    type: 'steel',
    gradient: 'linear-gradient(180deg, #708090 0%, #778899 40%, #B0C4DE 70%, #4A4A4A 100%)',
    particleType: 'sparks',
    ambientColor: 'rgba(184, 184, 208, 0.3)',
  },
  fairy: {
    type: 'fairy',
    gradient: 'linear-gradient(180deg, #FFB6C1 0%, #FFC0CB 40%, #FF69B4 70%, #FF1493 100%)',
    particleType: 'sparkles',
    ambientColor: 'rgba(238, 153, 172, 0.3)',
  },
};

// Audio file URLs (we'll use royalty-free sounds)
export const BATTLE_AUDIO = {
  battleStart: '/audio/battle-start.mp3',
  charge: '/audio/charge.mp3',
  attack: '/audio/attack.mp3',
  hit: '/audio/hit.mp3',
  criticalHit: '/audio/critical-hit.mp3',
  superEffective: '/audio/super-effective.mp3',
  notEffective: '/audio/not-effective.mp3',
  hpDecrease: '/audio/hp-decrease.mp3',
  faint: '/audio/faint.mp3',
  victory: '/audio/victory.mp3',
};

// Screen shake configurations
export const SCREEN_SHAKE = {
  light: { x: 2, y: 2, duration: 0.1 },
  medium: { x: 5, y: 5, duration: 0.15 },
  heavy: { x: 10, y: 10, duration: 0.2 },
  critical: { x: 15, y: 15, duration: 0.3 },
};

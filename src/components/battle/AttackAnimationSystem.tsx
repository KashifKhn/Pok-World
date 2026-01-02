import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { PokemonType } from '@/types/battle';
import { TYPE_VISUALS } from '@/utils/battleConstants';

interface AttackAnimationSystemProps {
  attackType: PokemonType;
  isActive: boolean;
  fromPlayer: boolean;
  phase: 'idle' | 'charging' | 'firing' | 'impact';
  onPhaseComplete?: () => void;
}

// Type-specific particle configurations
const getParticleConfig = (type: PokemonType, fromPlayer: boolean) => {
  // Both Pokemon are horizontally aligned
  // Player on left (~18%), Opponent on right (~82%)
  // Attacks should come from body level (~45% from top, slightly above center)
  const direction = fromPlayer ? 0 : 180; // Straight horizontal
  const startX = fromPlayer ? 22 : 78;
  const startY = 45; // Slightly above center to match Pokemon body
  const color = TYPE_VISUALS[type].color;

  const baseConfig = {
    fullScreen: false,
    fpsLimit: 120,
    detectRetina: true,
  };

  switch (type) {
    case 'fire':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#ff4500', '#ff6600', '#ff8c00', '#ffd700', '#fff'] },
          shape: { 
            type: ['circle', 'triangle'],
          },
          opacity: {
            value: { min: 0.6, max: 1 },
            animation: { enable: true, speed: 2, minimumValue: 0 }
          },
          size: {
            value: { min: 8, max: 25 },
            animation: { enable: true, speed: 10, minimumValue: 2, sync: false }
          },
          move: {
            enable: true,
            speed: { min: 15, max: 35 },
            direction: direction,
            outModes: { default: 'destroy' },
            straight: false,
            random: true,
          },
          life: {
            duration: { value: 1.5 },
            count: 1
          },
          rotate: {
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 30 }
          },
          wobble: {
            enable: true,
            distance: 15,
            speed: 10
          },
          tilt: {
            enable: true,
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 30 }
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 8, delay: 0.05 },
          size: { width: 10, height: 30 },
          life: { duration: 0.8, count: 1 }
        }
      };

    case 'water':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#00bfff', '#1e90ff', '#4169e1', '#87ceeb', '#fff'] },
          shape: { type: 'circle' },
          opacity: {
            value: { min: 0.5, max: 0.9 },
            animation: { enable: true, speed: 1, minimumValue: 0.2 }
          },
          size: {
            value: { min: 5, max: 20 },
            animation: { enable: true, speed: 5, minimumValue: 1 }
          },
          move: {
            enable: true,
            speed: { min: 20, max: 40 },
            direction: direction,
            outModes: { default: 'destroy' },
            straight: false,
            random: true,
            path: {
              enable: true,
              delay: { value: 0 },
            }
          },
          life: {
            duration: { value: 1.2 },
            count: 1
          },
          twinkle: {
            particles: { enable: true, frequency: 0.5, color: { value: '#fff' } }
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 12, delay: 0.03 },
          size: { width: 8, height: 25 },
          life: { duration: 0.7, count: 1 }
        }
      };

    case 'electric':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#ffff00', '#ffd700', '#fff', '#87ceeb'] },
          shape: { 
            type: ['line', 'circle'],
          },
          opacity: {
            value: { min: 0.7, max: 1 },
            animation: { enable: true, speed: 5, minimumValue: 0.3 }
          },
          size: {
            value: { min: 2, max: 15 },
            animation: { enable: true, speed: 20, minimumValue: 1 }
          },
          move: {
            enable: true,
            speed: { min: 30, max: 60 },
            direction: direction,
            outModes: { default: 'destroy' },
            straight: false,
            random: true,
            vibrate: true,
          },
          life: {
            duration: { value: 0.8 },
            count: 1
          },
          stroke: {
            width: 2,
            color: { value: '#fff' }
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 15, delay: 0.02 },
          size: { width: 15, height: 40 },
          life: { duration: 0.5, count: 1 }
        }
      };

    case 'grass':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#32cd32', '#228b22', '#90ee90', '#adff2f', '#fff'] },
          shape: { 
            type: ['circle', 'polygon'],
            options: {
              polygon: { sides: 5 }
            }
          },
          opacity: {
            value: { min: 0.6, max: 1 },
            animation: { enable: true, speed: 1 }
          },
          size: {
            value: { min: 6, max: 18 },
            animation: { enable: true, speed: 8 }
          },
          move: {
            enable: true,
            speed: { min: 12, max: 30 },
            direction: direction,
            outModes: { default: 'destroy' },
            random: true,
          },
          life: {
            duration: { value: 1.5 },
            count: 1
          },
          rotate: {
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 15 }
          },
          roll: {
            enable: true,
            speed: { min: 5, max: 15 }
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 10, delay: 0.04 },
          size: { width: 12, height: 35 },
          life: { duration: 0.9, count: 1 }
        }
      };

    case 'ice':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#00ffff', '#87ceeb', '#b0e0e6', '#e0ffff', '#fff'] },
          shape: { 
            type: ['star', 'circle'],
            options: {
              star: { sides: 6 }
            }
          },
          opacity: {
            value: { min: 0.5, max: 1 },
            animation: { enable: true, speed: 1 }
          },
          size: {
            value: { min: 4, max: 16 },
            animation: { enable: true, speed: 5 }
          },
          move: {
            enable: true,
            speed: { min: 15, max: 35 },
            direction: direction,
            outModes: { default: 'destroy' },
            random: true,
          },
          life: {
            duration: { value: 1.3 },
            count: 1
          },
          rotate: {
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 20 }
          },
          twinkle: {
            particles: { enable: true, frequency: 0.8, color: { value: '#fff' } }
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 10, delay: 0.04 },
          size: { width: 10, height: 30 },
          life: { duration: 0.8, count: 1 }
        }
      };

    case 'psychic':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#ff69b4', '#da70d6', '#9370db', '#8a2be2', '#fff'] },
          shape: { type: 'circle' },
          opacity: {
            value: { min: 0.4, max: 0.9 },
            animation: { enable: true, speed: 2 }
          },
          size: {
            value: { min: 8, max: 25 },
            animation: { enable: true, speed: 8 }
          },
          move: {
            enable: true,
            speed: { min: 10, max: 25 },
            direction: direction,
            outModes: { default: 'destroy' },
            random: true,
            path: {
              enable: true,
              delay: { value: 0 }
            }
          },
          life: {
            duration: { value: 1.5 },
            count: 1
          },
          orbit: {
            enable: true,
            radius: 30,
            rotation: { value: 45 }
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 8, delay: 0.05 },
          size: { width: 15, height: 35 },
          life: { duration: 1, count: 1 }
        }
      };

    case 'ghost':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#483d8b', '#6a5acd', '#9370db', '#8b008b', '#4b0082'] },
          shape: { type: 'circle' },
          opacity: {
            value: { min: 0.2, max: 0.7 },
            animation: { enable: true, speed: 2 }
          },
          size: {
            value: { min: 10, max: 35 },
            animation: { enable: true, speed: 5 }
          },
          move: {
            enable: true,
            speed: { min: 8, max: 20 },
            direction: direction,
            outModes: { default: 'destroy' },
            random: true,
            path: {
              enable: true,
              delay: { value: 0 }
            }
          },
          life: {
            duration: { value: 2 },
            count: 1
          },
          shadow: {
            enable: true,
            blur: 10,
            color: { value: '#000' }
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 5, delay: 0.08 },
          size: { width: 20, height: 40 },
          life: { duration: 1.2, count: 1 }
        }
      };

    case 'dragon':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#7038f8', '#6a5acd', '#9370db', '#ff4500', '#ffd700'] },
          shape: { 
            type: ['triangle', 'polygon'],
            options: {
              polygon: { sides: 6 }
            }
          },
          opacity: {
            value: { min: 0.6, max: 1 },
            animation: { enable: true, speed: 2 }
          },
          size: {
            value: { min: 8, max: 30 },
            animation: { enable: true, speed: 10 }
          },
          move: {
            enable: true,
            speed: { min: 20, max: 45 },
            direction: direction,
            outModes: { default: 'destroy' },
            straight: false,
            random: true,
          },
          life: {
            duration: { value: 1.2 },
            count: 1
          },
          rotate: {
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 25 }
          },
          tilt: {
            enable: true,
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 20 }
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 10, delay: 0.04 },
          size: { width: 12, height: 35 },
          life: { duration: 0.8, count: 1 }
        }
      };

    case 'dark':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#2f4f4f', '#1a1a2e', '#16213e', '#4a0e4e', '#000'] },
          shape: { type: ['circle', 'triangle'] },
          opacity: {
            value: { min: 0.5, max: 0.9 },
            animation: { enable: true, speed: 3 }
          },
          size: {
            value: { min: 8, max: 25 },
            animation: { enable: true, speed: 8 }
          },
          move: {
            enable: true,
            speed: { min: 15, max: 35 },
            direction: direction,
            outModes: { default: 'destroy' },
            random: true,
          },
          life: {
            duration: { value: 1.3 },
            count: 1
          },
          shadow: {
            enable: true,
            blur: 15,
            color: { value: '#000' }
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 8, delay: 0.05 },
          size: { width: 12, height: 35 },
          life: { duration: 0.9, count: 1 }
        }
      };

    case 'fighting':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#c03028', '#ff6347', '#dc143c', '#ff4500', '#fff'] },
          shape: { 
            type: ['star', 'triangle'],
            options: {
              star: { sides: 4 }
            }
          },
          opacity: {
            value: { min: 0.7, max: 1 },
            animation: { enable: true, speed: 3 }
          },
          size: {
            value: { min: 6, max: 20 },
            animation: { enable: true, speed: 12 }
          },
          move: {
            enable: true,
            speed: { min: 25, max: 50 },
            direction: direction,
            outModes: { default: 'destroy' },
            straight: true,
          },
          life: {
            duration: { value: 0.8 },
            count: 1
          },
          rotate: {
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 40 }
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 12, delay: 0.03 },
          size: { width: 8, height: 20 },
          life: { duration: 0.6, count: 1 }
        }
      };

    case 'rock':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#b8a038', '#a0522d', '#8b4513', '#d2b48c', '#808080'] },
          shape: { 
            type: ['polygon'],
            options: {
              polygon: { sides: 5 }
            }
          },
          opacity: {
            value: { min: 0.8, max: 1 },
          },
          size: {
            value: { min: 10, max: 30 },
            animation: { enable: true, speed: 5 }
          },
          move: {
            enable: true,
            speed: { min: 15, max: 30 },
            direction: direction,
            outModes: { default: 'destroy' },
            gravity: { enable: true, acceleration: 5 }
          },
          life: {
            duration: { value: 1.5 },
            count: 1
          },
          rotate: {
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 15 }
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 6, delay: 0.08 },
          size: { width: 15, height: 30 },
          life: { duration: 0.8, count: 1 }
        }
      };

    case 'ground':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#e0c068', '#d2b48c', '#deb887', '#8b4513', '#a0522d'] },
          shape: { type: ['circle', 'polygon'] },
          opacity: {
            value: { min: 0.7, max: 1 },
          },
          size: {
            value: { min: 5, max: 20 },
            animation: { enable: true, speed: 8 }
          },
          move: {
            enable: true,
            speed: { min: 10, max: 25 },
            direction: direction,
            outModes: { default: 'destroy' },
            gravity: { enable: true, acceleration: 8 }
          },
          life: {
            duration: { value: 1.5 },
            count: 1
          },
          roll: {
            enable: true,
            speed: { min: 10, max: 25 }
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 10, delay: 0.04 },
          size: { width: 20, height: 20 },
          life: { duration: 0.9, count: 1 }
        }
      };

    case 'steel':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#b8b8d0', '#c0c0c0', '#a9a9a9', '#808080', '#fff'] },
          shape: { 
            type: ['polygon', 'star'],
            options: {
              polygon: { sides: 6 },
              star: { sides: 4 }
            }
          },
          opacity: {
            value: { min: 0.7, max: 1 },
            animation: { enable: true, speed: 2 }
          },
          size: {
            value: { min: 6, max: 18 },
            animation: { enable: true, speed: 8 }
          },
          move: {
            enable: true,
            speed: { min: 20, max: 40 },
            direction: direction,
            outModes: { default: 'destroy' },
            straight: true,
          },
          life: {
            duration: { value: 1 },
            count: 1
          },
          rotate: {
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 30 }
          },
          twinkle: {
            particles: { enable: true, frequency: 0.8, color: { value: '#fff' } }
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 10, delay: 0.04 },
          size: { width: 10, height: 25 },
          life: { duration: 0.7, count: 1 }
        }
      };

    case 'poison':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#a040a0', '#8b008b', '#9932cc', '#ba55d3', '#9400d3'] },
          shape: { type: 'circle' },
          opacity: {
            value: { min: 0.4, max: 0.8 },
            animation: { enable: true, speed: 2 }
          },
          size: {
            value: { min: 8, max: 25 },
            animation: { enable: true, speed: 6 }
          },
          move: {
            enable: true,
            speed: { min: 8, max: 20 },
            direction: direction,
            outModes: { default: 'destroy' },
            random: true,
            path: {
              enable: true,
              delay: { value: 0 }
            }
          },
          life: {
            duration: { value: 1.8 },
            count: 1
          },
          wobble: {
            enable: true,
            distance: 20,
            speed: 8
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 8, delay: 0.05 },
          size: { width: 15, height: 35 },
          life: { duration: 1, count: 1 }
        }
      };

    case 'bug':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#a8b820', '#9acd32', '#6b8e23', '#adff2f', '#7cfc00'] },
          shape: { type: ['circle', 'triangle'] },
          opacity: {
            value: { min: 0.6, max: 1 },
          },
          size: {
            value: { min: 4, max: 12 },
            animation: { enable: true, speed: 10 }
          },
          move: {
            enable: true,
            speed: { min: 15, max: 35 },
            direction: direction,
            outModes: { default: 'destroy' },
            random: true,
          },
          life: {
            duration: { value: 1.2 },
            count: 1
          },
          wobble: {
            enable: true,
            distance: 10,
            speed: 15
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 15, delay: 0.03 },
          size: { width: 12, height: 30 },
          life: { duration: 0.8, count: 1 }
        }
      };

    case 'fairy':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#ff69b4', '#ffb6c1', '#ffc0cb', '#ff1493', '#fff'] },
          shape: { 
            type: ['star', 'circle'],
            options: {
              star: { sides: 5 }
            }
          },
          opacity: {
            value: { min: 0.5, max: 1 },
            animation: { enable: true, speed: 2 }
          },
          size: {
            value: { min: 4, max: 16 },
            animation: { enable: true, speed: 8 }
          },
          move: {
            enable: true,
            speed: { min: 10, max: 25 },
            direction: direction,
            outModes: { default: 'destroy' },
            random: true,
            path: {
              enable: true,
              delay: { value: 0 }
            }
          },
          life: {
            duration: { value: 1.5 },
            count: 1
          },
          rotate: {
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 20 }
          },
          twinkle: {
            particles: { enable: true, frequency: 0.9, color: { value: '#fff' } }
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 12, delay: 0.04 },
          size: { width: 15, height: 35 },
          life: { duration: 1, count: 1 }
        }
      };

    case 'flying':
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#a890f0', '#87ceeb', '#b0e0e6', '#add8e6', '#fff'] },
          shape: { type: ['circle', 'triangle'] },
          opacity: {
            value: { min: 0.4, max: 0.8 },
            animation: { enable: true, speed: 2 }
          },
          size: {
            value: { min: 6, max: 20 },
            animation: { enable: true, speed: 8 }
          },
          move: {
            enable: true,
            speed: { min: 20, max: 45 },
            direction: direction,
            outModes: { default: 'destroy' },
            random: true,
          },
          life: {
            duration: { value: 1 },
            count: 1
          },
          wobble: {
            enable: true,
            distance: 15,
            speed: 12
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 10, delay: 0.04 },
          size: { width: 15, height: 40 },
          life: { duration: 0.7, count: 1 }
        }
      };

    default: // normal and others
      return {
        ...baseConfig,
        particles: {
          number: { value: 0 },
          color: { value: ['#a8a878', '#d3d3d3', '#c0c0c0', '#808080', '#fff'] },
          shape: { 
            type: ['star', 'circle'],
            options: {
              star: { sides: 4 }
            }
          },
          opacity: {
            value: { min: 0.6, max: 1 },
            animation: { enable: true, speed: 2 }
          },
          size: {
            value: { min: 5, max: 18 },
            animation: { enable: true, speed: 10 }
          },
          move: {
            enable: true,
            speed: { min: 15, max: 35 },
            direction: direction,
            outModes: { default: 'destroy' },
            straight: false,
          },
          life: {
            duration: { value: 1.2 },
            count: 1
          },
          rotate: {
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 20 }
          }
        },
        emitters: {
          position: { x: startX, y: startY },
          rate: { quantity: 10, delay: 0.04 },
          size: { width: 10, height: 30 },
          life: { duration: 0.8, count: 1 }
        }
      };
  }
};

// Get impact explosion configuration
const getImpactConfig = (type: PokemonType, fromPlayer: boolean) => {
  // Impact happens at the defender's body position
  // Slightly above center (45%) to match Pokemon body level
  const impactX = fromPlayer ? 78 : 22;
  const impactY = 45; // Body level
  const color = TYPE_VISUALS[type].color;

  return {
    fullScreen: false,
    fpsLimit: 120,
    detectRetina: true,
    particles: {
      number: { value: 0 },
      color: { value: [color, '#fff', '#ffd700'] },
      shape: { 
        type: ['star', 'circle'],
        options: {
          star: { sides: 4 }
        }
      },
      opacity: {
        value: { min: 0.8, max: 1 },
        animation: { enable: true, speed: 3, minimumValue: 0 }
      },
      size: {
        value: { min: 8, max: 30 },
        animation: { enable: true, speed: 15, minimumValue: 1 }
      },
      move: {
        enable: true,
        speed: { min: 10, max: 30 },
        direction: 'none' as const,
        outModes: { default: 'destroy' as const },
        random: true,
      },
      life: {
        duration: { value: 0.8 },
        count: 1
      },
      rotate: {
        value: { min: 0, max: 360 },
        animation: { enable: true, speed: 40 }
      }
    },
    emitters: {
      position: { x: impactX, y: impactY },
      rate: { quantity: 25, delay: 0 },
      size: { width: 5, height: 5 },
      life: { duration: 0.1, count: 1 }
    }
  };
};

export function AttackAnimationSystem({
  attackType,
  isActive,
  fromPlayer,
  phase,
  onPhaseComplete,
}: AttackAnimationSystemProps) {
  const [init, setInit] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const typeVisual = TYPE_VISUALS[attackType];
  const particlesKey = useRef(0);

  // Initialize particles engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Handle phase changes
  useEffect(() => {
    if (!isActive) {
      setShowParticles(false);
      setShowImpact(false);
      return;
    }

    if (phase === 'firing') {
      particlesKey.current += 1;
      setShowParticles(true);
      setShowImpact(false);
    } else if (phase === 'impact') {
      setShowParticles(false);
      particlesKey.current += 1;
      setShowImpact(true);
      
      // Auto-hide impact after animation
      setTimeout(() => {
        setShowImpact(false);
        onPhaseComplete?.();
      }, 600);
    } else {
      setShowParticles(false);
      setShowImpact(false);
    }
  }, [isActive, phase, onPhaseComplete]);

  const particleConfig = getParticleConfig(attackType, fromPlayer);
  const impactConfig = getImpactConfig(attackType, fromPlayer);

  if (!init) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Charging Effect */}
      <AnimatePresence>
        {isActive && phase === 'charging' && (
          <motion.div
            className="absolute"
            style={{
              // Charging effect at Pokemon body level (45% from top)
              left: fromPlayer ? '22%' : '78%',
              top: '45%',
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Charging rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-32 rounded-full border-4"
                style={{
                  borderColor: typeVisual.color,
                  boxShadow: `0 0 20px ${typeVisual.color}, inset 0 0 20px ${typeVisual.color}40`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: [0.5, 1.5],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.15,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            ))}
            
            {/* Central glow */}
            <motion.div
              className="absolute w-20 h-20 rounded-full"
              style={{
                background: `radial-gradient(circle, ${typeVisual.color}, transparent)`,
                boxShadow: `0 0 40px ${typeVisual.color}, 0 0 60px ${typeVisual.color}`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Attack Particles */}
      {showParticles && (
        <Particles
          key={`attack-${particlesKey.current}`}
          id={`attack-particles-${particlesKey.current}`}
          options={particleConfig as any}
          className="absolute inset-0"
        />
      )}

      {/* Beam/Laser effect for certain types */}
      <AnimatePresence>
        {isActive && phase === 'firing' && ['electric', 'psychic', 'dragon', 'ice', 'water', 'fire', 'grass'].includes(attackType) && (
          <motion.div
            className="absolute h-4 md:h-8"
            style={{
              // Beam at body level (45% from top)
              top: '45%',
              left: fromPlayer ? '24%' : 'auto',
              right: fromPlayer ? 'auto' : '24%',
              transform: 'translateY(-50%)',
              background: `linear-gradient(${fromPlayer ? '90deg' : '-90deg'}, 
                ${typeVisual.color}00, 
                ${typeVisual.color}80, 
                #fff, 
                ${typeVisual.color}80, 
                ${typeVisual.color}00)`,
              boxShadow: `0 0 30px ${typeVisual.color}, 0 0 60px ${typeVisual.color}80`,
              transformOrigin: fromPlayer ? 'left center' : 'right center',
              filter: 'blur(2px)',
            }}
            initial={{ width: '0%', opacity: 0 }}
            animate={{ 
              width: '52%', 
              opacity: [0, 1, 1, 0.8],
            }}
            exit={{ width: '0%', opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Impact Explosion Particles */}
      {showImpact && (
        <Particles
          key={`impact-${particlesKey.current}`}
          id={`impact-particles-${particlesKey.current}`}
          options={impactConfig as any}
          className="absolute inset-0"
        />
      )}

      {/* Impact Flash */}
      <AnimatePresence>
        {isActive && phase === 'impact' && (
          <>
            {/* White flash */}
            <motion.div
              className="absolute inset-0 bg-white pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.15 }}
            />
            
            {/* Impact circle - at defender's body level */}
            <motion.div
              className="absolute"
              style={{
                left: fromPlayer ? '78%' : '22%',
                top: '45%',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 3], opacity: [1, 0] }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <div
                className="w-32 h-32 rounded-full"
                style={{
                  background: `radial-gradient(circle, #fff, ${typeVisual.color}, transparent)`,
                  boxShadow: `0 0 50px ${typeVisual.color}`,
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

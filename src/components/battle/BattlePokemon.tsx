import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CombatSubPhase, PokemonType } from '@/types/battle';
import { TYPE_VISUALS } from '@/utils/battleConstants';

interface BattlePokemonProps {
  sprite: string;
  name: string;
  primaryType: PokemonType;
  isPlayer?: boolean; // Left side (back sprite) or right side (front sprite)
  combatPhase: CombatSubPhase | null;
  isAttacker: boolean;
  isDefeated: boolean;
  showAura?: boolean;
}

export function BattlePokemon({
  sprite,
  name,
  primaryType,
  isPlayer = true,
  combatPhase,
  isAttacker,
  isDefeated,
  showAura = true,
}: BattlePokemonProps) {
  const [imageError, setImageError] = useState(false);
  const typeVisual = TYPE_VISUALS[primaryType];

  // Reset image error when sprite changes
  useEffect(() => {
    setImageError(false);
  }, [sprite]);

  // Check if being hit (defender during impact)
  const isBeingHit = !isAttacker && combatPhase === 'impact';

  // Determine animation based on combat phase and role
  const getAnimation = () => {
    if (isDefeated) {
      return {
        opacity: 0,
        y: 50,
        rotate: isPlayer ? -30 : 30,
        scale: 0.5,
      };
    }

    if (isAttacker) {
      switch (combatPhase) {
        case 'charging':
          // Pull back to charge
          return {
            x: isPlayer ? -20 : 20,
            scale: 1.1,
          };
        case 'attacking':
          // Lunge forward
          return {
            x: isPlayer ? 80 : -80,
            scale: 1.15,
          };
        case 'impact':
        case 'hp_drain':
          // Return to position
          return {
            x: 0,
            scale: 1,
          };
        default:
          return { x: 0, scale: 1 };
      }
    }

    // Default position
    return { x: 0, scale: 1, opacity: 1 };
  };

  // Get transition based on animation type
  const getTransition = () => {
    if (isDefeated) {
      return {
        duration: 0.8,
        ease: 'easeOut' as const,
      };
    }

    // Use tween for most animations
    return {
      type: 'tween' as const,
      duration: 0.25,
      ease: 'easeOut' as const,
    };
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        isPlayer ? 'self-end' : 'self-start'
      )}
    >
      {/* Type-based aura effect */}
      <AnimatePresence>
        {showAura && isAttacker && combatPhase === 'charging' && (
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            style={{
              background: typeVisual.gradient,
              opacity: 0.6,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0.6 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Pokemon sprite container */}
      <motion.div
        className={cn(
          'relative z-10',
          isPlayer ? 'w-32 h-32 md:w-40 md:h-40' : 'w-28 h-28 md:w-36 md:h-36',
          // CSS animation for shake effect (avoids Framer Motion keyframe issue)
          isBeingHit && 'animate-shake'
        )}
        animate={getAnimation()}
        transition={getTransition()}
      >
        {/* Shadow beneath Pokemon */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/30 rounded-full blur-sm"
          animate={{
            scaleX: isDefeated ? 0 : 1,
            opacity: isDefeated ? 0 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Pokemon image */}
        <motion.img
          src={imageError ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${isPlayer ? 'back/' : ''}${name}.png` : sprite}
          alt={name}
          className={cn(
            'w-full h-full object-contain',
            'drop-shadow-lg',
            isBeingHit && 'brightness-150'
          )}
          style={{
            imageRendering: 'pixelated',
            filter: isDefeated ? 'grayscale(100%)' : undefined,
          }}
          onError={() => setImageError(true)}
          draggable={false}
        />

        {/* Hit flash overlay */}
        <AnimatePresence>
          {isBeingHit && !isDefeated && (
            <motion.div
              className="absolute inset-0 bg-white/60 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

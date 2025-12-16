import { motion, AnimatePresence } from 'framer-motion';
import { TypeEffectiveness } from '@/types/battle';
import { cn } from '@/lib/utils';

interface DamageNumberProps {
  damage: number;
  effectiveness: TypeEffectiveness;
  isCritical: boolean;
  isVisible: boolean;
  position: 'left' | 'right';
}

export function DamageNumber({
  damage,
  effectiveness,
  isCritical,
  isVisible,
  position,
}: DamageNumberProps) {
  const getColor = () => {
    if (effectiveness === 'super_effective') return 'text-green-400';
    if (effectiveness === 'not_effective') return 'text-gray-400';
    if (effectiveness === 'immune') return 'text-gray-500';
    return 'text-white';
  };

  const getText = () => {
    if (effectiveness === 'immune') return 'IMMUNE';
    return damage.toString();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={`damage-${damage}-${Date.now()}`}
          className={cn(
            'absolute z-30 font-bold text-2xl md:text-4xl',
            'drop-shadow-lg',
            getColor(),
            position === 'left' ? 'left-1/4' : 'right-1/4'
          )}
          initial={{ 
            y: 0, 
            opacity: 0,
            scale: 0.5,
          }}
          animate={{ 
            y: -60,
            opacity: 1,
            scale: isCritical ? 1.5 : 1.2,
          }}
          exit={{ 
            opacity: 0,
            y: -80,
          }}
          transition={{ 
            type: 'tween',
            duration: 0.5,
            ease: 'easeOut',
          }}
          style={{
            top: '40%',
            textShadow: isCritical 
              ? '0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5)'
              : '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {isCritical && (
            <motion.span
              className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm md:text-base text-yellow-400 whitespace-nowrap"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: 'tween' }}
            >
              CRITICAL!
            </motion.span>
          )}
          {getText()}
          {effectiveness === 'super_effective' && (
            <motion.span
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs md:text-sm text-green-400 whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, type: 'tween' }}
            >
              Super effective!
            </motion.span>
          )}
          {effectiveness === 'not_effective' && (
            <motion.span
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs md:text-sm text-gray-400 whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, type: 'tween' }}
            >
              Not very effective...
            </motion.span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

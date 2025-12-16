import { motion, AnimatePresence } from 'framer-motion';
import { PokemonType } from '@/types/battle';
import { TYPE_VISUALS } from '@/utils/battleConstants';

interface AttackAnimationProps {
  attackType: PokemonType;
  isActive: boolean;
  fromPlayer: boolean; // Attack originates from player (left) side
}

export function AttackAnimation({
  attackType,
  isActive,
  fromPlayer,
}: AttackAnimationProps) {
  const typeVisual = TYPE_VISUALS[attackType];
  const animationType = typeVisual.attackAnimation;

  // Starting and ending positions based on direction
  const startX = fromPlayer ? '-20%' : '120%';
  const endX = fromPlayer ? '120%' : '-20%';

  const renderProjectile = () => (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full"
      style={{
        background: typeVisual.gradient,
        boxShadow: `0 0 20px ${typeVisual.color}, 0 0 40px ${typeVisual.color}`,
      }}
      initial={{ x: startX, scale: 0.5, opacity: 0 }}
      animate={{ x: endX, scale: 1, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    />
  );

  const renderBeam = () => (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 h-4 md:h-6"
      style={{
        background: `linear-gradient(${fromPlayer ? '90deg' : '270deg'}, ${typeVisual.color}00, ${typeVisual.color}, ${typeVisual.color}00)`,
        boxShadow: `0 0 15px ${typeVisual.color}`,
      }}
      initial={{ 
        left: fromPlayer ? '10%' : 'auto',
        right: fromPlayer ? 'auto' : '10%',
        width: '0%',
        opacity: 0 
      }}
      animate={{ 
        width: '80%',
        opacity: [0, 1, 1, 0] 
      }}
      transition={{ duration: 0.5, times: [0, 0.2, 0.8, 1] }}
    />
  );

  const renderWave = () => (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2"
      style={{
        left: fromPlayer ? '30%' : 'auto',
        right: fromPlayer ? 'auto' : '30%',
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-16 md:w-24 md:h-24 rounded-full border-4"
          style={{
            borderColor: typeVisual.color,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ 
            scale: [0.5, 2.5],
            opacity: [1, 0],
            x: fromPlayer ? [0, 100] : [0, -100],
          }}
          transition={{ 
            duration: 0.6,
            delay: i * 0.1,
            ease: 'easeOut',
          }}
        />
      ))}
    </motion.div>
  );

  const renderStrike = () => (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2"
      style={{
        left: fromPlayer ? 'auto' : '25%',
        right: fromPlayer ? '25%' : 'auto',
      }}
    >
      {/* Impact lines */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <motion.div
          key={angle}
          className="absolute w-1 h-8 md:h-12 origin-bottom"
          style={{
            background: typeVisual.color,
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'center center',
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </motion.div>
  );

  const renderSpecial = () => (
    <motion.div className="absolute inset-0 pointer-events-none">
      {/* Sparkles/stars for fairy type */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 md:w-3 md:h-3"
          style={{
            background: typeVisual.color,
            borderRadius: '50%',
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            boxShadow: `0 0 10px ${typeVisual.color}`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ 
            duration: 0.6,
            delay: i * 0.05,
          }}
        />
      ))}
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {animationType === 'projectile' && renderProjectile()}
          {animationType === 'beam' && renderBeam()}
          {animationType === 'wave' && renderWave()}
          {animationType === 'strike' && renderStrike()}
          {animationType === 'special' && renderSpecial()}
        </div>
      )}
    </AnimatePresence>
  );
}

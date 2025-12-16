import { motion } from 'framer-motion';
import { PokemonType } from '@/types/battle';
import { ARENA_BACKGROUNDS } from '@/utils/battleConstants';
import { useMemo } from 'react';

interface BattleBackgroundProps {
  pokemon1Type: PokemonType;
  pokemon2Type: PokemonType;
  isActive: boolean;
}

export function BattleBackground({
  pokemon1Type,
  pokemon2Type,
  isActive,
}: BattleBackgroundProps) {
  // Blend the two Pokemon's arena backgrounds
  const arena1 = ARENA_BACKGROUNDS[pokemon1Type];
  const arena2 = ARENA_BACKGROUNDS[pokemon2Type];

  // Generate particles based on type
  const particles = useMemo(() => {
    const particleTypes = [arena1.particleType, arena2.particleType];
    const colors = [arena1.ambientColor, arena2.ambientColor];
    
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      type: particleTypes[i % 2],
      color: colors[i % 2],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 8,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }));
  }, [arena1, arena2]);

  const renderParticle = (particle: typeof particles[0]) => {
    const baseStyle = {
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: particle.size,
      height: particle.size,
    };

    switch (particle.type) {
      case 'fire':
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              ...baseStyle,
              background: 'radial-gradient(circle, #ff6b35 0%, #ff4500 50%, transparent 70%)',
            }}
            animate={{
              y: [0, -100, -200],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        );
      
      case 'water':
      case 'bubbles':
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full border border-blue-300/50"
            style={{
              ...baseStyle,
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(100,180,255,0.3))',
            }}
            animate={{
              y: [0, -80],
              x: [0, Math.sin(particle.id) * 20],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        );

      case 'leaves':
        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              ...baseStyle,
              background: '#5fbd58',
              borderRadius: '0 50% 50% 50%',
            }}
            animate={{
              y: [0, 100],
              x: [0, Math.sin(particle.id * 2) * 50],
              rotate: [0, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration * 1.5,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        );

      case 'sparks':
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              ...baseStyle,
              background: '#f8d030',
              boxShadow: '0 0 10px #f8d030',
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              delay: particle.delay,
              repeatDelay: particle.duration,
            }}
          />
        );

      case 'snow':
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white"
            style={baseStyle}
            animate={{
              y: [0, 150],
              x: [0, Math.sin(particle.id) * 30],
              opacity: [0, 1, 0.5],
            }}
            transition={{
              duration: particle.duration * 2,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        );

      case 'stars':
        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              ...baseStyle,
              background: 'white',
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        );

      case 'shadows':
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              ...baseStyle,
              background: 'radial-gradient(circle, rgba(80,50,120,0.6) 0%, transparent 70%)',
              width: particle.size * 3,
              height: particle.size * 3,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
              x: [0, 20, 0],
            }}
            transition={{
              duration: particle.duration * 2,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        );

      case 'sparkles':
        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              ...baseStyle,
              background: '#ff69b4',
              borderRadius: '50%',
              boxShadow: '0 0 10px #ff69b4, 0 0 20px #ff1493',
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: particle.delay,
              repeatDelay: particle.duration,
            }}
          />
        );

      case 'dust':
      default:
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-amber-200/50"
            style={baseStyle}
            animate={{
              y: [0, -30, 0],
              x: [0, 10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration * 2,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        );
    }
  };

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient - blend between both Pokemon types */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, ${arena1.gradient.replace('linear-gradient(180deg,', '').replace(')', '')}, ${arena2.gradient.replace('linear-gradient(180deg,', '').replace(')', '')})`,
        }}
      />

      {/* Overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(renderParticle)}
      </div>

      {/* Battle platform/ground indication */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
          }}
        />
      </div>
    </motion.div>
  );
}

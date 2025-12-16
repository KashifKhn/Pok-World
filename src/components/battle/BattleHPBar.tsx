import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BattleHPBarProps {
  currentHP: number;
  maxHP: number;
  pokemonName: string;
  isPlayer?: boolean; // Left side (player's view) or right side (opponent)
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BattleHPBar({
  currentHP,
  maxHP,
  pokemonName,
  isPlayer = true,
  showLabel = true,
  size = 'md',
}: BattleHPBarProps) {
  const percentage = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));

  // Color transitions: green -> yellow -> orange -> red
  const getBarColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    if (percentage > 10) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getGlowColor = () => {
    if (percentage > 50) return 'shadow-green-500/50';
    if (percentage > 25) return 'shadow-yellow-500/50';
    if (percentage > 10) return 'shadow-orange-500/50';
    return 'shadow-red-500/50';
  };

  const sizeClasses = {
    sm: { bar: 'h-2', text: 'text-xs', container: 'w-32' },
    md: { bar: 'h-3', text: 'text-sm', container: 'w-48' },
    lg: { bar: 'h-4', text: 'text-base', container: 'w-64' },
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-1',
        sizeClasses[size].container,
        isPlayer ? 'items-start' : 'items-end'
      )}
    >
      {/* Pokemon name and HP text */}
      {showLabel && (
        <div
          className={cn(
            'flex w-full justify-between items-center',
            sizeClasses[size].text,
            'font-semibold'
          )}
        >
          <span className="capitalize text-foreground truncate max-w-[60%]">
            {pokemonName}
          </span>
          <span className="text-muted-foreground tabular-nums">
            {Math.ceil(currentHP)}/{maxHP}
          </span>
        </div>
      )}

      {/* HP Bar container */}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden',
          sizeClasses[size].bar,
          'bg-gray-800/80 border border-gray-700'
        )}
      >
        {/* Animated HP bar */}
        <motion.div
          className={cn(
            'h-full rounded-full',
            getBarColor(),
            'shadow-lg',
            getGlowColor()
          )}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.4,
            ease: 'easeOut',
          }}
        />
      </div>

      {/* HP label */}
      <div
        className={cn(
          'text-[10px] font-bold tracking-wider text-muted-foreground uppercase',
          isPlayer ? 'self-start' : 'self-end'
        )}
      >
        HP
      </div>
    </div>
  );
}

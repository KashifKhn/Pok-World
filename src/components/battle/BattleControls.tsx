import { motion } from 'framer-motion';
import { Play, FastForward, SkipForward, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BattleSpeed } from '@/types/battle';
import { cn } from '@/lib/utils';

interface BattleControlsProps {
  speed: BattleSpeed;
  isPaused: boolean;
  isBattleActive: boolean;
  audioEnabled: boolean;
  onSpeedChange: (speed: BattleSpeed) => void;
  onSkip: () => void;
  onPause: () => void;
  onResume: () => void;
  onToggleAudio: () => void;
}

export function BattleControls({
  speed,
  isPaused,
  isBattleActive,
  audioEnabled,
  onSpeedChange,
  onSkip,
  onPause,
  onResume,
  onToggleAudio,
}: BattleControlsProps) {
  if (!isBattleActive) return null;

  return (
    <motion.div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm border border-gray-700">
        {/* Pause/Resume button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:text-yellow-400"
          onClick={isPaused ? onResume : onPause}
        >
          {isPaused ? (
            <Play className="h-4 w-4" />
          ) : (
            <Pause className="h-4 w-4" />
          )}
        </Button>

        {/* Speed controls */}
        <div className="flex items-center gap-1 px-2 border-l border-gray-600">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 px-2 text-xs font-bold',
              speed === 1 ? 'text-yellow-400 bg-yellow-400/20' : 'text-gray-400'
            )}
            onClick={() => onSpeedChange(1)}
          >
            1x
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 px-2 text-xs font-bold',
              speed === 2 ? 'text-yellow-400 bg-yellow-400/20' : 'text-gray-400'
            )}
            onClick={() => onSpeedChange(2)}
          >
            <FastForward className="h-3 w-3 mr-1" />
            2x
          </Button>
        </div>

        {/* Skip button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:text-yellow-400 border-l border-gray-600 rounded-none pl-3"
          onClick={onSkip}
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        {/* Audio toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:text-yellow-400 border-l border-gray-600 rounded-none pl-3"
          onClick={onToggleAudio}
        >
          {audioEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
      </div>
    </motion.div>
  );
}

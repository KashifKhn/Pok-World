import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Swords, Zap, Target } from 'lucide-react';
import { BattleResult } from '@/types/battle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface VictoryOverlayProps {
  result: BattleResult | null;
  isVisible: boolean;
  winnerSprite: string;
  loserSprite: string;
  onPlayAgain: () => void;
  onClose: () => void;
}

export function VictoryOverlay({
  result,
  isVisible,
  winnerSprite,
  loserSprite,
  onPlayAgain,
  onClose,
}: VictoryOverlayProps) {
  // Trigger confetti on victory
  useEffect(() => {
    if (isVisible && result) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isVisible, result]);

  if (!result) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-lg mx-4 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-2xl"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* Victory header */}
            <motion.div
              className="text-center mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Trophy className="w-12 h-12 mx-auto text-yellow-400 mb-2" />
              <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">
                VICTORY!
              </h2>
            </motion.div>

            {/* Winner display */}
            <motion.div
              className="flex flex-col items-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <img
                  src={winnerSprite}
                  alt={result.winnerName}
                  className="w-32 h-32 md:w-40 md:h-40 relative z-10 drop-shadow-lg"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <h3 className="text-xl md:text-2xl font-bold capitalize mt-2 text-foreground">
                {result.winnerName}
              </h3>
              <span className="text-sm text-muted-foreground">is the winner!</span>
            </motion.div>

            {/* Battle stats */}
            <motion.div
              className="grid grid-cols-2 gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Swords className="w-4 h-4" />
                  <span>Total Rounds</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{result.totalRounds}</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Zap className="w-4 h-4" />
                  <span>Critical Hits</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {result.criticalHits.pokemon1 + result.criticalHits.pokemon2}
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Target className="w-4 h-4" />
                  <span>Super Effective</span>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {result.superEffectiveHits.pokemon1 + result.superEffectiveHits.pokemon2}
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span className="text-lg">💥</span>
                  <span>Total Damage</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {result.totalDamageDealt.pokemon1 + result.totalDamageDealt.pokemon2}
                </p>
              </div>
            </motion.div>

            {/* Loser display */}
            <motion.div
              className="flex items-center justify-center gap-3 mb-6 py-3 border-t border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <img
                src={loserSprite}
                alt={result.loserName}
                className="w-12 h-12 grayscale opacity-50"
                style={{ imageRendering: 'pixelated' }}
              />
              <span className="text-sm text-muted-foreground">
                <span className="capitalize">{result.loserName}</span> fainted
              </span>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={onPlayAgain}
                className={cn(
                  'flex-1 bg-gradient-to-r from-yellow-500 to-orange-500',
                  'hover:from-yellow-400 hover:to-orange-400',
                  'text-white font-bold'
                )}
              >
                Battle Again
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                New Matchup
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

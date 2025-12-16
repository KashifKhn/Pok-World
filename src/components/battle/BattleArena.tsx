import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BattleBackground } from './BattleBackground';
import { BattlePokemon } from './BattlePokemon';
import { BattleHPBar } from './BattleHPBar';
import { AttackAnimation } from './AttackAnimation';
import { DamageNumber } from './DamageNumber';
import { VictoryOverlay } from './VictoryOverlay';
import { BattleControls } from './BattleControls';
import { useBattleSimulation } from '@/hooks/useBattleSimulation';
import { useBattleHistory } from '@/hooks/useBattleHistory';
import { BattleResult, PokemonType } from '@/types/battle';
import { TYPE_VISUALS, POKEMON_SPRITES } from '@/utils/battleConstants';
import { getPrimaryType } from '@/utils/typeEffectiveness';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BattleArenaProps {
  pokemon1Data: any;
  pokemon2Data: any;
  onBattleComplete: (result: BattleResult) => void;
  onClose: () => void;
}

export function BattleArena({
  pokemon1Data,
  pokemon2Data,
  onBattleComplete,
  onClose,
}: BattleArenaProps) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { addBattle } = useBattleHistory();

  const handleBattleComplete = (result: BattleResult) => {
    addBattle(result, pokemon1Data, pokemon2Data);
    onBattleComplete(result);
  };

  const {
    state,
    startBattle,
    setSpeed,
    skipToEnd,
    reset,
    pause,
    resume,
  } = useBattleSimulation({
    pokemon1Data,
    pokemon2Data,
    onBattleComplete: handleBattleComplete,
    audioEnabled,
  });

  // Start battle automatically when arena mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      startBattle();
    }, 500);
    return () => clearTimeout(timer);
  }, [startBattle]);

  // Get Pokemon types
  const pokemon1Types: PokemonType[] = pokemon1Data.types.map((t: any) => t.type.name);
  const pokemon2Types: PokemonType[] = pokemon2Data.types.map((t: any) => t.type.name);
  const pokemon1PrimaryType = getPrimaryType(pokemon1Types);
  const pokemon2PrimaryType = getPrimaryType(pokemon2Types);

  // Determine if showing attack animation
  const showAttack = state.combatSubPhase === 'attacking' || state.combatSubPhase === 'impact';
  
  // Determine if showing damage number
  const showDamage = state.combatSubPhase === 'impact' || state.combatSubPhase === 'hp_drain';

  // Check if either Pokemon is defeated
  const pokemon1Defeated = state.pokemon1HP <= 0 && state.phase === 'knockout';
  const pokemon2Defeated = state.pokemon2HP <= 0 && state.phase === 'knockout';

  // Battle active phases
  const isBattleActive = ['preparing', 'arena_enter', 'combat', 'knockout', 'victory'].includes(state.phase);
  const showArena = state.phase !== 'idle' && state.phase !== 'complete';

  const handlePlayAgain = () => {
    reset();
    setTimeout(() => {
      startBattle();
    }, 100);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background */}
      <BattleBackground
        pokemon1Type={pokemon1PrimaryType}
        pokemon2Type={pokemon2PrimaryType}
        isActive={showArena}
      />

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Battle content */}
      <div className="relative h-full w-full flex flex-col">
        {/* Phase indicator */}
        <AnimatePresence mode="wait">
          {state.phase === 'preparing' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ type: 'spring', damping: 10 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg animate-pulse">
                GET READY!
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main battle area */}
        <div className="flex-1 relative px-4 md:px-8 pt-16 pb-20">
          {/* HP Bars */}
          <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
            {/* Pokemon 1 HP (left/player side) */}
            <AnimatePresence>
              {state.phase !== 'idle' && state.phase !== 'preparing' && (
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <BattleHPBar
                    currentHP={state.pokemon1HP}
                    maxHP={state.pokemon1MaxHP}
                    pokemonName={pokemon1Data.name}
                    isPlayer={true}
                    size="md"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pokemon 2 HP (right/opponent side) */}
            <AnimatePresence>
              {state.phase !== 'idle' && state.phase !== 'preparing' && (
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <BattleHPBar
                    currentHP={state.pokemon2HP}
                    maxHP={state.pokemon2MaxHP}
                    pokemonName={pokemon2Data.name}
                    isPlayer={false}
                    size="md"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pokemon battle field */}
          <div className="absolute inset-0 flex items-center justify-between px-8 md:px-16 lg:px-32">
            {/* Pokemon 1 (left side - shows back) */}
            <AnimatePresence>
              {state.phase !== 'idle' && (
                <motion.div
                  className="relative"
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -200, opacity: 0 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                >
                  <BattlePokemon
                    sprite={POKEMON_SPRITES.back(pokemon1Data.id)}
                    name={pokemon1Data.name}
                    primaryType={pokemon1PrimaryType}
                    isPlayer={true}
                    combatPhase={state.combatSubPhase}
                    isAttacker={state.currentAttacker === 1}
                    isDefeated={pokemon1Defeated}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pokemon 2 (right side - shows front) */}
            <AnimatePresence>
              {state.phase !== 'idle' && (
                <motion.div
                  className="relative"
                  initial={{ x: 200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 200, opacity: 0 }}
                  transition={{ delay: 0.4, type: 'spring', damping: 15 }}
                >
                  <BattlePokemon
                    sprite={POKEMON_SPRITES.front(pokemon2Data.id)}
                    name={pokemon2Data.name}
                    primaryType={pokemon2PrimaryType}
                    isPlayer={false}
                    combatPhase={state.combatSubPhase}
                    isAttacker={state.currentAttacker === 2}
                    isDefeated={pokemon2Defeated}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Attack animation */}
          <AttackAnimation
            attackType={state.lastAttackType || pokemon1PrimaryType}
            isActive={showAttack && state.currentAttacker !== null}
            fromPlayer={state.currentAttacker === 1}
          />

          {/* Damage numbers */}
          <DamageNumber
            damage={state.lastDamage}
            effectiveness={state.lastEffectiveness || 'normal'}
            isCritical={state.lastIsCritical}
            isVisible={showDamage}
            position={state.currentAttacker === 1 ? 'right' : 'left'}
          />

          {/* Round indicator */}
          <AnimatePresence>
            {state.combatSubPhase === 'turn_start' && state.round > 0 && (
              <motion.div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 z-30"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <span className="text-lg md:text-xl font-bold text-white/80 bg-black/40 px-4 py-2 rounded-full">
                  Round {state.round}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Attack name display */}
          <AnimatePresence>
            {state.combatSubPhase === 'charging' && state.lastAttackType && (
              <motion.div
                className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
              >
                <span
                  className="text-xl md:text-2xl font-bold px-6 py-2 rounded-full"
                  style={{
                    background: TYPE_VISUALS[state.lastAttackType].gradient,
                    color: 'white',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {TYPE_VISUALS[state.lastAttackType].attackName}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Battle controls */}
        <BattleControls
          speed={state.speed}
          isPaused={state.isPaused}
          isBattleActive={isBattleActive && state.phase !== 'victory' && state.phase !== 'knockout'}
          audioEnabled={audioEnabled}
          onSpeedChange={setSpeed}
          onSkip={skipToEnd}
          onPause={pause}
          onResume={resume}
          onToggleAudio={() => setAudioEnabled(!audioEnabled)}
        />

        {/* Victory overlay */}
        <VictoryOverlay
          result={state.result}
          isVisible={state.phase === 'complete'}
          winnerSprite={
            state.winner === 1
              ? POKEMON_SPRITES.official(pokemon1Data.id)
              : POKEMON_SPRITES.official(pokemon2Data.id)
          }
          loserSprite={
            state.winner === 1
              ? POKEMON_SPRITES.front(pokemon2Data.id)
              : POKEMON_SPRITES.front(pokemon1Data.id)
          }
          onPlayAgain={handlePlayAgain}
          onClose={onClose}
        />
      </div>
    </motion.div>
  );
}

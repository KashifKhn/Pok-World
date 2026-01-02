import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BattleBackground } from './BattleBackground';
import { BattlePokemon } from './BattlePokemon';
import { BattleHPBar } from './BattleHPBar';
import { AttackAnimationSystem } from './AttackAnimationSystem';
import { DamageNumber } from './DamageNumber';
import { VictoryOverlay } from './VictoryOverlay';
import { BattleControls } from './BattleControls';
import { useBattleSimulation } from '@/hooks/useBattleSimulation';
import { useBattleHistory } from '@/hooks/useBattleHistory';
import { useScreenEffects } from '@/hooks/useScreenEffects';
import { BattleResult, PokemonType } from '@/types/battle';
import { TYPE_VISUALS, POKEMON_SPRITES } from '@/utils/battleConstants';
import { getPrimaryType } from '@/utils/typeEffectiveness';
import { X, Swords } from 'lucide-react';
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
  const [showFightIntro, setShowFightIntro] = useState(false);
  const { addBattle } = useBattleHistory();
  
  // Screen effects for shake/flash
  const {
    effects,
    triggerImpact,
    triggerCriticalHit,
    triggerSuperEffective,
    triggerNotEffective,
    getShakeStyle,
  } = useScreenEffects();

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

  // Show "FIGHT!" intro when arena_enter phase starts
  useEffect(() => {
    if (state.phase === 'arena_enter') {
      setShowFightIntro(true);
      const timer = setTimeout(() => setShowFightIntro(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [state.phase]);

  // Trigger screen effects based on combat phase and effectiveness
  useEffect(() => {
    if (state.combatSubPhase === 'impact') {
      const typeColor = state.lastAttackType ? TYPE_VISUALS[state.lastAttackType].color : '#fff';
      
      if (state.lastIsCritical) {
        triggerCriticalHit(typeColor);
      } else if (state.lastEffectiveness === 'super_effective') {
        triggerSuperEffective(typeColor);
      } else if (state.lastEffectiveness === 'not_effective') {
        triggerNotEffective();
      } else {
        triggerImpact('medium', typeColor);
      }
    }
  }, [state.combatSubPhase, state.lastIsCritical, state.lastEffectiveness, state.lastAttackType, triggerCriticalHit, triggerSuperEffective, triggerNotEffective, triggerImpact]);

  // Get Pokemon types
  const pokemon1Types: PokemonType[] = pokemon1Data.types.map((t: any) => t.type.name);
  const pokemon2Types: PokemonType[] = pokemon2Data.types.map((t: any) => t.type.name);
  const pokemon1PrimaryType = getPrimaryType(pokemon1Types);
  const pokemon2PrimaryType = getPrimaryType(pokemon2Types);

  // Map combat sub-phases to animation phases
  const getAnimationPhase = useMemo(() => {
    switch (state.combatSubPhase) {
      case 'charging':
        return 'charging';
      case 'attacking':
        return 'firing';
      case 'impact':
        return 'impact';
      default:
        return 'idle';
    }
  }, [state.combatSubPhase]);

  // Determine if showing attack animation
  const showAttack = ['charging', 'attacking', 'impact'].includes(state.combatSubPhase || '');
  
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
      className="fixed inset-0 z-50 bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={getShakeStyle()}
    >
      {/* Background */}
      <BattleBackground
        pokemon1Type={pokemon1PrimaryType}
        pokemon2Type={pokemon2PrimaryType}
        isActive={showArena}
      />

      {/* Screen Flash Effect */}
      <AnimatePresence>
        {effects.isFlashing && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-[100]"
            style={{ backgroundColor: effects.flashColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Battle Arena Badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40">
        <motion.div
          className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Swords className="w-4 h-4 text-red-500" />
          <span className="text-white text-sm font-bold tracking-wider">BATTLE ARENA</span>
          <Swords className="w-4 h-4 text-red-500" />
        </motion.div>
      </div>

      {/* Battle content */}
      <div className="relative h-full w-full flex flex-col">
        {/* Phase indicator - GET READY */}
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

        {/* FIGHT! Intro Overlay */}
        <AnimatePresence>
          {showFightIntro && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: [0, 1.3, 1], rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'backOut' }}
              >
                <h1 
                  className="text-6xl md:text-8xl font-black tracking-wider"
                  style={{
                    color: '#fff',
                    textShadow: '0 0 20px #ff0000, 0 0 40px #ff0000, 0 0 60px #ff0000, 2px 2px 0 #000',
                  }}
                >
                  FIGHT!
                </h1>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main battle area */}
        <div className="flex-1 relative px-4 md:px-8 pt-20 pb-24">
          {/* HP Bars */}
          <div className="absolute top-16 left-4 right-4 flex justify-between z-20">
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

          {/* Round Counter */}
          <AnimatePresence>
            {state.phase === 'combat' && state.round > 0 && (
              <motion.div
                className="absolute top-16 left-1/2 -translate-x-1/2 z-30"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <span className="text-sm font-bold text-white/90 bg-gradient-to-r from-purple-600/80 to-pink-600/80 px-4 py-1.5 rounded-full shadow-lg">
                  Round {state.round}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pokemon battle field - Classic Pokemon battle layout */}
          <div className="absolute inset-0 flex items-center justify-between px-8 md:px-16 lg:px-24">
            {/* Pokemon 1 (left side - player's Pokemon, shows back) */}
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

            {/* Pokemon 2 (right side - opponent's Pokemon, shows front) */}
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

          {/* New Attack Animation System */}
          <AttackAnimationSystem
            attackType={state.lastAttackType || pokemon1PrimaryType}
            isActive={showAttack && state.currentAttacker !== null}
            fromPlayer={state.currentAttacker === 1}
            phase={getAnimationPhase as 'idle' | 'charging' | 'firing' | 'impact'}
          />

          {/* Damage numbers */}
          <DamageNumber
            damage={state.lastDamage}
            effectiveness={state.lastEffectiveness || 'normal'}
            isCritical={state.lastIsCritical}
            isVisible={showDamage}
            position={state.currentAttacker === 1 ? 'right' : 'left'}
          />

          {/* Attack name display */}
          <AnimatePresence>
            {state.combatSubPhase === 'charging' && state.lastAttackType && (
              <motion.div
                className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30"
                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  {/* Glow effect behind */}
                  <div 
                    className="absolute inset-0 blur-xl opacity-60 rounded-full"
                    style={{ background: TYPE_VISUALS[state.lastAttackType].gradient }}
                  />
                  <span
                    className="relative text-xl md:text-2xl font-black px-6 py-2 rounded-full uppercase tracking-wider"
                    style={{
                      background: TYPE_VISUALS[state.lastAttackType].gradient,
                      color: 'white',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      boxShadow: `0 0 20px ${TYPE_VISUALS[state.lastAttackType].color}80`,
                    }}
                  >
                    {TYPE_VISUALS[state.lastAttackType].attackName}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Effectiveness indicator */}
          <AnimatePresence>
            {state.combatSubPhase === 'impact' && state.lastEffectiveness && state.lastEffectiveness !== 'normal' && (
              <motion.div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 z-40"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span
                  className={`text-lg md:text-xl font-bold px-4 py-2 rounded-lg ${
                    state.lastEffectiveness === 'super_effective'
                      ? 'bg-green-500/90 text-white'
                      : state.lastEffectiveness === 'not_effective'
                      ? 'bg-gray-500/90 text-white'
                      : 'bg-red-500/90 text-white'
                  }`}
                  style={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {state.lastEffectiveness === 'super_effective' && "It's super effective!"}
                  {state.lastEffectiveness === 'not_effective' && "It's not very effective..."}
                  {state.lastEffectiveness === 'immune' && "It doesn't affect them!"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Critical hit indicator */}
          <AnimatePresence>
            {state.combatSubPhase === 'impact' && state.lastIsCritical && (
              <motion.div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 z-40"
                initial={{ scale: 0, rotate: -10, opacity: 0 }}
                animate={{ scale: [0, 1.3, 1], rotate: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span
                  className="text-2xl md:text-3xl font-black text-yellow-400 px-4 py-2"
                  style={{
                    textShadow: '0 0 10px #ffd700, 0 0 20px #ffd700, 2px 2px 0 #000',
                  }}
                >
                  CRITICAL HIT!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Battle controls - Glassmorphism bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/10 px-4 py-3">
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
        </div>

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

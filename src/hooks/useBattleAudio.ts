import { useCallback, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import { BATTLE_AUDIO, POKEMON_CRY_URL } from '@/utils/battleConstants';

interface AudioCache {
  [key: string]: Howl | null;
}

interface UseBattleAudioReturn {
  playSound: (sound: keyof typeof BATTLE_AUDIO) => void;
  playCry: (pokemonId: number) => void;
  stopAll: () => void;
  setVolume: (volume: number) => void;
  preloadSounds: () => void;
}

export function useBattleAudio(enabled: boolean = true): UseBattleAudioReturn {
  const audioCache = useRef<AudioCache>({});
  const cryCache = useRef<AudioCache>({});
  const volumeRef = useRef(0.5);
  const enabledRef = useRef(enabled);

  // Keep enabled ref in sync
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  // Preload all battle sounds
  const preloadSounds = useCallback(() => {
    if (!enabledRef.current) return;

    Object.entries(BATTLE_AUDIO).forEach(([key, url]) => {
      if (!audioCache.current[key]) {
        try {
          audioCache.current[key] = new Howl({
            src: [url],
            volume: volumeRef.current,
            preload: true,
            onloaderror: () => {
              console.warn(`Failed to load audio: ${url}`);
              audioCache.current[key] = null;
            },
          });
        } catch (e) {
          console.warn(`Error creating Howl for ${url}:`, e);
          audioCache.current[key] = null;
        }
      }
    });
  }, []);

  // Play a battle sound effect
  const playSound = useCallback((sound: keyof typeof BATTLE_AUDIO) => {
    if (!enabledRef.current) return;

    const cached = audioCache.current[sound];
    if (cached) {
      cached.volume(volumeRef.current);
      cached.play();
      return;
    }

    // Try to load and play on demand
    const url = BATTLE_AUDIO[sound];
    if (url) {
      try {
        const howl = new Howl({
          src: [url],
          volume: volumeRef.current,
          onload: () => {
            howl.play();
          },
          onloaderror: () => {
            console.warn(`Failed to load audio: ${url}`);
          },
        });
        audioCache.current[sound] = howl;
      } catch (e) {
        console.warn(`Error playing ${sound}:`, e);
      }
    }
  }, []);

  // Play a Pokémon cry
  const playCry = useCallback((pokemonId: number) => {
    if (!enabledRef.current) return;

    const cryKey = `cry_${pokemonId}`;
    const cached = cryCache.current[cryKey];
    
    if (cached) {
      cached.volume(volumeRef.current);
      cached.play();
      return;
    }

    // Load and play the cry
    const cryUrl = POKEMON_CRY_URL(pokemonId);
    try {
      const howl = new Howl({
        src: [cryUrl],
        volume: volumeRef.current,
        format: ['ogg'],
        onload: () => {
          howl.play();
        },
        onloaderror: () => {
          console.warn(`Failed to load cry for Pokemon #${pokemonId}`);
        },
      });
      cryCache.current[cryKey] = howl;
    } catch (e) {
      console.warn(`Error playing cry for Pokemon #${pokemonId}:`, e);
    }
  }, []);

  // Stop all sounds
  const stopAll = useCallback(() => {
    Object.values(audioCache.current).forEach((howl) => {
      if (howl) {
        howl.stop();
      }
    });
    Object.values(cryCache.current).forEach((howl) => {
      if (howl) {
        howl.stop();
      }
    });
  }, []);

  // Set volume for all sounds
  const setVolume = useCallback((volume: number) => {
    volumeRef.current = Math.max(0, Math.min(1, volume));
    
    Object.values(audioCache.current).forEach((howl) => {
      if (howl) {
        howl.volume(volumeRef.current);
      }
    });
    Object.values(cryCache.current).forEach((howl) => {
      if (howl) {
        howl.volume(volumeRef.current);
      }
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(audioCache.current).forEach((howl) => {
        if (howl) {
          howl.unload();
        }
      });
      Object.values(cryCache.current).forEach((howl) => {
        if (howl) {
          howl.unload();
        }
      });
    };
  }, []);

  return {
    playSound,
    playCry,
    stopAll,
    setVolume,
    preloadSounds,
  };
}

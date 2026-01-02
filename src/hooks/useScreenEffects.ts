import { useState, useCallback, useRef } from 'react';

interface ScreenEffects {
  isShaking: boolean;
  shakeIntensity: 'light' | 'medium' | 'heavy' | 'critical';
  isFlashing: boolean;
  flashColor: string;
  isDimmed: boolean;
}

export function useScreenEffects() {
  const [effects, setEffects] = useState<ScreenEffects>({
    isShaking: false,
    shakeIntensity: 'medium',
    isFlashing: false,
    flashColor: '#fff',
    isDimmed: false,
  });

  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flashTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerShake = useCallback((intensity: 'light' | 'medium' | 'heavy' | 'critical' = 'medium', duration: number = 300) => {
    // Clear existing timeout
    if (shakeTimeoutRef.current) {
      clearTimeout(shakeTimeoutRef.current);
    }

    setEffects(prev => ({ ...prev, isShaking: true, shakeIntensity: intensity }));

    shakeTimeoutRef.current = setTimeout(() => {
      setEffects(prev => ({ ...prev, isShaking: false }));
    }, duration);
  }, []);

  const triggerFlash = useCallback((color: string = '#fff', duration: number = 150) => {
    // Clear existing timeout
    if (flashTimeoutRef.current) {
      clearTimeout(flashTimeoutRef.current);
    }

    setEffects(prev => ({ ...prev, isFlashing: true, flashColor: color }));

    flashTimeoutRef.current = setTimeout(() => {
      setEffects(prev => ({ ...prev, isFlashing: false }));
    }, duration);
  }, []);

  const triggerDim = useCallback((dimmed: boolean) => {
    setEffects(prev => ({ ...prev, isDimmed: dimmed }));
  }, []);

  const triggerImpact = useCallback((intensity: 'light' | 'medium' | 'heavy' | 'critical' = 'medium', color?: string) => {
    // Combine shake and flash for impact
    const shakeDurations = {
      light: 150,
      medium: 250,
      heavy: 400,
      critical: 500,
    };

    triggerShake(intensity, shakeDurations[intensity]);
    triggerFlash(color || '#fff', 100);
  }, [triggerShake, triggerFlash]);

  const triggerCriticalHit = useCallback((color: string = '#ffd700') => {
    triggerShake('critical', 500);
    triggerFlash(color, 200);
  }, [triggerShake, triggerFlash]);

  const triggerSuperEffective = useCallback((color: string = '#ff6600') => {
    triggerShake('heavy', 400);
    triggerFlash(color, 150);
  }, [triggerShake, triggerFlash]);

  const triggerNotEffective = useCallback(() => {
    triggerShake('light', 100);
  }, [triggerShake]);

  const getShakeStyle = useCallback(() => {
    if (!effects.isShaking) return {};

    const intensities = {
      light: '2px',
      medium: '4px',
      heavy: '8px',
      critical: '12px',
    };

    return {
      animation: `battle-shake 0.05s infinite`,
      '--shake-intensity': intensities[effects.shakeIntensity],
    } as React.CSSProperties;
  }, [effects.isShaking, effects.shakeIntensity]);

  return {
    effects,
    triggerShake,
    triggerFlash,
    triggerDim,
    triggerImpact,
    triggerCriticalHit,
    triggerSuperEffective,
    triggerNotEffective,
    getShakeStyle,
  };
}

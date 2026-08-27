import React, { useEffect, useState, useRef } from 'react';
import { formatBdt } from '../../../utils/formatters';

interface AnimatedBalanceCounterProps {
  value: number;
  language: 'bn' | 'en';
  className?: string;
  durationMs?: number;
  highlightGlow?: boolean;
}

export const AnimatedBalanceCounter: React.FC<AnimatedBalanceCounterProps> = ({
  value,
  language,
  className = '',
  durationMs = 1600,
  highlightGlow = false,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const prevValueRef = useRef<number>(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      prevValueRef.current = value;
      return;
    }

    const startValue = prevValueRef.current;
    const endValue = value;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Ease out expo curve for smooth, premium deceleration
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startValue + (endValue - startValue) * easeOutExpo);

      setDisplayValue(current);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = endValue;
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [value, durationMs]);

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        highlightGlow ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]' : ''
      } ${className}`}
    >
      {formatBdt(displayValue, language)}
    </span>
  );
};

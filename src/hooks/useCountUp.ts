import { useEffect, useRef, useState, useCallback } from 'react';

interface UseCountUpOptions {
  /** Target number to count up to */
  end: number;
  /** Starting number */
  start?: number;
  /** Duration in milliseconds */
  duration?: number;
  /** Decimal places to display */
  decimals?: number;
  /** Whether to start counting (useful with Intersection Observer) */
  enabled?: boolean;
}

/**
 * Custom hook for animated number counting.
 * Uses requestAnimationFrame for smooth 60fps animation with ease-out.
 */
export function useCountUp({
  end,
  start = 0,
  duration = 1800,
  decimals = 0,
  enabled = true,
}: UseCountUpOptions): number {
  const [value, setValue] = useState(start);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasRun = useRef(false);

  // Ease-out cubic for natural deceleration
  const easeOutCubic = useCallback((t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  }, []);

  useEffect(() => {
    if (!enabled || hasRun.current) return;

    hasRun.current = true;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = start + (end - start) * easedProgress;

      setValue(Number(currentValue.toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, end, start, duration, decimals, easeOutCubic]);

  return value;
}

/**
 * Combined hook: counts up when element enters viewport.
 */
export function useCountUpOnScroll(
  end: number,
  options?: Partial<Omit<UseCountUpOptions, 'end' | 'enabled'>>
) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const value = useCountUp({
    end,
    enabled: isVisible,
    ...options,
  });

  return { ref, value, isVisible };
}

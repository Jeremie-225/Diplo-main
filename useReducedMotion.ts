import { useEffect, useState } from 'react';

/**
 * Listens to the user's `prefers-reduced-motion` setting and exposes it as a
 * boolean. Used to disable decorative animations (parallax, marquee, custom
 * cursor, infinite drifts) for users who opt out — this is an accessibility
 * requirement, not a nice-to-have.
 *
 * Usage:
 *   const reduced = useReducedMotion();
 *   if (reduced) return <StaticThing />;
 */
export function useReducedMotion(): boolean {
  // Default to false on SSR / when matchMedia is unavailable.
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

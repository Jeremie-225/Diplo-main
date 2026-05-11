import { useEffect, useState } from 'react';

/**
 * Returns the current vertical scroll position. Used by the Header to
 * switch from transparent to white-with-shadow once the user scrolls.
 *
 * Throttled with rAF so it doesn't fire dozens of times per second.
 */
export function useScrollPosition(): number {
  const [scrollY, setScrollY] = useState<number>(
    typeof window !== 'undefined' ? window.scrollY : 0,
  );

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      // Coalesce multiple scroll events into one paint frame
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        frame = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return scrollY;
}

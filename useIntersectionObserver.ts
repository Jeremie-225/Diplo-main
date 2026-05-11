import { useEffect, useRef, useState } from 'react';

interface Options {
  threshold?: number;
  rootMargin?: string;
  /** If true, stop observing after the first intersection (one-shot reveal). */
  once?: boolean;
}

/**
 * Track whether a referenced element is currently within the viewport.
 * Used to trigger fade-in animations and counter "count up" effects.
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: Options = {},
): { ref: React.RefObject<T>; isIntersecting: boolean } {
  const { threshold = 0.15, rootMargin = '0px', once = true } = options;
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsIntersecting(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isIntersecting };
}

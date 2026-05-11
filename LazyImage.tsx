import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  src: string;
  alt: string;
  className?: string;
  /** Optional class for the wrapper element (sets aspect ratio etc.). */
  wrapperClassName?: string;
  /** Native `loading` hint — defaults to lazy. */
  loading?: 'lazy' | 'eager';
  /** Apply object-cover (default true). */
  cover?: boolean;
}

/**
 * Image with a blur-up placeholder + IntersectionObserver-driven load.
 * - Renders a soft neutral placeholder block immediately (no layout shift).
 * - Only swaps in the real image once it scrolls within the viewport.
 * - Once the real image is decoded, it fades in with a subtle blur-out.
 *
 * Used everywhere we'd otherwise have a static `<img>` — product cards,
 * news cards, hero. Keeps the network polite without sacrificing polish.
 */
export function LazyImage({
  src,
  alt,
  className,
  wrapperClassName,
  loading = 'lazy',
  cover = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(loading === 'eager');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (inView) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' }, // start loading slightly before it enters
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [inView]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-neutral-100',
        wrapperClassName,
      )}
    >
      {/* Animated shimmer placeholder while we wait */}
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 skeleton"
        />
      )}
      {inView && (
        <motion.img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setLoaded(true)}
          initial={{ opacity: 0, filter: 'blur(12px)', scale: 1.02 }}
          animate={
            loaded
              ? { opacity: 1, filter: 'blur(0px)', scale: 1 }
              : { opacity: 0, filter: 'blur(12px)', scale: 1.02 }
          }
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={cn(
            'w-full h-full',
            cover ? 'object-cover' : 'object-contain',
            className,
          )}
        />
      )}
    </div>
  );
}

export default LazyImage;

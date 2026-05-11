import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin (3px) gradient bar fixed to the very top of the viewport. Its width
 * tracks the user's scroll progress through the current page.
 *
 * Implementation: framer-motion's `useScroll` gives us a 0..1 motion value;
 * `useSpring` smooths it (stiff but damped — feels alive, not laggy);
 * we then drive `scaleX` from that. Only `transform` animates, so this is
 * cheap to render even on slower devices.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  // Spring smooths jitter from rapid scroll wheels / trackpads
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      // z-50 keeps us above the sticky header (z-40)
      className="fixed top-0 left-0 right-0 h-[3px] z-50 origin-left pointer-events-none"
      style={{
        scaleX,
        background:
          'linear-gradient(90deg, #1E3A8A 0%, #3B82F6 50%, #FCD34D 100%)',
      }}
    />
  );
}

export default ScrollProgress;

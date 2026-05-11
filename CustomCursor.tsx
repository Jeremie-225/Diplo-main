import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * A two-part custom cursor:
 *  1. A small 8px solid dot that tracks the actual mouse precisely.
 *  2. A 32px outline ring that lags slightly (springed) for a polished feel.
 *
 * The ring scales up and tints yellow when the user hovers over interactive
 * elements (anchors, buttons, [role="button"]). We detect hover via mousemove +
 * `closest('a, button, [role="button"]')` — cheaper than attaching listeners
 * to every element on every render.
 *
 * Visibility is gated by a media query: the cursor is only shown on devices
 * that have a *real* cursor (`(hover: hover) and (pointer: fine)`), so it
 * never appears on touch devices. Reduced-motion users also see nothing.
 */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  // Precise position for the dot
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  // Springed position for the ring — feels like the ring "follows" the dot
  const ringX = useSpring(dotX, { stiffness: 220, damping: 22, mass: 0.5 });
  const ringY = useSpring(dotY, { stiffness: 220, damping: 22, mass: 0.5 });

  // Decide whether to render at all (touch devices don't get a cursor).
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled || reduced) return;

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!visible) setVisible(true);
      // Detect interactive parents — keeps DOM listeners count at zero.
      const target = e.target as HTMLElement | null;
      const interactive =
        target?.closest('a, button, [role="button"], [data-cursor="pointer"]');
      setHovering(!!interactive);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled, reduced, dotX, dotY, visible]);

  if (!enabled || reduced) return null;

  return (
    <>
      {/* Outer ring (lagging spring) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[60] rounded-full mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 32,
          height: 32,
          border: '1.5px solid',
          borderColor: hovering ? '#FCD34D' : '#FFFFFF',
          opacity: visible ? 1 : 0,
        }}
        animate={{
          scale: hovering ? 1.5 : 1,
        }}
        transition={{ scale: { type: 'spring', stiffness: 280, damping: 22 } }}
      />
      {/* Inner dot (precise) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[60] rounded-full bg-white mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 8,
          height: 8,
          opacity: visible ? 1 : 0,
        }}
      />
    </>
  );
}

export default CustomCursor;

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
  /** Max degrees of tilt in either axis (default 8). */
  max?: number;
  /** Add a subtle scale-up while hovered. */
  scale?: number;
}

/**
 * Wraps content in a 3D tilt that follows the cursor. The card rotates
 * (rotateX/rotateY) up to `max` degrees based on cursor position relative
 * to its center. Springed for smooth motion.
 *
 * Skipped under `prefers-reduced-motion`.
 */
export function TiltCard({ children, className, max = 8, scale = 1.0 }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 240, damping: 22 });
  const sry = useSpring(ry, { stiffness: 240, damping: 22 });

  const rotateX = useTransform(srx, (v) => `${v}deg`);
  const rotateY = useTransform(sry, (v) => `${v}deg`);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    // Normalize cursor to -1..1 within the card.
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    // Y axis tilt (mouse left/right) -> rotateY; X axis (up/down) -> rotateX.
    // Invert X so moving cursor *up* tilts the card *backward*.
    ry.set(px * 2 * max);
    rx.set(-py * 2 * max);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
      whileHover={scale !== 1 ? { scale } : undefined}
      transition={{ scale: { type: 'spring', stiffness: 280, damping: 22 } }}
      className={cn('will-change-transform', className)}
    >
      {children}
    </motion.div>
  );
}

export default TiltCard;

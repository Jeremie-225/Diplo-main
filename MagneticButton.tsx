import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Props {
  children: ReactNode;
  className?: string;
  /** Max pixels the element can drift toward the cursor (default 12). */
  strength?: number;
  /** How far around the element the magnet attracts (default 80px). */
  radius?: number;
}

/**
 * Wraps interactive content in a "magnetic" effect — the element gently
 * eases toward the cursor when the cursor is within `radius` pixels of its
 * center, and snaps back when the cursor leaves.
 *
 * We attach a single mousemove listener to the wrapper itself and only when
 * the cursor enters its bounding box (cheap) — no global listeners.
 *
 * Disabled entirely under `prefers-reduced-motion`.
 */
export function MagneticButton({ children, className, strength = 12, radius = 80 }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Raw target coords + springed visible coords. Springs make snap-back smooth.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const tx = useTransform(sx, (v) => v);
  const ty = useTransform(sy, (v) => v);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > radius) {
      x.set(0);
      y.set(0);
      return;
    }
    // Linear attenuation toward `strength` at the center, easing off near radius.
    const factor = (1 - dist / radius) * strength;
    const angle = Math.atan2(dy, dx);
    x.set(Math.cos(angle) * factor);
    y.set(Math.sin(angle) * factor);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: tx, y: ty }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default MagneticButton;

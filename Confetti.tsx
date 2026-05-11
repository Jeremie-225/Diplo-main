import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Props {
  /** When this changes, the burst remounts and replays. */
  trigger: number;
  count?: number;
}

const COLORS = ['#1E3A8A', '#3B82F6', '#FCD34D', '#FBBF24', '#10B981'];

/**
 * Simple confetti burst built entirely with framer-motion — no extra deps.
 * Each particle is a tiny colored square that flies outward in a random
 * direction, rotating, then fades. Used on the contact form success state.
 *
 * Mount this near the button you want it to burst from; the button's
 * relative-positioned parent will contain the absolute particles.
 */
export function Confetti({ trigger, count = 24 }: Props) {
  // Pre-compute random positions/rotations per trigger so the layout is
  // deterministic for that burst (no shimmer between renders).
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 90 + Math.random() * 90;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 20, // slight upward bias
          rotate: Math.random() * 360,
          color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? '#FCD34D',
          size: 6 + Math.random() * 5,
          delay: Math.random() * 0.05,
        };
      }),
    // We deliberately want a fresh burst on each `trigger` change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trigger, count],
  );

  return (
    <span
      key={trigger}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {particles.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.5 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            rotate: p.rotate,
            scale: 1,
          }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: p.delay }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </span>
  );
}

export default Confetti;

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

/**
 * Simple wrapper that fades and slides content slightly on mount + unmount.
 * Used inside `<AnimatePresence>` keyed by location.pathname so each route
 * cross-fades cleanly.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;

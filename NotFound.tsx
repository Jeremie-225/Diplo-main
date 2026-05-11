import { motion, useMotionValue } from 'framer-motion';
import { Compass, Home as HomeIcon, MessageSquare } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { LinkButton } from '@/components/ui/Button';

/**
 * Animated 404. The "404" digits are individually draggable a tiny bit;
 * release and they spring back to home position. The compass badge bobs.
 *
 * No interactive complexity beyond framer-motion's built-in `drag` —
 * users can't break the layout because dragConstraints clamps each digit
 * to a tiny radius around its origin.
 */
function DraggableDigit({ children, delay }: { children: string; delay: number }) {
  // Two motion values would let us track position for cosmetic purposes,
  // but framer-motion handles the drag + spring-back internally when
  // dragConstraints + dragSnapToOrigin is set.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <motion.span
      drag
      dragConstraints={{ left: -30, right: 30, top: -30, bottom: 30 }}
      dragElastic={0.35}
      dragSnapToOrigin
      whileTap={{ cursor: 'grabbing', scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      animate={{ y: [0, -6, 0] }}
      transition={{
        y: { duration: 3 + delay, repeat: Infinity, ease: 'easeInOut', delay },
        // Spring back to origin smoothly when dragging stops.
      }}
      style={{ x, y, cursor: 'grab', display: 'inline-block' }}
      className="select-none"
    >
      {children}
    </motion.span>
  );
}

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-neutral-50 pt-20">
      <Container size="md">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative inline-block mb-6"
          >
            <span className="text-[8rem] sm:text-[10rem] font-extrabold text-primary leading-none flex">
              <DraggableDigit delay={0}>4</DraggableDigit>
              <DraggableDigit delay={0.4}>0</DraggableDigit>
              <DraggableDigit delay={0.8}>4</DraggableDigit>
            </span>
            <motion.span
              animate={{ rotate: [6, -6, 6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-2 -right-2 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent text-primary shadow-lift"
            >
              <Compass className="w-7 h-7" />
            </motion.span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-neutral-900"
          >
            Looks like this page wandered off.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-neutral-700 max-w-md mx-auto"
          >
            The page you're looking for doesn't exist — or maybe it's still in our warehouse.
            Drag the digits if you're bored. Otherwise, let's get you back on track.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <LinkButton to="/" leftIcon={<HomeIcon className="w-4 h-4" />}>
              Back to home
            </LinkButton>
            <LinkButton
              to="/contact"
              variant="outline"
              leftIcon={<MessageSquare className="w-4 h-4" />}
            >
              Contact us
            </LinkButton>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

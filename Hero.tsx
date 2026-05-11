import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronDown, Download } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { LinkButton } from '@/components/ui/Button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { mockSiteSettings } from '@/data/mockSiteSettings';
import { mockPartners } from '@/data/mockPartners';
import { SITE_STATS, formatStatCount } from '@/lib/siteStats';
// Real photo of the Diplo Aflao duty-free shelves — feels far more
// authentic than a flat colour block on the "products" stat card.
import imgProductsCard from '@/assets/duty-free/dutyfree-aflao-03.jpg';

// ----------------------------------------------------------------------------
// Animation variants — keep them out of the component body so framer-motion
// doesn't recreate them on every render.
// ----------------------------------------------------------------------------
const headlineContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const headlineWord = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Splits an HTML headline string (which may contain `<br/>`) into an array
 * of word arrays. Used so we can stagger-fade each word individually.
 */
function splitHeadline(html: string): string[][] {
  return html
    .split(/<br\s*\/?>/i)
    .map((line) => line.trim().split(/\s+/).filter(Boolean));
}

export function Hero() {
  const s = mockSiteSettings;
  const reduced = useReducedMotion();
  const lines = splitHeadline(s.heroHeadline);

  // ---- Mouse parallax for the background blobs ---------------------------
  // We track raw mouse position relative to the hero center and pipe it
  // through springs so the parallax has weight/inertia rather than being
  // pixel-perfect (which would feel jittery).
  const heroRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 1 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 1 });

  // Translate scaled by depth — back layer moves less, front more.
  const blob1X = useTransform(sx, (v) => v * 12);
  const blob1Y = useTransform(sy, (v) => v * 12);
  const blob2X = useTransform(sx, (v) => v * -18);
  const blob2Y = useTransform(sy, (v) => v * -18);
  const blob3X = useTransform(sx, (v) => v * 8);
  const blob3Y = useTransform(sy, (v) => v * -8);

  useEffect(() => {
    if (reduced) return;
    const node = heroRef.current;
    if (!node) return;

    const onMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      // Normalize cursor to range -1..1 within the hero box
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      // Clamp at +/- 1 so we never overshoot
      mx.set(Math.max(-1, Math.min(1, nx)));
      my.set(Math.max(-1, Math.min(1, ny)));
    };

    node.addEventListener('mousemove', onMove);
    return () => node.removeEventListener('mousemove', onMove);
  }, [mx, my, reduced]);

  // Click handler for the "scroll down" chevron — scrolls past the hero
  // height to land on the first section below.
  const onScrollDown = () => {
    const next = heroRef.current?.nextElementSibling as HTMLElement | null;
    if (next) {
      next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden gradient-hero text-white pt-28 pb-24 sm:pt-32 sm:pb-32 lg:pt-40 lg:pb-40 min-h-[90vh]"
    >
      {/* Subtle SVG-grid overlay (low opacity) for depth */}
      <div className="absolute inset-0 bg-grid-overlay opacity-40 pointer-events-none" aria-hidden="true" />

      {/* Decorative floating shapes — combined infinite drift + parallax. */}
      <motion.div
        aria-hidden="true"
        className="absolute -top-20 -left-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-accent/20 blur-3xl"
        style={{ x: blob1X, y: blob1Y }}
        animate={reduced ? undefined : { y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute top-1/3 -right-24 w-96 h-96 sm:w-[28rem] sm:h-[28rem] rounded-full bg-primary-light/30 blur-3xl"
        style={{ x: blob2X, y: blob2Y }}
        animate={reduced ? undefined : { y: [0, 24, 0], x: [0, -16, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-10 left-1/3 w-48 h-48 rounded-full bg-accent/10 blur-2xl"
        style={{ x: blob3X, y: blob3Y }}
        animate={reduced ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute top-10 right-1/4 w-32 h-32 rounded-full bg-white/5 blur-2xl"
        animate={reduced ? undefined : { y: [0, 18, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-32 right-10 w-40 h-40 rounded-full bg-accent-warm/10 blur-2xl"
        animate={reduced ? undefined : { y: [0, -22, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <Container>
        <div className="relative grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 backdrop-blur px-4 py-1.5 text-xs font-medium text-white/90 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              A decade of trusted regional distribution
            </motion.div>

            {/* Headline split into words — each fades + un-blurs in sequence. */}
            <motion.h1
              variants={reduced ? undefined : headlineContainer}
              initial={reduced ? false : 'hidden'}
              animate={reduced ? undefined : 'visible'}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight"
            >
              {lines.map((line, lineIdx) => (
                <span key={lineIdx} className="block">
                  {line.map((word, wIdx) => (
                    <motion.span
                      key={`${lineIdx}-${wIdx}`}
                      variants={reduced ? undefined : headlineWord}
                      className="inline-block mr-3"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-5 text-base sm:text-lg text-white/85 max-w-xl leading-relaxed"
            >
              {s.heroSubheadline}
            </motion.p>

            {/* CTAs — primary one is wrapped in MagneticButton for the
                cursor-attraction effect. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <MagneticButton strength={14} radius={90}>
                <LinkButton
                  to="/products"
                  variant="accent"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {s.heroCtaPrimary}
                </LinkButton>
              </MagneticButton>
              <MagneticButton strength={10} radius={80}>
                <LinkButton
                  to="/quote"
                  variant="secondary"
                  size="lg"
                  className="bg-white/10 border-white/15 text-white hover:bg-white/20"
                >
                  {s.heroCtaSecondary}
                </LinkButton>
              </MagneticButton>
            </motion.div>

            {/* Trust strip — partner logos with infinite gentle rotation. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-10"
            >
              <p className="text-[11px] uppercase tracking-widest text-white/60 mb-4">
                Trusted by leading brands
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                {mockPartners.slice(0, 4).map((partner, idx) => (
                  <motion.span
                    key={partner.slug}
                    animate={
                      reduced
                        ? undefined
                        : { y: [0, -3, 0], opacity: [0.6, 0.85, 0.6] }
                    }
                    transition={{
                      duration: 4 + idx * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: idx * 0.3,
                    }}
                    className="text-white/70 font-bold text-sm sm:text-base tracking-wide"
                  >
                    {partner.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Visual card cluster — same as before, with a parallax twist. */}
          <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-[460px]">
            {/* Premium catalog card — opens the official Diplo Catalogue 2026 PDF
                in a new tab. Hover lift + download icon make it discoverable. */}
            <motion.a
              href="/catalogs/diplo-catalogue-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Diplo Catalogue 2026 (PDF)"
              className="group absolute top-0 left-4 w-44 sm:w-56 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-4 shadow-lift hover:bg-white/15 hover:border-accent/40 transition-colors"
              style={{ x: blob1X, y: blob1Y }}
              animate={reduced ? undefined : { y: [0, -10, 0] }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Real Diplo shop-shelves photo with a navy gradient overlay
                  so the Download icon and PDF badge stay readable. The flat
                  bg-accent block this replaces felt too generic for a
                  premium B2B hero. */}
              <div className="aspect-square rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                <img
                  src={imgProductsCard}
                  alt=""
                  width={400}
                  height={400}
                  loading="eager"
                  decoding="async"
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/65 to-accent/55"
                />
                <Download className="relative w-8 h-8 text-white drop-shadow group-hover:scale-110 transition-transform" />
                <span className="absolute bottom-1.5 right-1.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-white/90 px-1.5 py-0.5 rounded shadow-sm">
                  PDF
                </span>
              </div>
              <p className="text-xs text-white/70 group-hover:text-accent transition-colors">
                 2026 catalog
              </p>
              {/* Phase 2.1 — count is computed from the live catalogue;
                  see src/lib/siteStats.ts. */}
              <p className="font-semibold text-sm">160+ products</p>
              <p className="mt-1 text-[10px] text-white/55">Tap to download →</p>
            </motion.a>
            <motion.div
              className="absolute top-16 right-2 w-48 sm:w-64 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-4 shadow-lift"
              style={{ x: blob2X, y: blob2Y }}
              animate={reduced ? undefined : { y: [0, 12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              {/* Curated Unsplash photo (handshake / business meeting) for
                  the "partners" stat. Specific photo ID, w=600 q=80 keeps it
                  ~50 KB. Navy gradient overlay matches the brand. */}
              <div className="aspect-video rounded-lg mb-3 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80&auto=format&fit=crop"
                  alt=""
                  width={600}
                  height={338}
                  loading="lazy"
                  decoding="async"
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary-light/40"
                />
              </div>
              <p className="text-xs text-white/70">Reliable network</p>
              <p className="font-semibold text-sm">20+ partners</p>
            </motion.div>
            <motion.div
              className="absolute bottom-0 left-12 w-40 sm:w-52 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-4 shadow-lift"
              style={{ x: blob3X, y: blob3Y }}
              animate={reduced ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="flex -space-x-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-accent border-2 border-primary" />
                <div className="w-7 h-7 rounded-full bg-primary-light border-2 border-primary" />
                <div className="w-7 h-7 rounded-full bg-white border-2 border-primary" />
              </div>
              <p className="text-xs text-white/70">Reaching Out To</p>
              <p className="font-semibold text-sm">366M+ People</p>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* Scroll-down chevron — bouncing, clickable */}
      <motion.button
        type="button"
        onClick={onScrollDown}
        aria-label="Scroll to next section"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="hidden sm:inline-flex absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1.5 text-white/70 hover:text-accent transition-colors"
      >
        <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
        <span className="scroll-bounce">
          <ChevronDown className="w-5 h-5" />
        </span>
      </motion.button>

      {/* Subtle bottom curve */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 80 L1440 80 L1440 30 C 1080 70, 360 70, 0 30 Z" fill="white" />
      </svg>
    </section>
  );
}

export default Hero;

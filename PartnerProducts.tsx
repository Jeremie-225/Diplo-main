import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import {
  Search,
  X,
  SearchX,
  ArrowRight,
  Globe2,
  Sparkles,
  Star,
  Package,
  Award,
  Filter,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/ui/ProductCard';
import { TiltCard } from '@/components/ui/TiltCard';
import { partnerProducts } from '@/data/partnerProducts';
import { vilniausProducts } from '@/data/vilniausProducts';
import { massIndustriesProducts } from '@/data/massIndustriesProducts';
import { categories } from '@/data/categories';
import { partners } from '@/data/partners';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Product, Partner } from '@/types';

const ALL = 'all';

// Lookup: country name -> emoji flag for the origin browser. Covers the
// countries our partners actually source from. Anything missing falls
// back to a generic globe.
const COUNTRY_FLAGS: Record<string, string> = {
  Lithuania: '🇱🇹',
  Ghana: '🇬🇭',
  France: '🇫🇷',
  Spain: '🇪🇸',
  India: '🇮🇳',
  Belgium: '🇧🇪',
  'South Africa': '🇿🇦',
  Italy: '🇮🇹',
  Netherlands: '🇳🇱',
  Germany: '🇩🇪',
};

// Hand-picked dedicated landing pages — partners big enough to warrant
// their own deep-dive page rather than just filtering the catalogue.
const PARTNER_DEEP_LINKS: Record<string, string> = {
  'vilniaus-degtine': '/partners/vilniaus-degtine',
  'mass-industries': '/partners/mass-industries',
};

/**
 * Partner Brands page — cinematic redesign.
 *
 * Sections (top to bottom):
 *   1. Hero — gradient + scrolling marquee of partner logos
 *   2. Stats strip — animated counters
 *   3. Country-of-origin browser — flag pills that filter the grid
 *   4. Featured partners mosaic — 6 oversized cards with story
 *   5. Full partner atlas — every partner as a hover-rich card
 *   6. Catalogue browser — sticky filters + product grid
 *
 * The page is intentionally long-scroll: B2B buyers want to browse the
 * roster like a portfolio, not just hit a filter and grab SKUs.
 */
export default function PartnerProducts() {
  const reduced = useReducedMotion();

  // ─── Combined product pool ──────────────────────────────────────
  const all: Product[] = useMemo(
    () => [...partnerProducts, ...vilniausProducts, ...massIndustriesProducts],
    [],
  );

  // ─── Filters ────────────────────────────────────────────────────
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>(ALL);
  const [supplier, setSupplier] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);

  // ─── Pre-aggregated counts (recomputed only when `all` changes) ──
  const counts = useMemo(() => {
    const cat = new Map<string, number>();
    const sup = new Map<string, number>();
    for (const p of all) {
      cat.set(p.categoryId, (cat.get(p.categoryId) ?? 0) + 1);
      if (p.partnerSlug) sup.set(p.partnerSlug, (sup.get(p.partnerSlug) ?? 0) + 1);
    }
    return { cat, sup };
  }, [all]);

  const usedCategories = categories.filter((c) => counts.cat.has(c.id));

  // Partners grouped by country — drives both the origin browser and
  // the "by country" labels on cards. Sorted alphabetically.
  const partnersByCountry = useMemo(() => {
    const map = new Map<string, Partner[]>();
    for (const p of partners) {
      const c = p.country ?? 'Other';
      const arr = map.get(c) ?? [];
      arr.push(p);
      map.set(c, arr);
    }
    return new Map([...map.entries()].sort());
  }, []);

  // Anything with logo OR isFeatured shows in the atlas.
  const atlasPartners = useMemo(
    () => partners.filter((p) => p.logo !== null || p.isFeatured),
    [],
  );

  // Featured for the mosaic — `isFeatured: true` partners only, kept in
  // the order defined in partners.ts so the data file is the source of
  // truth for ordering.
  const featuredPartners = useMemo(
    () => partners.filter((p) => p.isFeatured).slice(0, 6),
    [],
  );

  // ─── Filtered product list ─────────────────────────────────────
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = all;
    if (category !== ALL) list = list.filter((p) => p.categoryId === category);
    if (supplier) list = list.filter((p) => p.partnerSlug === supplier);
    if (country) {
      const partnerSlugs = new Set(
        (partnersByCountry.get(country) ?? []).map((p) => p.slug),
      );
      list = list.filter((p) => p.partnerSlug && partnerSlugs.has(p.partnerSlug));
    }
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand?.toLowerCase().includes(q) ?? false) ||
          (p.supplier?.toLowerCase().includes(q) ?? false),
      );
    }
    return list;
  }, [query, category, supplier, country, all, partnersByCountry]);

  // Scroll to catalogue when any filter is touched — keeps the user
  // oriented when they click a card up top.
  const catalogueRef = useRef<HTMLElement>(null);
  function scrollToCatalogue() {
    catalogueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function selectSupplier(slug: string | null) {
    // If the partner has its own dedicated page, route there instead of
    // filtering — it's a richer experience.
    if (slug && PARTNER_DEEP_LINKS[slug]) return;
    setSupplier(slug);
    setCountry(null);
    scrollToCatalogue();
  }

  function selectCountry(c: string | null) {
    setCountry(c);
    setSupplier(null);
    scrollToCatalogue();
  }

  function clearAll() {
    setQuery('');
    setCategory(ALL);
    setSupplier(null);
    setCountry(null);
  }

  const hasActiveFilters = !!(query || category !== ALL || supplier || country);

  // ─── Top-level metrics for the stats strip ─────────────────────
  const totalCountries = partnersByCountry.size;
  const totalPartners = atlasPartners.length;
  const totalSKUs = all.length;
  const totalCategories = usedCategories.length;

  return (
    <>
      {/* ─── 1. Cinematic hero ──────────────────────────────────── */}
      <PartnerHero atlasPartners={atlasPartners} reduced={reduced} />

      {/* ─── 2. Stats strip ─────────────────────────────────────── */}
      <section className="bg-white border-b border-neutral-100">
        <Container>
          <div className="py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            <Stat icon={Award} value={totalPartners} label="Trusted partners" />
            <Stat icon={Package} value={totalSKUs} label="SKUs available" suffix="+" />
            <Stat icon={Globe2} value={totalCountries} label="Countries of origin" />
            <Stat icon={Sparkles} value={totalCategories} label="Beverage & food categories" />
          </div>
        </Container>
      </section>

      {/* ─── 3. Country-of-origin browser ───────────────────────── */}
      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-primary-light font-semibold mb-2">
              Where the brands come from
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
              A roster sourced from <span className="text-primary">{totalCountries} countries</span>.
            </h2>
            <p className="mt-3 text-neutral-700">
              Tap a country to filter the catalogue. Every partner has been hand-picked to fill a
              specific gap on West African shelves.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[...partnersByCountry.entries()].map(([c, ps], i) => {
              const flag = COUNTRY_FLAGS[c] ?? '🌍';
              const skuCount = ps.reduce(
                (n, p) => n + (counts.sup.get(p.slug) ?? 0),
                0,
              );
              const active = country === c;
              return (
                <motion.button
                  key={c}
                  type="button"
                  onClick={() => selectCountry(active ? null : c)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  whileHover={reduced ? undefined : { y: -3 }}
                  className={cn(
                    'group relative rounded-2xl p-5 text-left border transition-all',
                    active
                      ? 'bg-primary text-white border-primary shadow-lift'
                      : 'bg-white border-neutral-100 shadow-soft hover:shadow-lift hover:border-primary/30',
                  )}
                  aria-pressed={active}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-3xl leading-none" aria-hidden="true">
                      {flag}
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center justify-center px-2 min-w-[1.75rem] h-6 rounded-full text-xs font-bold',
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-primary/5 text-primary',
                      )}
                    >
                      {ps.length}
                    </span>
                  </div>
                  <p
                    className={cn(
                      'mt-4 font-bold',
                      active ? 'text-white' : 'text-neutral-900',
                    )}
                  >
                    {c}
                  </p>
                  <p
                    className={cn(
                      'mt-0.5 text-xs',
                      active ? 'text-white/75' : 'text-neutral-700/80',
                    )}
                  >
                    {skuCount} {skuCount === 1 ? 'SKU' : 'SKUs'} ·{' '}
                    {ps.length} {ps.length === 1 ? 'brand' : 'brands'}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── 4. Featured partners mosaic ────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white border-t border-neutral-100">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary-light font-semibold mb-2">
                Spotlight
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
                Our flagship partners.
              </h2>
            </div>
            <p className="text-sm text-neutral-700 max-w-md">
              Six relationships that anchor the Diplo catalogue — by volume, by exclusivity,
              or simply by the trust we've built over years of distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredPartners.map((p, idx) => (
              <FeaturedPartnerCard
                key={p.slug}
                partner={p}
                skuCount={counts.sup.get(p.slug) ?? p.productCount ?? 0}
                onFilter={() => selectSupplier(p.slug)}
                deepLink={PARTNER_DEEP_LINKS[p.slug]}
                reduced={reduced}
                idx={idx}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 5. Full partner atlas ──────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs uppercase tracking-widest text-primary-light font-semibold mb-2">
              The full roster
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
              Every brand we distribute.
            </h2>
            <p className="mt-3 text-neutral-700">
              Click any partner to filter the catalogue, or open the dedicated landing page
              where available.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {atlasPartners.map((p, i) => (
              <AtlasPartnerCard
                key={p.slug}
                partner={p}
                skuCount={counts.sup.get(p.slug) ?? 0}
                onFilter={() => selectSupplier(p.slug)}
                deepLink={PARTNER_DEEP_LINKS[p.slug]}
                idx={i}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 6. Catalogue browser ───────────────────────────────── */}
      <section
        ref={catalogueRef}
        className="py-20 sm:py-24 bg-white"
        id="catalogue"
      >
        <Container>
          <div className="max-w-2xl mb-8">
            <p className="text-xs uppercase tracking-widest text-primary-light font-semibold mb-2">
              Browse the catalogue
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
              {filtered.length === all.length
                ? 'All partner products.'
                : `${filtered.length} matching ${filtered.length === 1 ? 'product' : 'products'}.`}
            </h2>
          </div>

          {/* Active-filter chip strip */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex flex-wrap items-center gap-2 mb-6"
              >
                <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-bold text-neutral-700/70">
                  <Filter className="w-3 h-3" /> Active
                </span>
                {category !== ALL && (
                  <Chip onRemove={() => setCategory(ALL)}>
                    {usedCategories.find((c) => c.id === category)?.name ?? category}
                  </Chip>
                )}
                {supplier && (
                  <Chip onRemove={() => setSupplier(null)}>
                    {partners.find((p) => p.slug === supplier)?.name ?? supplier}
                  </Chip>
                )}
                {country && (
                  <Chip onRemove={() => setCountry(null)}>
                    {COUNTRY_FLAGS[country] ?? '🌍'} {country}
                  </Chip>
                )}
                {query && <Chip onRemove={() => setQuery('')}>"{query}"</Chip>}
                <button
                  type="button"
                  onClick={clearAll}
                  className="ml-auto text-xs font-semibold text-primary hover:text-primary-light"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-[260px_1fr] gap-8">
            {/* Sticky sidebar — search + categories */}
            <aside className="lg:sticky lg:top-28 lg:self-start space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-700/60" />
                <input
                  type="search"
                  placeholder="Search by brand, name…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search partner products"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-neutral-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-neutral-700/60 hover:bg-neutral-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5" /> Categories
                </h3>
                <ul className="space-y-1">
                  {[{ id: ALL, name: 'All products' }, ...usedCategories].map((c) => {
                    const count = c.id === ALL ? all.length : counts.cat.get(c.id) ?? 0;
                    const isActive = category === c.id;
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => setCategory(c.id)}
                          className={cn(
                            'w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between gap-2 group',
                            isActive
                              ? 'bg-primary text-white font-semibold shadow-soft'
                              : 'text-neutral-700 hover:bg-white hover:text-primary hover:shadow-soft',
                          )}
                        >
                          <span className="truncate">{c.name}</span>
                          <span
                            className={cn(
                              'inline-flex items-center justify-center px-1.5 min-w-[1.5rem] h-5 rounded-full text-[11px] font-semibold transition-colors',
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-neutral-100 text-neutral-700 group-hover:bg-primary/10 group-hover:text-primary',
                            )}
                          >
                            {count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* Animated product grid */}
            <div>
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-24 bg-white rounded-2xl border border-neutral-100 shadow-soft"
                >
                  <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-100 text-primary mb-4 shadow-soft">
                    <SearchX className="w-8 h-8" />
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 mb-1">No matches.</h3>
                  <p className="text-sm text-neutral-700 max-w-xs mx-auto">
                    Try a different country, brand, or search term — we have a lot of catalogue to
                    explore.
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-light"
                    >
                      Clear filters <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  <AnimatePresence>
                    {filtered.map((p) => (
                      <motion.div
                        key={p.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                      >
                        <ProductCard product={p} noTilt />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

// =====================================================================
// Sub-components — kept in this file for now; promote to ui/ if reused.
// =====================================================================

interface PartnerHeroProps {
  atlasPartners: Partner[];
  reduced: boolean;
}

/**
 * Cinematic hero. Layered gradient + scrolling marquee of partner logos
 * underneath the title. The marquee animates infinitely via CSS keyframe.
 */
function PartnerHero({ atlasPartners, reduced }: PartnerHeroProps) {
  // Subtle parallax on the title using scroll progress.
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useSmoothTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  // Logo strip — duplicated so the marquee can loop seamlessly.
  const logos = atlasPartners.filter((p) => p.logo).slice(0, 14);
  const marqueeLogos = [...logos, ...logos];

  return (
    <section
      ref={ref}
      className="relative bg-white text-neutral-900 pt-32 pb-20 sm:pt-44 sm:pb-28 overflow-hidden border-b border-neutral-100"
    >
      <Container className="relative">
        <motion.div style={{ y, opacity }}>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
            Catalogue · Partner Brands
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-4xl text-neutral-900">
            Brands that travel. <span className="text-primary">Trust that Stays.</span>
          </h1>
          <p className="mt-5 text-lg text-neutral-700 max-w-2xl leading-relaxed">
            From Lithuanian distilleries to Spanish vineyards and Ghanaian biscuit makers —
            an exclusive roster of suppliers, hand-picked for the West African market.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#catalogue"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-light transition-colors"
            >
              Browse the catalogue <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/quote"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-neutral-200 text-primary font-semibold hover:bg-neutral-50 transition-colors"
            >
              Get a quote
            </Link>
          </div>
        </motion.div>
      </Container>

      {/* Logo marquee band — sits along the bottom of the hero */}
      <div className="marquee-paused absolute bottom-0 left-0 right-0 py-5 bg-gradient-to-t from-neutral-50 to-transparent overflow-hidden">
        <div
          className={cn(
            'flex items-center gap-12 whitespace-nowrap',
            !reduced && 'marquee',
          )}
          style={{ width: 'max-content' }}
        >
          {marqueeLogos.map((p, i) => (
            <span key={`${p.slug}-${i}`} className="inline-flex items-center gap-2 shrink-0">
              {p.logo && (
                <img
                  src={p.logo}
                  alt={p.name}
                  width={240}
                  height={80}
                  decoding="async"
                  loading="lazy"
                  className="h-7 sm:h-8 w-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Helper: spring-smoothed transform for parallax. */
function useSmoothTransform(
  source: MotionValue<number>,
  input: number[],
  output: number[],
) {
  const transformed = useTransform(source, input, output);
  return useSpring(transformed, { stiffness: 80, damping: 20 });
}

interface StatProps {
  icon: typeof Award;
  value: number;
  label: string;
  suffix?: string;
}

function Stat({ icon: Icon, value, label, suffix }: StatProps) {
  // Count up when the stat enters the viewport. Cheap intersection
  // observer (no library) — plays once.
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate to value over ~1.4s with a simple ease.
          const start = performance.now();
          const dur = 1400;
          let raf = 0;
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setShown(Math.round(value * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          io.disconnect();
          return () => cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/5 text-primary mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-none">
        {shown}
        {suffix}
      </p>
      <p className="mt-2 text-xs uppercase tracking-widest font-semibold text-neutral-700">
        {label}
      </p>
    </div>
  );
}

interface FeaturedPartnerCardProps {
  partner: Partner;
  skuCount: number;
  onFilter: () => void;
  deepLink?: string;
  reduced: boolean;
  idx: number;
}

/**
 * Big feature card — TiltCard wrapper, full-color logo, country flag,
 * SKU count, "Explore" CTA. Goes to the dedicated landing page when one
 * exists, otherwise scroll-filters the catalogue.
 */
function FeaturedPartnerCard({
  partner,
  skuCount,
  onFilter,
  deepLink,
  reduced,
  idx,
}: FeaturedPartnerCardProps) {
  const flag = partner.country ? COUNTRY_FLAGS[partner.country] ?? '🌍' : null;

  const inner = (
    <TiltCard
      max={6}
      className="group relative h-full overflow-hidden rounded-2xl bg-white border border-neutral-100 p-6 shadow-soft hover:shadow-lift transition-shadow"
    >
      {/* Decorative corner accent */}
      <span
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-accent/15 blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="h-14 max-w-[60%] flex items-center">
            {partner.logo ? (
              <img
                src={partner.logo}
                alt={partner.name}
                width={480}
                height={160}
                decoding="async"
                loading="lazy"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="font-extrabold text-xl text-primary tracking-tight">
                {partner.name}
              </span>
            )}
          </div>
          {deepLink && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-amber-700">
              <Star className="w-3 h-3 fill-current" /> Featured
            </span>
          )}
        </div>

        <h3 className="text-xl font-extrabold text-neutral-900 leading-tight">
          {partner.name}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-700">
          {flag && partner.country && (
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <span className="text-base leading-none" aria-hidden="true">
                {flag}
              </span>
              {partner.country}
            </span>
          )}
          {partner.since && <span>· Since {partner.since}</span>}
        </div>

        <p className="mt-4 text-sm text-neutral-700 leading-relaxed flex-1">
          {partner.shortDescription}
        </p>

        <div className="mt-5 pt-4 border-t border-neutral-100 flex items-end justify-between gap-2">
          <div>
            <p className="text-2xl font-extrabold text-primary leading-none">
              {skuCount || partner.productCount || '—'}
            </p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-700/70 mt-1">
              {skuCount === 1 ? 'SKU' : 'SKUs'} ready
            </p>
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 text-sm font-bold transition-transform',
              !reduced && 'group-hover:translate-x-1',
              deepLink ? 'text-primary' : 'text-primary-light',
            )}
          >
            {deepLink ? 'Explore brand' : 'Filter catalogue'}
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </TiltCard>
  );

  // Wrap in motion + appropriate link/button.
  const wrapper = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: idx * 0.06 }}
      className="h-full"
    >
      {inner}
    </motion.div>
  );

  if (deepLink) {
    return (
      <Link to={deepLink} className="block h-full" aria-label={`${partner.name} brand page`}>
        {wrapper}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onFilter}
      className="text-left h-full"
      aria-label={`Filter catalogue by ${partner.name}`}
    >
      {wrapper}
    </button>
  );
}

interface AtlasPartnerCardProps {
  partner: Partner;
  skuCount: number;
  onFilter: () => void;
  deepLink?: string;
  idx: number;
}

/** Compact card for the full atlas grid — hover lift, logo or wordmark,
 *  small SKU pill. */
function AtlasPartnerCard({ partner, skuCount, onFilter, deepLink, idx }: AtlasPartnerCardProps) {
  const flag = partner.country ? COUNTRY_FLAGS[partner.country] ?? '🌍' : null;

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.4) }}
      whileHover={{ y: -4 }}
      className="group relative h-full rounded-xl bg-white border border-neutral-100 p-4 shadow-soft hover:shadow-lift hover:border-primary/30 transition-all"
    >
      <div className="aspect-[4/3] flex items-center justify-center overflow-hidden mb-3 grayscale group-hover:grayscale-0 transition-all">
        {partner.logo ? (
          <img
            src={partner.logo}
            alt={partner.name}
            width={480}
            height={360}
            decoding="async"
            loading="lazy"
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="font-extrabold text-base text-primary tracking-tight text-center px-2">
            {partner.name}
          </span>
        )}
      </div>
      <p className="text-xs font-bold text-neutral-900 truncate">{partner.name}</p>
      <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-700/80">
        <span className="inline-flex items-center gap-1">
          {flag && (
            <span className="leading-none" aria-hidden="true">
              {flag}
            </span>
          )}
          {partner.country ?? '—'}
        </span>
        <span className="font-semibold">
          {skuCount > 0 ? `${skuCount} SKU${skuCount === 1 ? '' : 's'}` : '·'}
        </span>
      </div>
      {deepLink && (
        <span className="absolute top-2 right-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-amber-700">
          <Star className="w-3 h-3 fill-current" />
        </span>
      )}
    </motion.div>
  );

  if (deepLink) {
    return (
      <Link to={deepLink} className="block h-full" aria-label={`${partner.name} brand page`}>
        {inner}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onFilter}
      className="block text-left h-full w-full"
      aria-label={`Filter catalogue by ${partner.name}`}
    >
      {inner}
    </button>
  );
}

/** Removable filter chip used in the active-filter strip. */
function Chip({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/15">
      {children}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove filter"
        className="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-primary/20 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

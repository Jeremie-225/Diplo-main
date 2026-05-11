import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Globe2,
  MessageSquareQuote,
  Package,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { LinkButton } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductCard } from '@/components/ui/ProductCard';
import { vilniausProducts } from '@/data/vilniausProducts';
import { getPartnerBySlug } from '@/data/partners';
import type { Product } from '@/types';

/**
 * Vilniaus Degtinė landing page.
 *
 * Lithuanian premium spirits distillery — one of Diplo's strategic
 * EXCLUSIVE_PARTNER suppliers. The page is structured as:
 *   1. Cinematic hero with typographic logo placeholder
 *   2. About — distillery heritage + partnership pitch
 *   3. Brand-by-brand product sections (8 brands, ~30 SKUs)
 *   4. Trust strip — why Diplo partners with Vilniaus
 *   5. Sticky mobile CTA + final quote-request banner
 *
 * Heritage notes are conservative — verifiable claims only. Founding
 * year (1897) is taken directly from the official Vilniaus Degtinė
 * logo — "Anno 1897".
 */

interface BrandSection {
  brand: string;
  blurb: string;
  highlight?: string;
}

// Curated brand order. Matches the way the Excel groups them and how
// Vilniaus presents the portfolio in their own materials.
const BRAND_ORDER: BrandSection[] = [
  {
    brand: 'El Galipote',
    blurb:
      'Caribbean rum and tropical spirit drinks. Sourced from the Dominican Republic, refined in Lithuania.',
    highlight: 'Flagship rum range',
  },
  {
    brand: 'Thorn',
    blurb: 'Modern London-style and pink gins, distilled in Lithuania.',
  },
  {
    brand: 'Missed Call',
    blurb: 'New-generation gins — London Dry and a punchy strawberry expression.',
    highlight: 'Newest launch',
  },
  {
    brand: 'Obeliu Crafted',
    blurb: 'Single-grain crafted vodka with a clean, balanced finish.',
  },
  {
    brand: '7 Senses',
    blurb: 'Herbal liqueurs and spirit drinks rooted in Lithuanian botanical tradition.',
  },
  {
    brand: 'Barska',
    blurb:
      'Vilniaus Degtinė\'s flagship vodka line — Premium and Classic across 1L, 0.7L, 0.5L, 0.2L and 0.1L formats, plus a five-flavour spirit-drink series.',
    highlight: 'Most ordered',
  },
  {
    brand: 'Admiral',
    blurb: 'Easy-pour vodka and gin pair — versatile workhorses for the on-trade.',
  },
  {
    brand: 'Čepkeliai',
    blurb: 'Forest-berry spirit drinks — cowberry, forest berry, and cranberry.',
  },
];

export default function VilniausDegtinePage() {
  const partner = getPartnerBySlug('vilniaus-degtine');

  // Group products by brand once.
  const byBrand = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const p of vilniausProducts) {
      const key = p.brand ?? 'Other';
      const arr = map.get(key) ?? [];
      arr.push(p);
      map.set(key, arr);
    }
    return map;
  }, []);

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-white text-neutral-900 pt-32 pb-24 sm:pt-40 sm:pb-28 overflow-hidden border-b border-neutral-100">
        <Container className="relative">
          {/* Breadcrumbs */}
          <nav className="text-xs text-neutral-500 mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-400">Partners</span>
            <span className="mx-2">/</span>
            <span className="text-neutral-900">Vilniaus Degtinė</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge tone="accent">
                  <Sparkles className="w-3 h-3" /> Exclusive partner
                </Badge>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 px-2 py-1 bg-neutral-100 rounded-full">
                  <Globe2 className="w-3.5 h-3.5" /> Lithuania 🇱🇹
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-neutral-900">
                Vilniaus Degtinė
              </h1>
              <p className="mt-3 text-lg text-primary font-semibold">
                Premium Lithuanian spirits — vodka, gin, rum, liqueurs.
              </p>

              <p className="mt-5 text-neutral-700 max-w-2xl leading-relaxed">
                {partner?.longDescription}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <LinkButton to="/quote?partner=vilniaus-degtine" variant="primary" size="lg">
                  Request a quote
                  <ArrowRight className="w-4 h-4" />
                </LinkButton>
                <LinkButton to="#brands" variant="outline" size="lg">
                  Explore brands
                </LinkButton>
              </div>
            </motion.div>

            {/* Real Vilniaus Degtinė logo (Anno 1897) on a soft card. */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="hidden lg:flex flex-col items-center justify-center bg-white border border-neutral-100 rounded-3xl px-10 py-10 min-w-[280px] shadow-lift"
              aria-label="Vilniaus Degtinė logo"
            >
              <img
                src={partner?.logo ?? ''}
                alt="Vilniaus Degtinė — Anno 1897"
                width={400}
                height={400}
                decoding="async"
                className="w-44 h-auto object-contain"
              />
              <span className="mt-4 text-[10px] uppercase tracking-[0.3em] text-neutral-700 font-semibold">
                UAB · Lithuania
              </span>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ─── Quick stats strip ────────────────────────────────────── */}
      <section className="bg-white border-b border-neutral-100">
        <Container>
          <div className="py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <Stat icon={Package} label="SKUs" value={`${vilniausProducts.length}+`} />
            <Stat icon={Sparkles} label="Brand families" value={`${byBrand.size}`} />
            <Stat icon={Clock} label="Lead time" value="4 weeks" />
            <Stat icon={Award} label="Partner status" value="Exclusive" />
          </div>
        </Container>
      </section>

      {/* ─── About / partnership pitch ────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-white border-t border-neutral-100">
        <Container size="lg">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs uppercase tracking-widest font-bold text-primary-light mb-3">
                About this partner
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
                A full Lithuanian spirits portfolio under one supplier.
              </h2>
              <div className="mt-5 space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Vilniaus Degtinė is one of Lithuania's established distilleries with a
                  catalogue spanning rum, gin, vodka, herbal liqueurs and flavoured spirit
                  drinks. For Diplo, that breadth is the strategic appeal — a single
                  exclusive partnership that fills several shelves at once across the
                  beverage category.
                </p>
                <p>
                  Their flagship <strong>Barska</strong> vodka line ships in five formats
                  (1L down to 0.1L hip-flasks) and is paired with five flavoured spirit
                  drinks — covering everything from on-trade pours to retail miniatures.
                  The <strong>El Galipote</strong> rum range is sourced from the Dominican
                  Republic and refined in Lithuania, giving Diplo a credible Caribbean
                  story for our markets.
                </p>
                <p className="text-sm text-neutral-700">
                  Vilniaus Degtinė carries the seal <em>Anno 1897</em> — over 125 years of
                  Lithuanian distilling heritage. The full distillery story is something
                  we can develop with the client for the final About section.
                </p>
              </div>
            </motion.div>

            {/* Why we partner with them */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl bg-white border border-neutral-100 shadow-soft p-7"
            >
              <p className="text-xs uppercase tracking-widest font-bold text-primary mb-4">
                Why we partner with Vilniaus
              </p>
              <ul className="space-y-3 text-sm text-neutral-700">
                {[
                  'EU-origin documentation across every SKU',
                  'EAN-coded products — easy retail integration',
                  'Multi-format Barska range (1L down to 100ml)',
                  'Predictable 4-week lead times',
                  'Eight brand families under one supplier contract',
                  'Caribbean rum credibility via El Galipote',
                ].map((reason) => (
                  <li key={reason} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </motion.aside>
          </div>
        </Container>
      </section>

      {/* ─── Brand-by-brand product sections ──────────────────────── */}
      <section id="brands" className="py-20 sm:py-24 bg-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-widest font-bold text-primary-light mb-3">
              The portfolio
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
              Eight brands. {vilniausProducts.length}+ SKUs.
            </h2>
            <p className="mt-3 text-neutral-700">
              All available for B2B order.{' '}
              <span className="font-semibold">Price on request.</span>
            </p>
          </div>

          <div className="space-y-16">
            {BRAND_ORDER.map((b) => {
              const products = byBrand.get(b.brand) ?? [];
              if (products.length === 0) return null;
              return (
                <motion.div
                  key={b.brand}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45 }}
                >
                  <div className="flex flex-wrap items-end justify-between gap-3 mb-6 pb-3 border-b-2 border-primary/10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                          {b.brand}
                        </h3>
                        {b.highlight && (
                          <Badge tone="accent">
                            {b.highlight}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-neutral-700 max-w-xl">{b.blurb}</p>
                    </div>
                    <span className="text-xs uppercase tracking-widest font-bold text-neutral-700/70">
                      {products.length} {products.length === 1 ? 'SKU' : 'SKUs'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {products.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── Trust strip ──────────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-neutral-100">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Trust icon={ShieldCheck} title="EU origin" body="Documented EU production and bottling." />
            <Trust icon={Package} title="Container loads" body="MOQs sized for 20ft and 40ft containers." />
            <Trust icon={Clock} title="4-week lead" body="Reliable, predictable shipping windows." />
            <Trust icon={MessageSquareQuote} title="Direct pricing" body="Quotes turned around in 24-48 hours." />
          </div>
        </Container>
      </section>

      {/* ─── Final CTA banner ─────────────────────────────────────── */}
      <section className="relative py-20 sm:py-24 bg-white border-t border-neutral-100 overflow-hidden">
        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-neutral-900">
              Interested in Vilniaus Degtinė products?
            </h2>
            <p className="mt-4 text-neutral-700 text-lg">
              Tell us which brands and volumes you're after — we'll confirm pricing and
              container availability within two business days.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <LinkButton to="/quote?partner=vilniaus-degtine" variant="primary" size="lg">
                Request a quote
                <ArrowRight className="w-4 h-4" />
              </LinkButton>
              <LinkButton to="/contact" variant="outline" size="lg">
                Talk to a sales rep
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Sticky mobile CTA — only on small screens ────────────── */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-30 pointer-events-none">
        <Link
          to="/quote?partner=vilniaus-degtine"
          className="pointer-events-auto flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-accent text-primary font-bold shadow-lift hover:bg-accent-warm transition-colors"
        >
          Request a quote <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  );
}

interface StatProps {
  icon: typeof Package;
  label: string;
  value: string;
}
function Stat({ icon: Icon, label, value }: StatProps) {
  return (
    <div>
      <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/5 text-primary mb-2">
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-extrabold text-neutral-900 leading-none">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest font-semibold text-neutral-700">
        {label}
      </p>
    </div>
  );
}

function Trust({ icon: Icon, title, body }: { icon: typeof Package; title: string; body: string }) {
  return (
    <div>
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-bold text-neutral-900">{title}</p>
      <p className="mt-1 text-sm text-neutral-700 leading-relaxed">{body}</p>
    </div>
  );
}

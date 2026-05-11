import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Cookie,
  Download,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  CheckCircle2,
  Globe2,
  Heart,
  Factory,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { LinkButton } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductCard } from '@/components/ui/ProductCard';
import { massIndustriesProducts } from '@/data/massIndustriesProducts';
import { getPartnerBySlug } from '@/data/partners';
import type { Product } from '@/types';

/**
 * Mass Industries landing page.
 *
 * Ghana-based biscuit and wafer manufacturer (Tema Industrial Area).
 * Diplo distributes their four brand families: All Day, Bonita, Lola
 * Biggy, and Supreme. Address and contact details are pulled directly
 * from the back cover of the Bonita Catalogue 2025.
 *
 * Product data is currently placeholder-level — we have category labels
 * but not exact SKU lists or prices. TODO comments flag the open items.
 */

interface BrandSection {
  brand: string;
  blurb: string;
  highlight?: string;
}

const BRAND_ORDER: BrandSection[] = [
  {
    brand: 'All Day',
    blurb: 'Everyday biscuits — oats, digestives, and the new Supreme wafers.',
    highlight: 'Everyday range',
  },
  {
    brand: 'Bonita',
    blurb: 'Coconut shortcake and multi-flavour wafers — Mass Industries\' flagship line.',
  },
  {
    brand: 'Lola Biggy',
    blurb: 'Multi-flavour cream wafers in bright family-friendly packaging.',
  },
  {
    brand: 'Supreme',
    blurb: 'Premium wafer expressions — the upmarket sibling of the Bonita line.',
    highlight: 'Premium tier',
  },
];

export default function MassIndustriesPage() {
  const partner = getPartnerBySlug('mass-industries');

  const byBrand = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const p of massIndustriesProducts) {
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
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-amber-100 pt-32 pb-24 sm:pt-40 sm:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(252,211,77,0.35),transparent_50%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_10%_85%,rgba(251,191,36,0.25),transparent_50%)]"
          aria-hidden="true"
        />

        <Container className="relative">
          <nav className="text-xs text-neutral-700 mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-700/70">Partners</span>
            <span className="mx-2">/</span>
            <span className="text-neutral-900 font-semibold">Mass Industries</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge tone="primary">
                  <Sparkles className="w-3 h-3" /> Featured partner
                </Badge>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 px-2 py-1 bg-white/70 backdrop-blur-sm rounded-full">
                  <Globe2 className="w-3.5 h-3.5" /> Ghana 🇬🇭
                </span>
                {partner?.since && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 px-2 py-1 bg-white/70 backdrop-blur-sm rounded-full">
                    Since {partner.since}
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-neutral-900">
                Mass Industries
              </h1>
              <p className="mt-3 text-lg text-primary font-semibold italic">
                "Where quality meets flavor in every crunch!"
              </p>

              <p className="mt-5 text-neutral-700 max-w-2xl leading-relaxed">
                {partner?.longDescription}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <LinkButton to="/quote?partner=mass-industries" variant="primary" size="lg">
                  Request a quote
                  <ArrowRight className="w-4 h-4" />
                </LinkButton>
                {partner?.hasCatalog && partner.catalogUrl && (
                  <a
                    href={partner.catalogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/80 backdrop-blur-sm border border-neutral-200 font-semibold text-neutral-900 hover:bg-white hover:border-primary/30 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download catalogue (PDF)
                  </a>
                )}
              </div>
            </motion.div>

            {/* Typographic logo placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="hidden lg:flex flex-col items-center justify-center bg-white border-2 border-primary/20 rounded-3xl px-10 py-12 min-w-[280px] shadow-soft"
              aria-label="Mass Industries wordmark"
            >
              <Cookie className="w-10 h-10 text-accent-warm mb-3" />
              <span className="font-extrabold text-2xl text-primary tracking-tight text-center leading-tight">
                MASS<br />INDUSTRIES
              </span>
              <span className="mt-2 text-[10px] uppercase tracking-widest text-neutral-700">
                Tema · Ghana
              </span>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ─── Quick stats ──────────────────────────────────────────── */}
      <section className="bg-white border-b border-neutral-100">
        <Container>
          <div className="py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <Stat icon={Cookie} label="Brand families" value={`${byBrand.size}`} />
            <Stat icon={Factory} label="HQ" value="Tema, GH" />
            <Stat icon={Sparkles} label="Heritage" value="11+ yrs" />
            <Stat icon={Heart} label="Made in" value="Ghana 🇬🇭" />
          </div>
        </Container>
      </section>

      {/* ─── About / partnership pitch ────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-neutral-50">
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
                A Ghana–Ghana partnership in Diplo's food category.
              </h2>
              <div className="mt-5 space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Mass Industries has been crafting biscuits and wafers in Tema for over a
                  decade — long enough to earn shelves across Ghanaian supermarkets and
                  corner shops. Their tagline says it best:{' '}
                  <em>"Where quality meets flavor in every crunch!"</em>
                </p>
                <p>
                  For Diplo, the partnership is meaningful in two ways: <strong>local
                  production</strong> means short supply chains, and <strong>four
                  consumer brand families</strong> (All Day, Bonita, Lola Biggy, Supreme)
                  cover everything from everyday digestives to premium wafer treats.
                </p>
                <p className="text-xs text-neutral-700/80 italic">
                  {/* TODO: Replace placeholder SKU list with the real Mass Industries
                      product catalogue (names, EANs, prices) once received from client. */}
                  Full SKU list and per-pack pricing to be confirmed with the client.
                </p>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl bg-white border border-neutral-100 shadow-soft p-7"
            >
              <p className="text-xs uppercase tracking-widest font-bold text-primary mb-4">
                Why we partner with Mass Industries
              </p>
              <ul className="space-y-3 text-sm text-neutral-700">
                {[
                  'Ghana-made — supports the local manufacturing economy',
                  'Four distinct brand families covering the full price ladder',
                  'Both biscuits and wafers under one supplier',
                  'Established 11+ year manufacturer in Tema Industrial Area',
                  'Short supply chain — no import freight on biscuits',
                  'Halal-friendly recipes and wide retail acceptance',
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
              Four brand families.
            </h2>
            <p className="mt-3 text-neutral-700">
              All available for B2B order. <span className="font-semibold">Price on request.</span>
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
                  <div className="flex flex-wrap items-end justify-between gap-3 mb-6 pb-3 border-b-2 border-accent/20">
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
                      {products.length} {products.length === 1 ? 'item' : 'items'}
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

          {/* Catalogue CTA */}
          {partner?.hasCatalog && partner.catalogUrl && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4 }}
              className="mt-16 max-w-3xl mx-auto rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 p-8 text-center"
            >
              <Download className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-extrabold text-neutral-900">
                Browse the full Bonita catalogue
              </h3>
              <p className="mt-2 text-neutral-700">
                Visual reference for every Mass Industries pack we distribute. Ideal for
                buyers and shelf planners.
              </p>
              <a
                href={partner.catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-light transition-colors"
              >
                <Download className="w-4 h-4" /> Download PDF (9 MB)
              </a>
            </motion.div>
          )}
        </Container>
      </section>

      {/* ─── Manufacturer contact card ────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-neutral-50">
        <Container>
          <div className="max-w-3xl mx-auto rounded-2xl bg-white border border-neutral-100 shadow-soft p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary text-white">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-primary">
                  Manufacturer
                </p>
                <p className="font-extrabold text-lg text-neutral-900">Mass Industries Ghana</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-5 text-sm">
              <ContactItem
                icon={MapPin}
                label="Address"
                value={
                  <>
                    Plot #A2/11 Tema Industrial Area
                    <br />
                    P.O. Box CT 3174, Cantonments
                    <br />
                    Accra, Ghana
                  </>
                }
              />
              <ContactItem
                icon={Phone}
                label="Phone"
                value={
                  <>
                    +233 (0) 303 966 524
                    <br />
                    <span className="text-xs text-neutral-700/80">
                      Fax: +233 (0) 302 231 854
                    </span>
                  </>
                }
              />
              <ContactItem
                icon={Mail}
                label="Email"
                value={
                  <a href="mailto:info@mass-ind.com" className="hover:text-primary">
                    info@mass-ind.com
                  </a>
                }
              />
            </div>

            <p className="mt-6 text-xs text-neutral-700/80">
              <strong>Note:</strong> these are the manufacturer's direct details. For
              orders or bulk pricing, please contact Diplo FZE Limited via the quote form.
            </p>
          </div>
        </Container>
      </section>

      {/* ─── Final CTA banner ─────────────────────────────────────── */}
      <section className="relative py-20 sm:py-24 gradient-primary text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(252,211,77,0.2),transparent_55%)]"
          aria-hidden="true"
        />
        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Want Mass Industries on your shelves?
            </h2>
            <p className="mt-4 text-white/85 text-lg">
              Tell us which brand families and pack formats you're after — we'll respond
              with current availability and B2B pricing.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <LinkButton to="/quote?partner=mass-industries" variant="accent" size="lg">
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

      {/* Sticky mobile CTA */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-30 pointer-events-none">
        <Link
          to="/quote?partner=mass-industries"
          className="pointer-events-auto flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-primary text-white font-bold shadow-lift hover:bg-primary-light transition-colors"
        >
          Request a quote <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  );
}

interface StatProps {
  icon: typeof Cookie;
  label: string;
  value: string;
}
function Stat({ icon: Icon, label, value }: StatProps) {
  return (
    <div>
      <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-accent/20 text-amber-700 mb-2">
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-extrabold text-neutral-900 leading-none">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest font-semibold text-neutral-700">
        {label}
      </p>
    </div>
  );
}

interface ContactItemProps {
  icon: typeof MapPin;
  label: string;
  value: React.ReactNode;
}
function ContactItem({ icon: Icon, label, value }: ContactItemProps) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-primary mb-2">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className="text-neutral-900 leading-relaxed">{value}</p>
    </div>
  );
}

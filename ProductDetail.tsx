import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight, Check, Package, X, ZoomIn, Globe, Boxes, Wine, Download } from 'lucide-react';
import { ProductCapacityPanels } from '@/components/products/ProductCapacityPanels';
import { Container } from '@/components/ui/Container';
import { LinkButton } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LazyImage } from '@/components/ui/LazyImage';
import { ProductCard } from '@/components/ui/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { ownProducts } from '@/data/ownProducts';
import { vilniausProducts } from '@/data/vilniausProducts';
import { partnerProducts } from '@/data/partnerProducts';
import { massIndustriesProducts } from '@/data/massIndustriesProducts';
import { getCategoryById } from '@/data/categories';
import { getPartnerBySlug } from '@/data/partners';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { partnerTypeLabel, cn } from '@/lib/utils';

interface Props {
  /** Which slice of products to look in. Determined by the route. */
  kind: 'own' | 'partner';
}

const partnerTone: Record<string, 'success' | 'accent' | 'primary' | 'neutral'> = {
  PRIVATE_LABEL: 'accent',
  EXCLUSIVE_PARTNER: 'primary',
  PARTNER: 'neutral',
};

/**
 * Product detail page — handles both Private Label-brand SKUs (under
 * /products/own/:slug) and partner SKUs (under /products/partners/:slug).
 * The `kind` prop, supplied by the router, narrows the lookup pool so a
 * partner slug doesn't accidentally match an own-brand product (and
 * vice-versa) when slugs collide.
 */
export default function ProductDetail({ kind }: Props) {
  const { slug } = useParams<{ slug: string }>();

  // Pick the right lookup pool based on which sub-route we're on.
  const pool =
    kind === 'own'
      ? ownProducts
      : [...partnerProducts, ...vilniausProducts, ...massIndustriesProducts];
  const product = pool.find((p) => p.slug === slug);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const scrollY = useScrollPosition();

  // Close lightbox on Esc
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  if (!product) return <Navigate to="/products" replace />;

  const category = getCategoryById(product.categoryId);
  const partner = product.partnerSlug ? getPartnerBySlug(product.partnerSlug) : undefined;

  // Related products — same category, different SKU. Pull from full pool.
  const related = mockProducts
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 3);

  // Mobile sticky CTA — slides up after the user scrolls past the hero.
  const stickyVisible = scrollY > 300;

  // Build a row of "spec" entries that we'll render as a clean table.
  const specs: Array<[string, string]> = [];
  if (product.brand) specs.push(['Brand', product.brand]);
  if (product.code) specs.push(['SKU', product.code]);
  if (product.origin) specs.push(['Origin', product.origin]);
  if (product.supplier) specs.push(['Supplier', product.supplier]);
  if (product.packing) specs.push(['Packing', product.packing]);
  if (product.volume) specs.push(['Volume', product.volume]);
  if (product.alcoholContent !== undefined) specs.push(['Alcohol', `${product.alcoholContent}% ABV`]);
  if (product.ean) specs.push(['EAN', product.ean]);
  if (product.moq !== undefined) specs.push(['MOQ', `${product.moq} bottles`]);
  if (product.leadTimeWeeks !== undefined) specs.push(['Lead time', `${product.leadTimeWeeks} weeks`]);
  if (product.containerQty !== undefined) specs.push(['Per container', `${product.containerQty} units`]);
  if (product.tcSize !== undefined) specs.push(['Container', `${product.tcSize}ft`]);

  return (
    <>
      <section className="bg-neutral-50 pt-28 pb-6 sm:pt-32">
        <Container>
          {/* Breadcrumbs */}
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm text-neutral-700/80"
          >
            <ol className="flex items-center flex-wrap gap-1.5">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li>
                <Link
                  to={kind === 'own' ? '/products/own' : '/products/partners'}
                  className="hover:text-primary transition-colors"
                >
                  {kind === 'own' ? 'Private Label Brands' : 'Partner Brands'}
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li className="text-neutral-900 font-semibold scale-105 origin-left">
                {product.name}
              </li>
            </ol>
          </motion.nav>
        </Container>
      </section>

      <section className="bg-white py-10">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Image */}
            <div>
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Open image lightbox"
                className="block w-full group relative aspect-square rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100"
              >
                <LazyImage
                  src={product.image}
                  alt={product.name}
                  wrapperClassName="absolute inset-0"
                  className="transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5" />
                  Zoom
                </span>
              </button>
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-3">
                {category && (
                  <Link
                    to={`/products/${kind === 'own' ? 'own' : 'partners'}?category=${category.slug}`}
                    className="text-xs uppercase tracking-widest text-primary-light font-semibold hover:underline"
                  >
                    {category.name}
                  </Link>
                )}
                <Badge tone={partnerTone[product.partnerType] ?? 'neutral'}>
                  {partnerTypeLabel(product.partnerType)}
                </Badge>
                {partner && (
                  <Link
                    to={
                      partner.slug === 'vilniaus-degtine'
                        ? '/partners/vilniaus-degtine'
                        : partner.slug === 'mass-industries'
                          ? '/partners/mass-industries'
                          : '/products/partners'
                    }
                    className="text-xs font-semibold text-neutral-700 hover:text-primary inline-flex items-center gap-1"
                  >
                    {partner.name}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
                {product.name}
              </h1>

              {/* "Price on request" — Diplo never publishes prices */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-1.5">
                <span className="text-sm font-bold text-primary">Price on request</span>
              </div>

              {product.description && (
                <p className="mt-5 text-neutral-700 leading-relaxed">{product.description}</p>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <LinkButton
                  to={`/quote?product=${product.slug}`}
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Request a Quote
                </LinkButton>
                <LinkButton to="/contact" variant="outline" size="lg">
                  Ask a question
                </LinkButton>
              </div>

              {/* Quick perks */}
              <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-neutral-700">
                {[
                  'Quality-checked',
                  'Volume pricing',
                  'Reliable delivery',
                  'Dedicated support',
                ].map((perk, i) => (
                  <motion.li
                    key={perk}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="inline-flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-success" /> {perk}
                  </motion.li>
                ))}
              </ul>

              {/* Specs table */}
              {specs.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-3 inline-flex items-center gap-2">
                    <Package className="w-4 h-4" /> Product details
                  </h2>
                  <div className="rounded-xl border border-neutral-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        {specs.map(([key, value], i) => (
                          <motion.tr
                            key={key}
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ delay: i * 0.04, duration: 0.35 }}
                            className={cn(i % 2 === 0 ? 'bg-neutral-50' : 'bg-white')}
                          >
                            <th
                              scope="row"
                              className="text-left px-4 py-2.5 font-medium text-neutral-700 w-1/3"
                            >
                              {key}
                            </th>
                            <td className="px-4 py-2.5 text-neutral-900">{value}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sommelier tasting notes — wine SKUs that ship with notes */}
              {product.tastingNotes && (
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4 }}
                  className="mt-8 rounded-2xl bg-gradient-to-br from-primary/5 via-white to-accent/10 border border-primary/15 p-6"
                  aria-labelledby="tasting-notes-heading"
                >
                  <h2
                    id="tasting-notes-heading"
                    className="text-sm font-semibold uppercase tracking-wider text-primary mb-3 inline-flex items-center gap-2"
                  >
                    <Wine className="w-4 h-4" /> Sommelier notes
                  </h2>
                  <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    {product.tastingNotes.appearance && (
                      <div>
                        <dt className="font-bold text-neutral-900">Appearance</dt>
                        <dd className="text-neutral-700 leading-relaxed">
                          {product.tastingNotes.appearance}
                        </dd>
                      </div>
                    )}
                    {product.tastingNotes.nose && (
                      <div>
                        <dt className="font-bold text-neutral-900">Nose</dt>
                        <dd className="text-neutral-700 leading-relaxed">
                          {product.tastingNotes.nose}
                        </dd>
                      </div>
                    )}
                    {product.tastingNotes.palate && (
                      <div>
                        <dt className="font-bold text-neutral-900">Palate</dt>
                        <dd className="text-neutral-700 leading-relaxed">
                          {product.tastingNotes.palate}
                        </dd>
                      </div>
                    )}
                    {product.tastingNotes.pairing && (
                      <div>
                        <dt className="font-bold text-neutral-900">Pairing</dt>
                        <dd className="text-neutral-700 leading-relaxed">
                          {product.tastingNotes.pairing}
                        </dd>
                      </div>
                    )}
                  </dl>
                </motion.section>
              )}

              {/* Brochure download — wine tasting notes PDF, MAX12 brand toolkit, etc. */}
              {product.brochureUrl && (
                <a
                  href={product.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-primary/20 text-primary font-semibold hover:bg-primary/5 hover:border-primary transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {product.categoryId === 'energy-drink'
                    ? 'Download MAX12 brand toolkit (PDF)'
                    : 'Download tasting notes (PDF)'}
                </a>
              )}

              {/* Logistic chips */}
              <div className="mt-6 flex flex-wrap gap-3">
                {product.origin && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-100 text-neutral-700">
                    <Globe className="w-3.5 h-3.5" />
                    {product.origin}
                  </span>
                )}
                {product.containerQty !== undefined && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-100 text-neutral-700">
                    <Boxes className="w-3.5 h-3.5" />
                    {product.containerQty} per container
                  </span>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Logistics & carton info — three accordions: carton specs,
          per-container capacity, per-vehicle capacity. */}
      <section className="bg-neutral-50/60 py-10 sm:py-12 border-t border-neutral-100">
        <Container>
          <div className="mb-5">
            <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">
              Logistics & Capacity
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              How much fits per shipment?
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-2xl">
              Carton dimensions, container capacity, and vehicle capacity for{' '}
              <strong>{product.name}</strong>. Useful for buyers planning bulk
              orders.
            </p>
          </div>
          <ProductCapacityPanels
            carton={product.carton}
            unitLabel={product.unit_label}
          />
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-neutral-50 py-16">
          <Container>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Related products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} noTilt />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Mobile sticky CTA */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            className="lg:hidden fixed bottom-0 inset-x-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-neutral-100 shadow-lift"
          >
            <div className="flex items-center justify-between gap-3 max-w-xl mx-auto">
              <div className="min-w-0">
                <p className="text-xs text-neutral-700/70 truncate">{product.name}</p>
                <p className="text-sm font-bold text-primary">Price on request</p>
              </div>
              <LinkButton
                to={`/quote?product=${product.slug}`}
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Request Quote
              </LinkButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Product image fullscreen"
            className="fixed inset-0 z-[80] bg-neutral-900/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              src={product.image}
              alt={product.name}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[85vh] rounded-2xl shadow-lift"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Package, Users, FileDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { partners } from '@/data/partners';
import { ownProducts } from '@/data/ownProducts';
import { partnerProducts } from '@/data/partnerProducts';
import { vilniausProducts } from '@/data/vilniausProducts';
import { massIndustriesProducts } from '@/data/massIndustriesProducts';

/**
 * /products — landing/index page.  Two large path-cards funnel visitors
 * into either Own Brands or Partner Brands.  Below, a brand wall preview
 * shows the major partner logos so the page feels alive even before you
 * click into a category.
 */
export default function ProductsLanding() {
  const ownCount = ownProducts.length;
  const partnerCount = partnerProducts.length + vilniausProducts.length + massIndustriesProducts.length;

  return (
    <>
      {/* Header band */}
      <section className="gradient-primary text-white pt-32 pb-20 sm:pt-40 sm:pb-24 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(252,211,77,0.18),transparent_55%)]"
          aria-hidden="true"
        />
        <Container className="relative">
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
            Catalogue
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl">
            Two paths into the Diplo catalogue.
          </h1>
          <p className="mt-5 text-lg text-white/85 max-w-2xl">
            Diplo distributes both private-label brands we own and an exclusive list of
            international supplier partners. Choose where to start.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-sm">
            <FileDown className="w-4 h-4 text-accent" />
            <a href="/catalogs/diplo-catalogue-2026.pdf" className="hover:text-accent" target="_blank" rel="noopener noreferrer">
              Download the 2026 catalogue (PDF)
            </a>
          </div>
        </Container>
      </section>

      {/* Two big path-cards */}
      <section className="py-20 sm:py-24 bg-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                to: '/products/own',
                icon: Package,
                title: 'Private Label Brands',
                count: ownCount,
                copy: 'Private-label beverages and select foods we develop, source, and distribute under our own labels — MATZ, Mama Mia, 4KING, Chateau San Nicola, and more.',
                bg: 'bg-gradient-to-br from-primary to-primary-light',
              },
              {
                to: '/products/partners',
                icon: Users,
                title: 'Partner Brands',
                count: partnerCount,
                copy: 'International suppliers we distribute exclusively in the region — Vilniaus Degtinė, Grands Chais De France, Allied Blenders, Slaur Sardet, Four Cousins, and more.',
                bg: 'bg-gradient-to-br from-neutral-900 to-primary',
              },
            ].map((c, idx) => (
              <motion.div
                key={c.to}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link
                  to={c.to}
                  className={`group relative block ${c.bg} text-white rounded-3xl p-8 sm:p-10 overflow-hidden h-full hover:shadow-lift transition-all`}
                >
                  <div
                    aria-hidden="true"
                    className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-accent/20 blur-3xl opacity-60 group-hover:opacity-90 transition-opacity"
                  />
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/15 backdrop-blur mb-5 text-accent">
                      <c.icon className="w-6 h-6" />
                    </div>
                    <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
                      {c.count}+ products
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">{c.title}</h2>
                    <p className="text-white/85 leading-relaxed mb-6">{c.copy}</p>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-accent group-hover:gap-2 transition-all">
                      Browse
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured partners brand wall */}
      <section className="py-20 sm:py-24 bg-neutral-50">
        <Container>
          <SectionHeading
            eyebrow="Featured partners"
            title="Distribution partners with dedicated landing pages."
            description="Our two flagship partners have their own deep-dive pages — explore the full range and brand stories."
          />
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {partners
              .filter((p) => p.slug === 'vilniaus-degtine' || p.slug === 'mass-industries')
              .map((p) => (
                <Link
                  key={p.slug}
                  to={`/partners/${p.slug}`}
                  className="group block bg-white p-7 rounded-2xl border border-neutral-100 shadow-soft hover:shadow-lift transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest font-semibold text-primary-light mb-1">
                        {p.country}
                      </p>
                      <h3 className="text-2xl font-extrabold text-primary">{p.name}</h3>
                    </div>
                    <ArrowRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-neutral-700 leading-relaxed">{p.shortDescription}</p>
                  {p.productCount !== undefined && (
                    <p className="mt-4 text-xs font-semibold text-neutral-700/70">
                      {p.productCount}+ SKUs
                    </p>
                  )}
                </Link>
              ))}
          </div>
        </Container>
      </section>
    </>
  );
}

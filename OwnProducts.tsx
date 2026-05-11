import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileDown, X, SearchX } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/ui/ProductCard';
import { ownProducts } from '@/data/ownProducts';
import { categories } from '@/data/categories';
import { cn } from '@/lib/utils';

const ALL = 'all';

/**
 * Private Label Brands list page.  Sidebar shows category filters; main area
 * shows a search bar and a responsive grid of own-brand SKUs.  Catalogue
 * download CTA at the top.
 */
export default function OwnProducts() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>(ALL);

  // Per-category counts so we can show a nice "(N)" next to each chip.
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of ownProducts) {
      map.set(p.categoryId, (map.get(p.categoryId) ?? 0) + 1);
    }
    return map;
  }, []);

  // Only show categories that actually have at least one own-brand SKU.
  const usedCategories = categories.filter((c) => counts.has(c.id));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = ownProducts;
    if (category !== ALL) list = list.filter((p) => p.categoryId === category);
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand?.toLowerCase().includes(q) ?? false) ||
          (p.shortDescription?.toLowerCase().includes(q) ?? false),
      );
    }
    return list;
  }, [query, category]);

  return (
    <>
      <section className="bg-white pt-28 pb-10 sm:pt-32 border-b border-neutral-100">
        <Container>
          <p className="text-xs uppercase tracking-widest text-primary-light font-semibold mb-2">
            Catalogue · Private Label Brands
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900">
            Private Label Brands
          </h1>
          <p className="mt-3 text-neutral-700 max-w-2xl">
            Private-label beverages and foods developed and sourced by Diplo — distributed across
            West Africa under our own labels.
          </p>
          <a
            href="/catalogs/diplo-catalogue-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:bg-primary-light transition-colors"
          >
            <FileDown className="w-4 h-4" /> Download Catalogue 2026 (PDF)
          </a>
        </Container>
      </section>

      <section className="py-12 bg-white">
        <Container>
          <div className="grid lg:grid-cols-[240px_1fr] gap-8">
            {/* Sidebar */}
            <aside className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-3">
                Categories
              </h2>
              <ul className="space-y-1">
                {[{ id: ALL, name: 'All products' }, ...usedCategories].map((c) => {
                  const count = c.id === ALL ? ownProducts.length : counts.get(c.id) ?? 0;
                  const isActive = category === c.id;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between gap-2',
                          isActive
                            ? 'bg-primary text-white font-semibold shadow-soft'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary',
                        )}
                      >
                        <span className="truncate">{c.name}</span>
                        <span
                          className={cn(
                            'inline-flex items-center justify-center px-1.5 min-w-[1.5rem] h-5 rounded-full text-[11px] font-semibold',
                            isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-700',
                          )}
                        >
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            <div>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-700/60" />
                <input
                  type="search"
                  placeholder="Search Private Label brands..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search products"
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

              <p className="text-sm text-neutral-700 mb-4">
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              </p>

              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-neutral-100 text-primary mb-4 shadow-soft">
                    <SearchX className="w-8 h-8" />
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 mb-1">No matches.</h3>
                  <p className="text-sm text-neutral-700">Try a different category or search term.</p>
                </div>
              ) : (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} noTilt />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

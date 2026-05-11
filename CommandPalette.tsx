import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, ArrowRight, Package, Home, Phone, Briefcase, FileQuestion, Building2, Users } from 'lucide-react';
import { mockProducts } from '@/data/mockProducts';
import { partners } from '@/data/partners';
import { cn } from '@/lib/utils';

interface Item {
  id: string;
  label: string;
  hint: string;
  group: 'Pages' | 'Products' | 'Partners';
  to: string;
  icon: typeof Search;
}

const PAGES: Item[] = [
  { id: 'p-home', label: 'Home', hint: 'Landing page', group: 'Pages', to: '/', icon: Home },
  { id: 'p-about', label: 'About', hint: 'Our story', group: 'Pages', to: '/about', icon: Building2 },
  { id: 'p-products', label: 'Products', hint: 'Browse the catalog', group: 'Pages', to: '/products', icon: Package },
  { id: 'p-products-own', label: 'Private Label Brands', hint: 'Private-label range', group: 'Pages', to: '/products/own', icon: Package },
  { id: 'p-products-partners', label: 'Partner Brands', hint: 'International suppliers', group: 'Pages', to: '/products/partners', icon: Users },
  { id: 'p-services', label: 'Services', hint: 'What we do', group: 'Pages', to: '/services', icon: Briefcase },
  { id: 'p-contact', label: 'Contact', hint: 'Reach our team', group: 'Pages', to: '/contact', icon: Phone },
  { id: 'p-quote', label: 'Request a quote', hint: 'Tell us what you need', group: 'Pages', to: '/quote', icon: FileQuestion },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Spotlight-style command palette. Triggered by ⌘K / Ctrl+K (handled by the
 * provider further up the tree). Navigates pages, products, and news.
 *
 * Keyboard:
 *  - ArrowUp/ArrowDown move the highlighted row
 *  - Enter routes to it
 *  - Esc closes the palette
 */
export function CommandPalette({ open, onClose }: Props) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  // Reset when opening so each invocation feels fresh.
  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      // Focus the input after the modal animates in
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Build a flat searchable list — this is small enough that we don't need
  // a fuzzy matcher; simple includes() works great.
  const allItems = useMemo<Item[]>(() => {
    const products: Item[] = mockProducts.map((p) => ({
      id: `pr-${p.id}`,
      label: p.name,
      hint: p.shortDescription ?? p.brand ?? '',
      group: 'Products',
      to: p.isOwnBrand ? `/products/own/${p.slug}` : `/products/partners/${p.slug}`,
      icon: Package,
    }));
    const partnerItems: Item[] = partners.map((p) => ({
      id: `pa-${p.slug}`,
      label: p.name,
      hint: p.shortDescription ?? p.country ?? '',
      group: 'Partners',
      to: p.slug === 'vilniaus-degtine'
        ? '/partners/vilniaus-degtine'
        : p.slug === 'mass-industries'
          ? '/partners/mass-industries'
          : `/products/partners?supplier=${p.slug}`,
      icon: Users,
    }));
    return [...PAGES, ...products, ...partnerItems];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems.slice(0, 12);
    return allItems
      .filter(
        (i) =>
          i.label.toLowerCase().includes(q) ||
          i.hint.toLowerCase().includes(q) ||
          i.group.toLowerCase().includes(q),
      )
      .slice(0, 20);
  }, [query, allItems]);

  // Keep `active` in range as the filtered list changes.
  useEffect(() => {
    if (active >= filtered.length) setActive(0);
  }, [filtered.length, active]);

  // Lock body scroll while open + global keyboard handling.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(filtered.length - 1, a + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = filtered[active];
        if (item) {
          navigate(item.to);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, navigate, filtered, active]);

  // Group display ordering
  const groups: Item['group'][] = ['Pages', 'Products', 'Partners'];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center pt-[12vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-lift border border-neutral-100 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
              <Search className="w-5 h-5 text-neutral-700/60" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, articles, pages..."
                className="flex-1 bg-transparent outline-none text-sm placeholder-neutral-700/50"
                aria-label="Search"
              />
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-neutral-700/70 bg-neutral-100 rounded">
                ESC
              </kbd>
            </div>

            <div className="max-h-[55vh] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-neutral-700">
                  No matches for "{query}".
                </p>
              ) : (
                groups.map((g) => {
                  const items = filtered.filter((i) => i.group === g);
                  if (items.length === 0) return null;
                  return (
                    <div key={g} className="mb-1">
                      <p className="px-4 py-1.5 text-[10px] uppercase tracking-widest font-semibold text-neutral-700/60">
                        {g}
                      </p>
                      <ul role="listbox">
                        {items.map((i) => {
                          const idx = filtered.indexOf(i);
                          const isActive = idx === active;
                          const Icon = i.icon;
                          return (
                            <li key={i.id}>
                              <button
                                type="button"
                                role="option"
                                aria-selected={isActive}
                                onMouseEnter={() => setActive(idx)}
                                onClick={() => {
                                  navigate(i.to);
                                  onClose();
                                }}
                                className={cn(
                                  'w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors',
                                  isActive ? 'bg-primary/5' : 'hover:bg-neutral-50',
                                )}
                              >
                                <span
                                  className={cn(
                                    'inline-flex w-8 h-8 items-center justify-center rounded-lg shrink-0',
                                    isActive
                                      ? 'bg-primary text-white'
                                      : 'bg-neutral-100 text-neutral-700',
                                  )}
                                >
                                  <Icon className="w-4 h-4" />
                                </span>
                                <span className="flex-1 min-w-0">
                                  <span className="block font-medium text-neutral-900 truncate">
                                    {i.label}
                                  </span>
                                  <span className="block text-xs text-neutral-700/70 truncate">
                                    {i.hint}
                                  </span>
                                </span>
                                {isActive && (
                                  <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-4 py-2 text-[11px] text-neutral-700/70 border-t border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-neutral-100 rounded font-semibold">↑↓</kbd>
                  navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-neutral-100 rounded font-semibold">↵</kbd>
                  open
                </span>
              </div>
              <span>Diplo</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;

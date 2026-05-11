/**
 * SimulatorProductBrowser — dark-theme product grid for `/simulate`.
 *
 * Phase 2.2 cards now show:
 *   • Image header
 *   • Name + category
 *   • Carton spec line (units / dims / weight)
 *   • Container capacity table (one row per of 20ft / 40ft / 40ft HC),
 *     useMemo-cached. Each row shows count + the limiting factor badge
 *     (volume vs weight). Counts cap at 99,999+.
 *   • FILL TO buttons — 25% / 50% / 75% / 100% — each computes the
 *     quantity that brings THIS product to that target percentage of
 *     the active cargo space, accounting for items already in the cart.
 *   • Stepper (− / draft input / +).
 *
 * All quantity commits go through `setQuantityCapped` from the cart
 * hook, which auto-clamps to whatever fits and reports `{ value, capped,
 * reason }`. The card toasts when a click resulted in clamping.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Minus, X, AlertTriangle, Package, Weight, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import {
  ALL_SIMULATOR_PRODUCTS,
  type LimitReason,
} from '@/hooks/useSimulationCart';
import { QuantityInput } from '@/components/simulator/QuantityInput';
import { CONTAINERS } from '@/data/containers';
import { getCartonCapacity } from '@/lib/simulator/capToFit';
import type { Product, CartonSpec } from '@/types';
import type { ContainerSpec } from '@/data/containers';

// ---------------------------------------------------------------------------
// Filter taxonomies — same as Phase 1.9
// ---------------------------------------------------------------------------

const CATEGORY_GROUPS: Array<{
  id: string;
  label: string;
  matches: (p: Product) => boolean;
}> = [
  { id: 'beer', label: 'Beer', matches: (p) => p.categoryId === 'beer' },
  {
    id: 'wine',
    label: 'Wine',
    matches: (p) => p.categoryId === 'wine' || p.categoryId === 'sparkling-wine',
  },
  {
    id: 'spirits',
    label: 'Spirits',
    matches: (p) =>
      ['whiskey', 'vodka', 'gin', 'rum', 'brandy', 'liqueur', 'spirits', 'aperitif'].includes(
        p.categoryId,
      ),
  },
  { id: 'energy', label: 'Energy', matches: (p) => p.categoryId === 'energy-drink' },
  {
    id: 'food',
    label: 'Food',
    matches: (p) => p.categoryId === 'food' || p.categoryId.includes('food'),
  },
];

const BRAND_CHIPS: Array<{
  id: string;
  label: string;
  matches: (p: Product) => boolean;
}> = [
  { id: 'own', label: 'Private Label', matches: (p) => p.isOwnBrand },
  {
    id: 'vilniaus',
    label: 'Vilniaus Degtinė',
    matches: (p) => p.partnerSlug === 'vilniaus-degtine',
  },
  {
    id: 'mass',
    label: 'Mass Industries',
    matches: (p) => p.partnerSlug === 'mass-industries',
  },
  {
    id: 'other',
    label: 'Other partners',
    matches: (p) =>
      !p.isOwnBrand &&
      p.partnerSlug !== 'vilniaus-degtine' &&
      p.partnerSlug !== 'mass-industries',
  },
];

// Sea-freight containers we show in the per-card capacity table.
const CAPACITY_CONTAINERS: ContainerSpec[] = CONTAINERS.filter((c) => c.kind === 'container');

const FILL_PERCENTAGES = [0.25, 0.5, 0.75, 1.0] as const;

// ---------------------------------------------------------------------------
// Debounced value
// ---------------------------------------------------------------------------

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format carton-fit numbers — caps display at 99,999+ to keep the row tidy. */
function fmtCount(n: number): string {
  if (n >= 100_000) return '99,999+';
  return n.toLocaleString();
}

/** How many cartons of `carton` fit in `cargoSpace` if it were *just this
 *  product* taking up the rest of the cart's headroom. Used by fill buttons. */
function calculateFillQuantity(
  percentage: number,
  cargoSpace: ContainerSpec,
  carton: CartonSpec,
  cartItems: ReadonlyArray<{ productId: string; quantityCartons: number; product: Product }>,
  thisProductId: string,
): number {
  let otherVol = 0;
  let otherWt = 0;
  for (const it of cartItems) {
    if (it.productId === thisProductId) continue;
    const c = it.product.carton;
    if (!c) continue;
    otherVol += c.volume_m3 * it.quantityCartons;
    otherWt += c.weight_kg * it.quantityCartons;
  }
  const cargoVol_m3 =
    (cargoSpace.length_cm * cargoSpace.width_cm * cargoSpace.height_cm) /
    1_000_000;
  const targetVol = cargoVol_m3 * percentage;
  const targetWt = cargoSpace.max_payload_kg * percentage;

  const availVol = Math.max(0, targetVol - otherVol);
  const availWt = Math.max(0, targetWt - otherWt);

  const byVol = carton.volume_m3 > 0 ? Math.floor(availVol / carton.volume_m3) : 0;
  const byWt = carton.weight_kg > 0 ? Math.floor(availWt / carton.weight_kg) : 0;
  return Math.max(0, Math.min(byVol, byWt));
}

// ---------------------------------------------------------------------------
// Product card
// ---------------------------------------------------------------------------

interface CardProps {
  product: Product;
  quantity: number;
  cargoSpace: ContainerSpec;
  cartItems: ReadonlyArray<{ productId: string; quantityCartons: number; product: Product }>;
  onIncrement: () => LimitReason;
  onDecrement: () => void;
  onSetQuantity: (n: number) => { value: number; capped: boolean; reason: LimitReason };
}

function ProductCard({
  product,
  quantity,
  cargoSpace,
  cartItems,
  onIncrement,
  onDecrement,
  onSetQuantity,
}: CardProps) {
  const hasCarton = !!product.carton;
  const inCart = quantity > 0;
  const stepperRef = useRef<HTMLDivElement>(null);

  // Capacity table — useMemo against (carton dims), not against cargoSpace,
  // since this is "alone in each container" reference info.
  const capacityRows = useMemo(() => {
    if (!product.carton) {
      return CAPACITY_CONTAINERS.map((c) => ({
        container: c,
        count: 0,
        limitedBy: 'volume' as const,
      }));
    }
    return CAPACITY_CONTAINERS.map((c) => ({
      container: c,
      ...getCartonCapacity(c, product.carton!),
    }));
  }, [product.carton]);

  // Fill-percentage quantities — dependent on the *current cart*, so we
  // recompute against the cart items reference.
  const fillTargets = useMemo(() => {
    if (!product.carton) {
      return FILL_PERCENTAGES.map((pct) => ({ pct, qty: 0, disabled: true }));
    }
    return FILL_PERCENTAGES.map((pct) => {
      const qty = calculateFillQuantity(
        pct,
        cargoSpace,
        product.carton!,
        cartItems,
        product.id,
      );
      return { pct, qty, disabled: false };
    });
  }, [product.carton, product.id, cargoSpace, cartItems]);

  function shake() {
    const el = stepperRef.current;
    if (!el) return;
    el.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(-3px)' },
        { transform: 'translateX(3px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 320, easing: 'ease-out' },
    );
  }

  function handleInc() {
    if (!hasCarton) return;
    const r = onIncrement();
    if (r) {
      shake();
      toast(
        r === 'volume'
          ? '📦 Container volume full.'
          : '⚖️ Weight limit reached.',
      );
    }
  }

  function handleFillTo(qty: number) {
    if (!hasCarton) return;
    if (qty === 0) {
      toast(
        'Container already full at this fill level — remove other items to make space.',
      );
      shake();
      return;
    }
    const r = onSetQuantity(qty);
    if (r.capped && r.value < qty) {
      shake();
      toast(
        r.reason === 'weight'
          ? `⚖️ Weight cap — adjusted to ${r.value.toLocaleString()} cartons.`
          : `📦 Volume cap — adjusted to ${r.value.toLocaleString()} cartons.`,
      );
    }
  }

  return (
    <motion.li
      layout="position"
      className="group relative flex flex-col rounded-xl border sim-card-hover overflow-hidden shadow-sm"
      style={{
        background: 'var(--sim-surface)',
        borderColor: inCart ? 'var(--sim-primary)' : 'var(--sim-border)',
        opacity: hasCarton ? 1 : 0.6,
        boxShadow: inCart
          ? '0 4px 12px rgba(30, 58, 138, 0.12)'
          : '0 1px 3px rgba(15, 23, 42, 0.05)',
      }}
    >
      {/* Image header — uniform aspect-square + object-contain pattern.
          Background fills any gaps so portrait/landscape sources both
          render at the same on-card size, fully visible, never cropped. */}
      <div
        className="relative w-full aspect-square overflow-hidden flex items-center justify-center"
        style={{
          background: 'var(--sim-surface-2)',
          borderBottom: '1px solid var(--sim-border)',
        }}
      >
        {product.image && !product.image.includes('placehold') ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain object-center p-2"
          />
        ) : (
          <Package
            className="w-8 h-8"
            style={{ color: 'var(--sim-text-muted)' }}
            aria-hidden="true"
          />
        )}
        {!hasCarton && (
          <span
            className="absolute top-2 right-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--sim-warn)',
              border: '1px solid var(--sim-warn)',
            }}
            title="Carton specs needed to simulate."
          >
            <AlertTriangle className="w-2.5 h-2.5" />
            Specs needed
          </span>
        )}
        {inCart && (
          <span
            className="absolute top-2 left-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold shadow-sm"
            style={{
              background: 'var(--sim-gold)',
              color: 'var(--sim-primary)',
            }}
          >
            ✓ In load
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-3 gap-2">
        <div>
          <p
            className="text-[12px] font-bold leading-tight line-clamp-2 min-h-[2.4em]"
            style={{ color: 'var(--sim-text-primary)' }}
            title={product.name}
          >
            {product.name}
          </p>
          {product.brand && (
            <p
              className="text-[10px] uppercase tracking-wider mt-0.5"
              style={{ color: 'var(--sim-text-secondary)' }}
            >
              {product.brand}
            </p>
          )}
        </div>

        {/* Carton specs */}
        {hasCarton ? (
          <div
            className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] font-mono tabular-nums"
            style={{ color: 'var(--sim-text-secondary)' }}
          >
            <span className="inline-flex items-center gap-1">
              <Package className="w-2.5 h-2.5" aria-hidden="true" />
              <span style={{ color: 'var(--sim-text-primary)' }}>
                {product.carton!.units_per_carton}
              </span>{' '}
              units/carton
            </span>
            <span className="inline-flex items-center gap-1">
              <Layers className="w-2.5 h-2.5" aria-hidden="true" />
              {product.carton!.length_cm}×{product.carton!.width_cm}×{product.carton!.height_cm}cm
            </span>
            <span className="inline-flex items-center gap-1">
              <Weight className="w-2.5 h-2.5" aria-hidden="true" />
              {product.carton!.weight_kg}kg
            </span>
          </div>
        ) : (
          <p
            className="text-[10px] italic"
            style={{ color: 'var(--sim-text-muted)' }}
          >
            Carton specs not available — contact sales.
          </p>
        )}

        {/* Container capacity table */}
        <div
          className="rounded-lg p-2"
          style={{
            background: 'var(--sim-surface-2)',
            border: '1px solid var(--sim-border)',
          }}
        >
          <p
            className="text-[9px] uppercase tracking-widest font-bold mb-1.5"
            style={{ color: 'var(--sim-primary)' }}
          >
            Container capacity
          </p>
          <ul className="space-y-0.5">
            {capacityRows.map(({ container, count, limitedBy }) => (
              <li
                key={container.id}
                className="flex items-center justify-between text-[10px] font-mono tabular-nums"
              >
                <span style={{ color: 'var(--sim-text-secondary)' }}>
                  {container.name.replace(' Standard', '').replace(' High Cube', ' HC')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="font-bold"
                    style={{
                      color: hasCarton
                        ? 'var(--sim-text-primary)'
                        : 'var(--sim-text-muted)',
                    }}
                  >
                    {hasCarton ? `~${fmtCount(count)}` : '—'}
                  </span>
                  {hasCarton && count > 0 && (
                    <span
                      className="text-[8px] px-1 rounded"
                      style={{
                        background:
                          limitedBy === 'weight'
                            ? 'rgba(245, 158, 11, 0.15)'
                            : 'rgba(59, 130, 246, 0.15)',
                        color:
                          limitedBy === 'weight'
                            ? 'var(--sim-warn)'
                            : 'var(--sim-blue-bright)',
                      }}
                      title={
                        limitedBy === 'weight'
                          ? 'Weight-limited'
                          : 'Volume-limited'
                      }
                    >
                      {limitedBy === 'weight' ? '⚖' : '📦'}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Fill-percentage buttons */}
        <div>
          <p
            className="text-[9px] uppercase tracking-widest font-bold mb-1"
            style={{ color: 'var(--sim-primary)' }}
          >
            Fill to
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
            {fillTargets.map(({ pct, qty, disabled }) => {
              const label = `${Math.round(pct * 100)}%`;
              const isActiveTarget = inCart && quantity === qty && qty > 0;
              return (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleFillTo(qty)}
                  disabled={disabled || !hasCarton}
                  aria-label={`Fill to ${label} of ${cargoSpace.name} container`}
                  className="text-[11px] font-bold py-1.5 rounded-md transition-all active:scale-95 hover:-translate-y-px"
                  style={{
                    background: isActiveTarget
                      ? 'var(--sim-gold)'
                      : 'var(--sim-gold-soft)',
                    color: isActiveTarget
                      ? 'var(--sim-primary)'
                      : disabled || !hasCarton
                        ? 'var(--sim-text-muted)'
                        : 'var(--sim-gold-dim)',
                    border: `1px solid ${isActiveTarget ? 'var(--sim-gold)' : 'transparent'}`,
                    cursor: disabled || !hasCarton ? 'not-allowed' : 'pointer',
                    opacity: disabled || !hasCarton ? 0.4 : 1,
                    boxShadow: isActiveTarget
                      ? '0 1px 3px rgba(252, 211, 77, 0.4)'
                      : 'none',
                  }}
                  title={
                    disabled || !hasCarton
                      ? 'Carton specs needed'
                      : qty === 0
                        ? 'Container already full at this level'
                        : `Sets quantity to ${qty.toLocaleString()} cartons`
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stepper */}
        <div
          ref={stepperRef}
          className="mt-auto pt-1 flex items-center justify-between gap-1"
        >
          <button
            type="button"
            onClick={onDecrement}
            disabled={!hasCarton || quantity === 0}
            aria-label={`Decrease ${product.name}`}
            className="w-8 h-8 rounded-md flex items-center justify-center transition-all active:scale-95"
            style={{
              background: 'var(--sim-surface-2)',
              color:
                quantity === 0 || !hasCarton
                  ? 'var(--sim-text-muted)'
                  : 'var(--sim-text-primary)',
              border: '1px solid var(--sim-border)',
              cursor: quantity === 0 || !hasCarton ? 'not-allowed' : 'pointer',
              opacity: quantity === 0 || !hasCarton ? 0.4 : 1,
            }}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <QuantityInput
            value={quantity}
            disabled={!hasCarton}
            ariaLabel={`Cartons of ${product.name}`}
            onCommit={(parsed) => {
              const r = onSetQuantity(parsed);
              if (r.capped) {
                shake();
                toast(
                  r.reason === 'weight'
                    ? `⚖️ Weight limit — adjusted to ${r.value.toLocaleString()} cartons.`
                    : `📦 Volume limit — adjusted to ${r.value.toLocaleString()} cartons.`,
                );
              }
            }}
            className={cn(
              'w-16 text-sm rounded-md py-1 border focus:ring-2',
            )}
            // We pass styles inline so the dark-theme tokens drive colors.
            // (Tailwind className lives alongside.)
          />
          <button
            type="button"
            onClick={handleInc}
            disabled={!hasCarton}
            aria-label={`Add one ${product.name}`}
            className="w-8 h-8 rounded-md flex items-center justify-center transition-all active:scale-95"
            style={{
              background: hasCarton ? 'var(--sim-primary)' : 'var(--sim-surface-2)',
              color: hasCarton ? '#FFFFFF' : 'var(--sim-text-muted)',
              cursor: hasCarton ? 'pointer' : 'not-allowed',
              opacity: hasCarton ? 1 : 0.4,
              boxShadow: hasCarton ? '0 1px 3px rgba(30,58,138,0.20)' : 'none',
            }}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {/* QuantityInput colour overrides — light theme. Selector keeps the
          tokens win over Tailwind utility colors that the input still has. */}
      <style>{`
        .simulator-dark-theme [aria-label^="Cartons of "] {
          background: var(--sim-surface);
          color: var(--sim-text-primary);
          border: 1px solid var(--sim-border);
        }
        .simulator-dark-theme [aria-label^="Cartons of "]:focus {
          border-color: var(--sim-primary);
          box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.15);
          outline: none;
        }
      `}</style>
    </motion.li>
  );
}

// ---------------------------------------------------------------------------
// Browser
// ---------------------------------------------------------------------------

interface Props {
  cargoSpace: ContainerSpec;
  cartItems: ReadonlyArray<{ productId: string; quantityCartons: number; product: Product }>;
  quantityFor: (productId: string) => number;
  onIncrement: (productId: string) => LimitReason;
  onDecrement: (productId: string) => void;
  onSetQuantity: (
    productId: string,
    n: number,
  ) => { value: number; capped: boolean; reason: LimitReason };
}

const PAGE_SIZE = 24;

export function SimulatorProductBrowser({
  cargoSpace,
  cartItems,
  quantityFor,
  onIncrement,
  onDecrement,
  onSetQuantity,
}: Props) {
  const [search, setSearch] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [activeBrands, setActiveBrands] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const debouncedSearch = useDebouncedValue(search, 250);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [debouncedSearch, activeCategories, activeBrands]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return ALL_SIMULATOR_PRODUCTS.filter((p) => {
      if (q) {
        const haystack =
          `${p.name} ${p.brand ?? ''} ${p.categoryId ?? ''} ${p.supplier ?? ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (activeCategories.size > 0) {
        const hit = CATEGORY_GROUPS.some(
          (g) => activeCategories.has(g.id) && g.matches(p),
        );
        if (!hit) return false;
      }
      if (activeBrands.size > 0) {
        const hit = BRAND_CHIPS.some((b) => activeBrands.has(b.id) && b.matches(p));
        if (!hit) return false;
      }
      return true;
    });
  }, [debouncedSearch, activeCategories, activeBrands]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const inA = quantityFor(a.id) > 0 ? 0 : 1;
      const inB = quantityFor(b.id) > 0 ? 0 : 1;
      if (inA !== inB) return inA - inB;
      const cartA = a.carton ? 0 : 1;
      const cartB = b.carton ? 0 : 1;
      if (cartA !== cartB) return cartA - cartB;
      const featA = a.isFeatured ? 0 : 1;
      const featB = b.isFeatured ? 0 : 1;
      if (featA !== featB) return featA - featB;
      return a.name.localeCompare(b.name);
    });
  }, [filtered, quantityFor]);

  const visible = sorted.slice(0, visibleCount);

  function toggleSet(setter: (next: Set<string>) => void, current: Set<string>, id: string) {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  }

  return (
    <div
      className="rounded-2xl border"
      style={{
        background: 'var(--sim-surface)',
        borderColor: 'var(--sim-border)',
      }}
    >
      {/* Header — search + filter chips */}
      <div
        className="px-4 py-3 border-b flex flex-col gap-2 lg:flex-row lg:items-center"
        style={{ borderColor: 'var(--sim-border)' }}
      >
        <div>
          <p
            className="text-[10px] uppercase tracking-widest font-bold leading-tight"
            style={{ color: 'var(--sim-primary)' }}
          >
            Catalog
          </p>
          <p
            className="text-xs font-bold leading-tight"
            style={{ color: 'var(--sim-text-primary)' }}
          >
            {filtered.length.toLocaleString()} products
          </p>
        </div>

        <div className="relative flex-1 lg:max-w-xs">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
            style={{ color: 'var(--sim-text-muted)' }}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-2"
            style={{
              background: 'var(--sim-surface-2)',
              border: '1px solid var(--sim-border)',
              color: 'var(--sim-text-primary)',
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5"
              style={{ color: 'var(--sim-text-muted)' }}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1 lg:mx-0 lg:px-0 lg:flex-1 lg:justify-end">
          {[
            ...CATEGORY_GROUPS,
            { divider: true } as { divider: boolean; id?: string; label?: string; matches?: (p: Product) => boolean },
            ...BRAND_CHIPS,
          ].map((c, i) => {
            if ('divider' in c) {
              return (
                <span
                  key={`d-${i}`}
                  className="hidden lg:inline-block w-px h-5 mx-1"
                  style={{ background: 'var(--sim-border)' }}
                  aria-hidden="true"
                />
              );
            }
            const isCat = CATEGORY_GROUPS.some((g) => g.id === c.id);
            const setter = isCat ? setActiveCategories : setActiveBrands;
            const current = isCat ? activeCategories : activeBrands;
            const on = current.has(c.id!);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleSet(setter, current, c.id!)}
                aria-pressed={on}
                className={cn(
                  'shrink-0 text-[10px] sm:text-[11px] font-semibold px-2 py-1 rounded-full transition-all',
                )}
                style={{
                  background: on ? 'var(--sim-primary)' : 'var(--sim-surface)',
                  color: on ? '#FFFFFF' : 'var(--sim-text-secondary)',
                  border: `1px solid ${on ? 'var(--sim-primary)' : 'var(--sim-border)'}`,
                  boxShadow: on ? '0 1px 3px rgba(30,58,138,0.18)' : 'none',
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="p-3 sm:p-4">
        {visible.length === 0 ? (
          <p
            className="text-center text-sm py-12"
            style={{ color: 'var(--sim-text-muted)' }}
          >
            No products match your filters.
          </p>
        ) : (
          <ul
            role="list"
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3"
          >
            {visible.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                quantity={quantityFor(p.id)}
                cargoSpace={cargoSpace}
                cartItems={cartItems}
                onIncrement={() => onIncrement(p.id)}
                onDecrement={() => onDecrement(p.id)}
                onSetQuantity={(n) => onSetQuantity(p.id, n)}
              />
            ))}
          </ul>
        )}

        {sorted.length > visibleCount && (
          <button
            type="button"
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="mt-5 mx-auto block px-4 py-2 text-xs font-semibold rounded-full transition-all hover:-translate-y-px"
            style={{
              background: 'var(--sim-surface)',
              color: 'var(--sim-primary)',
              border: '1px solid var(--sim-primary)',
            }}
          >
            Load {Math.min(PAGE_SIZE, sorted.length - visibleCount)} more{' '}
            <span style={{ color: 'var(--sim-text-muted)' }}>
              ({sorted.length - visibleCount} hidden)
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

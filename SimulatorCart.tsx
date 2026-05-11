/**
 * SimulatorCart — slim items list for the dark-theme simulator.
 *
 * Phase 2.2: stats and CTAs moved into LoadStatusCard. This panel now
 * just shows the list of cart line items + clear-all link. Lives below
 * the Load Status card in the right sidebar.
 *
 * Empty state: friendly placeholder with a PackageOpen icon.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, X, PackageOpen, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import type { LimitReason } from '@/hooks/useSimulationCart';
import type { Product } from '@/types';

interface HydratedItem {
  productId: string;
  quantityCartons: number;
  product: Product;
}

interface Props {
  items: HydratedItem[];
  onIncrement: (productId: string) => LimitReason;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
}

function CartLine({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  item: HydratedItem;
  onIncrement: (id: string) => LimitReason;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const c = item.product.carton;
  const lineUnits = c ? c.units_per_carton * item.quantityCartons : 0;

  function handleInc() {
    const r = onIncrement(item.productId);
    if (r) toast(r === 'volume' ? '📦 Volume full.' : '⚖️ Weight limit hit.');
  }

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.18 }}
      className="group flex items-center gap-2 py-2.5"
      style={{
        borderBottom: '1px solid var(--sim-border)',
      }}
    >
      <div
        className="relative w-9 h-9 shrink-0 aspect-square overflow-hidden rounded-md flex items-center justify-center"
        style={{ background: 'var(--sim-surface-2)', border: '1px solid var(--sim-border)' }}
      >
        {item.product.image && !item.product.image.includes('placehold') ? (
          <img
            src={item.product.image}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain object-center"
          />
        ) : (
          <Package
            className="w-4 h-4"
            style={{ color: 'var(--sim-text-muted)' }}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-[11px] font-bold leading-tight truncate"
          style={{ color: 'var(--sim-text-primary)' }}
          title={item.product.name}
        >
          {item.product.name}
        </p>
        <p
          className="text-[10px] leading-tight font-mono tabular-nums"
          style={{ color: 'var(--sim-text-secondary)' }}
        >
          {item.quantityCartons} cartons
          {lineUnits > 0 && (
            <span style={{ color: 'var(--sim-text-muted)' }}>
              {' '}({lineUnits.toLocaleString()})
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onClick={() => onDecrement(item.productId)}
          aria-label={`Decrease ${item.product.name}`}
          className="w-6 h-6 rounded flex items-center justify-center transition-all active:scale-95"
          style={{ color: 'var(--sim-text-secondary)' }}
        >
          <Minus className="w-3 h-3" />
        </button>
        <span
          className="w-7 text-center text-[11px] font-bold font-mono tabular-nums"
          style={{ color: 'var(--sim-text-primary)' }}
        >
          {item.quantityCartons}
        </span>
        <button
          type="button"
          onClick={handleInc}
          aria-label={`Increase ${item.product.name}`}
          className="w-6 h-6 rounded flex items-center justify-center transition-all active:scale-95"
          style={{ color: 'var(--sim-primary)' }}
        >
          <Plus className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          aria-label={`Remove ${item.product.name}`}
          className="w-6 h-6 rounded flex items-center justify-center transition-colors sm:opacity-0 sm:group-hover:opacity-100"
          style={{ color: 'var(--sim-text-muted)' }}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </motion.li>
  );
}

export function SimulatorCart({
  items,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
}: Props) {
  const [confirmingClear, setConfirmingClear] = useState(false);

  return (
    <aside
      className="rounded-2xl border overflow-hidden flex flex-col sim-card-hover"
      style={{
        background: 'var(--sim-surface)',
        borderColor: 'var(--sim-border)',
      }}
      aria-label="Cart items"
    >
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--sim-border)' }}
      >
        <p
          className="text-[10px] uppercase tracking-widest font-bold"
          style={{ color: 'var(--sim-primary)' }}
        >
          Cart items{' '}
          {items.length > 0 && (
            <span style={{ color: 'var(--sim-text-secondary)' }}>
              ({items.length})
            </span>
          )}
        </p>
        {items.length > 0 &&
          (confirmingClear ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setConfirmingClear(false);
                }}
                className="text-[10px] font-bold"
                style={{ color: 'var(--sim-danger)' }}
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmingClear(false)}
                className="text-[10px]"
                style={{ color: 'var(--sim-text-muted)' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingClear(true)}
              aria-label="Clear all items"
              className="inline-flex items-center gap-1 text-[10px] transition-colors"
              style={{ color: 'var(--sim-text-muted)' }}
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          ))}
      </div>

      <div className="px-4 py-2 max-h-[40vh] overflow-y-auto min-h-[88px]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <PackageOpen
              className="w-12 h-12 mb-2"
              style={{ color: 'var(--sim-text-muted)' }}
              aria-hidden="true"
            />
            <p
              className="text-xs font-bold"
              style={{ color: 'var(--sim-text-secondary)' }}
            >
              Your load is empty
            </p>
            <p
              className="text-[10px] mt-1"
              style={{ color: 'var(--sim-text-muted)' }}
            >
              Browse products to start.
            </p>
          </div>
        ) : (
          <ul role="list" aria-live="polite">
            <AnimatePresence initial={false}>
              {items.map((it) => (
                <CartLine
                  key={it.productId}
                  item={it}
                  onIncrement={onIncrement}
                  onDecrement={onDecrement}
                  onRemove={onRemove}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </aside>
  );
}

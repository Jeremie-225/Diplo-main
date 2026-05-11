/**
 * LoadStatusCard — the dark-theme hero card on the right of `/simulate`.
 *
 * Replaces the SVG isometric visualization. Shows:
 *   • Top status colour bar (3px) — green → amber → orange → red
 *   • Cargo space name + Load Status eyebrow
 *   • Two CircularGauges (Volume + Weight) side by side on ≥sm,
 *     HorizontalGauges stacked on <sm (rings get too small at 375px)
 *   • Totals row — cartons, units, distinct product lines
 *   • CTAs — Save PDF (outline) + Get Quote (gold solid)
 *
 * Empty state — when no items in cart:
 *   Both gauges read "—", center reads "Add products to start building",
 *   action buttons disabled.
 *
 * Pulse trigger — when the cart hook clamps a quantity, the parent bumps
 *   `pulseTrigger.tick` and we briefly highlight the matching gauge.
 */

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileDown, Send, Loader2, Zap, AlertTriangle } from 'lucide-react';
import { CircularGauge, HorizontalGauge } from '@/components/simulator/CircularGauge';
import { writeQuotePrefill } from '@/lib/quotePrefill';
import toast from 'react-hot-toast';
import type { ContainerSpec } from '@/data/containers';
import type { CartTotals, LimitReason } from '@/hooks/useSimulationCart';
import type { Product } from '@/types';

interface HydratedItem {
  productId: string;
  quantityCartons: number;
  product: Product;
}

interface Props {
  cargoSpace: ContainerSpec;
  items: HydratedItem[];
  totals: CartTotals;
  isOverCapacity: boolean;
  pulseTrigger: { reason: LimitReason; tick: number };
  onSavePDF: () => Promise<void>;
}

function statusBarColor(pct: number): string {
  if (pct >= 1) return 'var(--sim-danger)';
  if (pct >= 0.9) return 'var(--sim-danger-light)';
  if (pct >= 0.75) return 'var(--sim-warn)';
  if (pct > 0) return 'var(--sim-ok)';
  return 'var(--sim-border)';
}

export function LoadStatusCard({
  cargoSpace,
  items,
  totals,
  isOverCapacity,
  pulseTrigger,
  onSavePDF,
}: Props) {
  const navigate = useNavigate();
  const [pdfLoading, setPdfLoading] = useState(false);
  const isEmpty = items.length === 0;

  // Distinct product count + total units
  const productCount = items.length;
  const cargoVol_m3 = cargoSpace.volume_m3;
  const cargoMaxKg = cargoSpace.max_payload_kg;

  // Pulse highlighting on cap-clamp
  const [pulseRing, setPulseRing] = useState<LimitReason>(null);
  useEffect(() => {
    if (pulseTrigger.tick > 0 && pulseTrigger.reason) {
      setPulseRing(pulseTrigger.reason);
      const t = setTimeout(() => setPulseRing(null), 1800);
      return () => clearTimeout(t);
    }
  }, [pulseTrigger]);

  // "Pop" animation on the whole card whenever item count changes
  const [popTick, setPopTick] = useState(0);
  const lastCount = useMemo(() => items.length, [items.length]);
  useEffect(() => {
    setPopTick((t) => t + 1);
  }, [lastCount]);

  function handleQuote() {
    if (isEmpty) {
      toast.error('Add items first.');
      return;
    }
    writeQuotePrefill({
      cargoSpaceType: cargoSpace.kind,
      cargoSpaceId: cargoSpace.id,
      cargoSpaceName: cargoSpace.name,
      truckCustom:
        cargoSpace.id === 'truck-custom'
          ? {
              length_cm: cargoSpace.length_cm,
              width_cm: cargoSpace.width_cm,
              height_cm: cargoSpace.height_cm,
              max_payload_kg: cargoSpace.max_payload_kg,
            }
          : undefined,
      items: items.map((i) => {
        const c = i.product.carton;
        return {
          productId: i.productId,
          productName: i.product.name,
          quantityCartons: i.quantityCartons,
          unitsPerCarton: c?.units_per_carton ?? 0,
          totalUnits: (c?.units_per_carton ?? 0) * i.quantityCartons,
          cartonDimensions: c
            ? `${c.length_cm} × ${c.width_cm} × ${c.height_cm} cm`
            : '—',
          cartonWeightKg: c?.weight_kg ?? 0,
        };
      }),
      simulationStats: {
        totalCartons: totals.cartons,
        totalVolume_m3: Number(totals.volume_m3.toFixed(2)),
        volumeUtilization_pct: Math.round(totals.volumePct * 100),
        totalWeight_kg: Number(totals.weight_kg.toFixed(1)),
        weightUtilization_pct: Math.round(totals.weightPct * 100),
      },
    });
    navigate('/quote?from=simulator');
  }

  async function handlePDF() {
    setPdfLoading(true);
    try {
      await onSavePDF();
    } finally {
      setPdfLoading(false);
    }
  }

  const volumePct = totals.volumePct * 100;
  const weightPct = totals.weightPct * 100;

  return (
    <motion.section
      key={`pop-${popTick}`}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.015, 1] }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      aria-label="Load status"
      className="rounded-2xl overflow-hidden border sim-card-hover shadow-sm"
      style={{
        background: 'var(--sim-surface)',
        borderColor: 'var(--sim-border)',
      }}
    >
      {/* Top status colour bar */}
      <div
        aria-hidden="true"
        className="h-[3px] w-full"
        style={{
          background: statusBarColor(totals.fillPct),
          transition: 'background 300ms ease',
        }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <p
              className="text-[10px] uppercase tracking-widest font-bold"
              style={{ color: 'var(--sim-primary)' }}
            >
              Load Status
            </p>
            <p
              className="font-extrabold text-base mt-0.5 truncate"
              style={{ color: 'var(--sim-text-primary)' }}
            >
              {cargoSpace.name}
            </p>
          </div>
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
            style={{ background: 'var(--sim-gold-soft)' }}
          >
            <Zap
              className="w-3.5 h-3.5"
              style={{ color: 'var(--sim-gold-dim)' }}
              aria-hidden="true"
            />
          </span>
        </div>

        {/* Gauges — rings on sm+, horizontal bars on xs */}
        <div className="hidden sm:flex items-start justify-around gap-4">
          <div
            className={pulseRing === 'volume' ? 'sim-ring-pulse' : undefined}
          >
            <CircularGauge
              percentage={volumePct}
              label="Volume"
              value={isEmpty ? undefined : `${totals.volume_m3.toFixed(2)} m³`}
              maxValue={`${cargoVol_m3} m³`}
              size={108}
              ariaLabel={`Volume utilization: ${Math.round(volumePct)}%`}
            />
          </div>
          <div
            className={pulseRing === 'weight' ? 'sim-ring-pulse' : undefined}
          >
            <CircularGauge
              percentage={weightPct}
              label="Weight"
              value={isEmpty ? undefined : `${(totals.weight_kg / 1000).toFixed(1)} t`}
              maxValue={`${(cargoMaxKg / 1000).toFixed(1)} t`}
              size={108}
              ariaLabel={`Weight utilization: ${Math.round(weightPct)}%`}
            />
          </div>
        </div>
        <div className="sm:hidden space-y-3">
          <HorizontalGauge
            percentage={volumePct}
            label="Volume"
            value={isEmpty ? undefined : `${totals.volume_m3.toFixed(2)} m³`}
            maxValue={`${cargoVol_m3} m³`}
          />
          <HorizontalGauge
            percentage={weightPct}
            label="Weight"
            value={isEmpty ? undefined : `${(totals.weight_kg / 1000).toFixed(1)} t`}
            maxValue={`${(cargoMaxKg / 1000).toFixed(1)} t`}
          />
        </div>

        {isOverCapacity && (
          <p
            className="mt-3 text-[11px] font-semibold inline-flex items-center gap-1"
            style={{ color: 'var(--sim-danger)' }}
          >
            <AlertTriangle className="w-3 h-3" aria-hidden="true" />
            Over capacity — pick a larger cargo space or remove items.
          </p>
        )}

        {/* Totals row */}
        <div
          className="mt-4 pt-4 border-t flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-mono tabular-nums"
          style={{ borderColor: 'var(--sim-border)' }}
        >
          {isEmpty ? (
            <span style={{ color: 'var(--sim-text-secondary)' }}>
              Add products to start building your load.
            </span>
          ) : (
            <>
              <span style={{ color: 'var(--sim-text-primary)' }}>
                <strong>{totals.cartons.toLocaleString()}</strong>{' '}
                <span style={{ color: 'var(--sim-text-secondary)' }}>cartons</span>
              </span>
              <span style={{ color: 'var(--sim-border)' }}>•</span>
              <span style={{ color: 'var(--sim-text-primary)' }}>
                <strong>{totals.units.toLocaleString()}</strong>{' '}
                <span style={{ color: 'var(--sim-text-secondary)' }}>units</span>
              </span>
              <span style={{ color: 'var(--sim-border)' }}>•</span>
              <span style={{ color: 'var(--sim-text-primary)' }}>
                <strong>{productCount}</strong>{' '}
                <span style={{ color: 'var(--sim-text-secondary)' }}>
                  product{productCount === 1 ? '' : 's'}
                </span>
              </span>
            </>
          )}
        </div>

        {/* Action row */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handlePDF}
            disabled={isEmpty || pdfLoading}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              border: '1px solid var(--sim-border)',
              background: 'var(--sim-surface-2)',
              color: isEmpty ? 'var(--sim-text-muted)' : 'var(--sim-text-secondary)',
              opacity: isEmpty ? 0.5 : 1,
              cursor: isEmpty ? 'not-allowed' : 'pointer',
            }}
          >
            {pdfLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <FileDown className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            Save PDF
          </button>
          <motion.button
            type="button"
            onClick={handleQuote}
            disabled={isEmpty}
            whileHover={!isEmpty ? { y: -1 } : undefined}
            whileTap={!isEmpty ? { scale: 0.97 } : undefined}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all"
            style={{
              background: isEmpty ? 'var(--sim-surface-2)' : 'var(--sim-gold)',
              color: isEmpty ? 'var(--sim-text-muted)' : '#0A1628',
              opacity: isEmpty ? 0.5 : 1,
              cursor: isEmpty ? 'not-allowed' : 'pointer',
            }}
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            Get Quote
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}

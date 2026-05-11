/**
 * CargoChips — compact horizontal cargo-space picker.
 *
 * Replaces the verbose `ContainerPicker` card column for Phase 1.9.
 * Layout (desktop):
 *
 *   [🚢 Container | 🚛 Truck]   [chip] [chip] [chip] …
 *      mode toggle              cargo space chips
 *
 * - Mode toggle is a segmented control with a sliding pill
 *   (framer-motion `layoutId`) so switching feels native.
 * - Each chip is ~40-48px tall, shows icon + name + tiny dimensions.
 * - Selected chip uses primary blue background; rest are subtle gray.
 * - Hover surfaces a tooltip with the full dimensions + payload.
 * - Mobile: chips scroll horizontally with snap; mode toggle stacks above.
 *
 * Accessibility: each chip is a button with `aria-pressed`; the mode
 * toggle uses `role="radiogroup"` semantics.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Ship, Truck, Settings2 } from 'lucide-react';
import { CONTAINERS } from '@/data/containers';
import { cn } from '@/lib/utils';
import { TRUCK_CUSTOM_ID, type TruckCustom } from '@/hooks/useSimulationCart';
import { CustomTruckForm } from '@/components/simulator/CustomTruckForm';
import type { ContainerSpec } from '@/data/containers';

type Mode = 'container' | 'truck';

interface Props {
  selectedId: ContainerSpec['id'];
  onSelect: (id: ContainerSpec['id']) => void;
  /** Existing custom truck dimensions (for round-trip after page reload). */
  truckCustom?: TruckCustom;
  /** Apply user-supplied custom truck dimensions. */
  onApplyCustomTruck?: (custom: TruckCustom) => void;
}

export function CargoChips({
  selectedId,
  onSelect,
  truckCustom,
  onApplyCustomTruck,
}: Props) {
  // The synthetic 'truck-custom' id always means truck mode is active.
  const isCustomTruck = selectedId === TRUCK_CUSTOM_ID;
  const selected = isCustomTruck ? null : CONTAINERS.find((c) => c.id === selectedId);
  const mode: Mode = isCustomTruck ? 'truck' : selected?.kind === 'truck' ? 'truck' : 'container';
  const visible = CONTAINERS.filter((c) => c.kind === mode);

  function switchMode(newMode: Mode) {
    if (newMode === mode) return;
    // Pick the first cargo space of the new mode.
    const target = CONTAINERS.find((c) => c.kind === newMode);
    if (target) onSelect(target.id);
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* Top row — mode toggle + chip strip side by side */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      {/* Mode toggle — primary navy pill underneath the active option */}
      <div
        role="radiogroup"
        aria-label="Cargo mode"
        className="relative inline-flex items-center rounded-full p-0.5 self-start sm:self-auto"
        style={{ background: 'var(--sim-surface-2)', border: '1px solid var(--sim-border)' }}
      >
        {(['container', 'truck'] as Mode[]).map((m) => {
          const active = m === mode;
          const Icon = m === 'container' ? Ship : Truck;
          return (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => switchMode(m)}
              className="relative z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors"
              style={{
                color: active ? '#FFFFFF' : 'var(--sim-text-secondary)',
              }}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="capitalize">{m}</span>
              {active && (
                <motion.span
                  layoutId="cargo-mode-pill"
                  className="absolute inset-0 rounded-full -z-10"
                  style={{ background: 'var(--sim-primary)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Cargo chips */}
      <div
        className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none"
        role="listbox"
        aria-label={`Available ${mode === 'container' ? 'containers' : 'trucks'}`}
      >
        {visible.map((c) => {
          const active = c.id === selectedId;
          return (
            <button
              key={c.id}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => onSelect(c.id)}
              title={`${c.name} · ${c.length_cm}×${c.width_cm}×${c.height_cm} cm · ${c.volume_m3} m³ · max ${c.max_payload_kg.toLocaleString()} kg`}
              className="shrink-0 snap-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                background: active ? 'var(--sim-primary-soft)' : 'var(--sim-surface)',
                color: active ? 'var(--sim-primary)' : 'var(--sim-text-secondary)',
                border: `1px solid ${active ? 'var(--sim-primary)' : 'var(--sim-border)'}`,
                boxShadow: active ? '0 1px 4px rgba(30,58,138,0.10)' : 'none',
              }}
            >
              <span className="leading-tight">{c.name}</span>
              <span
                className="font-mono tabular-nums text-[10px]"
                style={{
                  color: active ? 'var(--sim-primary-light)' : 'var(--sim-text-muted)',
                }}
              >
                {c.volume_m3} m³
              </span>
            </button>
          );
        })}

        {/* Custom truck chip */}
        {mode === 'truck' && onApplyCustomTruck && (
          <button
            type="button"
            role="option"
            aria-selected={isCustomTruck}
            onClick={() => {
              if (truckCustom) {
                onApplyCustomTruck(truckCustom);
              } else {
                onSelect(TRUCK_CUSTOM_ID);
              }
            }}
            className={cn(
              'shrink-0 snap-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            )}
            style={{
              background: isCustomTruck ? 'var(--sim-surface-2)' : 'transparent',
              color: 'var(--sim-gold)',
              border: `1px dashed ${isCustomTruck ? 'var(--sim-gold)' : 'var(--sim-gold-dim)'}`,
            }}
            title="Define your own truck dimensions"
          >
            <Settings2 className="w-3 h-3" aria-hidden="true" />
            <span className="leading-tight">Custom</span>
          </button>
        )}
      </div>
      </div>

      {/* Inline custom-truck form — slides in below the strip when active */}
      <AnimatePresence>
        {mode === 'truck' && isCustomTruck && onApplyCustomTruck && (
          <motion.div
            key="custom-truck-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden w-full"
          >
            <CustomTruckForm initial={truckCustom} onApply={onApplyCustomTruck} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

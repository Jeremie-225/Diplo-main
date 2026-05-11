/**
 * SimulatePage — Phase 2.2 dark premium simulator.
 *
 * Layout (≥1024px):
 *   ┌────────────────────────────────────────────────────────────────────┐
 *   │  Page header (title + gold rule + ? help)                          │
 *   │  Cargo selector (mode toggle + chip strip + custom truck form)     │
 *   ├──────────────────────────────────────────┬─────────────────────────┤
 *   │  LEFT (col-span-8) — product browser     │  RIGHT (col-span-4)     │
 *   │    search + filter chips                 │  LoadStatusCard (sticky)│
 *   │    4-col grid w/ cards                   │  Cart items             │
 *   │      • image                             │                         │
 *   │      • carton specs                      │                         │
 *   │      • container capacity table          │                         │
 *   │      • Fill-to 25/50/75/100 buttons      │                         │
 *   │      • stepper                           │                         │
 *   └──────────────────────────────────────────┴─────────────────────────┘
 *
 * Mobile: vertical stack — cargo strip, LoadStatusCard, browser, cart in a
 * collapsible bottom sheet, sticky bottom action bar.
 *
 * The whole page is wrapped in `.simulator-dark-theme` so the `--sim-*`
 * tokens stay scoped and the homepage isn't affected.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Container } from '@/components/ui/Container';
import { CargoChips } from '@/components/simulator/CargoChips';
import { SimulatorProductBrowser } from '@/components/simulator/SimulatorProductBrowser';
import { SimulatorCart } from '@/components/simulator/SimulatorCart';
import { LoadStatusCard } from '@/components/simulator/LoadStatusCard';
import { useSimulationCart } from '@/hooks/useSimulationCart';
import { exportLoadReportPDF } from '@/lib/simulator/pdf-export';
import { ChevronDown, HelpCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import '@/styles/simulator-dark-theme.css';

export default function SimulatePage() {
  const cart = useSimulationCart();

  // Pulse trigger — bumped when the cart hook clamps a quantity. Fed
  // into LoadStatusCard so it can briefly highlight the matching gauge.
  const [pulseTrigger, setPulseTrigger] = useState<{
    reason: 'volume' | 'weight' | null;
    tick: number;
  }>({ reason: cart.lastLimitRef.current.reason, tick: 0 });

  useEffect(() => {
    const id = setInterval(() => {
      const cur = cart.lastLimitRef.current;
      if (cur.tick !== pulseTrigger.tick) {
        setPulseTrigger({ reason: cur.reason, tick: cur.tick });
      }
    }, 80);
    return () => clearInterval(id);
  }, [cart.lastLimitRef, pulseTrigger.tick]);

  // Toast a warning when items still over-fill after a container switch.
  const lastCargoIdRef = useRef(cart.cargoSpace.id);
  useEffect(() => {
    if (lastCargoIdRef.current !== cart.cargoSpace.id) {
      lastCargoIdRef.current = cart.cargoSpace.id;
      if (cart.isOverCapacity) {
        toast(
          `⚠️ Items exceed your new ${cart.cargoSpace.kind === 'truck' ? 'truck' : 'container'}'s limits.`,
        );
      }
    }
  }, [cart.cargoSpace.id, cart.cargoSpace.kind, cart.isOverCapacity]);

  // ── PDF export — pure layout, no DOM screenshot. ──────────────────────
  async function handleSavePDF() {
    try {
      await exportLoadReportPDF({
        cargoSpace: cart.cargoSpace,
        items: cart.hydratedItems.map((i) => ({
          product: i.product,
          quantityCartons: i.quantityCartons,
        })),
        totals: {
          cartons: cart.totals.cartons,
          units: cart.totals.units,
          volume_m3: cart.totals.volume_m3,
          weight_kg: cart.totals.weight_kg,
          volumePct: cart.totals.volumePct,
          weightPct: cart.totals.weightPct,
        },
      });
      toast.success('PDF downloaded!');
    } catch (e) {
      console.error(e);
      toast.error('Could not export PDF.');
    }
  }

  // Mobile cart drawer + help modal
  const [cartOpen, setCartOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div
      className="simulator-dark-theme min-h-screen"
      style={{
        background:
          'linear-gradient(180deg, var(--sim-bg) 0%, var(--sim-surface) 100%)',
      }}
    >
      {/* ─── Page header ────────────────────────────────────────────── */}
      <section className="pt-24 lg:pt-28 pb-4">
        <Container size="xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              
              <h1
                className="text-2xl sm:text-3xl font-extrabold leading-tight mt-1"
                style={{ color: 'var(--sim-text-primary)' }}
              >
                Load Simulator
              </h1>
              <p
                className="text-sm mt-1.5 max-w-xl"
                style={{ color: 'var(--sim-text-secondary)' }}
              >
                Pick a container or truck, fill it with real Diplo
                products, and submit a fully-specced shipment quote.
              </p>
              <div
                aria-hidden="true"
                className="mt-3 h-[3px] w-20 rounded-full"
                style={{ background: 'var(--sim-gold)' }}
              />
            </div>
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors hover:-translate-y-px"
              style={{
                background: 'var(--sim-surface)',
                color: 'var(--sim-primary)',
                border: '1px solid var(--sim-border)',
                boxShadow: '0 1px 2px rgba(15,23,42,0.06)',
              }}
              aria-label="How does this simulator work?"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              How it works
            </button>
          </div>
        </Container>
      </section>

      {/* ─── Cargo selector — its own card so it reads as a step ──── */}
      <section className="pb-5">
        <Container size="xl">
          <div
            className="rounded-2xl border p-4 sm:p-5 shadow-sm"
            style={{
              background: 'var(--sim-surface)',
              borderColor: 'var(--sim-border)',
            }}
          >
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div>
                <p
                  className="text-[10px] uppercase tracking-widest font-bold"
                  style={{ color: 'var(--sim-primary)' }}
                >
                  Step 1 · Cargo space
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: 'var(--sim-text-secondary)' }}
                >
                  Pick a sea container or road truck. Custom truck
                  dimensions are supported under the truck tab.
                </p>
              </div>
            </div>
            <CargoChips
              selectedId={cart.cargoSpace.id}
              onSelect={(id) => cart.setCargoSpace(id)}
              truckCustom={cart.state.truckCustom}
              onApplyCustomTruck={cart.setTruckCustom}
            />
          </div>
        </Container>
      </section>

      {/* ─── Workspace — 2-column on lg+, vertical stack below ─────── */}
      <section className="pb-24 lg:pb-12">
        <Container size="xl">
          <div className="grid lg:grid-cols-12 gap-4 lg:gap-5">
            {/* LEFT — product browser */}
            <div className="lg:col-span-8">
              <SimulatorProductBrowser
                cargoSpace={cart.cargoSpace}
                cartItems={cart.hydratedItems}
                quantityFor={cart.quantityFor}
                onIncrement={cart.increment}
                onDecrement={cart.decrement}
                onSetQuantity={cart.setQuantityCapped}
              />
            </div>

            {/* RIGHT — load status + cart, sticky on lg+ */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-4">
                <LoadStatusCard
                  cargoSpace={cart.cargoSpace}
                  items={cart.hydratedItems}
                  totals={cart.totals}
                  isOverCapacity={cart.isOverCapacity}
                  pulseTrigger={pulseTrigger}
                  onSavePDF={handleSavePDF}
                />
                <SimulatorCart
                  items={cart.hydratedItems}
                  onIncrement={cart.increment}
                  onDecrement={cart.decrement}
                  onRemove={cart.remove}
                  onClear={cart.clear}
                />
              </div>
            </div>

            {/* Mobile/tablet — Load Status above the browser */}
            <div className="lg:hidden col-span-12 -mt-1 mb-2">
              <LoadStatusCard
                cargoSpace={cart.cargoSpace}
                items={cart.hydratedItems}
                totals={cart.totals}
                isOverCapacity={cart.isOverCapacity}
                pulseTrigger={pulseTrigger}
                onSavePDF={handleSavePDF}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Mobile bottom sheet + sticky bar ────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30">
        <button
          type="button"
          onClick={() => setCartOpen((v) => !v)}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold shadow-lg"
          style={{
            background: 'var(--sim-primary)',
            color: '#FFFFFF',
            borderTop: '1px solid var(--sim-border)',
          }}
          aria-expanded={cartOpen}
        >
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              cartOpen ? 'rotate-180' : 'rotate-0',
            )}
            aria-hidden="true"
          />
          {cart.totals.cartons > 0
            ? `${cart.totals.cartons.toLocaleString()} cartons · ${cart.hydratedItems.length} item${cart.hydratedItems.length === 1 ? '' : 's'}`
            : 'Cart empty — browse products above'}
        </button>
        <AnimatePresence>
          {cartOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '60vh', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
              style={{ background: 'var(--sim-bg)' }}
            >
              <div className="h-full overflow-y-auto p-3">
                <SimulatorCart
                  items={cart.hydratedItems}
                  onIncrement={cart.increment}
                  onDecrement={cart.decrement}
                  onRemove={cart.remove}
                  onClear={cart.clear}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Help modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {helpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setHelpOpen(false)}
          >
            <div
              className="absolute inset-0 backdrop-blur-md"
              style={{ background: 'rgba(10, 22, 40, 0.7)' }}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="sim-help-title"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-lg rounded-2xl p-6 border"
              style={{
                background: 'var(--sim-surface)',
                borderColor: 'var(--sim-border)',
              }}
            >
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                aria-label="Close help"
                className="absolute top-3 right-3 p-1.5 rounded-lg"
                style={{ color: 'var(--sim-text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
              <h2
                id="sim-help-title"
                className="text-lg font-extrabold"
                style={{ color: 'var(--sim-text-primary)' }}
              >
                How the Load Simulator works
              </h2>
              <ol
                className="mt-4 space-y-3 text-sm leading-relaxed"
                style={{ color: 'var(--sim-text-secondary)' }}
              >
                {[
                  'Pick a cargo space — sea container or road truck — using the chips at the top.',
                  'Browse the catalog. Each card shows how many cartons fit in each container, and which factor (volume or weight) limits it.',
                  'Use the Fill to 25 / 50 / 75 / 100% buttons to set a quantity that fills the cargo space to that target, accounting for whatever is already in your cart.',
                  'Watch the Volume + Weight gauges. Type any quantity freely — we cap it on blur to whatever fits.',
                  'Hit Get Quote to send the manifest to our team pre-filled in the quote form.',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="shrink-0 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold"
                      style={{
                        background: 'var(--sim-primary-soft)',
                        color: 'var(--sim-primary)',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

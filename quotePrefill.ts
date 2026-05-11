/**
 * Cross-page handoff between the simulator and the quote form.
 *
 * Phase 2.1 — Replaces the legacy `diplo_sim_quote` flat-message blob
 * with a structured payload (`diplo-quote-prefill-v1`) that carries
 * cargo-space + per-product line items + simulation stats. The quote
 * form renders Stage 2 from this payload (one row per line item with
 * editable quantity steppers).
 *
 * Contract:
 *   - Writer: SimulatorCart's "Submit Quote" handler
 *   - Reader: QuoteForm component (clears the key after reading so the
 *             pre-fill doesn't bleed into a later /quote visit)
 *
 * The schemaVersion guards against future schema changes; older payloads
 * are silently dropped.
 */

const STORAGE_KEY = 'diplo-quote-prefill-v1';
const SCHEMA_VERSION = 1 as const;

export interface SimulatorQuotePrefillItem {
  productId: string;
  productName: string;
  quantityCartons: number;
  unitsPerCarton: number;
  totalUnits: number;
  cartonDimensions: string; // e.g. "40 × 30 × 30 cm"
  cartonWeightKg: number;
}

export interface SimulatorQuotePrefill {
  cargoSpaceType: 'container' | 'truck';
  cargoSpaceId: string;
  cargoSpaceName: string;
  truckCustom?: {
    length_cm: number;
    width_cm: number;
    height_cm: number;
    max_payload_kg: number;
  };
  items: SimulatorQuotePrefillItem[];
  simulationStats: {
    totalCartons: number;
    totalVolume_m3: number;
    volumeUtilization_pct: number;
    totalWeight_kg: number;
    weightUtilization_pct: number;
  };
  generatedAt: string;
  schemaVersion: typeof SCHEMA_VERSION;
}

/** Persist a structured pre-fill payload for the quote form. */
export function writeQuotePrefill(payload: Omit<SimulatorQuotePrefill, 'schemaVersion' | 'generatedAt'>): void {
  if (typeof window === 'undefined') return;
  const full: SimulatorQuotePrefill = {
    ...payload,
    schemaVersion: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    // Clear the legacy flat-message key so we don't leave stale data behind.
    localStorage.removeItem('diplo_sim_quote');
  } catch (err) {
    console.warn('[quote-prefill] persist failed', err);
  }
}

/**
 * Read + delete the pre-fill payload. Returns `null` if it doesn't
 * exist, has a stale schema, or fails to parse.
 *
 * The clear-on-read behavior is deliberate (per spec): a user who
 * navigates to /quote later shouldn't see Stage 2 mysteriously
 * pre-filled with their old simulation.
 */
export function consumeQuotePrefill(): SimulatorQuotePrefill | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    localStorage.removeItem(STORAGE_KEY); // clear-on-read
    const parsed = JSON.parse(raw) as Partial<SimulatorQuotePrefill>;
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      console.warn('[quote-prefill] schema mismatch — dropping');
      return null;
    }
    if (!Array.isArray(parsed.items) || !parsed.cargoSpaceId) return null;
    return parsed as SimulatorQuotePrefill;
  } catch (err) {
    console.warn('[quote-prefill] read failed', err);
    return null;
  }
}

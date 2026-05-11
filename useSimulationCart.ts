/**
 * useSimulationCart — single source of truth for the new product-driven
 * simulator flow.
 *
 * State shape (persisted in localStorage under `diplo-simulator-cart-v1`):
 *   {
 *     cargoSpaceId: string,          // container OR truck id
 *     items: Array<{ productId, quantityCartons }>,
 *     lastUpdated: ISO date,
 *     schemaVersion: 1
 *   }
 *
 * Schema is versioned — bumping `SCHEMA_VERSION` clears stale carts gracefully
 * so old localStorage data never crashes the new code.
 *
 * Hard cap: every increment is checked against the *active* cargo space's
 * volume + weight limits. If either would be exceeded, the increment is
 * blocked and the caller receives a `LimitReason` telling the UI which
 * resource ran out (so it can toast/shake/pulse appropriately).
 */

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { CONTAINER_MAP } from '@/data/containers';
import { ownProducts } from '@/data/ownProducts';
import { partnerProducts } from '@/data/partnerProducts';
import { vilniausProducts } from '@/data/vilniausProducts';
import { massIndustriesProducts } from '@/data/massIndustriesProducts';
import type { Product } from '@/types';
import type { ContainerSpec } from '@/data/containers';

const SCHEMA_VERSION = 1;
const STORAGE_KEY = 'diplo-simulator-cart-v1';

// ---------------------------------------------------------------------------
// Aggregated product index — every catalog source plus auto-imports
// ---------------------------------------------------------------------------

export const ALL_SIMULATOR_PRODUCTS: Product[] = [
  ...ownProducts,
  ...partnerProducts,
  ...vilniausProducts,
  ...massIndustriesProducts,
];

const PRODUCT_INDEX = new Map<string, Product>(
  ALL_SIMULATOR_PRODUCTS.map((p) => [p.id, p]),
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItem {
  productId: string;
  quantityCartons: number;
}

/** User-supplied custom truck dimensions — used when cargoSpaceId === 'truck-custom'. */
export interface TruckCustom {
  length_cm: number;
  width_cm: number;
  height_cm: number;
  /** Optional payload limit. Falls back to 99,999 kg ("no weight limit") when absent. */
  max_payload_kg?: number;
}

export interface CartState {
  cargoSpaceId: string; // ContainerSpec.id (sea container OR truck) OR 'truck-custom'
  items: CartItem[];
  /** Phase 2.1 — Custom truck dimensions are persisted alongside the cart so
   *  reloading the page restores the exact custom truck. Only used when
   *  cargoSpaceId === 'truck-custom'. */
  truckCustom?: TruckCustom;
  lastUpdated: string;
  schemaVersion: typeof SCHEMA_VERSION;
}

export type LimitReason = 'volume' | 'weight' | null;

export interface CartTotals {
  cartons: number;
  units: number;
  volume_m3: number;
  weight_kg: number;
  /** Volume usage 0..1 (0..100%). */
  volumePct: number;
  /** Weight usage 0..1. */
  weightPct: number;
  /** Worst of the two — drives color states. */
  fillPct: number;
  /** Convenience: items the user can still safely add. */
  remainingVolume_m3: number;
  remainingWeight_kg: number;
}

interface CartReducerAction {
  type:
    | 'SET_CARGO_SPACE'
    | 'SET_TRUCK_CUSTOM'
    | 'SET_QUANTITY'
    | 'INCREMENT'
    | 'DECREMENT'
    | 'REMOVE'
    | 'CLEAR'
    | 'HYDRATE';
  productId?: string;
  quantity?: number;
  cargoSpaceId?: string;
  truckCustom?: TruckCustom;
  state?: CartState;
}

/** Synthetic id used for the user-supplied custom truck. Never appears in CONTAINER_MAP. */
export const TRUCK_CUSTOM_ID = 'truck-custom';

/** Default payload when the user doesn't supply one — effectively "no weight limit". */
const TRUCK_CUSTOM_DEFAULT_PAYLOAD = 99_999;

/** Build a runtime-only ContainerSpec from the user's custom dimensions. */
export function buildCustomTruckSpec(custom: TruckCustom): ContainerSpec {
  const volume_m3 =
    (custom.length_cm * custom.width_cm * custom.height_cm) / 1_000_000;
  return {
    id: TRUCK_CUSTOM_ID,
    kind: 'truck',
    name: `Custom Truck (${custom.length_cm}×${custom.width_cm}×${custom.height_cm} cm)`,
    length_cm: custom.length_cm,
    width_cm: custom.width_cm,
    height_cm: custom.height_cm,
    max_payload_kg: custom.max_payload_kg ?? TRUCK_CUSTOM_DEFAULT_PAYLOAD,
    volume_m3: Math.round(volume_m3 * 100) / 100,
    icon: 'truck-articulated',
    description: 'Your custom-sized truck.',
  };
}

// ---------------------------------------------------------------------------
// Initial state + persistence
// ---------------------------------------------------------------------------

const FALLBACK_CARGO: ContainerSpec['id'] = '40ft';

function freshState(): CartState {
  return {
    cargoSpaceId: FALLBACK_CARGO,
    items: [],
    lastUpdated: new Date().toISOString(),
    schemaVersion: SCHEMA_VERSION,
  };
}

function loadFromStorage(): CartState {
  if (typeof window === 'undefined') return freshState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw) as Partial<CartState>;
    // Schema-version mismatch → treat as fresh.
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      console.warn(
        `[simulator-cart] schema mismatch (have ${parsed.schemaVersion}, expected ${SCHEMA_VERSION}); resetting.`,
      );
      localStorage.removeItem(STORAGE_KEY);
      return freshState();
    }
    // Drop items whose product no longer exists in the catalog.
    const items = (parsed.items ?? []).filter((it) => {
      const exists = PRODUCT_INDEX.has(it.productId);
      if (!exists) {
        console.warn(`[simulator-cart] dropping orphan item ${it.productId}`);
      }
      return exists;
    });
    // Validate cargoSpaceId — accept either a real CONTAINER_MAP id OR the
    // synthetic 'truck-custom' marker (when accompanied by valid dimensions).
    const isCustom =
      parsed.cargoSpaceId === TRUCK_CUSTOM_ID &&
      parsed.truckCustom &&
      parsed.truckCustom.length_cm > 0 &&
      parsed.truckCustom.width_cm > 0 &&
      parsed.truckCustom.height_cm > 0;
    const cargoSpaceId =
      isCustom
        ? TRUCK_CUSTOM_ID
        : parsed.cargoSpaceId && CONTAINER_MAP[parsed.cargoSpaceId]
          ? parsed.cargoSpaceId
          : FALLBACK_CARGO;
    return {
      cargoSpaceId,
      items,
      truckCustom: isCustom ? parsed.truckCustom : undefined,
      lastUpdated: parsed.lastUpdated ?? new Date().toISOString(),
      schemaVersion: SCHEMA_VERSION,
    };
  } catch (err) {
    console.warn('[simulator-cart] load failed; using fresh state', err);
    return freshState();
  }
}

function persist(state: CartState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Quota exceeded or storage disabled — fail silently per spec.
    console.warn('[simulator-cart] persist failed', err);
  }
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function reducer(state: CartState, action: CartReducerAction): CartState {
  const stamped = (s: CartState): CartState => ({
    ...s,
    lastUpdated: new Date().toISOString(),
  });

  switch (action.type) {
    case 'HYDRATE':
      return action.state ?? state;
    case 'SET_CARGO_SPACE':
      if (!action.cargoSpaceId) return state;
      return stamped({ ...state, cargoSpaceId: action.cargoSpaceId });
    case 'SET_TRUCK_CUSTOM':
      if (!action.truckCustom) return state;
      return stamped({
        ...state,
        cargoSpaceId: TRUCK_CUSTOM_ID,
        truckCustom: action.truckCustom,
      });
    case 'SET_QUANTITY': {
      if (!action.productId) return state;
      const q = Math.max(0, action.quantity ?? 0);
      const idx = state.items.findIndex((i) => i.productId === action.productId);
      let items: CartItem[];
      if (idx === -1) {
        items = q > 0 ? [...state.items, { productId: action.productId, quantityCartons: q }] : state.items;
      } else if (q === 0) {
        items = state.items.filter((_, i) => i !== idx);
      } else {
        items = state.items.map((it, i) => (i === idx ? { ...it, quantityCartons: q } : it));
      }
      return stamped({ ...state, items });
    }
    case 'REMOVE':
      if (!action.productId) return state;
      return stamped({
        ...state,
        items: state.items.filter((i) => i.productId !== action.productId),
      });
    case 'CLEAR':
      return stamped({ ...state, items: [] });
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Total / fit math
// ---------------------------------------------------------------------------

/** Resolve the active cargo space — handles both real IDs and the synthetic
 *  'truck-custom' marker. Exported so callers (UI, packing) share one truth. */
export function resolveCargoSpace(state: CartState): ContainerSpec | undefined {
  if (state.cargoSpaceId === TRUCK_CUSTOM_ID && state.truckCustom) {
    return buildCustomTruckSpec(state.truckCustom);
  }
  return CONTAINER_MAP[state.cargoSpaceId];
}

function computeTotals(state: CartState): CartTotals {
  const cargo = resolveCargoSpace(state);
  let cartons = 0;
  let units = 0;
  let volume_m3 = 0;
  let weight_kg = 0;
  for (const it of state.items) {
    const product = PRODUCT_INDEX.get(it.productId);
    if (!product?.carton) continue;
    cartons += it.quantityCartons;
    units += it.quantityCartons * product.carton.units_per_carton;
    volume_m3 += it.quantityCartons * product.carton.volume_m3;
    weight_kg += it.quantityCartons * product.carton.weight_kg;
  }
  const containerVol = cargo
    ? (cargo.length_cm * cargo.width_cm * cargo.height_cm) / 1_000_000
    : 1;
  const containerWt = cargo?.max_payload_kg ?? 1;
  const volumePct = volume_m3 / containerVol;
  const weightPct = weight_kg / containerWt;
  return {
    cartons,
    units,
    volume_m3,
    weight_kg,
    volumePct,
    weightPct,
    fillPct: Math.max(volumePct, weightPct),
    remainingVolume_m3: Math.max(0, containerVol - volume_m3),
    remainingWeight_kg: Math.max(0, containerWt - weight_kg),
  };
}

// ---------------------------------------------------------------------------
// The hook
// ---------------------------------------------------------------------------

export function useSimulationCart() {
  // Lazy-init from localStorage on first render
  const [state, dispatch] = useReducer(reducer, undefined, loadFromStorage);

  // Persist on every change (after first hydration)
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    persist(state);
  }, [state]);

  // Limit the LAST blocked attempt so the UI can toast/shake. Stored in a
  // ref + bump counter so consumers can subscribe via a useEffect.
  const lastLimitRef = useRef<{ reason: LimitReason; productId: string | null; tick: number }>({
    reason: null,
    productId: null,
    tick: 0,
  });

  // ── Derived totals (memoised on state) ──────────────────────────────────
  const totals = useMemo(() => computeTotals(state), [state]);

  // ── Active cargo space ──────────────────────────────────────────────────
  const cargoSpace =
    resolveCargoSpace(state) ?? CONTAINER_MAP[FALLBACK_CARGO];

  // ── Helpers consumed by UI ──────────────────────────────────────────────

  /** Returns the current per-product quantity (0 if not in cart). */
  const quantityFor = useCallback(
    (productId: string): number =>
      state.items.find((i) => i.productId === productId)?.quantityCartons ?? 0,
    [state.items],
  );

  /**
   * Try to set a new quantity for a product. Returns the LimitReason if the
   * delta would exceed cargo limits (and the change is blocked), or null if
   * it succeeded.
   */
  const trySetQuantity = useCallback(
    (productId: string, nextQty: number): LimitReason => {
      const product = PRODUCT_INDEX.get(productId);
      if (!product?.carton) return null;
      const safeQty = Math.max(0, Math.min(100_000, Math.floor(nextQty)));
      const currentQty = state.items.find((i) => i.productId === productId)?.quantityCartons ?? 0;
      const deltaCartons = safeQty - currentQty;
      // Decreases never blocked.
      if (deltaCartons <= 0) {
        dispatch({ type: 'SET_QUANTITY', productId, quantity: safeQty });
        return null;
      }
      // Volume + weight check
      const dVol = deltaCartons * product.carton.volume_m3;
      const dWt = deltaCartons * product.carton.weight_kg;
      if (dVol > totals.remainingVolume_m3 + 1e-6) {
        lastLimitRef.current = {
          reason: 'volume',
          productId,
          tick: lastLimitRef.current.tick + 1,
        };
        return 'volume';
      }
      if (dWt > totals.remainingWeight_kg + 1e-6) {
        lastLimitRef.current = {
          reason: 'weight',
          productId,
          tick: lastLimitRef.current.tick + 1,
        };
        return 'weight';
      }
      dispatch({ type: 'SET_QUANTITY', productId, quantity: safeQty });
      return null;
    },
    [state.items, totals.remainingVolume_m3, totals.remainingWeight_kg],
  );

  /**
   * Like `trySetQuantity` but ALWAYS commits — capping at whatever fits in
   * the cargo space. Returns `{ value, capped, reason }` so the caller can
   * toast a "adjusted to N cartons" message when needed. Used by the
   * draft-state input (commits on blur) and by fill-percentage buttons.
   */
  const setQuantityCapped = useCallback(
    (productId: string, requested: number): {
      value: number;
      capped: boolean;
      reason: LimitReason;
    } => {
      const product = PRODUCT_INDEX.get(productId);
      if (!product?.carton) {
        return { value: 0, capped: false, reason: null };
      }
      const safe = Math.max(0, Math.min(100_000, Math.floor(requested)));
      // Decreases (and zero) commit straight through.
      const cur = state.items.find((i) => i.productId === productId)?.quantityCartons ?? 0;
      if (safe <= cur) {
        dispatch({ type: 'SET_QUANTITY', productId, quantity: safe });
        return { value: safe, capped: false, reason: null };
      }
      // For increases, figure out how much room remains. Subtract THIS line
      // from the remaining capacity since `totals.remaining*` already
      // excludes the line's existing cartons (it's "remaining capacity for
      // additional cartons of any product").
      const dVol = product.carton.volume_m3;
      const dWt = product.carton.weight_kg;
      const headroomVol = totals.remainingVolume_m3 + cur * dVol;
      const headroomWt = totals.remainingWeight_kg + cur * dWt;
      const fitByVol = dVol > 0 ? Math.floor(headroomVol / dVol) : safe;
      const fitByWt = dWt > 0 ? Math.floor(headroomWt / dWt) : safe;
      const maxFit = Math.max(0, Math.min(fitByVol, fitByWt));
      const capped = safe > maxFit;
      const value = capped ? maxFit : safe;
      dispatch({ type: 'SET_QUANTITY', productId, quantity: value });
      const reason: LimitReason = capped ? (fitByWt < fitByVol ? 'weight' : 'volume') : null;
      if (capped) {
        lastLimitRef.current = {
          reason,
          productId,
          tick: lastLimitRef.current.tick + 1,
        };
      }
      return { value, capped, reason };
    },
    [state.items, totals.remainingVolume_m3, totals.remainingWeight_kg],
  );

  /** Convenience: +1 for a product. Returns LimitReason if blocked. */
  const increment = useCallback(
    (productId: string): LimitReason => {
      const cur = quantityFor(productId);
      return trySetQuantity(productId, cur + 1);
    },
    [quantityFor, trySetQuantity],
  );

  /** Convenience: -1 for a product. */
  const decrement = useCallback(
    (productId: string) => {
      const cur = quantityFor(productId);
      if (cur > 0) trySetQuantity(productId, cur - 1);
    },
    [quantityFor, trySetQuantity],
  );

  const remove = useCallback(
    (productId: string) => dispatch({ type: 'REMOVE', productId }),
    [],
  );

  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const setCargoSpace = useCallback(
    (cargoSpaceId: ContainerSpec['id']) => dispatch({ type: 'SET_CARGO_SPACE', cargoSpaceId }),
    [],
  );

  /** Apply user-supplied custom truck dimensions and switch to that cargo. */
  const setTruckCustom = useCallback(
    (custom: TruckCustom) => dispatch({ type: 'SET_TRUCK_CUSTOM', truckCustom: custom }),
    [],
  );

  /**
   * After a user switches container, items might now exceed limits. We do
   * NOT auto-remove (per edge-case spec); we just expose `isOverCapacity`
   * so the UI can warn.
   */
  const isOverCapacity = totals.fillPct > 1.0001;

  /**
   * Returns the cart line items hydrated with their Product reference, so
   * the cart panel doesn't need to re-look-up.
   */
  const hydratedItems = useMemo(
    () =>
      state.items.flatMap((it) => {
        const product = PRODUCT_INDEX.get(it.productId);
        if (!product) return [];
        return [{ ...it, product }];
      }),
    [state.items],
  );

  return {
    state,
    cargoSpace,
    totals,
    isOverCapacity,
    quantityFor,
    trySetQuantity,
    increment,
    decrement,
    remove,
    clear,
    setCargoSpace,
    setTruckCustom,
    setQuantityCapped,
    hydratedItems,
    lastLimitRef,
  };
}

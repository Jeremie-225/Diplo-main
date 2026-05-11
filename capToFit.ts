/**
 * Cap a requested carton quantity to whatever currently fits in the cargo
 * space, honouring volume + weight limits and any items already in the cart.
 *
 * Both the manual quantity input (after blur) and the fill-percentage
 * buttons go through this helper so the math is identical everywhere.
 *
 * Returns:
 *   - `value`   the quantity that's actually safe to commit
 *   - `capped`  true when `value < requested` (caller may show a toast)
 *   - `reason`  which limit clamped us (volume / weight / none)
 */

import type { CartonSpec } from '@/types';
import type { ContainerSpec } from '@/data/containers';

export interface CartLineLite {
  productId: string;
  quantityCartons: number;
  carton?: CartonSpec | null;
}

export interface CapToFitArgs {
  productId: string;
  carton: CartonSpec;
  cargoSpace: ContainerSpec;
  cartItems: readonly CartLineLite[];
  /** Quantity the user is asking for (e.g. parsed from the input on blur). */
  requested: number;
  /** Hard ceiling — kept for sanity, prevents 5-million-carton typos. */
  hardMax?: number;
}

export interface CapToFitResult {
  value: number;
  capped: boolean;
  reason: 'volume' | 'weight' | 'none';
}

const HARD_MAX_DEFAULT = 100_000;

export function capToFit({
  productId,
  carton,
  cargoSpace,
  cartItems,
  requested,
  hardMax = HARD_MAX_DEFAULT,
}: CapToFitArgs): CapToFitResult {
  const cargoVol_m3 =
    (cargoSpace.length_cm * cargoSpace.width_cm * cargoSpace.height_cm) /
    1_000_000;
  const cargoWt_kg = cargoSpace.max_payload_kg;

  // Sum of every other line in the cart (excluding the product we're editing).
  let otherVol = 0;
  let otherWt = 0;
  for (const it of cartItems) {
    if (it.productId === productId) continue;
    if (!it.carton) continue;
    otherVol += it.carton.volume_m3 * it.quantityCartons;
    otherWt += it.carton.weight_kg * it.quantityCartons;
  }

  const safeRequested = Math.max(0, Math.floor(Number.isFinite(requested) ? requested : 0));
  if (safeRequested === 0) {
    return { value: 0, capped: requested < 0, reason: 'none' };
  }
  const cappedToHardMax = Math.min(safeRequested, hardMax);

  const availVol = Math.max(0, cargoVol_m3 - otherVol);
  const availWt = Math.max(0, cargoWt_kg - otherWt);

  const byVol = carton.volume_m3 > 0 ? Math.floor(availVol / carton.volume_m3) : cappedToHardMax;
  const byWt = carton.weight_kg > 0 ? Math.floor(availWt / carton.weight_kg) : cappedToHardMax;

  const limit = Math.max(0, Math.min(byVol, byWt));
  const value = Math.min(cappedToHardMax, limit);

  let reason: CapToFitResult['reason'] = 'none';
  if (value < cappedToHardMax) {
    reason = byWt < byVol ? 'weight' : 'volume';
  }
  return {
    value,
    capped: value < cappedToHardMax,
    reason,
  };
}

/**
 * Compute how many cartons fit ALONE in the given cargo space (no cart
 * context). Used by per-product capacity tables on the product card.
 */
export function getCartonCapacity(
  cargoSpace: ContainerSpec,
  carton: CartonSpec,
): { count: number; limitedBy: 'volume' | 'weight' } {
  const cargoVol_m3 =
    (cargoSpace.length_cm * cargoSpace.width_cm * cargoSpace.height_cm) /
    1_000_000;
  const byVolume =
    carton.volume_m3 > 0 ? Math.floor(cargoVol_m3 / carton.volume_m3) : 0;
  const byWeight =
    carton.weight_kg > 0 ? Math.floor(cargoSpace.max_payload_kg / carton.weight_kg) : 0;
  const count = Math.max(0, Math.min(byVolume, byWeight));
  const limitedBy = byWeight < byVolume ? 'weight' : 'volume';
  return { count, limitedBy };
}

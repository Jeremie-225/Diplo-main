/**
 * Single-box grid-fit estimator.
 *
 * Phase 2.2: shrunk to just `maxBoxFit` after the visualization removal.
 * The previous `runQuickPack` (multi-product greedy estimate) was only
 * used by the legacy `useSimulation` hook and went away with the rest of
 * the visualization wiring. Per-line capacity is now computed directly in
 * `capToFit.ts` (cart-aware) and `getCartonCapacity` (single-product).
 *
 * All dimensions are centimetres.
 */

import type { ContainerSpec } from '@/data/containers';

interface BoxDims {
  length_cm: number;
  width_cm: number;
  height_cm: number;
}

/**
 * How many of a single box fit in the cargo space (grid packing). Tries
 * both horizontal orientations (rotate L/W) and returns the larger of the
 * two. Used by the per-product capacity table on product detail pages.
 */
export function maxBoxFit(container: ContainerSpec, box: BoxDims): number {
  const { length_cm: cL, width_cm: cW, height_cm: cH } = container;
  const { length_cm: bL, width_cm: bW, height_cm: bH } = box;

  if (bL <= 0 || bW <= 0 || bH <= 0) return 0;
  if (bH > cH) return 0; // box is too tall regardless of horizontal rotation

  // Orientation A — box as-is.
  const a = Math.floor(cL / bL) * Math.floor(cW / bW) * Math.floor(cH / bH);
  // Orientation B — swap length and width.
  const b = Math.floor(cL / bW) * Math.floor(cW / bL) * Math.floor(cH / bH);

  return Math.max(a, b);
}

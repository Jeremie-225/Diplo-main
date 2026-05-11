// =====================================================================
// Aggregated product list — combines own-brand SKUs, partner brand
// SKUs, the Vilniaus Degtinė exclusive line, and Mass Industries.
// Other modules import from this file when they need "all products"
// (e.g., command palette, search). When a feature only needs one slice
// (Private Label brands, partner brands), it should import from the
// specific module (`ownProducts`, `partnerProducts`, etc.).
// =====================================================================

import type { Product } from '@/types';
import { ownProducts } from './ownProducts';
import { vilniausProducts } from './vilniausProducts';
import { partnerProducts } from './partnerProducts';
import { massIndustriesProducts } from './massIndustriesProducts';

export const mockProducts: Product[] = [
  ...ownProducts,
  ...vilniausProducts,
  ...partnerProducts,
  ...massIndustriesProducts,
];

/** Featured across all sources — used by the homepage carousel. */
export const featuredProducts: Product[] = mockProducts.filter((p) => p.isFeatured);

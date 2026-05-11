/**
 * Site-wide computed statistics — single source of truth for the numbers
 * displayed in the Hero cards, Stats section, and footer.
 *
 * Pre-Phase-2-Supabase, the catalog lives in TS data files. We import
 * them directly so adding a product = the count updates automatically,
 * no manual sync. When Phase 2 wires Supabase, replace the array imports
 * with a query and keep the rest of the API identical.
 *
 * The two figures that AREN'T derived from data live as named constants
 * — `yearsActive` (founded 2003) and `clientsServed` (client-supplied
 * marketing figure). Future Phase-2 work may move these to a CMS table.
 */

import { ownProducts } from '@/data/ownProducts';
import { partnerProducts } from '@/data/partnerProducts';
import { vilniausProducts } from '@/data/vilniausProducts';
import { massIndustriesProducts } from '@/data/massIndustriesProducts';
import { partners } from '@/data/partners';

export const SITE_STATS = {
  /** Total catalogue size across all four product files. */
  totalProducts:
    ownProducts.length +
    partnerProducts.length +
    vilniausProducts.length +
    massIndustriesProducts.length,
  /** Distinct partner brands we represent. */
  totalPartners: partners.length,
  /** Years since DFL was founded (2003). Update annually if you really must. */
  yearsActive: new Date().getFullYear() - 2003,
  /** Client-supplied marketing figure, not a real catalogue count. */
  clientsServed: 1000,
} as const;

/**
 * Format a count for display in a stat card.
 *
 * Rules (per Phase 2.1 spec):
 *   - 0          → "Coming soon"
 *   - <100       → exact (e.g. "24")
 *   - <1000      → round DOWN to nearest 10 with "+" suffix (e.g. 127 → "120+")
 *   - >=1000     → round to "Nk+" (e.g. 1240 → "1K+")
 */
export function formatStatCount(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return 'Coming soon';
  if (n < 100) return n.toString();
  if (n < 1000) return `${Math.floor(n / 10) * 10}+`;
  // 1K, 2K, …, 9K then 10K+
  const k = Math.floor(n / 1000);
  return `${k}K+`;
}

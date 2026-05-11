import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * `cn` merges Tailwind classes intelligently — resolves conflicts so
 * `cn('p-2', condition && 'p-4')` ends up as `p-4` not `p-2 p-4`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as USD currency, e.g. 7.5 -> "$7.50".
 * Phase 1 is USD-only; Phase 2 may re-introduce per-locale formatting.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format an ISO date string into a friendly display, e.g. "Apr 24, 2026".
 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Display label for the partner classification on a product card.
 * Phase 1.5: products are never priced — only labelled by partner type.
 */
export function partnerTypeLabel(type: string): string {
  switch (type) {
    case 'PARTNER':
      return 'Partner';
    case 'EXCLUSIVE_PARTNER':
      return 'Exclusive';
    case 'PRIVATE_LABEL':
      return 'Private Label';
    default:
      return type;
  }
}

/**
 * Tiny sleep helper for mock async submits.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

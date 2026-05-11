import type { Product } from '@/types';
import { enrichProducts } from '@/data/_generated/cartonsLoader';

import imgAllDayDigestiveOats from'@/assets/products/food/all-day-digestive-oats-biscuits-main.png';
import imgBonitaDigestiveOats from'@/assets/products/food/bonita-digestive-biscuit.jpeg';
import imgDigestiveOatsMilk from'@/assets/products/food/oats-and-milk-biscuit.jpeg';
import imgLolaBiggy from'@/assets/products/food/lola-biggy.png';
import imgBonitaChoco from'@/assets/products/food/bonita-choco.png';
import imgCoCoLait from'@/assets/products/food/image.png';
import imgSupremewafers from'@/assets/products/food/supreme-wafers.png';





// =====================================================================
// Mass Industries SKU placeholder list — biscuit and wafer manufacturer
// based in Tema, Ghana.  Organised into the four brand families we know
// of: All Day, Bonita, Lola Biggy, Supreme.
//
// TODO: Get real SKU list, EANs, packing, and product images from the
// client.  Existing entries are placeholders so the partner landing
// page renders meaningfully.
// =====================================================================

function img(text: string, bg = '7F1D1D', fg = 'FCD34D'): string {
  return `https://placehold.co/800x600/${bg}/${fg}?text=${encodeURIComponent(text)}`;
}

const PARTNER = 'mass-industries';

// Raw catalog. `massIndustriesProducts` (below) is enriched.
const massIndustriesProductsRaw: Product[] = [
  // ─── All Day brand ──────────────────────────────────────────────
  {
    id: 'mi-allday-oats',
    slug: 'all-day-oats-digestives',
    name: 'All Day Oats & Digestives Biscuits',
    brand: 'All Day',
    description: 'Oat-based digestive biscuits — All Day brand by Mass Industries, Ghana.',
    shortDescription: 'Oat-based digestive biscuits.',
    categoryId: 'biscuits',
    image: imgAllDayDigestiveOats,
    origin: 'Ghana — Tema',
    supplier: 'Mass Industries',
    partnerType: 'EXCLUSIVE_PARTNER',
    partnerSlug: PARTNER,
    isOwnBrand: false,
    priceOnRequest: true,
    isFeatured: true,
    // TODO: Get real SKU list + EANs from client
  },
  {
    id: 'mi-allday-supreme-wafers',
    slug: 'all-day-supreme-wafers',
    name: 'All Day Supreme Wafers (NEW)',
    brand: 'All Day',
    shortDescription: 'New supreme-line wafers from All Day.',
    categoryId: 'biscuits',
    image: imgSupremewafers,
    origin: 'Ghana — Tema',
    supplier: 'Mass Industries',
    partnerType: 'EXCLUSIVE_PARTNER',
    partnerSlug: PARTNER,
    isOwnBrand: false,
    priceOnRequest: true,
    // TODO: Get real SKU list + EANs from client
  },

  // ─── Bonita brand ────────────────────────────────────────────────
  {
    id: 'mi-bonita-coconut-shortcake',
    slug: 'bonita-coconut-shortcake',
    name: 'Bonita Coconut Shortcake',
    brand: 'Bonita',
    description: 'Iconic coconut shortcake — Mass Industries flagship Bonita product.',
    shortDescription: 'Iconic coconut shortcake.',
    categoryId: 'biscuits',
    image: imgCoCoLait,
    origin: 'Ghana — Tema',
    supplier: 'Mass Industries',
    partnerType: 'EXCLUSIVE_PARTNER',
    partnerSlug: PARTNER,
    isOwnBrand: false,
    priceOnRequest: true,
    isFeatured: true,
    // TODO: Get real SKU list + EANs from client
  },
  {
    id: 'mi-bonita-wafer-chocolate',
    slug: 'bonita-wafer-chocolate',
    name: 'Bonita Wafer — Chocolate',
    brand: 'Bonita',
    shortDescription: 'Chocolate cream wafer.',
    categoryId: 'biscuits',
    image: imgSupremewafers,
    origin: 'Ghana — Tema',
    supplier: 'Mass Industries',
    partnerType: 'EXCLUSIVE_PARTNER',
    partnerSlug: PARTNER,
    isOwnBrand: false,
    priceOnRequest: true,
    // TODO: real EAN
  },
  {
    id: 'mi-bonita-wafer-strawberry',
    slug: 'bonita-wafer-strawberry',
    name: 'Bonita Wafer — Strawberry',
    brand: 'Bonita',
    shortDescription: 'Strawberry cream wafer.',
    categoryId: 'biscuits',
    image: imgSupremewafers,
    origin: 'Ghana — Tema',
    supplier: 'Mass Industries',
    partnerType: 'EXCLUSIVE_PARTNER',
    partnerSlug: PARTNER,
    isOwnBrand: false,
    priceOnRequest: true,
  },
  {
    id: 'mi-bonita-wafer-vanilla',
    slug: 'bonita-wafer-vanilla',
    name: 'Bonita Wafer — Vanilla',
    brand: 'Bonita',
    shortDescription: 'Vanilla cream wafer.',
    categoryId: 'biscuits',
    image: imgSupremewafers,
    origin: 'Ghana — Tema',
    supplier: 'Mass Industries',
    partnerType: 'EXCLUSIVE_PARTNER',
    partnerSlug: PARTNER,
    isOwnBrand: false,
    priceOnRequest: true,
  },

  // ─── Lola Biggy brand ────────────────────────────────────────────
  {
    id: 'mi-lola-biggy-chocolate',
    slug: 'lola-biggy-chocolate',
    name: 'Lola Biggy — Chocolate',
    brand: 'Lola Biggy',
    description: 'Lola Biggy big-format cream wafer in chocolate flavour.',
    shortDescription: 'Big chocolate cream wafer.',
    categoryId: 'biscuits',
    image: imgBonitaChoco,
    origin: 'Ghana — Tema',
    supplier: 'Mass Industries',
    partnerType: 'EXCLUSIVE_PARTNER',
    partnerSlug: PARTNER,
    isOwnBrand: false,
    priceOnRequest: true,
    isFeatured: true,
  },
  {
    id: 'mi-lola-biggy-vanilla',
    slug: 'lola-biggy-vanilla',
    name: 'Lola Biggy — Vanilla',
    brand: 'Lola Biggy',
    shortDescription: 'Big vanilla cream wafer.',
    categoryId: 'biscuits',
    image: imgLolaBiggy,
    origin: 'Ghana — Tema',
    supplier: 'Mass Industries',
    partnerType: 'EXCLUSIVE_PARTNER',
    partnerSlug: PARTNER,
    isOwnBrand: false,
    priceOnRequest: true,
  },
  {
    id: 'mi-lola-biggy-strawberry',
    slug: 'lola-biggy-strawberry',
    name: 'Lola Biggy — Strawberry',
    brand: 'Lola Biggy',
    shortDescription: 'Big strawberry cream wafer.',
    categoryId: 'biscuits',
    image: imgLolaBiggy,
    origin: 'Ghana — Tema',
    supplier: 'Mass Industries',
    partnerType: 'EXCLUSIVE_PARTNER',
    partnerSlug: PARTNER,
    isOwnBrand: false,
    priceOnRequest: true,
  },
  {
    id: 'mi-lola-biggy-lemon',
    slug: 'lola-biggy-lemon',
    name: 'Lola Biggy — Lemon',
    brand: 'Lola Biggy',
    shortDescription: 'Big lemon cream wafer.',
    categoryId: 'biscuits',
    image: imgLolaBiggy,
    origin: 'Ghana — Tema',
    supplier: 'Mass Industries',
    partnerType: 'EXCLUSIVE_PARTNER',
    partnerSlug: PARTNER,
    isOwnBrand: false,
    priceOnRequest: true,
  },

  // ─── Supreme brand ───────────────────────────────────────────────
  {
    id: 'mi-supreme-wafer',
    slug: 'supreme-wafers',
    name: 'Supreme Wafers (Premium Line)',
    brand: 'Supreme',
    description: 'Premium-finish wafer — Supreme brand by Mass Industries.',
    shortDescription: 'Premium wafer line.',
    categoryId: 'biscuits',
    image: imgSupremewafers,
    origin: 'Ghana — Tema',
    supplier: 'Mass Industries',
    partnerType: 'EXCLUSIVE_PARTNER',
    partnerSlug: PARTNER,
    isOwnBrand: false,
    priceOnRequest: true,
    isFeatured: true,
    // TODO: Get real Supreme SKU details from client
  },
];

/** Carton-enriched export. */
export const massIndustriesProducts: Product[] = enrichProducts(massIndustriesProductsRaw);

/** Group helper — used by the Mass Industries landing page. */
export function massIndustriesByBrand(): Record<string, Product[]> {
  return massIndustriesProducts.reduce<Record<string, Product[]>>((acc, p) => {
    const brand = p.brand ?? 'Other';
    if (!acc[brand]) acc[brand] = [];
    acc[brand].push(p);
    return acc;
  }, {});
}

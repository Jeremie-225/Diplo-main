import type { Category } from '@/types';

// =====================================================================
// Real Diplo categories — matches the section ordering of the printed
// Diplo Catalogue 2026. `parentId` lets us split into Beverages vs Food
// for two-level filters; `iconName` is a lucide-react component name.
// =====================================================================
export const categories: Category[] = [
  // ─── Beverages ────────────────────────────────────────────────────
  {
    id: 'wine',
    slug: 'wine',
    name: 'Wine',
    parentId: 'beverages',
    iconName: 'Wine',
    description: 'Still, sparkling, and fortified wines from France, Spain, South Africa, and beyond.',
    catalogPdfUrl: '/catalogs/diplo-catalogue-2026.pdf',
  },
  { id: 'bitters', slug: 'bitters', name: 'Bitters', parentId: 'beverages', iconName: 'GlassWater' },
  { id: 'beer', slug: 'beer', name: 'Beer', parentId: 'beverages', iconName: 'Beer' },
  { id: 'liquor', slug: 'liquor', name: 'Liquor', parentId: 'beverages', iconName: 'Wine' },
  { id: 'whiskey', slug: 'whiskey', name: 'Whiskey', parentId: 'beverages', iconName: 'Wine' },
  { id: 'rum', slug: 'rum', name: 'Rum', parentId: 'beverages', iconName: 'Wine' },
  { id: 'gin', slug: 'gin', name: 'Gin', parentId: 'beverages', iconName: 'Wine' },
  { id: 'vodka', slug: 'vodka', name: 'Vodka', parentId: 'beverages', iconName: 'Wine' },
  { id: 'vodka-mix', slug: 'vodka-mix', name: 'Vodka Mix', parentId: 'beverages', iconName: 'Wine' },
  { id: 'energy-drink', slug: 'energy-drink', name: 'Energy Drinks', parentId: 'beverages', iconName: 'Zap' },
  { id: 'spirit-drink', slug: 'spirit-drink', name: 'Spirit Drinks', parentId: 'beverages', iconName: 'Wine' },
  { id: 'liqueur', slug: 'liqueur', name: 'Liqueurs', parentId: 'beverages', iconName: 'Wine' },
  { id: 'brandy', slug: 'brandy', name: 'Brandy', parentId: 'beverages', iconName: 'Wine' },
  { id: 'herbal', slug: 'herbal', name: 'Herbal', parentId: 'beverages', iconName: 'Leaf' },
  // ─── Food ─────────────────────────────────────────────────────────
  { id: 'cooking-oil', slug: 'cooking-oil', name: 'Cooking Oils', parentId: 'food', iconName: 'Droplet' },
  { id: 'pasta', slug: 'pasta', name: 'Pasta & Noodles', parentId: 'food', iconName: 'Utensils' },
  { id: 'canned-goods', slug: 'canned-goods', name: 'Canned Goods', parentId: 'food', iconName: 'Box' },
  { id: 'sauces', slug: 'sauces', name: 'Sauces', parentId: 'food', iconName: 'Soup' },
  { id: 'biscuits', slug: 'biscuits', name: 'Biscuits & Wafers', parentId: 'food', iconName: 'Cookie' },
];

/** Lookup helper — returns the Category by id or undefined. */
export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

/** Lookup helper — by slug. */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

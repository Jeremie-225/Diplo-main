// =====================================================================
// Domain types — Phase 1.5 real-content shape.
// Mirrors the planned Supabase schema; English-only for now (Phase 2 will
// re-introduce *_en / *_fr pairs and an i18n switcher).
//
// Conventions:
//  - All products are "price on request" — no numeric price field exists.
//    The literal `priceOnRequest: true` is the only allowed value, used as
//    a type-level reminder when wiring quote / catalogue UIs.
//  - `partnerType` mirrors the Diplo classification on the catalogue:
//    PARTNER, EXCLUSIVE_PARTNER, or PRIVATE_LABEL (Diplo's own brands).
// =====================================================================

export type PartnerType = 'PARTNER' | 'EXCLUSIVE_PARTNER' | 'PRIVATE_LABEL';

// ---------------------------------------------------------------------------
// CartonSpec — logistics info for a single shipping carton.
//
// All linear dimensions are centimetres, weight in kilograms.
// Source data lives in `src/data/_generated/cartons.json` (built from the
// ENCLAVE STOCKS workbook by `scripts/build-cartons.mjs`). Vilniaus products
// optionally get richer pallet/truck stats from the supplier sheet — those
// live on Product.cartonExtras when present.
//
// Mark `carton` OPTIONAL on Product so existing entries without Excel data
// don't break the build. UI must render "Carton specs not yet available"
// when missing.
// ---------------------------------------------------------------------------
export interface CartonSpec {
  /** How many retail units (bottles/cans) per shipping carton. */
  units_per_carton: number;
  /** Carton outer length in centimetres. */
  length_cm: number;
  /** Carton outer width in centimetres. */
  width_cm: number;
  /** Carton outer height in centimetres. */
  height_cm: number;
  /** Carton gross weight in kilograms (cargo + packaging). */
  weight_kg: number;
  /** Carton volume in cubic metres — pre-computed from L × W × H / 1e6. */
  volume_m3: number;
}

/**
 * Optional richer logistics stats sourced from the manufacturer's pallet/
 * truck planning sheet (currently only available for Vilniaus Degtinė).
 * Phase 2 will expose more of these on the detail page; for Phase 1.8 we
 * keep them on the type so the data isn't dropped at ingestion time.
 */
export interface CartonExtras {
  cases_per_layer?: number;
  cases_per_pallet?: number;
  units_per_pallet?: number;
  pallet_weight_kg?: number;
  pallets_per_truck?: number;
  bottles_per_truck?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** SKU code from the Excel master (e.g., "39-860"). Optional — new SKUs
   *  may not yet have a code. */
  code?: string;
  /** Brand line within the catalogue (e.g., "Barska", "Mama Mia"). */
  brand?: string;
  description?: string;
  shortDescription?: string;
  /** Top-level category id from `categories.ts` (e.g., "wine", "vodka"). */
  categoryId: string;
  /** Optional second-level category ("red-wine", "vodka-mix"). */
  subCategoryId?: string;
  /** Hero image — placehold.co URL until real photography is supplied. */
  image: string;
  /** Country of origin, displayed on cards/details. */
  origin?: string;
  /** Supplier company name as printed on the catalogue. */
  supplier?: string;
  partnerType: PartnerType;
  /** Bottles/units that fit in a container (the "in cont" column). */
  containerQty?: number;
  /** Container size in feet (20 or 40). */
  tcSize?: number;
  /** Packing format (e.g., "6×75cl", "24×33cl"). */
  packing?: string;
  /** Bottle volume (e.g., "0.7L"). */
  volume?: string;
  /** ABV / alcohol content as a percentage. */
  alcoholContent?: number;
  ean?: string;
  moq?: number;
  leadTimeWeeks?: number;
  /** Always `true` — Diplo never publishes pricing. Used as a typed flag. */
  priceOnRequest: true;
  /** True for Diplo private-label SKUs (MATZ, Mama Mia, etc.). */
  isOwnBrand: boolean;
  /** Slug into `partners.ts` for non-own-brand products. */
  partnerSlug?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  /** Vintage year for wines (e.g., "2024"). */
  vintage?: string;
  /** Sommelier-style notes — appearance, nose, palate, pairing.
   *  Sourced from supplier tasting-notes catalogues. */
  tastingNotes?: {
    appearance?: string;
    nose?: string;
    palate?: string;
    pairing?: string;
  };
  /** Optional product-specific PDF (tasting notes, brand toolkit, spec
   *  sheet). Resolves under `/catalogs/...` in the public folder. */
  brochureUrl?: string;
  // ── Logistics fields (Phase 1.8) ───────────────────────────────────────
  /** Shipping-carton spec sheet. Optional — `undefined` for products
   *  whose carton dimensions/weight aren't yet in the Excel master. */
  carton?: CartonSpec;
  /** Optional richer pallet/truck stats — currently Vilniaus only. */
  cartonExtras?: CartonExtras;
  /**
   * Singular noun for one retail unit ("bottle" | "can" | "pack" | "jar").
   * Used by cart UI to display "12 bottles per carton". Derived from
   * category at merge time when not explicitly set.
   */
  unit_label?: string;
}

export interface Partner {
  slug: string;
  name: string;
  country?: string;
  /** Imported PNG path or null when no logo file is available — UI must
   *  render a typographic fallback in that case. */
  logo: string | null;
  shortDescription?: string;
  longDescription?: string;
  hasCatalog: boolean;
  catalogUrl?: string;
  productCount?: number;
  isFeatured?: boolean;
  /** Year founded, when known. */
  since?: string;
  website?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  /** Top-level grouping — beverages or food. Useful for two-tier filtering. */
  parentId?: 'beverages' | 'food';
  description?: string;
  /** lucide-react icon component name. */
  iconName?: string;
  /** Section-specific catalogue PDF download, if available. */
  catalogPdfUrl?: string;
}

export interface Country {
  /** ISO-2 country code (TG, BJ, NG, CI, LR, BF, GH). */
  code: string;
  name: string;
  /** Emoji flag — quick visual without bundling SVGs. */
  flag: string;
  population?: string;
  isHq?: boolean;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Site-wide settings — used by Hero, Footer, About, Contact.
// ---------------------------------------------------------------------------
export interface SiteSettings {
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  stats: {
    yearsActive: string;
    products: string;
    partners: string;
    clients: string;
  };
  missionStatement: string;
  visionStatement: string;
  contact: {
    email: string;
    phone: string;
    /** Digits only, no '+'. */
    whatsapp: string;
    address: string;
    hours: string;
  };
  social: {
    facebook: string;
    linkedin: string;
    instagram: string;
  };
  footerAbout: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorTitle: string;
  authorCompany: string;
  authorPhoto: string;
  quote: string;
  rating: number;
  isFeatured: boolean;
  orderIndex: number;
}

export interface NavLink {
  to: string;
  label: string;
}

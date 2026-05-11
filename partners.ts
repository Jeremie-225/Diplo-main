import type { Partner } from '@/types';

// Partner logos — Vite bundles these via the import-then-reference pattern.
// Suppliers without a logo file have `logo: null` and the UI must render a
// typographic fallback (the partner name styled in the brand serif).
import logoAlcobrew from '@/assets/partners/alcobrew.png';
import logoAllied from '@/assets/partners/allied-blenders-distillers.png';
import logoArraez from '@/assets/partners/arraez-1934.png';
import logoBlueOcean from '@/assets/partners/blue-ocean-beverages.png';
import logoCeeCee from '@/assets/partners/cee-cee-holdings.png';
import logoCodys from '@/assets/partners/codys.png';
import logoCFGV from '@/assets/partners/compagnie-francaise-grands-vins.png';
import logoFourCousins from '@/assets/partners/four-cousins.png';
import logoGCF from '@/assets/partners/groupe-gcf.png';
import logoKhemani from '@/assets/partners/khemani-distilleries.png';
import logoLaMartiniquaise from '@/assets/partners/la-martiniquaise.png';
import logoLopezMorenas from '@/assets/partners/lopez-morenas.png';
import logoLucasBols from '@/assets/partners/lucas-bols.png';
import logoRita from '@/assets/partners/rita.png';
import logoSainov from '@/assets/partners/sainov.png';
import logoSeignouret from '@/assets/partners/seignouret-freres-bordeaux.png';
import logoSlaurSardet from '@/assets/partners/slaur-sardet.png';
// import logoThreeX from '@/assets/partners/three-x.png';
import logoVilniausDegtine from '@/assets/partners/vilniaus-degtine.jpg';

// =====================================================================
// All Diplo partners (Phase 1.5). Slugs map to product files via the
// `partnerSlug` field on `Product`. `productCount` is approximate and
// will be re-derived from the live data once Supabase is wired up in
// Phase 2.
// =====================================================================
export const partners: Partner[] = [
  // ─── Featured: dedicated landing pages ───────────────────────────
  {
    slug: 'vilniaus-degtine',
    name: 'Vilniaus Degtinė',
    country: 'Lithuania',
    logo: logoVilniausDegtine,
    shortDescription: 'Lithuanian distillery, Anno 1897 — premium spirits and crafted vodkas.',
    longDescription:
      'Vilniaus Degtinė, UAB is a Lithuanian distillery dating back to 1897, producing the El Galipote rum range, Thorn and Missed Call gins, Barska premium and flavoured vodkas, Admiral, 7 Senses herbal liqueurs, and Čepkeliai berry spirit drinks. Their portfolio is one of Diplo\'s most strategic — covering rum, gin, vodka, herbal liqueurs, and spirit drinks under one supplier.',
    hasCatalog: false,
    productCount: 30,
    isFeatured: true,
    since: '1897',
  },
  {
    slug: 'mass-industries',
    name: 'Mass Industries',
    country: 'Ghana',
    logo: null, // TODO: client to provide Mass Industries logo
    shortDescription: 'Ghanaian biscuit and wafer manufacturer — All Day, Bonita, Lola Biggy, Supreme.',
    longDescription:
      'For over 11 years, Mass Industries has produced biscuits and wafers in Tema, Ghana under four brand families: All Day (oats, digestives, supreme wafers), Bonita (coconut shortcake, multi-flavour wafers), Lola Biggy (multi-flavour cream wafers), and Supreme (premium wafer line). A Ghana-Ghana partnership at the heart of Diplo\'s food category.',
    hasCatalog: true,
    catalogUrl: '/catalogs/bonita-mass-industries-2025.pdf',
    productCount: 12,
    isFeatured: true,
    since: '2014', // TODO: confirm exact founding year
    website: 'https://mass-ind.com',
  },

  // ─── International beverage suppliers (with logos) ────────────────
  {
    slug: 'groupe-gcf',
    name: 'Groupe GCF',
    country: 'France',
    logo: logoGCF,
    shortDescription: 'Grands Chais De France — JP Chenet, Baron D\'arignac, Chateaux Haut Bourbon.',
    hasCatalog: false,
    productCount: 24,
    isFeatured: true,
  },
  {
    slug: 'compagnie-francaise-grands-vins',
    name: 'Compagnie Française des Grands Vins',
    country: 'France',
    logo: logoCFGV,
    shortDescription: 'CFGV — Muscador and MYLOW sparkling wine specialists.',
    hasCatalog: false,
    productCount: 8,
    isFeatured: false,
  },
  {
    slug: 'arraez-1934',
    name: 'Antonio Arraez 1934',
    country: 'Spain',
    logo: logoArraez,
    shortDescription: 'Spanish family winery — Baron del Lugar, Don Antonio, Petite Vendange.',
    hasCatalog: false,
    productCount: 3,
    since: '1934',
  },
  {
    slug: 'allied-blenders-distillers',
    name: 'Allied Blenders & Distillers',
    country: 'India',
    logo: logoAllied,
    shortDescription: 'India\'s largest spirits maker — Officer\'s Choice, Iconic, Class 21.',
    hasCatalog: false,
    productCount: 7,
    isFeatured: true,
  },
  {
    slug: 'alcobrew',
    name: 'Alcobrew Distilleries',
    country: 'India',
    logo: logoAlcobrew,
    shortDescription: 'Indian spirits — White & Blue Premium and Reserve whisky.',
    hasCatalog: false,
    productCount: 2,
  },
  {
    slug: 'slaur-sardet',
    name: 'Slaur Sardet',
    country: 'France',
    logo: logoSlaurSardet,
    shortDescription: 'Le Havre wines & spirits — Mangoustan rum, African Queen, Hamwick, Eperon.',
    hasCatalog: false,
    productCount: 14,
    isFeatured: true,
  },
  {
    slug: 'codys',
    name: "Cody's (Jens Warneke)",
    country: 'Belgium',
    logo: logoCodys,
    shortDescription: "Cody's beer, energy drinks, and vodka mixes — produced in Antwerp.",
    hasCatalog: false,
    productCount: 9,
    isFeatured: true,
  },
  {
    slug: 'four-cousins',
    name: 'Four Cousins (Van Loveren)',
    country: 'South Africa',
    logo: logoFourCousins,
    shortDescription: 'South African family wines — natural sweet red, rosé, and white.',
    hasCatalog: false,
    productCount: 3,
    isFeatured: true,
  },
  {
    slug: 'blue-ocean-beverages',
    name: 'Blue Ocean Beverages',
    country: 'India',
    logo: logoBlueOcean,
    shortDescription: 'Indian whisky — Old Soldier and Ranger Fine Special Blend.',
    hasCatalog: false,
    productCount: 2,
  },
  {
    slug: 'lucas-bols',
    name: 'Lucas Bols',
    country: 'Belgium',
    logo: logoLucasBols,
    shortDescription: 'Royal Storck gin — Lucas Bols import, Antwerp.',
    hasCatalog: false,
    productCount: 1,
  },

  // ─── Logo files we have but no products yet (catalogue partners) ──
  {
    slug: 'cee-cee-holdings',
    name: 'CEE CEE Holdings',
    logo: logoCeeCee,
    shortDescription: 'Distribution partner.',
    hasCatalog: false,
    // TODO: link products from main Excel master once supplier mapping confirmed.
  },
  {
    slug: 'khemani-distilleries',
    name: 'Khemani Distilleries',
    country: 'India',
    logo: logoKhemani,
    shortDescription: 'Indian spirits manufacturer.',
    hasCatalog: false,
  },
  {
    slug: 'la-martiniquaise',
    name: 'La Martiniquaise',
    country: 'France',
    logo: logoLaMartiniquaise,
    shortDescription: 'French spirits group — historic Le Havre supplier.',
    hasCatalog: false,
  },
  {
    slug: 'lopez-morenas',
    name: 'López Morenas',
    country: 'Spain',
    logo: logoLopezMorenas,
    shortDescription: 'Spanish wines and spirits supplier.',
    hasCatalog: false,
  },
  {
    slug: 'rita',
    name: 'Rita',
    logo: logoRita,
    shortDescription: 'Beverage supplier.',
    hasCatalog: false,
  },
  {
    slug: 'sainov',
    name: 'Sainov',
    logo: logoSainov,
    shortDescription: 'Beverage supplier.',
    hasCatalog: false,
  },
  {
    slug: 'seignouret-freres-bordeaux',
    name: 'Seignouret Frères Bordeaux',
    country: 'France',
    logo: logoSeignouret,
    shortDescription: 'Bordeaux wine merchant.',
    hasCatalog: false,
  },
  // {
  //   slug: 'three-x',
  //   name: 'Three X',
  //   logo: logoThreeX,
  //   shortDescription: 'Beverage supplier.',
  //   hasCatalog: false,
  // },
];

/** Lookup helpers. */
export function getPartnerBySlug(slug: string): Partner | undefined {
  return partners.find((p) => p.slug === slug);
}

/** Featured partners (used on Home + landing pages). */
export const featuredPartners = partners.filter((p) => p.isFeatured);

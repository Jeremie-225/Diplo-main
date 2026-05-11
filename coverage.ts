// =====================================================================
// Coverage countries — the 6 active West-African markets Diplo distributes
// to. Used by the footer flag strip, About / Home coverage maps, and the
// hero stats. The 2023 intro deck listed Niger and Mali instead of Liberia
// — we are using the user-confirmed 6, with that flagged in DECISIONS.md.
// =====================================================================

export interface CoverageCountry {
  code: string;
  name: string;
  flag: string; // emoji flag
  /** Approx population (from public sources) used in the About page tooltip. */
  population?: string;
  /** Short note shown on hover or as a chip subtitle. */
  note?: string;
}

export const COVERAGE_COUNTRIES: CoverageCountry[] = [
  { code: 'TG', name: 'Togo', flag: '🇹🇬', population: '~9M', note: 'Active market' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', population: '~13M', note: 'Active market' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', population: '~220M', note: 'Active market' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', population: '~28M', note: 'Active market' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷', population: '~5M', note: 'Active market' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', population: '~22M', note: 'Active market' },
];

// HQ country (origin) — shown on the coverage map as the warehouse hub.
export const HQ_COUNTRY: CoverageCountry = {
  code: 'GH',
  name: 'Ghana',
  flag: '🇬🇭',
  note: 'HQ — Tema Free Zone',
};

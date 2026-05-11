/**
 * Diplo FZE Duty Free shop network — content sourced strictly from
 * `claude/docs/Diplo Intro Presentation - 2023.pdf` (pages 4–8).
 *
 * Do NOT invent stats, locations, or services that aren't in the deck.
 *
 * Phase 2.1 — Real photographs were extracted from the deck and committed
 * to `src/assets/duty-free/`. Each shop carries a primary photo (interior /
 * storefront) plus a small gallery for use on detail pages or lightboxes.
 * The extraction script lives at `scripts/extract-duty-free-images.py`.
 */

import imgAflaoInterior from '@/assets/duty-free/dutyfree-aflao-03.jpg';
import imgAflaoExterior from '@/assets/duty-free/dutyfree-aflao-00.jpg';
import imgAflaoShelves from '@/assets/duty-free/dutyfree-aflao-04.jpg';
import imgPagaStorefront from '@/assets/duty-free/dutyfree-paga-00.jpg';
import imgPagaInterior from '@/assets/duty-free/dutyfree-paga-01.jpg';
import imgPagaShelves from '@/assets/duty-free/dutyfree-paga-04.jpg';
import imgElubuCounter from '@/assets/duty-free/dutyfree-elubu-04.jpg';
import imgElubuInterior from '@/assets/duty-free/dutyfree-elubu-00.jpg';
import imgElubuShelves from '@/assets/duty-free/dutyfree-elubu-03.jpg';
import imgEnclaveExterior from '@/assets/duty-free/dutyfree-enclave-01.jpg';

export interface DutyFreeShop {
  id: string;
  name: string;
  border: string;
  /** Square metres of retail floor space, per the deck. */
  size_m2: number;
  /** Markets the shop primarily serves. */
  serves: string;
  /** Combined population of the markets served, in millions. */
  populationReach_m: number;
  /** Marker letter used on the strategic-placement map slide. */
  marker: 'P' | 'A' | 'E';
  description: string;
  /** Primary photo (used on shop cards). */
  image: string;
  /** Small gallery for the lightbox / additional context. */
  gallery: string[];
}

export const DUTY_FREE_SHOPS: DutyFreeShop[] = [
  {
    id: 'aflao',
    name: 'Aflao Duty Free',
    border: 'Ghana / Togo border',
    size_m2: 685,
    serves: 'Togo, Benin, Niger',
    populationReach_m: 47,
    marker: 'A',
    description:
      'The largest of our three border shops, serving the heavily-trafficked Aflao crossing into Togo with onward distribution to Benin and Niger.',
    image: imgAflaoInterior,
    gallery: [imgAflaoInterior, imgAflaoExterior, imgAflaoShelves],
  },
  {
    id: 'paga',
    name: 'Paga Duty Free',
    border: 'Ghana / Burkina Faso border',
    size_m2: 550,
    serves: 'Burkina Faso, Mali, Niger',
    populationReach_m: 20,
    marker: 'P',
    description:
      'Our northern gateway. Paga serves overland trade routes into Burkina Faso, Mali and Niger.',
    image: imgPagaStorefront,
    gallery: [imgPagaStorefront, imgPagaInterior, imgPagaShelves],
  },
  {
    id: 'elubu',
    name: 'Elubu Enclave',
    border: "Ghana / Côte d'Ivoire border",
    size_m2: 650,
    serves: "Côte d'Ivoire",
    populationReach_m: 27,
    marker: 'E',
    description:
      "Our western post serves the Côte d'Ivoire market through the Elubu/Noé crossing.",
    image: imgElubuCounter,
    gallery: [imgElubuCounter, imgElubuInterior, imgElubuShelves],
  },
];

export const TEMA_HUB = {
  name: 'Tema Enclave FZE',
  size_m2: 5500,
  expansion_m2: 6000,
  description:
    'Our central freezone enclave in Tema is the main warehouse supplying the duty free operation, with room for a 6,000 m² expansion.',
  image: imgEnclaveExterior,
};

/** Combined population reach across the three border shops. */
export const TOTAL_POPULATION_REACH_M = DUTY_FREE_SHOPS.reduce(
  (sum, s) => sum + s.populationReach_m,
  0,
);

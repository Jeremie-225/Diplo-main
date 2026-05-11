/**
 * Shipping container specifications and box presets for the Container Loading Simulator.
 *
 * All dimensions are in centimetres (cm) internally.
 * Convert to m³ only for display purposes.
 */

/**
 * A cargo space the user can load — either a shipping container or a road
 * truck. Both share the same shape (3D bounding box + payload cap) so all
 * downstream packing/visualisation/reporting logic is mode-agnostic.
 */
export interface ContainerSpec {
  /** Unique identifier used in URL params and state. */
  id: string;
  /** Discriminator: 'container' (sea freight) or 'truck' (road haulage). */
  kind: 'container' | 'truck';
  /** Human-readable name shown in the UI. */
  name: string;
  /** Internal usable length in centimetres. */
  length_cm: number;
  /** Internal usable width in centimetres. */
  width_cm: number;
  /** Internal usable height in centimetres. */
  height_cm: number;
  /** Maximum gross payload in kilograms (excludes tare weight). */
  max_payload_kg: number;
  /** Approximate internal volume in cubic metres (pre-computed for display). */
  volume_m3: number;
  /** Icon key — picks the right SVG variant in the picker. */
  icon:
    | 'container-small'
    | 'container-medium'
    | 'container-large'
    | 'truck-small'
    | 'truck-medium'
    | 'truck-large'
    | 'truck-articulated';
  /** Short description shown on the picker card. */
  description: string;
}

export const CONTAINERS: ContainerSpec[] = [
  {
    id: '20ft',
    kind: 'container',
    name: '20ft Standard',
    length_cm: 590,
    width_cm: 235,
    height_cm: 239,
    max_payload_kg: 28200,
    volume_m3: 33.1,
    icon: 'container-small',
    description: 'Ideal for smaller shipments. Most common for trial orders.',
  },
  {
    id: '40ft',
    kind: 'container',
    name: '40ft Standard',
    length_cm: 1203,
    width_cm: 235,
    height_cm: 239,
    max_payload_kg: 26500,
    volume_m3: 67.5,
    icon: 'container-medium',
    description: 'The workhorse of international shipping. Best value per unit.',
  },
  {
    id: '40ft-hc',
    kind: 'container',
    name: '40ft High Cube',
    length_cm: 1203,
    width_cm: 235,
    height_cm: 269,
    max_payload_kg: 26500,
    volume_m3: 76.0,
    icon: 'container-large',
    description: '30cm taller than standard. Perfect for lightweight, bulky cargo.',
  },
  // Road-haulage trucks. Dimensions are realistic averages for the West
  // African market — actual cargo volume varies by manufacturer / model /
  // body type. Encourage users with strict specs to use a 'custom' option
  // (see Phase 2 follow-up) once exposed.
  {
    id: 'truck-small-van',
    kind: 'truck',
    name: 'Small Van',
    length_cm: 280,
    width_cm: 165,
    height_cm: 130,
    max_payload_kg: 1200,
    volume_m3: 6.0,
    icon: 'truck-small',
    description: 'Toyota Hiace-class delivery van. Local urban runs.',
  },
  {
    id: 'truck-medium',
    kind: 'truck',
    name: 'Medium Truck',
    length_cm: 450,
    width_cm: 200,
    height_cm: 220,
    max_payload_kg: 5000,
    volume_m3: 19.8,
    icon: 'truck-medium',
    description: '5–7 ton box truck (e.g. Isuzu NPR). Inter-city distribution.',
  },
  {
    id: 'truck-large',
    kind: 'truck',
    name: 'Large Truck',
    length_cm: 750,
    width_cm: 240,
    height_cm: 250,
    max_payload_kg: 12000,
    volume_m3: 45.0,
    icon: 'truck-large',
    description: '10–15 ton lorry (Mercedes Actros, Mitsubishi Fuso class).',
  },
  {
    id: 'truck-articulated',
    kind: 'truck',
    name: 'Articulated Truck',
    length_cm: 1350,
    width_cm: 245,
    height_cm: 270,
    max_payload_kg: 25000,
    volume_m3: 89.3,
    icon: 'truck-articulated',
    description: 'Trailer truck for long-haul West African routes.',
  },
];

/** Just the road-haulage entries. */
export const TRUCKS: ContainerSpec[] = CONTAINERS.filter((c) => c.kind === 'truck');
/** Just the sea-freight container entries. */
export const SEA_CONTAINERS: ContainerSpec[] = CONTAINERS.filter(
  (c) => c.kind === 'container',
);

export interface BoxPreset {
  /** Unique identifier. 'custom' has zero dimensions (user fills in). */
  id: string;
  /** Human-readable label. */
  name: string;
  /** Length in centimetres. */
  length_cm: number;
  /** Width in centimetres. */
  width_cm: number;
  /** Height in centimetres. */
  height_cm: number;
  /** Typical weight per box in kilograms. */
  weight_kg: number;
  /** Whether this is the free-form custom entry. */
  isCustom?: boolean;
}

export const BOX_PRESETS: BoxPreset[] = [
  {
    id: 'small',
    name: 'Small Box',
    length_cm: 30,
    width_cm: 30,
    height_cm: 30,
    weight_kg: 5,
  },
  {
    id: 'medium',
    name: 'Medium Box',
    length_cm: 40,
    width_cm: 30,
    height_cm: 30,
    weight_kg: 10,
  },
  {
    id: 'large',
    name: 'Large Box',
    length_cm: 60,
    width_cm: 40,
    height_cm: 40,
    weight_kg: 20,
  },
  {
    id: 'pallet',
    name: 'Euro Pallet (boxed)',
    length_cm: 120,
    width_cm: 80,
    height_cm: 100,
    weight_kg: 80,
  },
  {
    id: 'custom',
    name: 'Custom Size',
    length_cm: 0,
    width_cm: 0,
    height_cm: 0,
    weight_kg: 0,
    isCustom: true,
  },
];

/** Convenience lookup map: containerId → ContainerSpec */
export const CONTAINER_MAP: Record<string, ContainerSpec> = Object.fromEntries(
  CONTAINERS.map((c) => [c.id, c]),
);

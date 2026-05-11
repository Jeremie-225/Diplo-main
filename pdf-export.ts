/**
 * PDF export — a structured "Container Loading Report" generated entirely
 * from cart state.  Phase 2.2 removed the isometric SVG visualization, so
 * the previous html2canvas screenshot path is gone too.
 *
 * The report is now layout-driven (jsPDF text + tables only):
 *   1. Branded header band (navy with yellow rule)
 *   2. Cargo space block (name + dimensions + max payload + volume)
 *   3. Load summary block (cartons / units / volume% / weight%)
 *   4. Cargo manifest table (one row per product line)
 *   5. Footer with disclaimer + generation timestamp
 *
 * jsPDF is dynamically imported on first use so the simulator's initial
 * bundle stays small — only users who click "Save PDF" download the lib.
 */

import { CONTAINER_MAP } from '@/data/containers';
import type { ContainerSpec } from '@/data/containers';
import type { Product } from '@/types';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface PDFLineItem {
  product: Product;
  quantityCartons: number;
}

export interface PDFExportArgs {
  cargoSpace: ContainerSpec;
  /** Pass undefined if cart is empty — we still render an empty report. */
  items: PDFLineItem[];
  totals: {
    cartons: number;
    units: number;
    volume_m3: number;
    weight_kg: number;
    volumePct: number; // 0..1
    weightPct: number; // 0..1
  };
}

const BRAND_BLUE = '#1E3A8A';
const BRAND_YELLOW = '#FCD34D';
const TEXT_DARK = '#0F172A';
const TEXT_MID = '#334155';
const TEXT_LIGHT = '#64748B';

function hex2rgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function fmtDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function m3(v: number): string {
  return v.toFixed(2);
}

// ---------------------------------------------------------------------------
// Main exporter
// ---------------------------------------------------------------------------

export async function exportLoadReportPDF(args: PDFExportArgs): Promise<void> {
  const { cargoSpace, items, totals } = args;
  // Lazy-load jsPDF — only ships to the browser when the user actually clicks save.
  const jsPDFMod = await import('jspdf');
  const JSPDF = jsPDFMod.default ?? (jsPDFMod as unknown as { default: typeof import('jspdf').default }).default;

  const doc = new JSPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Header band
  const [bR, bG, bB] = hex2rgb(BRAND_BLUE);
  doc.setFillColor(bR, bG, bB);
  doc.rect(0, 0, pageW, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('Diplo FZE Limited', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 215, 255);
  doc.text('info@diplogroup.com  |  +233 303 300 000', pageW - margin, 10, { align: 'right' });
  doc.text('Tema Free Zone, Ghana  |  www.diplogroup.com', pageW - margin, 15, { align: 'right' });

  const [yR, yG, yB] = hex2rgb(BRAND_YELLOW);
  doc.setFillColor(yR, yG, yB);
  doc.rect(0, 28, pageW, 2, 'F');

  y = 38;

  // Title
  const [dR, dG, dB] = hex2rgb(TEXT_DARK);
  doc.setTextColor(dR, dG, dB);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(
    cargoSpace.kind === 'truck'
      ? 'Truck Loading Simulation Report'
      : 'Container Loading Simulation Report',
    margin,
    y,
  );
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const [lR, lG, lB] = hex2rgb(TEXT_LIGHT);
  doc.setTextColor(lR, lG, lB);
  doc.text(`Generated: ${fmtDate(new Date())}`, margin, y);
  y += 10;

  // Cargo space block
  const [mR, mG, mB] = hex2rgb(TEXT_MID);
  doc.setTextColor(mR, mG, mB);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(cargoSpace.kind === 'truck' ? 'Truck' : 'Container', margin, y);
  y += 5;

  doc.setFontSize(9);
  const cargoVol_m3 =
    (cargoSpace.length_cm * cargoSpace.width_cm * cargoSpace.height_cm) /
    1_000_000;
  const cargoRows: Array<[string, string]> = [
    ['Type', cargoSpace.name],
    [
      'Internal dimensions',
      `${cargoSpace.length_cm} cm × ${cargoSpace.width_cm} cm × ${cargoSpace.height_cm} cm`,
    ],
    ['Internal volume', `${m3(cargoVol_m3)} m³`],
    ['Max payload', `${cargoSpace.max_payload_kg.toLocaleString()} kg`],
  ];
  for (const [label, value] of cargoRows) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 60, y);
    y += 5;
  }
  y += 4;

  // Load summary block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(mR, mG, mB);
  doc.text('Load Summary', margin, y);
  y += 5;

  const summaryRows: Array<[string, string]> = [
    ['Cartons in load', totals.cartons.toLocaleString()],
    ['Total units', totals.units.toLocaleString()],
    [
      'Volume used',
      `${m3(totals.volume_m3)} m³ / ${m3(cargoVol_m3)} m³ (${(totals.volumePct * 100).toFixed(1)}%)`,
    ],
    [
      'Weight used',
      `${totals.weight_kg.toLocaleString()} kg / ${cargoSpace.max_payload_kg.toLocaleString()} kg (${(totals.weightPct * 100).toFixed(1)}%)`,
    ],
    ['Distinct product lines', items.length.toString()],
  ];
  doc.setFontSize(9);
  for (const [label, value] of summaryRows) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(mR, mG, mB);
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(dR, dG, dB);
    doc.text(value, margin + 60, y);
    y += 5.5;
  }
  y += 4;

  // Manifest table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(mR, mG, mB);
  doc.text('Cargo Manifest', margin, y);
  y += 5;

  // Header row
  doc.setFillColor(bR, bG, bB);
  doc.rect(margin, y - 4, contentW, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  const cols = [0, 70, 100, 125, 145, 165];
  const headers = ['Product', 'Code', 'Qty (cartons)', 'Units', 'Carton kg', 'Vol m³'];
  headers.forEach((h, i) => doc.text(h, margin + cols[i], y));
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(dR, dG, dB);
  let alt = false;

  if (items.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(lR, lG, lB);
    doc.text('No products in load — empty cart.', margin, y);
    y += 6;
  } else {
    for (const it of items) {
      // Page break if needed
      if (y > pageH - 30) {
        doc.addPage();
        y = margin;
      }
      if (alt) {
        doc.setFillColor(245, 247, 250);
        doc.rect(margin, y - 4, contentW, 6, 'F');
      }
      doc.setFontSize(8);
      const c = it.product.carton;
      const lineUnits = (c?.units_per_carton ?? 0) * it.quantityCartons;
      const lineVol = (c?.volume_m3 ?? 0) * it.quantityCartons;
      const name =
        it.product.name.length > 38
          ? it.product.name.slice(0, 36) + '…'
          : it.product.name;
      doc.text(name, margin + cols[0], y);
      doc.text(it.product.code ?? '—', margin + cols[1], y);
      doc.text(it.quantityCartons.toLocaleString(), margin + cols[2], y);
      doc.text(lineUnits.toLocaleString(), margin + cols[3], y);
      doc.text(c ? `${c.weight_kg}` : '—', margin + cols[4], y);
      doc.text(c ? lineVol.toFixed(3) : '—', margin + cols[5], y);
      y += 6;
      alt = !alt;
    }
  }

  // Footer
  const footerY = pageH - 14;
  doc.setFillColor(248, 250, 252);
  doc.rect(0, footerY - 4, pageW, 18, 'F');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(lR, lG, lB);
  doc.text(
    'This is an estimate. Final loading subject to actual cargo verification by the Diplo logistics team.',
    margin,
    footerY,
  );
  doc.text(
    `Diplo FZE Limited — ${fmtDate(new Date())}`,
    pageW - margin,
    footerY,
    { align: 'right' },
  );

  doc.save(`diplo-load-simulation-${fmtDate(new Date())}.pdf`);
}

// ---------------------------------------------------------------------------
// Backwards-compat shim — keeps the old exportSimulationPDF name working
// while we migrate callsites. Maps the new kind={'container'|'truck'} +
// items[] interface onto the legacy SimulatorState shape it used to take.
// Phase 2.2 callers should use exportLoadReportPDF directly.
// ---------------------------------------------------------------------------
export function legacyContainerById(id: string): ContainerSpec | undefined {
  return CONTAINER_MAP[id];
}

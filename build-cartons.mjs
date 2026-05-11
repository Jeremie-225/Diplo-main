/**
 * Build-time carton ingestion script.
 *
 * Reads:
 *   - claude/docs/ENCLAVE STOCKS.xlsx          (primary carton dimensions+weight, by SKU code)
 *   - claude/docs/DIPLO FZE - PRODUCT OF DIPLO AND SUPPLIERS.DECRYPTED.xlsx
 *       └── 'Diplo' sheet                      (master catalog: 266 SKUs with category/origin/partner)
 *       └── 'vilinaus' sheet                   (Vilniaus richer specs in mm — converted to cm)
 *
 * Emits:
 *   - src/data/_generated/cartons.json         (keyed by SKU code, e.g. "26-771")
 *   - src/data/_generated/cartons-by-name.json (keyed by normalized name, for fuzzy fallback)
 *   - src/data/_generated/diplo-master.json    (full Diplo sheet for new-product import)
 *   - src/data/_generated/cartons-vilniaus.json(Vilniaus richer pallet/truck stats)
 *   - src/data/_generated/manifest.json        (generation metadata + stats)
 *
 * Run:    node scripts/build-cartons.mjs
 * Re-run: every time Excel sources change.
 *
 * The output JSONs are committed so contributors without the decrypted Excel
 * still get a working dev environment.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// xlsx ships its CJS surface; use the default-import to get readFile et al.
import XLSXPkg from 'xlsx';
const XLSX = XLSXPkg.readFile ? XLSXPkg : XLSXPkg.default;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SOURCES = {
  stocks: path.join(ROOT, 'claude', 'docs', 'ENCLAVE STOCKS.xlsx'),
  supplier: path.join(ROOT, 'claude', 'docs', 'DIPLO FZE - PRODUCT OF DIPLO AND SUPPLIERS.DECRYPTED.xlsx'),
};

const OUT_DIR = path.join(ROOT, 'src', 'data', '_generated');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Normalize a product name for fuzzy matching: lowercase, alphanumerics only. */
function normName(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/** Coerce a cell to a positive finite number, or null. */
function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Round to N decimals (avoids ugly 0.015071875 in JSON). */
function round(n, dp = 4) {
  if (n === null || !Number.isFinite(n)) return null;
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeJSON(filename, data) {
  const p = path.join(OUT_DIR, filename);
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
  const sizeKB = (fs.statSync(p).size / 1024).toFixed(1);
  console.log(`  ✓ ${filename}  (${sizeKB} KB)`);
}

// ---------------------------------------------------------------------------
// 1. Parse ENCLAVE STOCKS — primary carton-spec source
// ---------------------------------------------------------------------------

function parseStocks() {
  if (!fs.existsSync(SOURCES.stocks)) {
    throw new Error(`Missing source: ${SOURCES.stocks}`);
  }
  const wb = XLSX.readFile(SOURCES.stocks, { cellDates: false });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

  // Header is row 0 in this sheet
  const headers = rows[0].map((h) => String(h ?? '').trim());
  const idx = (label) => headers.findIndex((h) => h === label);

  const COLS = {
    supplier: idx('SUPPLIER'),
    code: idx('CODE'),
    name: idx('NAME'),
    uom: idx('U.O.M'),
    total: idx('TOTAL'),
    kg: idx('KG'),
    length: idx('LENGTH'),
    width: idx('WIDTH'),
    height: idx('HEIGHT'),
    volume: idx('volume of carton'),
  };

  const out = {};
  let withDims = 0;
  let withoutDims = 0;
  let weightOnly = 0;

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || !r[COLS.code]) continue;

    const code = String(r[COLS.code]).trim();
    if (!code || code.toLowerCase() === 'new') continue; // skip 'TOTAL' bottom row + 'new' rows

    const length_cm = num(r[COLS.length]);
    const width_cm = num(r[COLS.width]);
    const height_cm = num(r[COLS.height]);
    const weight_kg = num(r[COLS.kg]);
    const units_per_carton = num(r[COLS.uom]);
    const explicitVolume = num(r[COLS.volume]);

    const hasDims = length_cm && width_cm && height_cm;
    if (hasDims) withDims++;
    else if (weight_kg) weightOnly++;
    else withoutDims++;

    out[code] = {
      code,
      name: String(r[COLS.name] ?? '').trim(),
      supplier: String(r[COLS.supplier] ?? '').trim(),
      units_per_carton: units_per_carton ? Math.round(units_per_carton) : null,
      length_cm: round(length_cm, 2),
      width_cm: round(width_cm, 2),
      height_cm: round(height_cm, 2),
      weight_kg: round(weight_kg, 3),
      volume_m3: hasDims
        ? round((length_cm * width_cm * height_cm) / 1_000_000, 5)
        : explicitVolume
          ? round(explicitVolume, 5)
          : null,
      hasDims: !!hasDims,
    };
  }

  console.log(`  STOCKS: ${Object.keys(out).length} SKUs (${withDims} with full L/W/H, ${weightOnly} weight-only, ${withoutDims} no data)`);
  return out;
}

// ---------------------------------------------------------------------------
// 2. Parse DIPLO master sheet — for category/origin/partner enrichment
// ---------------------------------------------------------------------------

function parseDiploMaster() {
  if (!fs.existsSync(SOURCES.supplier)) {
    console.warn('  ⚠ Decrypted supplier file missing — skipping master + Vilniaus enrichment.');
    console.warn('    Run: node scripts/decrypt-supplier-xls.mjs');
    return { master: {}, vilniaus: {} };
  }

  const wb = XLSX.readFile(SOURCES.supplier, { cellDates: false });

  // ── 'Diplo' sheet ──────────────────────────────────────────────────────
  const dWs = wb.Sheets['Diplo'];
  if (!dWs) {
    console.warn('  ⚠ "Diplo" sheet not found.');
    return { master: {}, vilniaus: {} };
  }
  const dRows = XLSX.utils.sheet_to_json(dWs, { header: 1, defval: null });
  const dHeaders = dRows[0].map((h) => String(h ?? '').trim());
  const dIdx = (label) => dHeaders.findIndex((h) => h.toLowerCase() === label.toLowerCase());

  const D = {
    code: dIdx('item code'),
    name: dIdx('item name'),
    type: dIdx('Type of Product'),
    flavor: dIdx('SUB Product details- Flavors'),
    origin: dIdx('COUNTRY OF ORIGIN'),
    supplier: dIdx('supplier'),
    partner: dIdx('Type of partner'),
    inCont: dIdx('in cont'),
    tcSize: dIdx('TC Size'),
  };

  const master = {};
  for (let i = 1; i < dRows.length; i++) {
    const r = dRows[i];
    if (!r || !r[D.code]) continue;
    const code = String(r[D.code]).trim();
    if (!code || code === 'new') continue;
    master[code] = {
      code,
      name: String(r[D.name] ?? '').trim(),
      product_type: String(r[D.type] ?? '').trim(),
      flavor: r[D.flavor] ? String(r[D.flavor]).trim() : null,
      origin: r[D.origin] ? String(r[D.origin]).trim() : null,
      supplier: String(r[D.supplier] ?? '').trim(),
      partner_type: String(r[D.partner] ?? '').trim().replace(/EXCULSIVE/g, 'EXCLUSIVE'),
      in_container: num(r[D.inCont]),
      tc_size: r[D.tcSize] ? parseInt(String(r[D.tcSize]), 10) : null,
    };
  }
  console.log(`  Diplo master: ${Object.keys(master).length} SKUs`);

  // ── 'vilinaus' sheet — much richer, in mm ──────────────────────────────
  const vWs = wb.Sheets['vilinaus '] || wb.Sheets['vilinaus'];
  if (!vWs) {
    console.warn('  ⚠ "vilinaus" sheet not found.');
    return { master, vilniaus: {} };
  }
  // Headers are split across rows 1-2 (group on row 1, name on row 2). We
  // hard-coded column indices below since the structure is stable per the
  // discovery report.
  const vRows = XLSX.utils.sheet_to_json(vWs, { header: 1, defval: null });

  const vilniaus = {};
  // Data starts at row 4 (rows 0-3 are: group header, sub header, label, units)
  for (let i = 4; i < vRows.length; i++) {
    const r = vRows[i];
    if (!r || (!r[0] && !r[4])) continue;
    const productName = String(r[4] ?? '').trim();
    if (!productName) continue;

    // Bottle = cols 11..16 (Netto, GiftBox, Brutto, Width_mm, Length_mm, Height_mm)
    // Case   = cols 17..21 (Netto_empty, Brutto, Width_mm, Length_mm, Height_mm)
    // Pallet = cols 22..28 (units_per_case, cases_per_layer, units_per_layer,
    //                       layers, cases_per_pallet, units_per_pallet, pallet_kg)
    // Truck  = cols 29..31 (pallets_per_truck, bottles_per_truck, total_kg)

    const caseW_mm = num(r[19]);
    const caseL_mm = num(r[20]);
    const caseH_mm = num(r[21]);
    const caseKg = num(r[18]);
    const unitsPerCase = num(r[22]);

    const length_cm = caseL_mm ? round(caseL_mm / 10, 2) : null;
    const width_cm = caseW_mm ? round(caseW_mm / 10, 2) : null;
    const height_cm = caseH_mm ? round(caseH_mm / 10, 2) : null;

    const key = normName(productName);
    vilniaus[key] = {
      raw_name: productName,
      brand: String(r[2] ?? '').trim(),
      ean: r[3] ? String(r[3]).trim() : null,
      // Bottle (single unit)
      bottle: {
        netto_l: num(r[5]),
        brutto_kg: num(r[13]),
        width_cm: r[14] ? round(num(r[14]) / 10, 2) : null,
        length_cm: r[15] ? round(num(r[15]) / 10, 2) : null,
        height_cm: r[16] ? round(num(r[16]) / 10, 2) : null,
      },
      // Carton/case (the unit packers care about)
      carton: {
        units_per_carton: unitsPerCase ? Math.round(unitsPerCase) : null,
        weight_kg: caseKg ? round(caseKg, 3) : null,
        length_cm,
        width_cm,
        height_cm,
        volume_m3:
          length_cm && width_cm && height_cm
            ? round((length_cm * width_cm * height_cm) / 1_000_000, 5)
            : null,
      },
      // Pallet (Phase 2 surface)
      pallet: {
        cases_per_layer: num(r[23]),
        units_per_layer: num(r[24]),
        layers: num(r[25]),
        cases_per_pallet: num(r[26]),
        units_per_pallet: num(r[27]),
        weight_kg: num(r[28]),
      },
      // Truck (Phase 2 surface)
      truck: {
        pallets_per_truck: num(r[29]),
        bottles_per_truck: num(r[30]),
        total_weight_kg: num(r[31]),
      },
    };
  }
  console.log(`  Vilniaus rich: ${Object.keys(vilniaus).length} SKUs`);

  return { master, vilniaus };
}

// ---------------------------------------------------------------------------
// 3. Build a name-keyed index of ENCLAVE STOCKS for fuzzy fallback matching
// ---------------------------------------------------------------------------

function indexByName(stocks) {
  const out = {};
  for (const code of Object.keys(stocks)) {
    const item = stocks[code];
    if (!item.name) continue;
    out[normName(item.name)] = code;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log('━'.repeat(60));
  console.log('build-cartons.mjs — generating carton JSON from Excel sources');
  console.log('━'.repeat(60));

  const stocks = parseStocks();
  const { master, vilniaus } = parseDiploMaster();
  const stocksByName = indexByName(stocks);

  ensureDir(OUT_DIR);

  console.log('\nWriting JSON outputs...');
  writeJSON('cartons.json', stocks);
  writeJSON('cartons-by-name.json', stocksByName);
  writeJSON('diplo-master.json', master);
  writeJSON('cartons-vilniaus.json', vilniaus);

  // Manifest with generation metadata
  const manifest = {
    generated_at: new Date().toISOString(),
    sources: {
      stocks: path.relative(ROOT, SOURCES.stocks),
      supplier: path.relative(ROOT, SOURCES.supplier),
    },
    counts: {
      stocks_skus: Object.keys(stocks).length,
      stocks_with_dims: Object.values(stocks).filter((s) => s.hasDims).length,
      diplo_master: Object.keys(master).length,
      vilniaus_rich: Object.keys(vilniaus).length,
    },
  };
  writeJSON('manifest.json', manifest);

  console.log('\nDone.');
  console.log(JSON.stringify(manifest.counts, null, 2));
}

main();

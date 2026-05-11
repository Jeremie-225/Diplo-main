/**
 * Decrypts the password-protected supplier workbook used by build-cartons.mjs.
 *
 * Run once whenever the encrypted source is updated:
 *   node scripts/decrypt-supplier-xls.mjs
 *
 * The decrypted twin sits next to the encrypted original and is .gitignored
 * (we never commit decrypted product data — see DECISIONS.md).
 *
 * The password is sourced from the env var DIPLO_SUPPLIER_XLS_PASSWORD, with a
 * default for local dev convenience. Override via shell when sharing across
 * machines:
 *   DIPLO_SUPPLIER_XLS_PASSWORD=xxxxx node scripts/decrypt-supplier-xls.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'claude', 'docs', 'DIPLO FZE - PRODUCT OF DIPLO AND SUPPLIERS.xlsx');
const DST = path.join(ROOT, 'claude', 'docs', 'DIPLO FZE - PRODUCT OF DIPLO AND SUPPLIERS.DECRYPTED.xlsx');
const PASSWORD = process.env.DIPLO_SUPPLIER_XLS_PASSWORD || 'bei123';

const execP = promisify(exec);

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`✗ Source file not found: ${SRC}`);
    process.exit(1);
  }

  // Use Python's msoffcrypto-tool (the only mature Office-encryption library
  // we found that handles all current OOXML cipher modes). Node alternatives
  // were either abandoned or partial — see DECISIONS.md.
  const pyScript = `
import io, msoffcrypto, sys
with open(r"""${SRC}""", "rb") as f:
    office = msoffcrypto.OfficeFile(f)
    office.load_key(password="${PASSWORD}")
    out = io.BytesIO()
    office.decrypt(out)
with open(r"""${DST}""", "wb") as f:
    f.write(out.getvalue())
print("decrypted")
`.trim();

  try {
    const { stdout } = await execP(`python -c "${pyScript.replace(/"/g, '\\"').replace(/\n/g, '; ')}"`);
    if (stdout.includes('decrypted')) {
      const stat = fs.statSync(DST);
      console.log(`✓ Decrypted → ${DST} (${stat.size.toLocaleString()} bytes)`);
    } else {
      console.error('✗ Unexpected output:', stdout);
      process.exit(1);
    }
  } catch (err) {
    console.error('✗ Decryption failed.');
    console.error('  Make sure Python + msoffcrypto-tool are installed:');
    console.error('    pip install msoffcrypto-tool');
    console.error('  Then re-run this script.');
    console.error('  Original error:', err.message);
    process.exit(1);
  }
}

main();

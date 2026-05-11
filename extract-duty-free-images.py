"""Extract duty-free shop photographs from the Diplo intro deck.

Reads `claude/docs/Diplo Intro Presentation - 2023.pdf` and writes JPEG/PNG
files to `src/assets/duty-free/`. Images smaller than 300x200 are skipped
(likely icons / logos / nav-bar artefacts).

A small allow-list at the top maps page-number → human filename so the
output names are descriptive and stable. The audit script in this repo's
DISCOVERY REPORT identified pages 6 (Tema enclave), 7 (Elubu), 8 (Aflao),
and 9 (Paga) as the photo-heavy pages.

Run:  python scripts/extract-duty-free-images.py
"""
from __future__ import annotations

import io
import os
import sys
from pathlib import Path

import fitz  # pymupdf

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "claude" / "docs" / "Diplo Intro Presentation - 2023.pdf"
OUT = ROOT / "src" / "assets" / "duty-free"
OUT.mkdir(parents=True, exist_ok=True)

# Pages that contain the photo content we want, in priority order.
PHOTO_PAGES: dict[int, str] = {
    1: "cover",
    6: "enclave",
    7: "elubu",
    8: "aflao",
    9: "paga",
}

# Anything below either dimension is filtered as logo / chrome / nav.
MIN_W, MIN_H = 300, 200

# These recurring chrome assets show up on every page — skip them.
DECK_CHROME_SIZES = {
    (612, 296),   # logo bar
    (258, 195),   # logo
    (493, 677),   # map silhouette (page 5+)
}


def main() -> int:
    if not PDF.exists():
        sys.stderr.write(f"ERROR: source PDF not found at {PDF}\n")
        sys.stderr.write("Make sure the file lives at the path above and re-run.\n")
        return 1

    doc = fitz.open(PDF)
    print(f"Opened: {PDF.name}  ({len(doc)} pages)")

    saved: list[tuple[str, int, int, int]] = []
    seen_xrefs: set[int] = set()

    for page_num in range(len(doc)):
        if (page_num + 1) not in PHOTO_PAGES:
            continue
        slug = PHOTO_PAGES[page_num + 1]
        page = doc[page_num]
        idx = 0
        for img in page.get_images(full=True):
            xref = img[0]
            if xref in seen_xrefs:
                continue
            seen_xrefs.add(xref)
            try:
                base = doc.extract_image(xref)
            except Exception as exc:
                print(f"  [skip] page {page_num + 1} xref {xref}: {exc}")
                continue
            w, h = base["width"], base["height"]
            if w < MIN_W or h < MIN_H:
                continue
            if (w, h) in DECK_CHROME_SIZES:
                continue
            ext = base["ext"]
            ext = "jpg" if ext == "jpeg" else ext
            filename = f"dutyfree-{slug}-{idx:02d}.{ext}"
            target = OUT / filename
            target.write_bytes(base["image"])
            saved.append((filename, w, h, len(base["image"])))
            print(f"  saved: {filename}  ({w}x{h}, {len(base['image']):,} bytes)")
            idx += 1

    doc.close()

    print()
    print(f"Total images saved: {len(saved)}")
    print(f"Output directory:   {OUT.relative_to(ROOT)}")
    if not saved:
        print()
        print("No images saved. Falling back to page screenshots is the next step.")
        print("Edit this script and uncomment the screenshot block to enable.")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

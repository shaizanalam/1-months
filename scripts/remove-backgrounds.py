"""
Remove backgrounds from all real keepsake photos and save as transparent PNGs.
"""
import os
from pathlib import Path

try:
    from rembg import remove
    from PIL import Image
except ImportError:
    print("Installing required packages...")
    os.system("pip install rembg[cpu] Pillow --quiet")
    from rembg import remove
    from PIL import Image

REAL_DIR = Path(__file__).parent.parent / "public" / "assets" / "real"
NOBG_DIR = REAL_DIR / "nobg"
NOBG_DIR.mkdir(exist_ok=True)

# All real photos that need background removal
IMAGES = [
    "real_flork_brain.jpg",
    "real_periodic_table.jpg",
    "real_lipstick_kisses.jpg",
    "real_gatefold_exterior.jpg",
    "real_gatefold_interior.png",
    "real_envelope_closed.jpg",
    "real_envelope_open.jpg",
    "real_parchment_letter.jpg",
    "real_accordion_top.png",
    "real_accordion_bottom.png",
]

for fname in IMAGES:
    src = REAL_DIR / fname
    if not src.exists():
        print(f"  SKIP (not found): {fname}")
        continue

    out_name = Path(fname).stem + ".png"
    dst = NOBG_DIR / out_name

    if dst.exists():
        print(f"  SKIP (exists):  {out_name}")
        continue

    print(f"  Processing: {fname} -> {out_name} ...", end="", flush=True)
    inp = Image.open(src)
    result = remove(inp)
    result.save(dst, "PNG")
    print(f" done ({dst.stat().st_size // 1024} KB)")

print("\nAll backgrounds removed! Files saved to:", NOBG_DIR)

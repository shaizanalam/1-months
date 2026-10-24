import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = 'C:/Users/shahn/.gemini/antigravity-ide/brain/1d8ad736-6f7e-42f0-99c7-56572e3fb5b3/.user_uploaded/media_1792861203246.png';
const DEST_RAW = 'c:/Users/shahn/OneDrive/Desktop/project/public/assets/real/real_tulip_portal.jpg';
const DEST_NOBG = 'c:/Users/shahn/OneDrive/Desktop/project/public/assets/real/nobg/real_tulip_portal.png';

async function processTulip() {
  // 1. Copy raw
  fs.copyFileSync(SRC, DEST_RAW);
  console.log('[OK] Copied raw tulip painting to:', DEST_RAW);

  // 2. Read dimensions
  const image = sharp(SRC);
  const meta = await image.metadata();
  console.log('Tulip dimensions:', meta.width, meta.height);

  // Notice the photo has a thin black border on left (x: 0 to ~10) and right,
  // and the bottom-left has a thumb.
  // The card itself is a rectangular watercolor paper:
  // Let's crop inside the dark surrounds to get the pure watercolor card:
  // Left border ~ 6px, Right border ~ 6px, Top ~ 2px
  // Let's inspect or crop cleanly:
  const left = Math.round(meta.width * 0.015);
  const top = Math.round(meta.height * 0.005);
  const width = Math.round(meta.width * 0.97);
  const height = Math.round(meta.height * 0.96); // avoid thumb at bottom left

  await sharp(SRC)
    .extract({ left, top, width, height })
    .png({ compressionLevel: 8 })
    .toFile(DEST_NOBG);

  console.log('[OK] Created clean cropped tulip card at:', DEST_NOBG);
}

processTulip();

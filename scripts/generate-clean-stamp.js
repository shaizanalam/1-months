import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ASSETS_DIR = path.resolve(__dirname, '../public/assets');

async function generateCleanStamp() {
  const width = 800;
  const height = 300;

  // Generate SVG with realistic textured grunge stamp
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="grunge" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
    <g transform="rotate(-6 400 150)" filter="url(#grunge)">
      <!-- Outer Border -->
      <rect x="50" y="40" width="700" height="220" rx="12" fill="none" stroke="#d32f2f" stroke-width="12" stroke-dasharray="25,4,15,3,35,4" />
      <!-- Inner Border -->
      <rect x="68" y="58" width="664" height="184" rx="6" fill="none" stroke="#d32f2f" stroke-width="5" stroke-dasharray="18,3,8,2" />
      <!-- Text -->
      <text x="400" y="172" font-family="Impact, 'Arial Black', sans-serif" font-size="94" font-weight="900" fill="#d32f2f" text-anchor="middle" letter-spacing="8">TOP SECRET</text>
      <!-- Subtext -->
      <text x="400" y="218" font-family="'Courier New', monospace" font-size="22" font-weight="bold" fill="#b71c1c" text-anchor="middle" letter-spacing="12">CONFIDENTIAL // EYES ONLY</text>
    </g>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(ASSETS_DIR, 'stamp_top_secret.png'));

  console.log('[OK] Created pristine vector grunge stamp: stamp_top_secret.png');
}

generateCleanStamp();

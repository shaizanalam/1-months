import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REAL_DIR = path.resolve(__dirname, '../public/assets/real');
const NOBG_DIR = path.resolve(REAL_DIR, 'nobg');

if (!fs.existsSync(NOBG_DIR)) {
  fs.mkdirSync(NOBG_DIR, { recursive: true });
}

const IMAGES = [
  { name: 'real_flork_brain.jpg', threshold: 45 },
  { name: 'real_periodic_table.jpg', threshold: 45 },
  { name: 'real_lipstick_kisses.jpg', threshold: 45 },
  { name: 'real_gatefold_exterior.jpg', threshold: 45 },
  { name: 'real_gatefold_interior.png', threshold: 45 },
  { name: 'real_parchment_letter.jpg', threshold: 40 },
  { name: 'real_accordion_top.png', threshold: 45 },
  { name: 'real_accordion_bottom.png', threshold: 45 },
  { name: 'real_envelope_closed.jpg', threshold: 30 },
  { name: 'real_envelope_open.jpg', threshold: 30 }
];

async function removeDarkBackground(filename, threshold = 40) {
  const inputPath = path.join(REAL_DIR, filename);
  if (!fs.existsSync(inputPath)) {
    console.log(`[SKIP] Not found: ${filename}`);
    return;
  }

  const baseName = path.parse(filename).name;
  const outputPath = path.join(NOBG_DIR, `${baseName}.png`);

  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const width = metadata.width;
  const height = metadata.height;

  // Get raw RGBA buffer
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const visited = new Uint8Array(width * height);
  const queue = [];

  // Helper to get pixel index
  const getIdx = (x, y) => (y * width + x) * 4;

  // Check if pixel is dark (part of black backdrop)
  const isDark = (x, y) => {
    const idx = getIdx(x, y);
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // Max channel or perceptual brightness
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness < threshold && r < threshold + 15 && g < threshold + 15 && b < threshold + 15;
  };

  // Seed boundary pixels (top, bottom, left, right)
  for (let x = 0; x < width; x++) {
    if (isDark(x, 0)) {
      queue.push(x, 0);
      visited[0 * width + x] = 1;
    }
    if (isDark(x, height - 1)) {
      queue.push(x, height - 1);
      visited[(height - 1) * width + x] = 1;
    }
  }
  for (let y = 0; y < height; y++) {
    if (isDark(0, y) && !visited[y * width + 0]) {
      queue.push(0, y);
      visited[y * width + 0] = 1;
    }
    if (isDark(width - 1, y) && !visited[y * width + (width - 1)]) {
      queue.push(width - 1, y);
      visited[y * width + (width - 1)] = 1;
    }
  }

  // BFS Flood-fill to find all dark pixels connected to the boundary
  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];

    // Set alpha to 0 for boundary dark pixels
    const idx = getIdx(x, y);
    data[idx + 3] = 0;

    // Check 4-connected neighbors
    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIndex = ny * width + nx;
        if (!visited[nIndex] && isDark(nx, ny)) {
          visited[nIndex] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  // Alpha feathering / edge smoothing: check pixels adjacent to transparent pixels
  // to avoid harsh aliasing
  const smoothedData = Buffer.from(data);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = getIdx(x, y);
      if (data[idx + 3] !== 0) {
        // Count transparent neighbors
        let transNeighbors = 0;
        if (data[getIdx(x + 1, y) + 3] === 0) transNeighbors++;
        if (data[getIdx(x - 1, y) + 3] === 0) transNeighbors++;
        if (data[getIdx(x, y + 1) + 3] === 0) transNeighbors++;
        if (data[getIdx(x, y - 1) + 3] === 0) transNeighbors++;

        if (transNeighbors > 1) {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          if (brightness < threshold * 1.5) {
            smoothedData[idx + 3] = Math.round(data[idx + 3] * 0.4);
          }
        }
      }
    }
  }

  // Save with sharp
  await sharp(smoothedData, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
    .png({ compressionLevel: 8 })
    .toFile(outputPath);

  console.log(`[OK] Created transparent cutout: ${outputPath}`);
}

async function run() {
  console.log('Starting background removal for all real photos...');
  for (const item of IMAGES) {
    try {
      await removeDarkBackground(item.name, item.threshold);
    } catch (err) {
      console.error(`Error on ${item.name}:`, err);
    }
  }
  console.log('Background removal complete!');
}

run();

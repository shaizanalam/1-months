import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.resolve(__dirname, '../public/assets');

// Remove white backgrounds from stickers
async function removeWhiteBackground(filename, outFilename, threshold = 240) {
  const inputPath = path.join(ASSETS_DIR, filename);
  const outputPath = path.join(ASSETS_DIR, outFilename);
  if (!fs.existsSync(inputPath)) return;

  const image = sharp(inputPath);
  const { width, height } = await image.metadata();
  const { data } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const getIdx = (x, y) => (y * width + x) * 4;
  const visited = new Uint8Array(width * height);
  const queue = [];

  const isWhite = (x, y) => {
    const idx = getIdx(x, y);
    return data[idx] >= threshold && data[idx + 1] >= threshold && data[idx + 2] >= threshold;
  };

  // Seed boundary
  for (let x = 0; x < width; x++) {
    if (isWhite(x, 0)) { queue.push(x, 0); visited[x] = 1; }
    if (isWhite(x, height - 1)) { queue.push(x, height - 1); visited[(height - 1) * width + x] = 1; }
  }
  for (let y = 0; y < height; y++) {
    if (isWhite(0, y) && !visited[y * width]) { queue.push(0, y); visited[y * width] = 1; }
    if (isWhite(width - 1, y) && !visited[y * width + width - 1]) { queue.push(width - 1, y); visited[y * width + width - 1] = 1; }
  }

  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];
    const idx = getIdx(x, y);
    data[idx + 3] = 0; // set transparent

    const neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!visited[nIdx] && isWhite(nx, ny)) {
          visited[nIdx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  // Feather
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = getIdx(x, y);
      if (data[idx + 3] !== 0) {
        let transNeighbors = 0;
        if (data[getIdx(x + 1, y) + 3] === 0) transNeighbors++;
        if (data[getIdx(x - 1, y) + 3] === 0) transNeighbors++;
        if (data[getIdx(x, y + 1) + 3] === 0) transNeighbors++;
        if (data[getIdx(x, y - 1) + 3] === 0) transNeighbors++;
        if (transNeighbors > 1) {
          const avg = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          if (avg > threshold - 20) {
            data[idx + 3] = Math.round(data[idx + 3] * 0.3);
          }
        }
      }
    }
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 8 })
    .toFile(outputPath);

  console.log(`[OK] Created transparent sticker: ${outFilename}`);
}

// Remove fake checkerboard background by flood-filling from borders
// Checkerboard pixels alternate between ~200-205 and ~255 (grayscale)
async function removeCheckerboardBackground(filename, outFilename) {
  const inputPath = path.join(ASSETS_DIR, filename);
  const outputPath = path.join(ASSETS_DIR, outFilename);
  if (!fs.existsSync(inputPath)) return;

  const image = sharp(inputPath);
  const { width, height } = await image.metadata();
  const { data } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const getIdx = (x, y) => (y * width + x) * 4;
  const visited = new Uint8Array(width * height);
  const queue = [];

  const isCheckerboard = (x, y) => {
    const idx = getIdx(x, y);
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const diff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    // Checkerboard is neutral gray/white (diff <= 8) and brightness > 185
    const isNeutral = diff <= 8;
    const isBright = r > 185;
    return isNeutral && isBright;
  };

  // Seed boundary
  for (let x = 0; x < width; x++) {
    if (isCheckerboard(x, 0)) { queue.push(x, 0); visited[x] = 1; }
    if (isCheckerboard(x, height - 1)) { queue.push(x, height - 1); visited[(height - 1) * width + x] = 1; }
  }
  for (let y = 0; y < height; y++) {
    if (isCheckerboard(0, y) && !visited[y * width]) { queue.push(0, y); visited[y * width] = 1; }
    if (isCheckerboard(width - 1, y) && !visited[y * width + width - 1]) { queue.push(width - 1, y); visited[y * width + width - 1] = 1; }
  }

  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];
    const idx = getIdx(x, y);
    data[idx + 3] = 0;

    const neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!visited[nIdx] && isCheckerboard(nx, ny)) {
          visited[nIdx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 8 })
    .toFile(outputPath);

  console.log(`[OK] Created transparent sticker from checkerboard: ${outFilename}`);
}

async function processAll() {
  await removeWhiteBackground('sticker_bunny.jpg', 'sticker_bunny.png', 235);
  await removeWhiteBackground('sticker_hair_claw.jpg', 'sticker_hair_claw.png', 240);
  await removeCheckerboardBackground('stamp_top_secret.jpg', 'stamp_top_secret.png');
  await removeCheckerboardBackground('star_metallic.jpg', 'star_metallic.png');
  console.log('Sticker processing finished!');
}

processAll();

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ASSETS_DIR = path.resolve(__dirname, '../public/assets');

async function cleanCarnivalTicket() {
  const inputPath = path.join(ASSETS_DIR, 'ticket_carnival.png');
  const tempPath = path.join(ASSETS_DIR, 'ticket_carnival_clean.png');

  const image = sharp(inputPath);
  const { width, height } = await image.metadata();
  const { data } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const getIdx = (x, y) => (y * width + x) * 4;
  const visited = new Uint8Array(width * height);
  const queue = [];

  // Corner pixel color: R ~ 245, G ~ 242, B ~ 235
  const isOuterBg = (x, y) => {
    const idx = getIdx(x, y);
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    return r >= 225 && g >= 220 && b >= 210 && Math.abs(r - g) <= 12 && Math.abs(g - b) <= 16;
  };

  // Seed boundary
  for (let x = 0; x < width; x++) {
    if (isOuterBg(x, 0)) { queue.push(x, 0); visited[x] = 1; }
    if (isOuterBg(x, height - 1)) { queue.push(x, height - 1); visited[(height - 1) * width + x] = 1; }
  }
  for (let y = 0; y < height; y++) {
    if (isOuterBg(0, y) && !visited[y * width]) { queue.push(0, y); visited[y * width] = 1; }
    if (isOuterBg(width - 1, y) && !visited[y * width + width - 1]) { queue.push(width - 1, y); visited[y * width + width - 1] = 1; }
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
        if (!visited[nIdx] && isOuterBg(nx, ny)) {
          visited[nIdx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  // Feather edges
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = getIdx(x, y);
      if (data[idx + 3] !== 0) {
        let transNeighbors = 0;
        if (data[getIdx(x + 1, y) + 3] === 0) transNeighbors++;
        if (data[getIdx(x - 1, y) + 3] === 0) transNeighbors++;
        if (data[getIdx(x, y + 1) + 3] === 0) transNeighbors++;
        if (data[getIdx(x, y - 1) + 3] === 0) transNeighbors++;
        if (transNeighbors >= 2) {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          if (r >= 210 && g >= 205 && b >= 195) {
            data[idx + 3] = Math.round(data[idx + 3] * 0.3);
          }
        }
      }
    }
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 8 })
    .toFile(inputPath); // Overwrite ticket_carnival.png directly!

  console.log('[OK] ticket_carnival.png is now transparent around ripped edges!');
}

cleanCarnivalTicket();

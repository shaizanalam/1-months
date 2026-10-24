const sharp = require('sharp');
const fs = require('fs');

async function processSapphire() {
  const inputPath = 'C:/Users/shahn/.gemini/antigravity-ide/brain/1d8ad736-6f7e-42f0-99c7-56572e3fb5b3/.user_uploaded/media_1792868594170.png';
  
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // 1. Create transparent arch cutout (keying out pure white bottom arch)
  const outData = Buffer.from(data);

  // BFS / flood fill from bottom center (x = width / 2, y = height - 1)
  const isWhiteBg = new Uint8Array(width * height);
  const queue = [];

  const startX = Math.floor(width / 2);
  const startY = height - 1;
  const startIdx = (startY * width + startX) * channels;

  // Check if starting point is white
  if (data[startIdx] > 240 && data[startIdx+1] > 240 && data[startIdx+2] > 240) {
    isWhiteBg[startY * width + startX] = 1;
    queue.push(startX, startY);
  }

  // Also check along bottom edge
  for (let x = 0; x < width; x++) {
    const idx = ((height - 1) * width + x) * channels;
    if (data[idx] > 245 && data[idx+1] > 245 && data[idx+2] > 245) {
      if (!isWhiteBg[(height - 1) * width + x]) {
        isWhiteBg[(height - 1) * width + x] = 1;
        queue.push(x, height - 1);
      }
    }
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];

    const neighbors = [
      [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nPos = ny * width + nx;
        if (!isWhiteBg[nPos]) {
          const nIdx = nPos * channels;
          const r = data[nIdx];
          const g = data[nIdx + 1];
          const b = data[nIdx + 2];
          // Near pure white
          if (r > 240 && g > 240 && b > 240) {
            isWhiteBg[nPos] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  console.log(`Keyed out ${queue.length / 2} white pixels for arch`);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = y * width + x;
      const idx = pos * channels;

      if (isWhiteBg[pos]) {
        outData[idx + 3] = 0;
      } else {
        // Antialias boundary
        let bgNeighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (isWhiteBg[ny * width + nx]) bgNeighbors++;
            }
          }
        }
        if (bgNeighbors > 0) {
          outData[idx + 3] = Math.round(255 * (1 - bgNeighbors / 9));
        } else {
          outData[idx + 3] = 255;
        }
      }
    }
  }

  await sharp(outData, { raw: { width, height, channels } })
    .png()
    .toFile('public/assets/sapphire_cosmic_arch.png');

  console.log('Saved public/assets/sapphire_cosmic_arch.png');

  // 2. Sample color palette from the sapphire nebula for project gradients
  let rSum = 0, gSum = 0, bSum = 0, count = 0;
  for (let y = 50; y < 350; y += 4) {
    for (let x = 50; x < width - 50; x += 4) {
      const pos = y * width + x;
      if (!isWhiteBg[pos]) {
        const idx = pos * channels;
        rSum += data[idx];
        gSum += data[idx + 1];
        bSum += data[idx + 2];
        count++;
      }
    }
  }

  const avgR = Math.round(rSum / count);
  const avgG = Math.round(gSum / count);
  const avgB = Math.round(bSum / count);
  console.log(`Average Sapphire Blue: rgb(${avgR}, ${avgG}, ${avgB}) -> #${avgR.toString(16).padStart(2,'0')}${avgG.toString(16).padStart(2,'0')}${avgB.toString(16).padStart(2,'0')}`);

  // 3. Create high-res panoramic sapphire nebula sky (2400x1200) for the blue scene backdrop
  // Tile / mirror and composite with starry depth
  const archBuffer = await sharp('public/assets/sapphire_cosmic_arch.png').toBuffer();
  
  await sharp({
    create: {
      width: 2400,
      height: 1200,
      channels: 4,
      background: { r: 7, g: 26, b: 52, alpha: 1 } // Deep sapphire night
    }
  })
  .composite([
    {
      input: await sharp(inputPath).resize(1200, 1070, { fit: 'cover' }).toBuffer(),
      left: 0,
      top: 0,
      blend: 'over'
    },
    {
      input: await sharp(inputPath).flop().resize(1200, 1070, { fit: 'cover' }).toBuffer(),
      left: 1200,
      top: 0,
      blend: 'over'
    }
  ])
  .png()
  .toFile('public/assets/sapphire_sky_panoramic.png');

  console.log('Saved public/assets/sapphire_sky_panoramic.png');
}

processSapphire();

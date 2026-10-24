const sharp = require('sharp');
const fs = require('fs');

async function processUserCloud() {
  const inputPath = 'C:/Users/shahn/.gemini/antigravity-ide/brain/1d8ad736-6f7e-42f0-99c7-56572e3fb5b3/.user_uploaded/media_1792868549648.png';
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const isBg = new Uint8Array(width * height);
  const queue = [];

  function checkPixelIsCheckerboard(x, y) {
    const idx = (y * width + x) * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    const tileX = Math.floor(x / 20);
    const tileY = Math.floor(y / 20);
    const expected = (tileX + tileY) % 2 === 0 ? 237 : 255;

    // Check if pixel is neutral grey/white matching checkerboard
    const diffExpected = Math.max(Math.abs(r - expected), Math.abs(g - expected), Math.abs(b - expected));
    const saturation = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));

    // Near border tiles or slightly blended checkerboard
    return diffExpected < 25 && saturation < 8;
  }

  // Seed BFS from all borders
  for (let x = 0; x < width; x++) {
    if (checkPixelIsCheckerboard(x, 0)) {
      isBg[0 * width + x] = 1;
      queue.push(x, 0);
    }
    if (checkPixelIsCheckerboard(x, height - 1)) {
      isBg[(height - 1) * width + x] = 1;
      queue.push(x, height - 1);
    }
  }
  for (let y = 0; y < height; y++) {
    if (checkPixelIsCheckerboard(0, y)) {
      isBg[y * width + 0] = 1;
      queue.push(0, y);
    }
    if (checkPixelIsCheckerboard(width - 1, y)) {
      isBg[y * width + (width - 1)] = 1;
      queue.push(width - 1, y);
    }
  }

  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];

    const neighbors = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nPos = ny * width + nx;
        if (!isBg[nPos]) {
          if (checkPixelIsCheckerboard(nx, ny)) {
            isBg[nPos] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  console.log(`Identified ${queue.length / 2} background pixels out of ${width * height}`);

  // Construct transparent RGBA buffer with feathering at boundary
  const outData = Buffer.from(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = y * width + x;
      const idx = pos * channels;

      if (isBg[pos]) {
        outData[idx + 3] = 0; // Completely transparent
      } else {
        // Check if on boundary with background for smooth antialiased edge
        let bgNeighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (isBg[ny * width + nx]) bgNeighbors++;
            }
          }
        }

        if (bgNeighbors > 0) {
          // Feather edge based on neighbor ratio
          const alphaFactor = 1 - (bgNeighbors / 9);
          outData[idx + 3] = Math.round(255 * Math.pow(alphaFactor, 0.7));
        } else {
          outData[idx + 3] = 255;
        }
      }
    }
  }

  await sharp(outData, { raw: { width, height, channels } })
    .png()
    .toFile('public/assets/cream_cloud_cutout.png');

  console.log('Successfully saved public/assets/cream_cloud_cutout.png');
}

processUserCloud();

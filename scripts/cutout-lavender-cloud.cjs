const sharp = require('sharp');
const fs = require('fs');

async function processLavenderCloud() {
  const inputPath = 'C:/Users/shahn/.gemini/antigravity-ide/brain/1d8ad736-6f7e-42f0-99c7-56572e3fb5b3/.user_uploaded/media_1792868620573.png';
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const isBg = new Uint8Array(width * height);
  const queue = [];

  function checkPixelIsCheckerboard(x, y) {
    const idx = (y * width + x) * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    const saturation = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    const distToGrey = Math.abs(r - 238);
    const distToWhite = Math.abs(r - 255);

    // Checkerboard tile is either ~238 or ~255, and neutral grey/white
    return saturation <= 8 && (distToGrey <= 14 || distToWhite <= 14);
  }

  // Seed BFS from all borders
  for (let x = 0; x < width; x++) {
    if (checkPixelIsCheckerboard(x, 0)) {
      isBg[0 * width + x] = 1;
      queue.push(x, 0);
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

  console.log(`Identified ${queue.length / 2} checkerboard background pixels out of ${width * height} (${((queue.length / 2) / (width * height) * 100).toFixed(1)}%)`);

  // Construct transparent RGBA buffer with soft feathering along the cloud silhouette AND edges
  const outData = Buffer.from(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = y * width + x;
      const idx = pos * channels;

      if (isBg[pos]) {
        outData[idx + 3] = 0; // Transparent
      } else {
        // Calculate distance/density to background for silky smooth cloud edge
        let bgNeighbors = 0;
        const kernelRadius = 2;
        let totalCount = 0;
        for (let dy = -kernelRadius; dy <= kernelRadius; dy++) {
          for (let dx = -kernelRadius; dx <= kernelRadius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              totalCount++;
              if (isBg[ny * width + nx]) bgNeighbors++;
            }
          }
        }

        let alpha = 255;
        if (bgNeighbors > 0) {
          const cloudRatio = 1 - (bgNeighbors / totalCount);
          alpha = Math.round(255 * Math.pow(cloudRatio, 0.8));
        }

        // Soft vignetting fade on side edges (35px) and bottom edge (25px) so it never clips abruptly
        let edgeFade = 1.0;
        const sideMargin = 35;
        const bottomMargin = 25;
        if (x < sideMargin) {
          edgeFade = Math.min(edgeFade, Math.sin((x / sideMargin) * (Math.PI / 2)));
        } else if (x > width - sideMargin) {
          edgeFade = Math.min(edgeFade, Math.sin(((width - x) / sideMargin) * (Math.PI / 2)));
        }
        if (y > height - bottomMargin) {
          edgeFade = Math.min(edgeFade, Math.sin(((height - y) / bottomMargin) * (Math.PI / 2)));
        }

        outData[idx + 3] = Math.round(Math.min(outData[idx + 3], alpha) * edgeFade);
      }
    }
  }

  await sharp(outData, { raw: { width, height, channels } })
    .png()
    .toFile('public/assets/lavender_clouds_cutout.png');

  console.log('Successfully saved public/assets/lavender_clouds_cutout.png with feathered edges');
}

processLavenderCloud();

const sharp = require('sharp');
const fs = require('fs');

async function processClouds() {
  // 1. Process Watercolor Cloud (media_1792869248206.png)
  {
    const inputPath = 'C:/Users/shahn/.gemini/antigravity-ide/brain/1d8ad736-6f7e-42f0-99c7-56572e3fb5b3/.user_uploaded/media_1792869248206.png';
    const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    const out = Buffer.from(data);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Background is near-neutral warm cream (r~241, g~240, b~236)
        const bgDiff = Math.max(Math.abs(r - 241), Math.abs(g - 240), Math.abs(b - 236));
        const saturation = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
        const brightness = (r + g + b) / 3;

        if (bgDiff < 14 && saturation < 8) {
          out[idx + 3] = 0;
        } else if (brightness > 232 && saturation < 16) {
          // Soft feather on borderline
          const alpha = Math.max(0, Math.min(255, (244 - brightness) / 12 * 255));
          out[idx + 3] = Math.round(alpha);
        } else {
          out[idx + 3] = 255;
        }
      }
    }

    await sharp(out, { raw: { width, height, channels } })
      .png()
      .toFile('public/assets/blue_cloud_watercolor.png');
    console.log('Saved public/assets/blue_cloud_watercolor.png');
  }

  // 2. Process Panoramic Cloud Bank (media_1792869254504.png)
  {
    const inputPath = 'C:/Users/shahn/.gemini/antigravity-ide/brain/1d8ad736-6f7e-42f0-99c7-56572e3fb5b3/.user_uploaded/media_1792869254504.png';
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

      return saturation <= 8 && (distToGrey <= 16 || distToWhite <= 16);
    }

    // Seed BFS from top, bottom, and side borders
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

    console.log(`Panoramic Cloud Bank: Keyed out ${queue.length / 2} checkerboard pixels out of ${width * height} (${((queue.length / 2) / (width * height) * 100).toFixed(1)}%)`);

    const out = Buffer.from(data);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pos = y * width + x;
        const idx = pos * channels;

        if (isBg[pos]) {
          out[idx + 3] = 0;
        } else {
          // Check border neighbors for feathering
          let bgNeighbors = 0;
          const rKernel = 2;
          let count = 0;
          for (let dy = -rKernel; dy <= rKernel; dy++) {
            for (let dx = -rKernel; dx <= rKernel; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                count++;
                if (isBg[ny * width + nx]) bgNeighbors++;
              }
            }
          }

          let alpha = 255;
          if (bgNeighbors > 0) {
            const ratio = 1 - (bgNeighbors / count);
            alpha = Math.round(255 * Math.pow(ratio, 0.85));
          }

          // Gentle lateral fade on extreme left/right margins (30px)
          const sideMargin = 30;
          let lateralFade = 1.0;
          if (x < sideMargin) {
            lateralFade = Math.sin((x / sideMargin) * (Math.PI / 2));
          } else if (x > width - sideMargin) {
            lateralFade = Math.sin(((width - x) / sideMargin) * (Math.PI / 2));
          }

          out[idx + 3] = Math.round(Math.min(out[idx + 3], alpha) * lateralFade);
        }
      }
    }

    await sharp(out, { raw: { width, height, channels } })
      .png()
      .toFile('public/assets/blue_cloud_panoramic.png');
    console.log('Saved public/assets/blue_cloud_panoramic.png');
  }
}

processClouds();

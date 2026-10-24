const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processClouds() {
  const inputPath = path.resolve(__dirname, '../public/assets/purple_clouds.png');
  const img = sharp(inputPath);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const out = Buffer.from(data);

  // Key out white / near-white background
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Feather right straight edge (x > width - 12)
      let edgeFade = 1.0;
      if (x > width - 14) {
        edgeFade = Math.max(0, (width - x) / 14);
      }
      if (x < 10) {
        edgeFade = Math.min(edgeFade, x / 10);
      }

      if (r > 240 && g > 240 && b > 240) {
        out[idx + 3] = 0;
      } else if (r > 215 && g > 215 && b > 215) {
        const brightness = (r + g + b) / 3;
        const alpha = Math.max(0, Math.min(255, (240 - brightness) / 25 * 255));
        out[idx + 3] = Math.round(alpha * edgeFade);
      } else {
        out[idx + 3] = Math.round(data[idx + 3] * edgeFade);
      }
    }
  }

  const cutoutPath = path.resolve(__dirname, '../public/assets/purple_clouds_cutout.png');
  await sharp(out, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(cutoutPath);

  console.log('Saved seamless transparent cloud cutout to:', cutoutPath);

  // Panoramic Canvas: 2400 x 1200
  const canvasWidth = 2400;
  const canvasHeight = 1200;

  const skySvg = `
  <svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="twilightSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1A0F21" />
        <stop offset="30%" stop-color="#281432" />
        <stop offset="60%" stop-color="#46214B" />
        <stop offset="85%" stop-color="#6B3870" />
        <stop offset="100%" stop-color="#84488A" />
      </linearGradient>

      <!-- Soft Celestial Starlight Nebula -->
      <radialGradient id="nebula1" cx="35%" cy="30%" r="55%">
        <stop offset="0%" stop-color="#A6D1E6" stop-opacity="0.22" />
        <stop offset="50%" stop-color="#7F5283" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#1A0F21" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="nebula2" cx="75%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#DDA0DD" stop-opacity="0.18" />
        <stop offset="60%" stop-color="#7F5283" stop-opacity="0.12" />
        <stop offset="100%" stop-color="#1A0F21" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Deep Twilight Sky -->
    <rect width="${canvasWidth}" height="${canvasHeight}" fill="url(#twilightSky)" />
    <rect width="${canvasWidth}" height="${canvasHeight}" fill="url(#nebula1)" />
    <rect width="${canvasWidth}" height="${canvasHeight}" fill="url(#nebula2)" />

    <!-- Romantic Constellation Stars -->
    <g fill="#FEFBF6">
      ${Array.from({ length: 180 }, () => {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * (canvasHeight * 0.72);
        const r = 0.8 + Math.random() * 2.2;
        const op = 0.35 + Math.random() * 0.65;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" opacity="${op.toFixed(2)}" />`;
      }).join('\n')}
    </g>
  </svg>
  `;

  const skyBase = await sharp(Buffer.from(skySvg)).png().toBuffer();

  // Create varied cloud layers with smooth overlaps
  const cLeft = await sharp(cutoutPath).resize(1300).toBuffer();
  const cRight = await sharp(cutoutPath).flop().resize(1400).toBuffer();
  const cCenter = await sharp(cutoutPath).resize(1150).toBuffer();
  const cBottom = await sharp(cutoutPath).flop().resize(1600).toBuffer();

  await sharp(skyBase)
    .composite([
      // Back center clouds
      { input: cCenter, top: canvasHeight - 560, left: 620, blend: 'over' },
      // Left cloud billowing
      { input: cLeft, top: canvasHeight - 520, left: -100, blend: 'over' },
      // Right cloud billowing
      { input: cRight, top: canvasHeight - 540, left: 1100, blend: 'over' },
      // Foreground low cloud bank along base
      { input: cBottom, top: canvasHeight - 420, left: 380, blend: 'over' }
    ])
    .png({ quality: 90 })
    .toFile(path.resolve(__dirname, '../public/assets/purple_sky_panoramic.png'));

  console.log('Saved seamless panoramic purple sky dreamscape!');
}

processClouds();

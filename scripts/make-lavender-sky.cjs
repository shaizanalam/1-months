const sharp = require('sharp');
const path = require('path');

async function generateLavenderSky() {
  const canvasWidth = 2400;
  const canvasHeight = 1200;

  const skySvg = `
  <svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lavenderSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1E0B24" />
        <stop offset="35%" stop-color="#351640" />
        <stop offset="60%" stop-color="#5A2761" />
        <stop offset="82%" stop-color="#8E4885" />
        <stop offset="100%" stop-color="#C57EA9" />
      </linearGradient>

      <!-- Soft Dreamy Pink/Lavender Nebulae -->
      <radialGradient id="nebulaPink" cx="30%" cy="35%" r="50%">
        <stop offset="0%" stop-color="#F7C6DE" stop-opacity="0.28" />
        <stop offset="50%" stop-color="#C57EA9" stop-opacity="0.16" />
        <stop offset="100%" stop-color="#1E0B24" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="nebulaLavender" cx="70%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#E5B8F4" stop-opacity="0.25" />
        <stop offset="50%" stop-color="#8E4885" stop-opacity="0.14" />
        <stop offset="100%" stop-color="#1E0B24" stop-opacity="0" />
      </radialGradient>
      
      <radialGradient id="horizonGlow" cx="50%" cy="85%" r="60%">
        <stop offset="0%" stop-color="#FCE4EC" stop-opacity="0.32" />
        <stop offset="45%" stop-color="#F48FB1" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#351640" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Sky Base -->
    <rect width="${canvasWidth}" height="${canvasHeight}" fill="url(#lavenderSky)" />
    <rect width="${canvasWidth}" height="${canvasHeight}" fill="url(#nebulaPink)" />
    <rect width="${canvasWidth}" height="${canvasHeight}" fill="url(#nebulaLavender)" />
    <rect width="${canvasWidth}" height="${canvasHeight}" fill="url(#horizonGlow)" />

    <!-- Romantic Starlight -->
    <g fill="#FFF5FA">
      ${Array.from({ length: 220 }, () => {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * (canvasHeight * 0.75);
        const r = 0.7 + Math.random() * 2.2;
        const op = 0.3 + Math.random() * 0.7;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" opacity="${op.toFixed(2)}" />`;
      }).join('\n      ')}
    </g>

    <!-- Sparkle Cross Stars -->
    <g stroke="#FFF" stroke-width="0.8" opacity="0.75">
      ${[
        [400, 250, 6], [850, 180, 8], [1400, 320, 7], [1850, 210, 9], [620, 420, 5], [1680, 450, 6]
      ].map(([x, y, s]) => `
        <line x1="${x - s}" y1="${y}" x2="${x + s}" y2="${y}" />
        <line x1="${x}" y1="${y - s}" x2="${x}" y2="${y + s}" />
        <circle cx="${x}" cy="${y}" r="2" fill="#FFF" />
      `).join('\n      ')}
    </g>
  </svg>
  `;

  await sharp(Buffer.from(skySvg))
    .png()
    .toFile('public/assets/lavender_sky_panoramic.png');

  console.log('Saved public/assets/lavender_sky_panoramic.png');
}

generateLavenderSky();

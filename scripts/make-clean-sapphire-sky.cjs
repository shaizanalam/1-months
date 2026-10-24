const sharp = require('sharp');

async function generateCleanBlueSky() {
  const canvasWidth = 2400;
  const canvasHeight = 1200;

  const skySvg = `
  <svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sapphireGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#07192C" />
        <stop offset="35%" stop-color="#0F2F4E" />
        <stop offset="65%" stop-color="#1B4965" />
        <stop offset="85%" stop-color="#2B6B91" />
        <stop offset="100%" stop-color="#5FA8D3" />
      </linearGradient>

      <!-- Soft Celestial Glows -->
      <radialGradient id="nebulaBlue1" cx="30%" cy="35%" r="55%">
        <stop offset="0%" stop-color="#62B6CB" stop-opacity="0.25" />
        <stop offset="60%" stop-color="#1B4965" stop-opacity="0.10" />
        <stop offset="100%" stop-color="#07192C" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="nebulaBlue2" cx="72%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#BEE9E8" stop-opacity="0.20" />
        <stop offset="50%" stop-color="#1B4965" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#07192C" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Sky Base -->
    <rect width="${canvasWidth}" height="${canvasHeight}" fill="url(#sapphireGradient)" />
    <rect width="${canvasWidth}" height="${canvasHeight}" fill="url(#nebulaBlue1)" />
    <rect width="${canvasWidth}" height="${canvasHeight}" fill="url(#nebulaBlue2)" />

    <!-- Romantic Constellation Stars -->
    <g fill="#FEFBF6">
      ${Array.from({ length: 220 }, () => {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * (canvasHeight * 0.75);
        const r = 0.6 + Math.random() * 2.0;
        const op = 0.25 + Math.random() * 0.70;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" opacity="${op.toFixed(2)}" />`;
      }).join('\n      ')}
    </g>

    <!-- Golden Sparkle Stars -->
    <g stroke="#FFD700" stroke-width="0.75" opacity="0.8">
      ${[
        [380, 220, 6], [820, 160, 7], [1320, 280, 8], [1780, 190, 7], [580, 390, 5], [1620, 410, 6]
      ].map(([x, y, s]) => `
        <line x1="${x - s}" y1="${y}" x2="${x + s}" y2="${y}" />
        <line x1="${x}" y1="${y - s}" x2="${x}" y2="${y + s}" />
        <circle cx="${x}" cy="${y}" r="1.8" fill="#FFD700" />
      `).join('\n      ')}
    </g>
  </svg>
  `;

  await sharp(Buffer.from(skySvg))
    .png()
    .toFile('public/assets/sapphire_sky_panoramic.png');

  console.log('Successfully saved clean public/assets/sapphire_sky_panoramic.png');
}

generateCleanBlueSky();

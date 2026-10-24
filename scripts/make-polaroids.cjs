const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const momentsDir = path.join(__dirname, '..', 'public', 'assets', 'moments');

const cards = [
  { file: 'moment_4.jpg', title: 'Our Dance Moment 🎥', isVideo: true },
  { file: 'moment_5.jpg', title: 'Prettiest in the Universe ✨' },
  { file: 'moment_6.jpg', title: 'Traditional Grace 🌸' },
  { file: 'moment_3.jpg', title: 'Those Eyes & Cheeks 🌷' },
  { file: 'moment_7.jpg', title: 'Sweetest Smile ☀️' },
  { file: 'moment_2.jpg', title: 'Dancing Under Starlight 💫' },
  { file: 'moment_1.jpg', title: 'Festive Joy 🎆' }
];

async function makePolaroid(card, index) {
  const cardW = 600;
  const cardH = 750;
  const photoW = 520;
  const photoH = 540;
  const photoX = 40;
  const photoY = 40;

  const photoPath = path.join(momentsDir, card.file);
  const photoBuf = await sharp(photoPath)
    .resize(photoW, photoH, { fit: 'cover', position: 'top' })
    .toBuffer();

  const playBadge = card.isVideo ? `
    <circle cx="${cardW/2}" cy="${photoY + photoH/2}" r="44" fill="rgba(61, 60, 66, 0.75)" stroke="#FEFBF6" stroke-width="3"/>
    <polygon points="${cardW/2 - 14},${photoY + photoH/2 - 20} ${cardW/2 + 22},${photoY + photoH/2} ${cardW/2 - 14},${photoY + photoH/2 + 20}" fill="#FEFBF6"/>
  ` : '';

  const svg = `
  <svg width="${cardW}" height="${cardH}" xmlns="http://www.w3.org/2000/svg">
    <!-- Polaroid Paper in #FEFBF6 with #A6D1E6 border -->
    <rect x="8" y="8" width="${cardW - 16}" height="${cardH - 16}" rx="14" fill="#FEFBF6" stroke="#A6D1E6" stroke-width="3"/>
    
    <!-- Pastel Sky Washi Tape on top -->
    <rect x="${cardW/2 - 50}" y="2" width="100" height="22" rx="3" fill="#A6D1E6" opacity="0.9" transform="rotate(-1.5 ${cardW/2} 12)"/>

    <!-- Handwritten Title -->
    <text x="${cardW/2}" y="${cardH - 58}" font-family="'Caveat', cursive, sans-serif" font-size="44" font-weight="700" fill="#3D3C42" text-anchor="middle">${card.title.replace(/&/g, '&amp;')}</text>
    <text x="${cardW/2}" y="${cardH - 26}" font-family="sans-serif" font-size="16" font-weight="600" fill="#7F5283" text-anchor="middle">♡ tap to ${card.isVideo ? 'play video' : 'zoom photo'} ♡</text>
    ${playBadge}
  </svg>
  `;

  const outPath = path.join(momentsDir, 'polaroid_' + (index + 1) + '.png');

  const baseBuf = await sharp(Buffer.from(svg)).png().toBuffer();

  await sharp(baseBuf)
    .composite([
      { input: photoBuf, top: photoY, left: photoX }
    ])
    .png()
    .toFile(outPath);

  console.log('Created polaroid_' + (index + 1) + '.png');
}

(async () => {
  for (let i = 0; i < cards.length; i++) {
    await makePolaroid(cards[i], i);
  }
  console.log('All polaroids generated successfully!');
})();

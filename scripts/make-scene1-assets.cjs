const sharp = require('sharp');
const fs = require('fs');

async function createMorningSky() {
  const width = 2400;
  const height = 1200;

  // Romantic morning dreamscape gradient: Cream #FEFBF6 -> Soft Blush -> Sky Blue #A6D1E6 -> Subtle Twilight
  const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="morningSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#8FA3C7" stop-opacity="0.8"/>
        <stop offset="30%" stop-color="#A6D1E6" stop-opacity="0.85"/>
        <stop offset="70%" stop-color="#EDF5F9" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#FEFBF6" stop-opacity="1.0"/>
      </linearGradient>
      <radialGradient id="sunGlow" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stop-color="#FFFDF8" stop-opacity="0.95"/>
        <stop offset="40%" stop-color="#FBF6EB" stop-opacity="0.75"/>
        <stop offset="75%" stop-color="#A6D1E6" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#FEFBF6" stop-opacity="0.0"/>
      </radialGradient>
      <filter id="softBlur">
        <feGaussianBlur stdDeviation="8"/>
      </filter>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#morningSky)"/>
    <rect width="${width}" height="${height}" fill="url(#sunGlow)"/>

    <!-- Subtle morning stars & sparkle constellations -->
    ${Array.from({ length: 60 }).map(() => {
      const cx = Math.floor(Math.random() * width);
      const cy = Math.floor(Math.random() * (height * 0.65));
      const r = (Math.random() * 2 + 1).toFixed(1);
      const op = (Math.random() * 0.6 + 0.2).toFixed(2);
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" opacity="${op}" filter="url(#softBlur)"/>
              <circle cx="${cx}" cy="${cy}" r="${(r * 0.6).toFixed(1)}" fill="#FFFFFF" opacity="${Math.min(1, op * 1.5).toFixed(2)}"/>`;
    }).join('\n')}

    <!-- Subtle light rays emanating from center -->
    <path d="M 1200 420 L 0 0 L 200 0 Z" fill="#FFFFFF" opacity="0.08"/>
    <path d="M 1200 420 L 600 0 L 850 0 Z" fill="#FFFFFF" opacity="0.12"/>
    <path d="M 1200 420 L 1550 0 L 1800 0 Z" fill="#FFFFFF" opacity="0.12"/>
    <path d="M 1200 420 L 2200 0 L 2400 0 Z" fill="#FFFFFF" opacity="0.08"/>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile('public/assets/morning_sky_panoramic.png');
  console.log('Created public/assets/morning_sky_panoramic.png');
}

async function createMorningClouds() {
  // We can take the stylized cloud cutout and tint it with soft morning hues: blush pink, pastel sky blue, and cream highlights
  // Or create high-resolution billowy illustrated morning clouds using sharp
  const input = 'public/assets/purple_clouds_cutout.png';
  
  // Transform purple tones into a dreamy morning palette (blush rose & lavender with cream highlights)
  // Let's create an authentic morning palette version
  await sharp(input)
    .modulate({
      hue: 15, // shift toward warm rose / golden peach
      saturation: 1.15,
      lightness: 1.12
    })
    .png()
    .toFile('public/assets/morning_clouds_cutout.png');

  console.log('Created public/assets/morning_clouds_cutout.png');
}

async function createTulipHeroFrame() {
  // A romantic watercolor paper deckle frame with gold embossed borders, washi tape, and calligraphic plaque
  const width = 900;
  const height = 900;

  const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="125%">
        <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#7F5283" flood-opacity="0.18"/>
      </filter>
      <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D4AF37"/>
        <stop offset="50%" stop-color="#F3E5AB"/>
        <stop offset="100%" stop-color="#AA771C"/>
      </linearGradient>
    </defs>

    <!-- Main Deckle Watercolor Paper Mount -->
    <rect x="25" y="25" width="850" height="850" rx="36" fill="#FEFBF6" stroke="#A6D1E6" stroke-width="4" filter="url(#cardShadow)"/>
    
    <!-- Subtle Inner Gold Foil Inset -->
    <rect x="42" y="42" width="816" height="816" rx="26" fill="none" stroke="url(#goldBorder)" stroke-width="2.5" opacity="0.85"/>
    <rect x="48" y="48" width="804" height="804" rx="22" fill="none" stroke="#7F5283" stroke-dasharray="8 6" stroke-width="1.5" opacity="0.35"/>

    <!-- Washi Tapes at Top Corners -->
    <!-- Top Left Tape -->
    <rect x="30" y="20" width="120" height="34" rx="4" fill="#A6D1E6" opacity="0.8" transform="rotate(-18 80 37)"/>
    <!-- Top Right Tape -->
    <rect x="750" y="20" width="120" height="34" rx="4" fill="#E8D5EB" opacity="0.85" transform="rotate(18 810 37)"/>

    <!-- Bottom Calligraphy Plaque Banner -->
    <rect x="180" y="780" width="540" height="68" rx="22" fill="#FFFFFF" stroke="#A6D1E6" stroke-width="2.5"/>
    <text x="450" y="812" font-family="'Segoe Script', 'Brush Script MT', cursive" font-size="26" font-weight="bold" fill="#7F5283" text-anchor="middle">“Hey, Kumkum. I made you a flower.” 🌷</text>
    <text x="450" y="836" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" fill="#3D3C42" opacity="0.8" text-anchor="middle">✨ The moment the universe shifted · Tap to open ✨</text>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile('public/assets/tulip_hero_frame.png');
  console.log('Created public/assets/tulip_hero_frame.png');
}

async function createTulipPetal() {
  const width = 200;
  const height = 280;

  const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#EAA6B8" stop-opacity="0.95"/>
        <stop offset="50%" stop-color="#DE829B" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#7F5283" stop-opacity="0.75"/>
      </linearGradient>
    </defs>
    <!-- Organic tulip petal curve -->
    <path d="M 100 10 
             C 160 50, 190 140, 150 220 
             C 120 270, 80 270, 50 220 
             C 10 140, 40 50, 100 10 Z" 
          fill="url(#petalGrad)" 
          stroke="#7F5283" 
          stroke-width="1.5" 
          opacity="0.9"/>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile('public/assets/tulip_petal.png');
  console.log('Created public/assets/tulip_petal.png');
}

async function run() {
  await createMorningSky();
  await createMorningClouds();
  await createTulipHeroFrame();
  await createTulipPetal();
}

run();

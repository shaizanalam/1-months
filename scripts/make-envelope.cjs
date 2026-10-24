const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createRomanticEnvelope() {
  const width = 1200;
  const height = 800;

  // SVG drawing of a luxurious, tactile romantic letter envelope
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Drop shadow for the entire envelope -->
      <filter id="envShadow" x="-10%" y="-10%" width="130%" height="135%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#3D3C42" flood-opacity="0.22" />
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#7F5283" flood-opacity="0.12" />
      </filter>

      <!-- Drop shadow for flaps -->
      <filter id="flapShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#2a2028" flood-opacity="0.15" />
      </filter>

      <!-- Drop shadow for wax seal -->
      <filter id="sealShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#2a1024" flood-opacity="0.38" />
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.2" />
      </filter>

      <!-- Paper Gradients -->
      <linearGradient id="paperGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFDF9" />
        <stop offset="50%" stop-color="#FBF7EE" />
        <stop offset="100%" stop-color="#F4ECE1" />
      </linearGradient>

      <linearGradient id="flapTopGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="70%" stop-color="#FDF8F0" />
        <stop offset="100%" stop-color="#F2E6D6" />
      </linearGradient>

      <linearGradient id="sideFlapGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F9F3E8" />
        <stop offset="100%" stop-color="#EDE2D0" />
      </linearGradient>

      <!-- Wax Seal Gradient -->
      <radialGradient id="waxGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#9C6B9E" />
        <stop offset="40%" stop-color="#7F5283" />
        <stop offset="85%" stop-color="#5E3562" />
        <stop offset="100%" stop-color="#3F2042" />
      </radialGradient>

      <linearGradient id="goldHeart" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFF5EA" />
        <stop offset="100%" stop-color="#F7D9B8" />
      </linearGradient>

      <!-- Vintage Airmail Border Pattern -->
      <pattern id="airmail" width="40" height="12" patternUnits="userSpaceOnUse">
        <rect width="20" height="12" fill="#A6D1E6" fill-opacity="0.65" />
        <rect x="20" width="20" height="12" fill="#7F5283" fill-opacity="0.55" />
      </pattern>
    </defs>

    <!-- Main Envelope Body with Shadow -->
    <g filter="url(#envShadow)">
      <!-- Outer Rectangle -->
      <rect x="70" y="60" width="1060" height="680" rx="18" fill="url(#paperGrad)" stroke="#E4D7C5" stroke-width="2" />

      <!-- Air Mail Border Trim -->
      <rect x="74" y="64" width="1052" height="10" fill="url(#airmail)" rx="2" />
      <rect x="74" y="726" width="1052" height="10" fill="url(#airmail)" rx="2" />
      <rect x="74" y="74" width="10" height="652" fill="url(#airmail)" rx="2" />
      <rect x="1116" y="74" width="10" height="652" fill="url(#airmail)" rx="2" />

      <!-- Inner Paper Texture Border -->
      <rect x="94" y="84" width="1012" height="632" fill="none" stroke="#D8C7B2" stroke-width="1.5" stroke-dasharray="6,4" />

      <!-- Back Flaps Shading (Left & Right triangles) -->
      <!-- Left Flap -->
      <path d="M 94 84 L 560 400 L 94 716 Z" fill="url(#sideFlapGrad)" stroke="#DFD1BF" stroke-width="1.5" />
      <!-- Right Flap -->
      <path d="M 1106 84 L 640 400 L 1106 716 Z" fill="url(#sideFlapGrad)" stroke="#DFD1BF" stroke-width="1.5" />

      <!-- Bottom Flap with subtle shadow -->
      <path d="M 94 716 L 600 420 L 1106 716 Z" fill="#FBF5EA" stroke="#D5C4AF" stroke-width="2" />

      <!-- Top Triangle Flap coming down over bottom flap with drop shadow -->
      <g filter="url(#flapShadow)">
        <path d="M 94 84 L 600 450 L 1106 84 Z" fill="url(#flapTopGrad)" stroke="#D0BFAB" stroke-width="2.5" />
      </g>
    </g>

    <!-- Vintage Postage Stamp in Top-Right Corner -->
    <g transform="translate(930, 110)">
      <!-- Stamp Shadow -->
      <rect x="-4" y="-4" width="148" height="178" rx="4" fill="#3D3C42" fill-opacity="0.12" />
      <!-- Stamp Body with Perforated Look -->
      <rect x="0" y="0" width="140" height="170" rx="3" fill="#FFFDF8" stroke="#7F5283" stroke-width="2" stroke-dasharray="8,3" />
      <rect x="8" y="8" width="124" height="154" fill="#F5EBF4" />

      <!-- Stamp Illustration: Tulip / Rose -->
      <text x="70" y="82" font-size="52" text-anchor="middle" dominant-baseline="middle">🌷</text>
      <text x="70" y="128" font-family="'Caveat', cursive, serif" font-weight="700" font-size="20" fill="#7F5283" text-anchor="middle">FOREVER</text>
      <text x="70" y="148" font-family="sans-serif" font-weight="600" font-size="11" fill="#3D3C42" text-anchor="middle" letter-spacing="1">SPECIAL POST</text>

      <!-- Postmark Stamp Circle -->
      <circle cx="20" cy="85" r="46" fill="none" stroke="#7F5283" stroke-width="2" stroke-dasharray="6,3" opacity="0.65" />
      <text x="20" y="80" font-family="sans-serif" font-size="10" fill="#7F5283" text-anchor="middle" font-weight="700" opacity="0.75">KUMKUM &amp; SHAIZAN</text>
      <text x="20" y="96" font-family="sans-serif" font-size="9" fill="#7F5283" text-anchor="middle" opacity="0.75">★ 2026 ★</text>
      <!-- Wavy cancellation lines -->
      <path d="M 40 70 Q 60 62 80 70 T 120 70" fill="none" stroke="#7F5283" stroke-width="2" opacity="0.6" />
      <path d="M 40 85 Q 60 77 80 85 T 120 85" fill="none" stroke="#7F5283" stroke-width="2" opacity="0.6" />
      <path d="M 40 100 Q 60 92 80 100 T 120 100" fill="none" stroke="#7F5283" stroke-width="2" opacity="0.6" />
    </g>

    <!-- Air Mail Label Badge on Top-Left -->
    <g transform="translate(130, 115)">
      <rect x="0" y="0" width="160" height="42" rx="6" fill="#A6D1E6" stroke="#7F5283" stroke-width="1.5" />
      <text x="80" y="26" font-family="sans-serif" font-weight="800" font-size="15" fill="#3D3C42" text-anchor="middle" letter-spacing="2">PAR AVION</text>
      <text x="80" y="38" font-family="sans-serif" font-weight="600" font-size="9" fill="#7F5283" text-anchor="middle" letter-spacing="1">AIR MAIL</text>
    </g>

    <!-- Handwritten Calligraphy Label: "For Kumkum ♡" in authentic cursive -->
    <g transform="translate(600, 580)">
      <text x="0" y="0" font-family="'Segoe Script', 'Brush Script MT', cursive" font-weight="bold" font-size="64" fill="#3D3C42" text-anchor="middle">For Kumkum ♡</text>
      <text x="0" y="44" font-family="'Segoe Script', 'Brush Script MT', cursive" font-weight="bold" font-size="28" fill="#7F5283" text-anchor="middle">"The reason underneath it all"</text>
    </g>

    <!-- Luxurious Dimensional Wax Seal in Center -->
    <g filter="url(#sealShadow)" transform="translate(600, 420)">
      <!-- Melted Wax Irregular Blobs -->
      <path d="M -85 -20 C -98 -60 -50 -95 -12 -90 C 28 -98 80 -70 92 -26 C 104 18 85 75 40 94 C -12 104 -68 85 -88 40 C -100 12 -92 -6 -85 -20 Z" fill="#4D2550" opacity="0.75" />
      <path d="M -78 -16 C -90 -52 -45 -85 -8 -80 C 30 -88 72 -62 82 -22 C 94 18 75 68 32 85 C -12 94 -60 76 -78 34 Z" fill="url(#waxGrad)" />

      <!-- Inner Seal Rim -->
      <circle cx="0" cy="0" r="66" fill="url(#waxGrad)" stroke="#3A183D" stroke-width="4" />
      <circle cx="0" cy="0" r="56" fill="none" stroke="#9C6B9E" stroke-width="2.5" stroke-opacity="0.8" />
      <circle cx="0" cy="0" r="54" fill="#5E3562" fill-opacity="0.5" />

      <!-- Embossed Heart on Wax Seal -->
      <path d="M 0 26 C -24 7 -36 -15 -20 -30 C -8 -42 0 -24 0 -24 C 0 -24 8 -42 20 -30 C 36 -15 24 7 0 26 Z" fill="url(#goldHeart)" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.6))" />

      <!-- Wax Seal Gloss Highlight Reflection -->
      <ellipse cx="-25" cy="-32" rx="22" ry="12" transform="rotate(-30, -25, -32)" fill="#FFFFFF" fill-opacity="0.32" />
    </g>

    <!-- Affordance Ribbon Tag at Bottom of Envelope -->
    <g transform="translate(600, 700)" filter="url(#flapShadow)">
      <rect x="-170" y="-22" width="340" height="44" rx="22" fill="#7F5283" stroke="#FEFBF6" stroke-width="2" />
      <circle cx="-135" cy="0" r="12" fill="#A6D1E6" />
      <text x="-135" y="4" font-family="sans-serif" font-size="14" fill="#3D3C42" text-anchor="middle">💌</text>
      <text x="10" y="6" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="16" fill="#FEFBF6" text-anchor="middle" letter-spacing="1">TAP TO OPEN LETTER ✨</text>
    </g>
  </svg>
  `;

  const outputPath = path.resolve(__dirname, '../public/assets/envelope_romantic.png');
  await sharp(Buffer.from(svg))
    .png({ quality: 95 })
    .toFile(outputPath);

  console.log('Successfully created romantic envelope at:', outputPath);
}

createRomanticEnvelope();

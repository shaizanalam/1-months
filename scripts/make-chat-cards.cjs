const sharp = require('sharp');
const fs = require('fs');

async function createChatCard1() {
  // First DM card (Scene 2)
  const width = 800;
  const height = 540;

  const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-8%" y="-8%" width="116%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#3D3C42" flood-opacity="0.16"/>
      </filter>
      <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f09433"/>
        <stop offset="25%" stop-color="#e6683c"/>
        <stop offset="50%" stop-color="#dc2743"/>
        <stop offset="75%" stop-color="#cc2366"/>
        <stop offset="100%" stop-color="#bc1888"/>
      </linearGradient>
    </defs>

    <!-- Card Background (Authentic frosted paper) -->
    <rect x="16" y="16" width="768" height="508" rx="28" fill="#FEFBF6" stroke="#A6D1E6" stroke-width="3" filter="url(#shadow)"/>

    <!-- Subtle paper tape at top -->
    <rect x="330" y="4" width="140" height="26" rx="4" fill="#A6D1E6" opacity="0.65" transform="rotate(-1.5 400 17)"/>

    <!-- Header bar -->
    <circle cx="64" cy="72" r="22" fill="url(#headerGrad)"/>
    <text x="64" y="78" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">𝜗ৎ</text>

    <text x="100" y="68" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" fill="#3D3C42">Kumkum &amp; Shaizan</text>
    <text x="100" y="90" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" fill="#7F5283">Sep 6, 2026 · 21:13 · The Very First DM</text>

    <!-- Divider line -->
    <line x1="36" y1="112" x2="764" y2="112" stroke="#E5EDF0" stroke-width="2"/>

    <!-- Shaizan message bubble 1 (Right aligned) -->
    <rect x="290" y="132" width="470" height="74" rx="22" fill="#3897f0"/>
    <text x="312" y="162" font-family="'Segoe UI', Roboto, sans-serif" font-size="19" fill="#ffffff">Chill mar and bas maf kar dio 🙏</text>
    <text x="312" y="188" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" fill="#E0F0FF" opacity="0.9">Btw sry for that day, ik i should've done trash talk</text>

    <!-- Reaction badge -->
    <rect x="710" y="186" width="44" height="28" rx="14" fill="#ffffff" stroke="#E0E0E0" stroke-width="1.5"/>
    <text x="732" y="206" font-family="'Segoe UI Emoji', sans-serif" font-size="16" text-anchor="middle">❤️</text>

    <!-- Kumkum message bubble (Left aligned) -->
    <circle cx="58" cy="284" r="18" fill="#7F5283"/>
    <text x="58" y="290" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">K</text>

    <rect x="88" y="250" width="560" height="110" rx="22" fill="#EFEFEF"/>
    <text x="112" y="284" font-family="'Segoe UI', Roboto, sans-serif" font-size="19" fill="#262626">Vese tu utna bhi Ganda nahi hai</text>
    <text x="112" y="312" font-family="'Segoe UI', Roboto, sans-serif" font-size="19" fill="#262626">jitna hum log sochte the tere bare mein 🤣🤣</text>
    <text x="112" y="340" font-family="'Segoe UI', Roboto, sans-serif" font-size="17" fill="#7F5283" font-style="italic">Aab opinion change karna padega ✨</text>

    <!-- Shaizan reply bubble 2 -->
    <rect x="380" y="380" width="380" height="54" rx="22" fill="#3897f0"/>
    <text x="402" y="414" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" fill="#ffffff">Haha wait till you see the real me 😌</text>

    <!-- Bottom Footer Pill Button -->
    <rect x="230" y="456" width="340" height="42" rx="21" fill="#7F5283"/>
    <text x="400" y="483" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#FEFBF6" text-anchor="middle">💬 Tap To Explore All 37,523 Texts ✨</text>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile('public/assets/chat_card_menace.png');
  console.log('Created public/assets/chat_card_menace.png');
}

async function createChatCard2() {
  // Late Night Lore card (Scene 4)
  const width = 800;
  const height = 560;

  const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow2" x="-8%" y="-8%" width="116%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#140a1e" flood-opacity="0.3"/>
      </filter>
    </defs>

    <!-- Card Background (Dark romantic midnight parchment) -->
    <rect x="16" y="16" width="768" height="528" rx="28" fill="#1C1826" stroke="#7F5283" stroke-width="3" filter="url(#shadow2)"/>

    <!-- Subtle paper tape at top -->
    <rect x="330" y="4" width="140" height="26" rx="4" fill="#7F5283" opacity="0.8" transform="rotate(1.2 400 17)"/>

    <!-- Header bar -->
    <text x="50" y="66" font-family="'Segoe UI Emoji', sans-serif" font-size="24">🌙</text>
    <text x="90" y="66" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" fill="#FEFBF6">01:42 AM · Late-Night Lore</text>
    <text x="90" y="90" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" fill="#A6D1E6">Talking until the hours blurred together...</text>

    <!-- Divider line -->
    <line x1="36" y1="110" x2="764" y2="110" stroke="#332B45" stroke-width="2"/>

    <!-- Kumkum message bubble 1 -->
    <rect x="50" y="130" width="520" height="66" rx="22" fill="#2E263D"/>
    <text x="74" y="160" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" fill="#FEFBF6">Tuje meri side cheeks me itna intrest kyu he</text>
    <text x="74" y="184" font-family="'Segoe UI', Roboto, sans-serif" font-size="17" fill="#A6D1E6">ghum phir ke wahi aa jaati he 🙈</text>

    <!-- Shaizan reply bubble 1 -->
    <rect x="230" y="214" width="530" height="84" rx="22" fill="#7F5283"/>
    <text x="252" y="244" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" fill="#FEFBF6">Okay so what i like most about you</text>
    <text x="252" y="270" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" fill="#FEFBF6">is your bunny cheeks 🤌🫶 and eyelashes</text>
    <text x="252" y="292" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" fill="#E8D5EB">they hold a whole world beneath them...</text>

    <!-- Kumkum message bubble 2 -->
    <rect x="50" y="316" width="460" height="60" rx="22" fill="#2E263D"/>
    <text x="74" y="352" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" fill="#FEFBF6">Vese love you 🫠 I don't wanna sleep yet</text>

    <!-- Shaizan reply bubble 2 -->
    <rect x="310" y="394" width="450" height="60" rx="22" fill="#3897f0"/>
    <text x="332" y="430" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" fill="#ffffff">Actually i over all love you 🤭💖</text>

    <!-- Bottom Footer Pill Button -->
    <rect x="220" y="474" width="360" height="42" rx="21" fill="#A6D1E6"/>
    <text x="400" y="501" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#1C1826" text-anchor="middle">💬 View 8,900+ Late-Night Chats ✨</text>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile('public/assets/chat_card_latenight.png');
  console.log('Created public/assets/chat_card_latenight.png');
}

async function run() {
  await createChatCard1();
  await createChatCard2();
}
run();

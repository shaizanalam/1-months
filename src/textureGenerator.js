// textureGenerator.js - Generates tactile, handmade scrapbook textures
import * as THREE from 'three';

// Helper to load an image into an Image object
export function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn('Failed to load image:', src);
      resolve(null);
    };
    img.src = src;
  });
}

// 1. Tulip Portal & Finale Canvas
export function createTulipTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d');

  // Heavy watercolor cold-press paper background
  ctx.fillStyle = '#faf6ed';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle paper grain noise
  for (let i = 0; i < 40000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const alpha = Math.random() * 0.05;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(180, 150, 120, ${alpha})` : `rgba(255, 255, 255, ${alpha * 1.5})`;
    ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }

  // Watercolor wash stains in soft peach and gold
  const grad = ctx.createRadialGradient(512, 640, 100, 512, 640, 600);
  grad.addColorStop(0, 'rgba(255, 235, 230, 0.5)');
  grad.addColorStop(0.5, 'rgba(254, 243, 226, 0.3)');
  grad.addColorStop(1, 'rgba(240, 230, 215, 0.7)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Deckled/torn paper edge effect
  ctx.strokeStyle = 'rgba(210, 190, 170, 0.6)';
  ctx.lineWidth = 12;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Draw 4 Pink Watercolor Tulips
  // Stems and broad overlapping green leaves
  function drawStem(x1, y1, x2, y2, bend) {
    ctx.save();
    // Watercolor wash for stem
    ctx.strokeStyle = 'rgba(76, 140, 74, 0.65)';
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(bend.x, bend.y, x2, y2);
    ctx.stroke();

    // Sketchy black ink lines
    ctx.strokeStyle = '#223127';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(bend.x, bend.y, x2, y2);
    ctx.stroke();

    // Second loose sketchy line
    ctx.strokeStyle = 'rgba(40, 55, 45, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1 + 3, y1);
    ctx.quadraticCurveTo(bend.x + 2, bend.y, x2 + 2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function drawLeaf(x, y, scale, rotation, flip = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    if (flip) ctx.scale(-1, 1);
    ctx.scale(scale, scale);

    // Watercolor leaf fill
    ctx.fillStyle = 'rgba(100, 168, 102, 0.65)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-40, -100, -60, -220, 0, -320);
    ctx.bezierCurveTo(60, -220, 40, -100, 0, 0);
    ctx.fill();

    // Second emerald wash layer
    ctx.fillStyle = 'rgba(60, 130, 75, 0.4)';
    ctx.beginPath();
    ctx.moveTo(-10, -20);
    ctx.bezierCurveTo(-30, -90, -40, -190, 0, -290);
    ctx.bezierCurveTo(20, -180, 10, -80, -10, -20);
    ctx.fill();

    // Sketchy black ink outline + center vein
    ctx.strokeStyle = '#1e2b20';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-40, -100, -60, -220, 0, -320);
    ctx.bezierCurveTo(60, -220, 40, -100, 0, 0);
    ctx.stroke();

    // Center vein & hatch marks
    ctx.strokeStyle = 'rgba(30, 45, 30, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(10, -160, 0, -310);
    ctx.stroke();

    ctx.restore();
  }

  // Draw broad leaves
  drawLeaf(360, 1100, 1.3, -0.25);
  drawLeaf(680, 1100, 1.25, 0.3, true);
  drawLeaf(480, 950, 1.1, -0.15);
  drawLeaf(560, 960, 1.15, 0.2, true);
  drawLeaf(240, 1080, 1.0, -0.45);
  drawLeaf(780, 1080, 1.0, 0.45, true);

  // Stems for 4 tulips:
  // Tulip 1 (left mid): 320, 520
  // Tulip 2 (center-left tall): 460, 380
  // Tulip 3 (center-right tall): 600, 410
  // Tulip 4 (right mid): 730, 540
  drawStem(340, 1200, 340, 560, { x: 310, y: 880 });
  drawStem(480, 1200, 470, 430, { x: 450, y: 800 });
  drawStem(580, 1200, 590, 450, { x: 610, y: 820 });
  drawStem(700, 1200, 720, 570, { x: 740, y: 900 });

  function drawTulipHead(x, y, scale, rotation, colorVariant = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    // Watercolor soft glow/bleed behind
    ctx.fillStyle = colorVariant === 0 ? 'rgba(255, 160, 180, 0.4)' : 'rgba(240, 120, 160, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, -60, 65, 85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Petal washes - Rose & Pink Watercolor
    const pink1 = colorVariant === 0 ? 'rgba(240, 98, 146, 0.75)' : 'rgba(233, 30, 99, 0.7)';
    const pink2 = colorVariant === 0 ? 'rgba(252, 142, 172, 0.8)' : 'rgba(244, 114, 155, 0.75)';
    const pinkDark = 'rgba(194, 24, 91, 0.7)';

    // Left petal
    ctx.fillStyle = pink1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-50, -20, -70, -80, -45, -120);
    ctx.bezierCurveTo(-15, -110, -5, -60, 0, 0);
    ctx.fill();

    // Right petal
    ctx.fillStyle = pink2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(50, -20, 70, -80, 45, -120);
    ctx.bezierCurveTo(15, -110, 5, -60, 0, 0);
    ctx.fill();

    // Center petal
    ctx.fillStyle = pinkDark;
    ctx.beginPath();
    ctx.moveTo(-25, -15);
    ctx.bezierCurveTo(-40, -70, -20, -135, 0, -145);
    ctx.bezierCurveTo(20, -135, 40, -70, 25, -15);
    ctx.closePath();
    ctx.fill();

    // Sketchy black ink contours
    ctx.strokeStyle = '#2b1b22';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Left contour
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-50, -20, -70, -80, -45, -120);
    ctx.bezierCurveTo(-30, -115, -15, -80, 0, 0);
    ctx.stroke();

    // Right contour
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(50, -20, 70, -80, 45, -120);
    ctx.bezierCurveTo(30, -115, 15, -80, 0, 0);
    ctx.stroke();

    // Center petal contour
    ctx.beginPath();
    ctx.moveTo(-25, -15);
    ctx.bezierCurveTo(-40, -70, -20, -135, 0, -145);
    ctx.bezierCurveTo(20, -135, 40, -70, 25, -15);
    ctx.stroke();

    // Hatching and texture details
    ctx.strokeStyle = 'rgba(50, 20, 35, 0.4)';
    ctx.lineWidth = 1.8;
    for (let i = -20; i <= 20; i += 7) {
      ctx.beginPath();
      ctx.moveTo(i, -20);
      ctx.lineTo(i * 1.3, -65);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw 4 tulip heads
  drawTulipHead(340, 560, 1.05, -0.15, 0);
  drawTulipHead(470, 430, 1.25, -0.05, 1);
  drawTulipHead(590, 450, 1.2, 0.08, 0);
  drawTulipHead(720, 570, 1.08, 0.18, 1);

  // Handwritten cute title & artist note at bottom
  ctx.save();
  ctx.fillStyle = '#4a3b32';
  ctx.font = 'bold 34px "Caveat", cursive';
  ctx.textAlign = 'center';
  ctx.fillText('"i made you a flower."', canvas.width / 2, 1160);
  ctx.font = '22px "Indie Flower", cursive';
  ctx.fillStyle = '#826f63';
  ctx.fillText("(yes, i know. professional artist. please don't be jealous. 🌷)", canvas.width / 2, 1205);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

// 2. Flork "Brain hai ye!" Roast Card Texture
export async function createFlorkCardTexture(florkImg) {
  const canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');

  // Kraft / light cream square card
  ctx.fillStyle = '#fffdf9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle grid lines
  ctx.strokeStyle = 'rgba(220, 210, 195, 0.45)';
  ctx.lineWidth = 1.5;
  for (let x = 40; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 40; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Cute washi tape at top
  ctx.fillStyle = 'rgba(255, 182, 193, 0.85)';
  ctx.fillRect(380, 15, 240, 50);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillRect(400, 25, 200, 6);

  // Top Title Text in Kumkum's playful handwriting
  ctx.fillStyle = '#2d2424';
  ctx.font = 'bold 44px "Caveat", cursive';
  ctx.textAlign = 'center';
  ctx.fillText("I didn't know what to get you", 500, 130);
  ctx.fillText('because you already have a lot.', 500, 180);

  ctx.font = '36px "Indie Flower", cursive';
  ctx.fillStyle = '#4f3e3e';
  ctx.fillText('So, I found the one thing', 500, 240);
  ctx.fillText("that I know you didn't have! 😌", 500, 290);

  // Draw Flork Sticker if available
  if (florkImg) {
    ctx.save();
    // Circular cutout frame
    ctx.drawImage(florkImg, 320, 360, 360, 360);
    ctx.restore();
  } else {
    // Procedural cute blushing Flork drawing
    ctx.save();
    ctx.translate(500, 520);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 110, Math.PI * 0.8, Math.PI * 2.2);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-35, -20, 8, 0, Math.PI * 2);
    ctx.arc(35, -20, 8, 0, Math.PI * 2);
    ctx.fill();

    // Blushing cheeks
    ctx.fillStyle = 'rgba(255, 105, 180, 0.6)';
    ctx.beginPath();
    ctx.arc(-55, -5, 18, 0, Math.PI * 2);
    ctx.arc(55, -5, 18, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.beginPath();
    ctx.arc(0, 10, 25, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.restore();
  }

  // Hand-drawn arrow pointing to brain
  ctx.save();
  ctx.strokeStyle = '#e91e63';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(310, 720);
  ctx.quadraticCurveTo(400, 680, 480, 710);
  ctx.stroke();
  // Arrow head
  ctx.beginPath();
  ctx.moveTo(480, 710);
  ctx.lineTo(450, 695);
  ctx.moveTo(480, 710);
  ctx.lineTo(460, 730);
  ctx.stroke();
  ctx.restore();

  // Highlight Box: "Here you go -> Brain hai ye! Happy Birthday!"
  ctx.save();
  ctx.fillStyle = '#ff4081';
  ctx.font = 'bold 52px "Caveat", cursive';
  ctx.textAlign = 'center';
  ctx.fillText('Here you go -> Brain hai ye! 🧠', 500, 780);

  ctx.fillStyle = '#d81b60';
  ctx.font = 'bold 64px "Caveat", cursive';
  ctx.fillText('Happy Birthday! ♡', 500, 860);

  // Little doodle stars & hearts
  ctx.font = '28px serif';
  ctx.fillText('✨', 180, 420);
  ctx.fillText('💖', 800, 460);
  ctx.fillText('🌸', 210, 760);
  ctx.fillText('✨', 790, 780);
  ctx.restore();

  // Hand-drawn border
  ctx.strokeStyle = '#e2d5c3';
  ctx.lineWidth = 8;
  ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

// 3. Periodic Table Science Card ("I LuV YOU FO ReVEr")
export function createPeriodicTableTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');

  // Crisp white scientific paper card with rounded feel
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Soft subtle blueprint/science grid
  ctx.strokeStyle = 'rgba(230, 235, 245, 0.8)';
  ctx.lineWidth = 1;
  for (let x = 30; x < canvas.width; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 30; y < canvas.height; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Title: Chemistry of Us
  ctx.save();
  ctx.fillStyle = '#2c3e50';
  ctx.font = 'bold 36px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('THE ELEMENTAL CHEMISTRY OF US', 600, 90);

  ctx.font = '26px "Indie Flower", cursive';
  ctx.fillStyle = '#7f8c8d';
  ctx.fillText('(scientifically proven fact: my heart did not stand a chance)', 600, 135);
  ctx.restore();

  // The 11 Elements spelling: I LuV YOU FO ReVEr
  // Row 1: I (53)
  // Row 2: Lu (71), V (23)
  // Row 3: Y (39), O (8), U (92)
  // Row 4: F (9), O (8), Re (75), V (23), Er (68)
  const rows = [
    [{ num: 53, sym: 'I', name: 'Iodine', mass: '126.90', color: '#e74c3c' }],
    [
      { num: 71, sym: 'Lu', name: 'Lutetium', mass: '174.97', color: '#9b59b6' },
      { num: 23, sym: 'V', name: 'Vanadium', mass: '50.94', color: '#e91e63' }
    ],
    [
      { num: 39, sym: 'Y', name: 'Yttrium', mass: '88.91', color: '#3498db' },
      { num: 8, sym: 'O', name: 'Oxygen', mass: '15.999', color: '#1abc9c' },
      { num: 92, sym: 'U', name: 'Uranium', mass: '238.03', color: '#f39c12' }
    ],
    [
      { num: 9, sym: 'F', name: 'Fluorine', mass: '18.998', color: '#e67e22' },
      { num: 8, sym: 'O', name: 'Oxygen', mass: '15.999', color: '#1abc9c' },
      { num: 75, sym: 'Re', name: 'Rhenium', mass: '186.21', color: '#8e44ad' },
      { num: 23, sym: 'V', name: 'Vanadium', mass: '50.94', color: '#e91e63' },
      { num: 68, sym: 'Er', name: 'Erbium', mass: '167.26', color: '#d81b60' }
    ]
  ];

  const tileW = 125;
  const tileH = 135;
  const startY = 175;
  const rowSpacing = 155;

  rows.forEach((row, rIdx) => {
    const totalRowW = row.length * tileW + (row.length - 1) * 20;
    const startX = (canvas.width - totalRowW) / 2;
    const y = startY + rIdx * rowSpacing;

    row.forEach((elem, cIdx) => {
      const x = startX + cIdx * (tileW + 20);

      // Tile background shadow & fill
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y, tileW, tileH);
      ctx.restore();

      // Colored top accent line
      ctx.fillStyle = elem.color;
      ctx.fillRect(x, y, tileW, 8);

      // Tile border
      ctx.strokeStyle = elem.color;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x, y, tileW, tileH);

      // Element number (top left)
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(elem.num.toString(), x + 12, y + 32);

      // Atomic mass (top right)
      ctx.fillStyle = '#777777';
      ctx.font = '14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(elem.mass, x + tileW - 10, y + 30);

      // Element symbol (huge in center)
      ctx.fillStyle = elem.color;
      ctx.font = 'bold 48px "Playfair Display", serif';
      ctx.textAlign = 'center';
      ctx.fillText(elem.sym, x + tileW / 2, y + 85);

      // Element full name (bottom center)
      ctx.fillStyle = '#555555';
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(elem.name, x + tileW / 2, y + 115);

      // Little heart doodle
      ctx.font = '14px serif';
      ctx.fillText('♡', x + tileW - 16, y + tileH - 12);
    });
  });

  // Footer caption in Kumkum's handwriting
  ctx.fillStyle = '#e91e63';
  ctx.font = 'bold 38px "Caveat", cursive';
  ctx.textAlign = 'center';
  ctx.fillText('I LuV YOU FO ReVEr ♡', 600, 835);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

// 4. Gatefold Birthday Card Exterior (Left & Right doors with "HAPPY BIRTH Day" + pink cake seam)
export function createGatefoldDoorsTexture(doorSide = 'left') {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');

  // Kraft / Textured card exterior
  ctx.fillStyle = '#f7eedd';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Washi tape accent strips
  ctx.fillStyle = 'rgba(230, 190, 150, 0.4)';
  ctx.fillRect(20, 20, 120, 35);
  ctx.fillRect(canvas.width - 140, canvas.height - 55, 120, 35);

  // Deckled border
  ctx.strokeStyle = '#d4c1a7';
  ctx.lineWidth = 6;
  ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

  // Ransom-style cutout letters for "HAPPY BIRTH Day"
  function drawRansomTile(text, x, y, bgCol, textCol, rot = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    ctx.fillStyle = bgCol;
    ctx.fillRect(-35, -45, 70, 90);

    ctx.fillStyle = textCol;
    ctx.font = 'bold 54px "Plus Jakarta Sans", Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  if (doorSide === 'left') {
    // Left Door shows: "HAPPY" + "BIR" + Left half of pink heart cake + "~ Cut"
    drawRansomTile('H', 120, 180, '#2c3e50', '#ffffff', -0.05);
    drawRansomTile('A', 210, 175, '#e74c3c', '#ffffff', 0.04);
    drawRansomTile('P', 300, 185, '#f39c12', '#2c3e50', -0.03);
    drawRansomTile('P', 390, 175, '#27ae60', '#ffffff', 0.06);
    drawRansomTile('Y', 480, 185, '#8e44ad', '#ffffff', -0.04);

    drawRansomTile('B', 200, 310, '#e91e63', '#ffffff', 0.05);
    drawRansomTile('I', 290, 305, '#34495e', '#ffffff', -0.06);
    drawRansomTile('R', 380, 315, '#d35400', '#ffffff', 0.04);

    // Left Half of Cake at right edge (x = 600)
    ctx.save();
    ctx.translate(600, 600);
    // Cake base
    ctx.fillStyle = '#ff80ab';
    ctx.beginPath();
    ctx.ellipse(0, 60, 220, 90, 0, Math.PI * 0.5, Math.PI * 1.5);
    ctx.lineTo(0, -60);
    ctx.ellipse(0, -60, 220, 90, 0, Math.PI * 1.5, Math.PI * 0.5, true);
    ctx.closePath();
    ctx.fill();

    // Frosting waves
    ctx.fillStyle = '#ff4081';
    ctx.fillRect(-220, -5, 220, 15);

    // Left half of top candle & flame
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(0, -170, 18, Math.PI * 0.5, Math.PI * 1.5);
    ctx.fill();
    ctx.restore();

    // Label: "~ Cut the"
    ctx.fillStyle = '#e91e63';
    ctx.font = 'bold 38px "Caveat", cursive';
    ctx.textAlign = 'right';
    ctx.fillText('~ Cut the ', 570, 780);

    // Arrow pointing to center
    ctx.strokeStyle = '#e91e63';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(350, 770);
    ctx.lineTo(550, 770);
    ctx.stroke();
  } else {
    // Right Door shows: "TH" + "Day" + Right half of pink heart cake + "cake ~"
    drawRansomTile('T', 120, 310, '#16a085', '#ffffff', -0.04);
    drawRansomTile('H', 210, 315, '#c0392b', '#ffffff', 0.05);

    drawRansomTile('D', 180, 440, '#2980b9', '#ffffff', 0.03);
    drawRansomTile('a', 270, 435, '#8e44ad', '#ffffff', -0.05);
    drawRansomTile('y', 360, 445, '#e67e22', '#ffffff', 0.06);

    // Right Half of Cake at left edge (x = 0)
    ctx.save();
    ctx.translate(0, 600);
    // Cake base
    ctx.fillStyle = '#ff80ab';
    ctx.beginPath();
    ctx.ellipse(0, 60, 220, 90, 0, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.lineTo(0, -60);
    ctx.ellipse(0, -60, 220, 90, 0, Math.PI * 0.5, -Math.PI * 0.5, true);
    ctx.closePath();
    ctx.fill();

    // Frosting waves
    ctx.fillStyle = '#ff4081';
    ctx.fillRect(0, -5, 220, 15);

    // Right half of top candle & flame
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(0, -170, 18, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.fill();
    ctx.restore();

    // Label: "cake ~"
    ctx.fillStyle = '#e91e63';
    ctx.font = 'bold 38px "Caveat", cursive';
    ctx.textAlign = 'left';
    ctx.fillText(' cake ~', 30, 780);

    // Cute sticker stars
    ctx.font = '32px serif';
    ctx.fillText('⭐', 460, 260);
    ctx.fillText('🎂', 440, 720);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

// 5. Gatefold Birthday Card Interior (Red gingham, September 29 heart calendar, Kumkum's note, cute stickers)
export async function createGatefoldInteriorTexture(partyGhostImg, bearImg) {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');

  // Red and white gingham pattern background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gridSize = 40;
  for (let x = 0; x < canvas.width; x += gridSize) {
    for (let y = 0; y < canvas.height; y += gridSize) {
      if ((x / gridSize + y / gridSize) % 2 === 0) {
        ctx.fillStyle = 'rgba(235, 87, 87, 0.22)';
        ctx.fillRect(x, y, gridSize, gridSize);
      }
    }
  }

  // Left Panel: September 29 Calendar with heart
  ctx.save();
  ctx.translate(100, 120);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
  ctx.shadowBlur = 12;
  ctx.fillRect(0, 0, 360, 520);

  // Calendar Header
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(0, 0, 360, 80);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SEPTEMBER 2026', 180, 52);

  // Day names
  ctx.fillStyle = '#777';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  days.forEach((d, i) => {
    ctx.fillText(d, 35 + i * 48, 120);
  });

  // Calendar dates
  ctx.font = '18px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#333';
  let dayNum = 1;
  const startDay = 2; // Tuesday
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 7; col++) {
      if (row === 0 && col < startDay) continue;
      if (dayNum > 30) break;
      const dx = 35 + col * 48;
      const dy = 165 + row * 65;

      if (dayNum === 29) {
        // Circled in red heart!
        ctx.save();
        ctx.strokeStyle = '#e91e63';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.ellipse(dx, dy - 6, 22, 24, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#e91e63';
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(dayNum.toString(), dx, dy);
        ctx.font = 'bold 14px "Caveat", cursive';
        ctx.fillText('HIS DAY! ♡', dx, dy + 22);
        ctx.restore();
      } else {
        ctx.fillText(dayNum.toString(), dx, dy);
      }
      dayNum++;
    }
  }

  // Draw party ghost if available
  if (partyGhostImg) {
    ctx.drawImage(partyGhostImg, 30, 550, 240, 240);
  } else {
    ctx.font = '60px serif';
    ctx.fillText('👻🎂', 120, 680);
  }
  ctx.restore();

  // Center Panel: Brown Polka-Dot Frame with Kumkum's Birthday Note
  ctx.save();
  ctx.translate(520, 100);
  // Outer brown polka dot frame
  ctx.fillStyle = '#5d4037';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 15;
  ctx.fillRect(0, 0, 560, 800);

  // Polka dots
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let px = 15; px < 560; px += 35) {
    for (let py = 15; py < 800; py += 35) {
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Cream Inner Parchment for Message
  ctx.fillStyle = '#fffcf5';
  ctx.fillRect(35, 35, 490, 730);

  // Kumkum's Handwritten Message
  ctx.fillStyle = '#2c221e';
  ctx.font = 'bold 44px "Caveat", cursive';
  ctx.textAlign = 'center';
  ctx.fillText('Happy Birthday! 🎂♡', 280, 95);

  ctx.font = '27px "Indie Flower", cursive';
  ctx.textAlign = 'left';
  const lines = [
    'I still don’t know how to explain',
    'how unexpected it was to have you',
    'in my life, and somehow you becoming',
    'such an important part of my life was',
    'even more unexpected!',
    '',
    'I love the way you talk,',
    'the way you solve problems,',
    'and also the way you shy... 🙈',
    '',
    'So yeah... happy birthday to someone',
    '(Shaizan) ♡ who became special to me',
    'without me even realising it.',
    '',
    "I'm really lucky to have you!",
    '',
    '~ Kumkum ♡'
  ];

  let textY = 155;
  lines.forEach((line) => {
    if (line.includes('Shaizan')) {
      ctx.fillStyle = '#e91e63';
      ctx.font = 'bold 30px "Caveat", cursive';
    } else if (line.includes('Kumkum')) {
      ctx.fillStyle = '#d81b60';
      ctx.font = 'bold 36px "Caveat", cursive';
    } else {
      ctx.fillStyle = '#3e2e28';
      ctx.font = '26px "Indie Flower", cursive';
    }
    ctx.fillText(line, 60, textY);
    textY += 34;
  });
  ctx.restore();

  // Right Panel: Cute stickers, gifts, and bear
  ctx.save();
  ctx.translate(1140, 120);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
  ctx.shadowBlur = 12;
  ctx.fillRect(0, 0, 360, 760);

  // Washi tape
  ctx.fillStyle = 'rgba(255, 182, 193, 0.7)';
  ctx.fillRect(80, 10, 200, 35);

  ctx.fillStyle = '#2d2424';
  ctx.font = 'bold 34px "Caveat", cursive';
  ctx.textAlign = 'center';
  ctx.fillText('Our Keepsakes ✨', 180, 90);

  if (bearImg) {
    ctx.drawImage(bearImg, 40, 130, 280, 280);
  } else {
    ctx.font = '80px serif';
    ctx.fillText('🐻💕', 180, 280);
  }

  // Cute Polaroid box at bottom of right panel
  ctx.fillStyle = '#fdfaf5';
  ctx.strokeStyle = '#e0d2c3';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 440, 300, 280);
  ctx.fillRect(30, 440, 300, 280);

  ctx.font = '54px serif';
  ctx.fillText('🎁 🐚 💫', 180, 560);
  ctx.font = '24px "Caveat", cursive';
  ctx.fillStyle = '#6d5a52';
  ctx.fillText('Little treasures from September', 180, 630);
  ctx.fillText('that started everything.', 180, 665);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

// 6. Operation Kingdom of Joy Dossier Folder Texture
export async function createDossierTexture(dossierImg) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');

  if (dossierImg) {
    ctx.drawImage(dossierImg, 0, 0, canvas.width, canvas.height);
  } else {
    // Rich Kraft paper
    ctx.fillStyle = '#bfa17c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Red Rubber Stamp: TOP SECRET
  ctx.save();
  ctx.translate(600, 220);
  ctx.rotate(-0.06);

  ctx.strokeStyle = '#b71c1c';
  ctx.lineWidth = 9;
  ctx.strokeRect(-360, -70, 720, 140);

  ctx.fillStyle = 'rgba(183, 28, 28, 0.88)';
  ctx.font = '900 68px "Plus Jakarta Sans", Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TOP SECRET // CONFIDENTIAL', 0, 0);
  ctx.restore();

  // Operation Title
  ctx.save();
  ctx.fillStyle = '#2e1c0c';
  ctx.font = 'bold 50px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('OPERATION: KINGDOM OF JOY', 600, 380);

  ctx.font = 'bold 28px "Courier New", monospace';
  ctx.fillStyle = '#4a331f';
  ctx.fillText('AGENT CODENAME: SHAIZAN  |  TARGET: KUMKUM', 600, 435);
  ctx.fillText('STATUS: BRIDGE ACTIVATED (AGENT ZUNAIRA)', 600, 475);

  // Handwritten dossier notes
  ctx.font = '34px "Caveat", cursive';
  ctx.fillStyle = '#1b120c';
  ctx.textAlign = 'center';
  ctx.fillText('"Because of my chaotic teasing, you had me blocked.', 600, 560);
  ctx.fillText("I couldn't just barge in—I had to use my brain and play the long game.\"", 600, 605);

  ctx.fillStyle = '#8e1b1b';
  ctx.font = 'bold 36px "Caveat", cursive';
  ctx.fillText('MISSION DIRECTIVE: Step by step, with patience and care. ♡', 600, 690);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

// 7. Accordion Letter & Confessions Texture
export async function createAccordionLetterTexture(stampHeartImg, stampEiffelImg, butterflyImg) {
  const canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');

  // Crisp fine white stationery with fold lines
  ctx.fillStyle = '#fdfdfb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw 3 horizontal fold creases
  [400, 800, 1200].forEach((y) => {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y + 2);
    ctx.lineTo(canvas.width, y + 2);
    ctx.stroke();
  });

  // Stamp Heart at top right
  if (stampHeartImg) {
    ctx.drawImage(stampHeartImg, 760, 40, 180, 220);
  }
  if (stampEiffelImg) {
    ctx.drawImage(stampEiffelImg, 760, 280, 180, 220);
  }
  if (butterflyImg) {
    ctx.drawImage(butterflyImg, 740, 720, 220, 220);
  }

  // Kumkum's actual letter text
  ctx.fillStyle = '#23201d';
  ctx.font = '32px "Indie Flower", cursive';
  ctx.textAlign = 'left';

  const paragraphs = [
    'Dear you,',
    '',
    "Honestly, I don't even know where to begin because",
    'sometimes I feel like I have so many things to say to you,',
    'but when it actually comes to putting them into words,',
    'I have nothing. Maybe that’s why I just want to spend',
    'more and more time with you.',
    '',
    'I don’t always need a reason or a conversation.',
    'I just want your presence.',
    '',
    'You have somehow become such a beautiful part of my thoughts',
    'and my dreams. I catch myself imagining little moments with you.',
    'Sometimes I even dream about hugging you and holding you so tightly',
    "that I wouldn't want to let go...",
    '',
    'And yes, maybe I’m a little obsessed with you.',
    "But I think it's because I'm in love with you.",
    'I really, really love you...',
    '',
    '--- (Fold 2: Vulnerability) ---',
    '',
    "Sometimes I wonder if I'm even worthy of having someone like you",
    'because I can be boring, awkward, or unsure of myself.',
    'Please never take my feelings for granted or misuse the trust',
    "I'm giving you. I'm being completely honest and vulnerable with you...",
    '',
    'I just hope you’ll always be genuine with me and never make me',
    'regret being this honest about how I feel.',
    '',
    '~ Kumkum ♡'
  ];

  let textY = 100;
  paragraphs.forEach((p) => {
    if (p.includes('worthy') || p.includes('trust')) {
      ctx.fillStyle = '#b71c1c';
      ctx.font = 'bold 31px "Caveat", cursive';
    } else if (p.includes('dream about hugging you') || p.includes('obsessed with you')) {
      ctx.fillStyle = '#e91e63';
      ctx.font = 'bold 32px "Caveat", cursive';
    } else if (p.startsWith('---')) {
      ctx.fillStyle = '#9e9e9e';
      ctx.font = '22px "Plus Jakarta Sans", sans-serif';
    } else {
      ctx.fillStyle = '#2c221e';
      ctx.font = '30px "Indie Flower", cursive';
    }
    ctx.fillText(p, 70, textY);
    textY += 46;
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

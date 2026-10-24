import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { romanticAudio } from './audio.js';
import { UNCUT_STORY, CARDS_DATA } from './storyData.js';
import chatData from './chat-data.json';
import { createMemoryMuseum } from './memory-museum.js';

const $ = (s) => document.querySelector(s);
const TH = THREE;

// Ensure Caveat font is loaded
Promise.all([
  document.fonts.load('500 30px Caveat'),
  document.fonts.load('700 30px Caveat')
]).catch(() => {}).then(() => {
  initApp();
});

function initApp() {
  const canvas = $('#c');
  const R = new TH.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  R.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  R.outputColorSpace = TH.SRGBColorSpace;

  const S = new TH.Scene();
  const cam = new TH.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 240);

  S.background = new TH.Color('#FEFBF6');
  // Extended fog distance to keep upcoming nodes visible on the horizon (Issue 1)
  S.fog = new TH.Fog('#FEFBF6', 8, 68);

  const allCards = [];
  const allStrings = [];
  let gate = null;
  let ev = null;
  let tEnd = null;
  let tulipHalo = null;
  let polaroidMeshes = [];
  let skyBackdrop = null;
  let cloudLeft = null;
  let cloudRight = null;
  let cloudCenter = null;
  let morningBackdrop = null;
  let cloudIntroLeft = null;
  let cloudIntroRight = null;
  let cloudIntroCenter = null;
  let tulipHeroGroup = null;

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    R.setSize(w, h);
    const aspect = w / h;
    cam.aspect = aspect;

    // Responsive FOV: wide enough on mobile so camera captures cards without clipping
    if (aspect < 1.0) {
      cam.fov = Math.min(84, Math.max(60, 60 / Math.pow(aspect, 0.55)));
    } else {
      cam.fov = 58;
    }
    cam.updateProjectionMatrix();

    // Responsive horizontal distance and card scaling
    // On mobile, keep cards closer to camera track so they are centered, unobstructed and never cropped!
    const isMobile = aspect < 0.85;
    const sideDist = isMobile ? 1.05 : (aspect < 1.1 ? 1.65 : 2.6);
    const cardScale = isMobile ? 0.75 : 1.0;
    const rotAmount = isMobile ? 0.08 : 0.35;

    allCards.forEach((m) => {
      const u = m.userData;
      if (!u || u.side === undefined) return;
      const p = at(u.z);
      m.position.x = p.x + u.side * sideDist;
      m.position.y = p.y + (u.relY || 0) * (isMobile ? 0.85 : 1.0);
      u.y0 = m.position.y;
      m.rotation.y = -u.side * rotAmount;
      m.scale.set(cardScale, cardScale, 1);
    });

    if (gate) {
      const gs = isMobile ? 0.78 : 1.0;
      gate.scale.set(gs, gs, 1);
    }

    // Responsive layout for Finale (Scene 6: Romantic Letter centered over purple clouds)
    if (ev) {
      if (isMobile) {
        ev.position.set(0, 0, -183);
        ev.scale.set(0.85, 0.85, 1);
        if (cloudCenter) cloudCenter.position.set(0, -2.8, -184.2);
      } else {
        ev.position.set(0, 0, -183);
        ev.scale.set(1.0, 1.0, 1);
        if (cloudCenter) cloudCenter.position.set(0, -2.6, -184.2);
      }
      ev.userData.y0 = ev.position.y;
    }

    if (tulipHeroGroup) {
      const ts = isMobile ? 0.82 : 1.0;
      tulipHeroGroup.scale.set(ts, ts, 1);
      if (cloudIntroCenter) {
        cloudIntroCenter.position.set(0, isMobile ? -2.9 : -2.6, 3.2);
        cloudIntroCenter.userData.y0 = cloudIntroCenter.position.y;
      }
    }

    allStrings.forEach((fn) => fn());
  };
  window.addEventListener('resize', resize);

  // Texture loader helper
  const texLoader = new TH.TextureLoader();
  const loadTex = (url) => {
    const t = texLoader.load(url);
    t.colorSpace = TH.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  };

  // Pre-load transparent real photo keepsakes
  const realTextures = {
    tulip: loadTex('/assets/real/nobg/real_tulip_portal.png'),
    flork: loadTex('/assets/real/nobg/real_flork_brain.png'),
    periodic: loadTex('/assets/real/nobg/real_periodic_table.png'),
    gatefoldExterior: loadTex('/assets/real/nobg/real_gatefold_exterior.png'),
    gatefoldInterior: loadTex('/assets/real/nobg/real_gatefold_interior.png'),
    kisses: loadTex('/assets/real/nobg/real_lipstick_kisses.png'),
    accordionTop: loadTex('/assets/real/nobg/real_accordion_top.png'),
    accordionBottom: loadTex('/assets/real/nobg/real_accordion_bottom.png'),
    parchment: loadTex('/assets/real/nobg/real_parchment_letter.png'),
    carnivalTicket: loadTex('/assets/ticket_carnival.png'),
    bunny: loadTex('/assets/sticker_bunny.png'),
    hairClaw: loadTex('/assets/sticker_hair_claw.png'),
    stampSecret: loadTex('/assets/stamp_top_secret.png'),
    starMetallic: loadTex('/assets/star_metallic.png'),
    romanticEnvelope: loadTex('/assets/envelope_romantic.png'),
    cloudSky: loadTex('/assets/lavender_sky_panoramic.png'),
    cloudCutout: loadTex('/assets/lavender_clouds_cutout.png'),
    lavenderClouds: loadTex('/assets/lavender_clouds_cutout.png'),
    lavenderSky: loadTex('/assets/lavender_sky_panoramic.png'),
    chatMenace: loadTex('/assets/chat_card_menace.png'),
    chatLatenight: loadTex('/assets/chat_card_latenight.png'),
    morningSky: loadTex('/assets/morning_sky_panoramic.png'),
    morningClouds: loadTex('/assets/cream_cloud_cutout.png'),
    tulipFrame: loadTex('/assets/tulip_hero_frame.png'),
    tulipPetal: loadTex('/assets/tulip_petal.png'),
    sapphireSky: loadTex('/assets/sapphire_sky_panoramic.png'),
    sapphireArch: loadTex('/assets/sapphire_cosmic_arch.png')
  };

  // Real Moments Polaroid Textures (Downloaded photos & dance video)
  const momentTex = [1, 2, 3, 4, 5, 6, 7].map((num) => loadTex(`/assets/moments/polaroid_${num}.png`));

  const MOMENTS_CARDS = [
    {
      title: 'Our Dance Moment 🎥',
      text: 'A glimpse of you moving with that effortless joy and contagious laughter... Every second with you feels like pure magic.',
      realPhoto: '/assets/moments/moment_4.jpg',
      video: '/assets/moments/moment_video.mp4'
    },
    {
      title: 'Prettiest in the Universe ✨',
      text: 'From the golden sunlight on your face to the calm in your eyes, you became the definition of perfection in my eyes.',
      realPhoto: '/assets/moments/moment_5.jpg'
    },
    {
      title: 'Traditional Grace 🌸',
      text: 'That stunning grace when you wear a saree, carrying an elegance that completely takes my breath away.',
      realPhoto: '/assets/moments/moment_6.jpg'
    },
    {
      title: 'Those Eyes & Cheeks 🌷',
      text: 'Those long dark eyelashes and cute cheeks that first made me notice you... and made my heart skip forever.',
      realPhoto: '/assets/moments/moment_3.jpg'
    },
    {
      title: 'Sweetest Smile ☀️',
      text: 'A smile so bright it could illuminate the darkest night in our little universe.',
      realPhoto: '/assets/moments/moment_7.jpg'
    },
    {
      title: 'Dancing Under Starlight 💫',
      text: 'Lost in the rhythm, celebrating every spark of life together.',
      realPhoto: '/assets/moments/moment_2.jpg',
      video: '/assets/moments/moment_video.mp4'
    },
    {
      title: 'Festive Joy 🎆',
      text: 'That genuine, radiant happiness you bring into every room you walk into.',
      realPhoto: '/assets/moments/moment_1.jpg'
    }
  ];

  // Camera Spline Path through the 6 Scenes
  const curve = new TH.CatmullRomCurve3([
    [0, 0, 14],
    [1, 0.5, -20],
    [-1, -0.5, -55],
    [1.2, 0.5, -90],
    [-1.2, 0, -125],
    [0.6, 0.4, -160],
    [0, 0, -190]
  ].map((a) => new TH.Vector3(...a)));

  const at = (z) => curve.getPointAt(Math.min(1, Math.max(0, (14 - z) / 204)));

  // Helper to create 2D canvas textures
  const mk = (w, h, f) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    f(c.getContext('2d'), w, h);
    const t = new TH.CanvasTexture(c);
    t.colorSpace = TH.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  };

  const wrap = (ctx, text, maxWidth) => {
    const lines = [];
    text.split('\n').forEach((para) => {
      let line = '';
      para.split(' ').forEach((word) => {
        const testLine = line ? line + ' ' + word : word;
        if (ctx.measureText(testLine).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = testLine;
        }
      });
      lines.push(line);
    });
    return lines;
  };

  const PAL = {
    paper: ['#FEFBF6', '#3D3C42'],    // Cream paper with dark charcoal ink
    kraft: ['#e4f1f8', '#3D3C42'],    // Soft sky tint paper with charcoal ink
    parch: ['#FEFBF6', '#7F5283'],    // Cream paper with romantic mauve plum ink
    pink: ['#eedfed', '#3D3C42'],     // Soft mauve tint with charcoal ink
    night: ['#3D3C42', '#FEFBF6'],    // Deep charcoal slate with cream ink
    gold: ['#FEFBF6', '#7F5283'],     // Cream paper with plum ink
    sky: ['#A6D1E6', '#3D3C42'],      // Sky blue card with charcoal ink
    plum: ['#7F5283', '#FEFBF6']      // Mauve plum card with cream ink
  };

  const note = (text, style = 'paper', title = '') =>
    mk(1024, 704, (ctx, w, h) => {
      const [bgCol, inkCol] = PAL[style] || PAL.paper;
      ctx.fillStyle = bgCol;
      ctx.fillRect(0, 0, w, h);
      for (let k = 0; k < 600; k++) {
        ctx.fillStyle = `rgba(61,60,66,${Math.random() * 0.05})`;
        ctx.fillRect(Math.random() * w, Math.random() * h, 3, 3);
      }
      ctx.fillStyle = inkCol;
      ctx.textBaseline = 'top';
      let y0 = 48;
      if (title) {
        ctx.font = '700 44px Caveat';
        ctx.fillText(title, 48, 24);
        y0 = 92;
      }
      for (let s = 62; s >= 24; s -= 2) {
        ctx.font = `600 ${s}px Caveat`;
        const lines = wrap(ctx, text, w - 96);
        if (lines.length * s * 1.15 <= h - y0 - 48 || s <= 24) {
          lines.forEach((l, k) => ctx.fillText(l, 48, y0 + k * s * 1.15));
          break;
        }
      }
      // Issue 4: Clear affordance icon & signifier of interactivity
      ctx.font = '600 24px Caveat';
      ctx.fillStyle = 'rgba(61, 60, 66, 0.45)';
      ctx.textAlign = 'right';
      ctx.fillText('Tap to read 📖', w - 48, h - 32);
      ctx.textAlign = 'left';

      // Issue 15: Authentic torn-paper washi tape with ragged deckled edges
      ctx.save();
      ctx.translate(w / 2, 8);
      ctx.rotate(-0.02);
      ctx.fillStyle = 'rgba(166, 209, 230, 0.85)';
      ctx.beginPath();
      const tapeW = 180;
      const tapeH = 38;
      ctx.moveTo(-tapeW / 2, -tapeH / 2);
      for (let x = -tapeW / 2; x <= tapeW / 2; x += 6) {
        ctx.lineTo(x, -tapeH / 2 + Math.sin(x * 0.4) * 1.8);
      }
      ctx.lineTo(tapeW / 2, tapeH / 2);
      for (let x = tapeW / 2; x >= -tapeW / 2; x -= 6) {
        ctx.lineTo(x, tapeH / 2 + Math.cos(x * 0.4) * 1.8);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

  // Romantic Wax-Sealed Envelope Canvas Texture (FEFBF6 · A6D1E6 · 7F5283 · 3D3C42)
  const envTex = mk(1024, 704, (ctx, w, h) => {
    ctx.fillStyle = '#FEFBF6';
    ctx.fillRect(0, 0, w, h);
    for (let k = 0; k < 450; k++) {
      ctx.fillStyle = `rgba(61,60,66,${Math.random() * 0.04})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }
    // Envelope flap lines in pastel sky blue
    ctx.strokeStyle = '#A6D1E6';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w / 2, h * 0.54);
    ctx.lineTo(w, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(w / 2, h * 0.54);
    ctx.lineTo(w, h);
    ctx.stroke();

    // Plum wax seal
    ctx.fillStyle = '#7F5283';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.54, 66, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#653b6a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.54, 54, 0, Math.PI * 2);
    ctx.stroke();

    // Heart on wax seal
    ctx.fillStyle = '#FEFBF6';
    ctx.font = '64px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♥', w / 2, h * 0.54 + 4);

    // Handwritten label
    ctx.fillStyle = '#3D3C42';
    ctx.font = '700 66px Caveat';
    ctx.fillText('For Kumkum ♡', w / 2, h * 0.86);
  });

  const pickable = [];
  const bobs = [];
  const STORY = [];

  // Plane creator
  const pl = (tex, w, h, x, y, z, transparent = true) => {
    const m = new TH.Mesh(
      new TH.PlaneGeometry(w, h),
      new TH.MeshBasicMaterial({ map: tex, transparent, side: TH.DoubleSide, alphaTest: 0.02 })
    );
    m.position.set(x, y, z);
    S.add(m);
    return m;
  };

  // Add keepsake to the world alternating along curve
  const add = (tex, z, side, { w = 3.2, h = 2.2, y = 0, title = '', text = '', realPhoto = null, video = null } = {}) => {
    const p = at(z);
    const m = pl(tex, w, h, p.x + side * 2.6, p.y + y, z);
    m.rotation.y = -side * 0.35;
    m.userData = {
      title,
      text,
      realPhoto,
      video,
      y0: p.y + y,
      ph: Math.random() * 6,
      z,
      side,
      relY: y,
      origW: w,
      origH: h
    };
    bobs.push(m);
    allCards.push(m);
    if (text || realPhoto || video) pickable.push(m);
    return m;
  };

  const ch = (t) => STORY.push('— ' + t + ' —');
  const n = (z, side, title, text, st, o = {}) => {
    STORY.push((title ? title + ': ' : '') + text);
    return add(note(text, st || 'paper', title), z, side, { ...o, title, text });
  };

  // 3D Red string connecting detective pins
  const str = (a, b, col) => {
    const mesh = new TH.Mesh(
      new TH.BufferGeometry(),
      new TH.MeshBasicMaterial({ color: col })
    );
    S.add(mesh);
    const updateStr = () => {
      const mid = a.position.clone().lerp(b.position, 0.5);
      mid.y -= 0.4;
      if (mesh.geometry) mesh.geometry.dispose();
      mesh.geometry = new TH.TubeGeometry(new TH.CatmullRomCurve3([a.position.clone(), mid, b.position.clone()]), 20, 0.02, 5);
    };
    updateStr();
    allStrings.push(updateStr);
  };

  // Soft-Glow Circular Particle Texture (Used across scenes)
  const circleSprite = mk(64, 64, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    g.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
    g.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
    g.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Twinkling Starlight / Morning Dust Particles
  const pts = (N, f, col, sz) => {
    const g = new TH.BufferGeometry();
    const a = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) f(a, i * 3);
    g.setAttribute('position', new TH.BufferAttribute(a, 3));
    const m = new TH.PointsMaterial({
      map: circleSprite,
      color: col,
      size: sz,
      transparent: true,
      depthWrite: false,
      alphaTest: 0.01
    });
    const pMesh = new TH.Points(g, m);
    S.add(pMesh);
    return pMesh;
  };

  // ==========================================
  // SCENE 01: The Shift (Morning Dawn Dreamscape)
  // ==========================================
  ch('The Shift');

  // Panoramic Morning Dawn Dreamscape Sky (Soft sunrise glow, light rays, morning stars)
  morningBackdrop = pl(realTextures.morningSky, 44, 22, 0, 1.2, -14);
  morningBackdrop.material.fog = false;

  // Layered 3D Painted Cream Cloud Banks framing the opening scene (using user's uploaded cream cloud)
  cloudIntroLeft = pl(realTextures.morningClouds, 9.2, 6.5, -4.6, -1.8, 3.7);
  cloudIntroLeft.userData = { y0: -1.8, ph: 0.2 };
  cloudIntroLeft.material.fog = false;
  bobs.push(cloudIntroLeft);

  cloudIntroRight = pl(realTextures.morningClouds, 9.6, 6.8, 4.6, -1.8, 3.7);
  cloudIntroRight.scale.x = -1;
  cloudIntroRight.userData = { y0: -1.8, ph: 2.2 };
  cloudIntroRight.material.fog = false;
  bobs.push(cloudIntroRight);

  cloudIntroCenter = pl(realTextures.morningClouds, 13.5, 9.6, 0, -2.6, 3.2);
  cloudIntroCenter.userData = { y0: -2.6, ph: 1.1 };
  cloudIntroCenter.material.fog = false;
  bobs.push(cloudIntroCenter);

  // Hero Watercolor Tulip Presentation Group (Deckle frame mount, gold foil, washi tapes, calligraphy plaque)
  tulipHeroGroup = new TH.Group();
  tulipHeroGroup.position.set(0, 0, 4);
  S.add(tulipHeroGroup);

  const tulipMount = pl(realTextures.tulipFrame, 5.0, 5.0, 0, 0, -0.02);
  tulipHeroGroup.add(tulipMount);

  const t1 = pl(realTextures.tulip, 4.3, 4.3, 0, 0.16, 0);
  tulipHeroGroup.add(t1);
  t1.userData = {
    title: CARDS_DATA.tulip.title,
    text: CARDS_DATA.tulip.quote,
    realPhoto: CARDS_DATA.tulip.realPhoto
  };
  pickable.push(t1);

  tulipHeroGroup.userData = { y0: 0, ph: 0 };
  bobs.push(tulipHeroGroup);

  // Soft Drifting Watercolor Tulip Petals in 3D Space
  const petalPositions = [
    { x: -3.0, y: 1.9, z: 6.8, s: 0.8, r: 0.35, ph: 1.2 },
    { x: 3.2, y: 1.5, z: 7.2, s: 0.7, r: -0.4, ph: 2.5 },
    { x: -3.5, y: -0.7, z: 5.6, s: 0.75, r: 0.8, ph: 3.1 },
    { x: 2.8, y: -1.5, z: 6.2, s: 0.85, r: -0.6, ph: 0.5 },
    { x: -1.8, y: 2.4, z: 5.0, s: 0.6, r: -0.2, ph: 4.2 },
    { x: 2.0, y: 2.6, z: 5.2, s: 0.65, r: 0.5, ph: 1.8 },
    { x: -2.4, y: -2.2, z: 4.6, s: 0.7, r: -0.7, ph: 3.8 },
    { x: 2.6, y: -2.3, z: 4.4, s: 0.75, r: 0.45, ph: 2.0 }
  ];
  petalPositions.forEach((p) => {
    const petal = pl(realTextures.tulipPetal, 1.25 * p.s, 1.75 * p.s, p.x, p.y, p.z);
    petal.rotation.z = p.r;
    petal.userData = { y0: p.y, ph: p.ph };
    bobs.push(petal);
  });

  // Soft morning sunlight sparkle dust
  pts(120, (a, i) => {
    a[i] = (Math.random() - 0.5) * 16;
    a[i + 1] = (Math.random() - 0.5) * 9;
    a[i + 2] = 3 + Math.random() * 8;
  }, 0xFFE5D9, 0.18);

  n(-3, -1, '', 'It is funny how you can know someone, see them around, and think you have them figured out—until one random day, the universe shifts on its axis and hits you with a completely different reality. That is exactly what happened the day I truly saw you.', 'paper', { y: 0.5 });
  n(-8, 1, '', 'Suddenly, I wasn’t just looking at a familiar face; I was looking at this impossibly innocent, breathtakingly cute girl, and my heart didn’t stand a chance.', 'paper');

  // Floating tags & bunny
  const tagA = n(-11, -1, '🌷 Tag A', 'Those long, dark eyelashes that seemed to hold a whole world of warmth beneath them', 'pink', { w: 2.6, h: 1.8, y: -0.6 });
  const tagB = n(-14, 1, '🌷 Tag B', 'Paired with the softest, cutest bunny-like cheeks that made me want to just stare at you forever', 'pink', { w: 2.6, h: 1.8, y: 0.6 });

  const bunnyMesh = pl(realTextures.bunny, 1.4, 1.4, 2.8, -1.0, -12);
  bobs.push(bunnyMesh);
  bunnyMesh.userData = { y0: -1.0, ph: 2, z: -12, side: 1, relY: -1.0 };
  allCards.push(bunnyMesh);

  ch('Certified Menace');

  // Celestial Sapphire Nebula Backdrop & Arches (Using user's uploaded cosmic blue)
  const sapphireSky1 = pl(realTextures.sapphireSky, 54, 26, 0, 1.8, -48);
  sapphireSky1.material.fog = false;

  const arch1 = pl(realTextures.sapphireArch, 16.0, 14.2, 0, 3.8, -26);
  arch1.material.fog = false;

  const arch2 = pl(realTextures.sapphireArch, 18.0, 16.0, 0, 4.2, -64);
  arch2.material.fog = false;

  // Golden stardust particles in the sapphire nebula
  pts(160, (a, i) => {
    a[i] = (Math.random() - 0.5) * 18;
    a[i + 1] = (Math.random() - 0.5) * 11;
    a[i + 2] = -18 - Math.random() * 55;
  }, 0xFFD700, 0.22);

  // Real Flork "Brain hai ye!" Card with transparent cutout!
  const florkCard = add(realTextures.flork, -20, -1, {
    w: 3.4,
    h: 3.8,
    y: 0.2,
    title: 'Kumkum’s Flork Card',
    text: CARDS_DATA.flork.quote,
    realPhoto: CARDS_DATA.flork.realPhoto
  });

  n(-24, 1, 'Incident Report', 'The ironic part was that I was my own worst enemy at the beginning. On the outside, I was acting like a total menace—teasing you to an insane level, enough to make you think I was just some annoying weirdo.', 'paper');

  // Clean Transparent TOP SECRET Stamp
  const stampMesh1 = pl(realTextures.stampSecret, 2.4, 1.0, -2.6, 1.4, -27);
  stampMesh1.rotation.z = -0.15;
  stampMesh1.userData = { z: -27, side: -1, relY: 1.4 };
  allCards.push(stampMesh1);

  const stampMesh2 = pl(realTextures.stampSecret, 2.4, 1.0, 2.6, -1.2, -31);
  stampMesh2.rotation.z = 0.12;
  stampMesh2.userData = { z: -31, side: 1, relY: -1.2 };
  allCards.push(stampMesh2);

  // Real Sep 6 First DM Chat Card (User Chat integration)
  const chatMenaceCard = add(realTextures.chatMenace, -29, -1, {
    w: 3.6,
    h: 2.43,
    y: -0.1,
    title: 'Sep 6 · The Very First DM 💬',
    text: 'Our actual first DM exchange on September 6, 2026! Tap to explore all 37,523 messages in our Chat Vault.'
  });
  chatMenaceCard.userData.chatVault = true;
  chatMenaceCard.userData.tab = 'milestones';

  // Hair Claw Sticker
  const clawMesh = pl(realTextures.hairClaw, 1.6, 1.6, 3.2, 1.2, -38);
  bobs.push(clawMesh);
  clawMesh.userData = { y0: 1.2, ph: 4, z: -38, side: 1, relY: 1.2 };
  allCards.push(clawMesh);

  // Sequenced notes connected with baker's twine (Issue 8)
  const sn1 = n(-35, -1, 'Secret Note 1', 'You had no idea that behind all that relentless teasing, I was quietly admiring you from afar with an intensity that scared even me.', 'gold');
  const sn2 = n(-40, 1, 'Secret Note 2 🎀', 'When you weren’t looking, my eyes were always finding you. I noticed the tiniest details nobody else paid attention to—like the exact way you wore your hair clutcher, always clipped just slightly down at the back of your head, effortless and imperfect in the most mesmerizing way.', 'gold');
  str(sn1, sn2, 0x7F5283);
  n(-45, -1, 'Secret Note 3', 'I memorized the placement of your moles, the subtle expressions that crossed your face, the quiet grace in the way you moved. I was falling harder and deeper with every passing day.', 'gold');

  // ==========================================
  // SCENE 03: Operation: Kingdom of Joy
  // ==========================================
  ch('Operation: Kingdom of Joy');
  n(-50, 1, '', 'Because of my chaotic teasing, you had me blocked. I knew I couldn’t just barge in; I had to actually use my brain and play the long game.', 'paper');
  n(-55, -1, 'TOP SECRET', '// OPERATION: KINGDOM OF JOY\nBridge Agent: Zunaira\nTarget: Kumkum’s heart', 'kraft', { h: 2.6 });

  const k1 = n(-60, 1, 'Node 01 · The Roadblock', 'Blocked. Direct approach impossible.', 'kraft');
  const k2 = n(-65, -1, 'Node 02 · The Bridge', 'Agent Zunaira — “I needed a bridge to reach your world, and that bridge was Zunaira.”', 'kraft');

  // Real Carnival Ticket with transparent ripped edges and readable scale (Issue 10)
  const ticketMesh = add(realTextures.carnivalTicket, -70, 1, {
    w: 3.8,
    h: 2.0,
    title: 'Kingdom of Joy Ticket',
    text: CARDS_DATA.dossier.quote,
    realPhoto: CARDS_DATA.dossier.realPhoto
  });

  const k4 = n(-75, -1, 'Node 04 · The Promise', 'When I finally got that line of communication open, I made a promise to myself not to rush. I took every single step gradually, with patience and care.', 'gold');

  str(k1, k2, 0x7F5283);
  str(k2, ticketMesh, 0x7F5283);
  str(ticketMesh, k4, 0xA6D1E6);

  // ==========================================
  // SCENE 04: The Late-Night Lore & Birthday Gatefold
  // ==========================================
  ch('The Late-Night Lore');
  n(-80, -1, '', 'Soon, my entire routine revolved around you. My nights were spent talking to you until the hours blurred together, and my days were spent replaying our conversations and daydreaming about the next time we would talk.', 'night');

  // Real Hand-drawn Periodic Table Card
  add(realTextures.periodic, -87, 1, {
    w: 3.4,
    h: 3.9,
    title: 'Kumkum’s Periodic Table Card',
    text: CARDS_DATA.periodic.quote,
    realPhoto: CARDS_DATA.periodic.realPhoto
  });

  // Metallic Star Sticker floating in starlight
  const starMesh = pl(realTextures.starMetallic, 1.4, 1.4, 1.8, 2.2, -86);
  bobs.push(starMesh);
  starMesh.userData = { y0: 2.2, ph: 1, z: -86, side: 1, relY: 2.2 };
  allCards.push(starMesh);

  // Real Late-Night Lore Chat Card (01:42 AM)
  const chatLatenightCard = add(realTextures.chatLatenight, -90, -1, {
    w: 3.6,
    h: 2.52,
    y: 0.1,
    title: '01:42 AM · Late-Night Lore 🌙',
    text: 'Talking until the hours blurred together... Tap to explore our late-night chats.'
  });
  chatLatenightCard.userData.chatVault = true;
  chatLatenightCard.userData.tab = 'milestones';

  n(-93, -1, '', 'And then, the best part happened—I started catching subtle signals from your side too. You became someone who makes every day brighter.', 'night', { w: 2.8, h: 2.0 });

  // 3D HINGED GATEFOLD CARD AT Z = -103
  const NOTE = CARDS_DATA.gatefold.quote;
  gate = new TH.Group();
  const gp = at(-103);
  gate.position.set(gp.x, gp.y, -103);
  S.add(gate);

  // Real Interior Backboard (Gingham, heart calendar, her message)
  const inn = pl(realTextures.gatefoldInterior, 3.6, 2.4, 0, 0, -0.02);
  gate.add(inn);
  inn.userData = {
    title: 'Kumkum’s Birthday Card',
    text: NOTE,
    realPhoto: CARDS_DATA.gatefold.realPhoto
  };
  pickable.push(inn);

  // Real Exterior Split Doors
  const createSplitDoor = (isRight) => {
    const geom = new TH.PlaneGeometry(1.8, 2.4);
    const uvs = geom.attributes.uv;
    for (let i = 0; i < uvs.count; i++) {
      const u = uvs.getX(i);
      const v = uvs.getY(i);
      uvs.setXY(i, isRight ? 0.5 + u * 0.5 : u * 0.5, v);
    }
    uvs.needsUpdate = true;
    return geom;
  };

  const doors = [-1, 1].map((s) => {
    const pv = new TH.Group();
    pv.position.x = s * 1.8;
    gate.add(pv);

    const doorGeom = createSplitDoor(s > 0);
    const doorMat = new TH.MeshBasicMaterial({
      map: realTextures.gatefoldExterior,
      transparent: true,
      side: TH.DoubleSide,
      alphaTest: 0.02
    });
    const m = new TH.Mesh(doorGeom, doorMat);
    m.position.x = -s * 0.9;
    m.userData = { cake: 1 };
    pickable.push(m);
    pv.add(m);
    return pv;
  });

  // ==========================================
  // SCENE 05: Our Little World & Morning Sanctuary
  // ==========================================
  ch('Our Little World');
  // Kumkum's Real Accordion Letter
  const hers = add(realTextures.accordionTop, -119, -1, {
    w: 2.4,
    h: 5.5,
    title: 'Kumkum’s Accordion Letter',
    text: CARDS_DATA.accordion.quote,
    realPhoto: CARDS_DATA.accordion.realPhoto
  });

  // Real Lipstick Kisses Card
  const kisses = add(realTextures.kisses, -125, 1, {
    w: 3.4,
    h: 2.5,
    title: 'Sealed With Her Kisses',
    text: CARDS_DATA.kisses.quote,
    realPhoto: CARDS_DATA.kisses.realPhoto
  });

  str(hers, kisses, 0x7F5283);

  const his = n(-129, -1, 'His reality', 'Nothing in this world compares to the feeling of meeting you in person. That height difference between us makes holding you feel like my arms were built specifically to be your safe space. And the way you hold onto me—refusing to let go, burying your face against me, sneaking closer just to breathe me in against my chest—it melts every bit of pride and toughness right out of me, leaving me completely yours.', 'gold', { h: 2.6 });
  const ca = n(-135, 1, 'The First Kiss', 'Then came our first kiss. Neither of us really knew what we were doing; we were both completely new to it, a little clumsy, and just figuring it out together. Even so, the second our lips met, a wave of pure, dizzying happiness hit me so hard the whole world felt like it was spinning.', 'gold');
  const cb = n(-141, -1, 'Our Morning Sanctuary', 'Our morning walks became our favorite sanctuary—under the excuse of taking a walk, we would find quiet moments to hold each other close, lost in endless hugs and deeper kisses.', 'gold');
  const cc = n(-146, 1, 'The Spark & No Rush', 'Every touch carries a spark that leaves me breathless... Whenever you lean in close, trace your fingers along my skin, or press close to my neck, my heart races like crazy. And honestly, there is no rush at all—we have our whole lives ahead of us to explore every chapter of being together.', 'gold');

  str(his, ca, 0xA6D1E6);
  str(ca, cb, 0x7F5283);
  str(cb, cc, 0xA6D1E6);

  // ==========================================
  // SCENE 06: The Reason Underneath It All
  // ==========================================
  ch('The Reason Underneath It All');
  // Kumkum's Real Vintage Parchment Letter
  add(realTextures.parchment, -152, 1, {
    w: 3.4,
    h: 3.8,
    title: 'Kumkum’s Parchment Letter',
    text: CARDS_DATA.parchment.quote,
    realPhoto: CARDS_DATA.parchment.realPhoto
  });

  n(-158, -1, 'Her Trust & Honesty', 'Please never take my feelings for granted or misuse the trust I’m giving you. I’m being completely honest and vulnerable with you... I just hope you’ll always be genuine with me and never make me regret being this honest about how I feel. ~ Kumkum', 'parch');

  // ==========================================
  // SCENE 06 FINALE: The Reason Underneath It All
  // ==========================================
  // Panoramic Background Lavender Dreamscape (User's pastel cotton-candy lavender clouds)
  skyBackdrop = pl(realTextures.lavenderSky, 46, 23, 0, 1.2, -196);
  skyBackdrop.material.fog = false;

  // Midground drifting lavender cloud puffs as you approach the climax
  const cloudApproach1 = pl(realTextures.lavenderClouds, 9.5, 4.9, -4.5, -1.2, -165);
  cloudApproach1.material.opacity = 0.88;
  cloudApproach1.userData = { y0: -1.2, ph: 1.8 };
  bobs.push(cloudApproach1);

  const cloudApproach2 = pl(realTextures.lavenderClouds, 9.5, 4.9, 4.5, -1.4, -174);
  cloudApproach2.scale.x = -1;
  cloudApproach2.material.opacity = 0.88;
  cloudApproach2.userData = { y0: -1.4, ph: 3.2 };
  bobs.push(cloudApproach2);

  // Layered 3D Billowy Pastel Pink & Lavender Cloud Banks cradling the letter
  cloudLeft = pl(realTextures.lavenderClouds, 13.0, 6.7, -5.6, -1.8, -183.5);
  cloudLeft.userData = { y0: -1.8, ph: 0 };
  cloudLeft.material.fog = false;
  bobs.push(cloudLeft);

  cloudRight = pl(realTextures.lavenderClouds, 13.0, 6.7, 5.6, -1.8, -183.5);
  cloudRight.scale.x = -1;
  cloudRight.userData = { y0: -1.8, ph: 2.5 };
  cloudRight.material.fog = false;
  bobs.push(cloudRight);

  cloudCenter = pl(realTextures.lavenderClouds, 17.5, 9.0, 0, -2.6, -184.2);
  cloudCenter.userData = { y0: -2.6, ph: 1.2 };
  cloudCenter.material.fog = false;
  bobs.push(cloudCenter);

  // Delicate Shimmering Rose-Gold & Lavender Finale Stardust
  pts(350, (a, i) => {
    const r = 2.0 + Math.random() * 6.5;
    const t = Math.random() * Math.PI * 2;
    a[i] = Math.cos(t) * r;
    a[i + 1] = Math.sin(t) * (r * 0.65) - 0.2;
    a[i + 2] = -176 - Math.random() * 12;
  }, 0xFFD1DC, 0.28);

  pts(250, (a, i) => {
    const r = 1.5 + Math.random() * 5.0;
    const t = Math.random() * Math.PI * 2;
    a[i] = Math.cos(t) * r;
    a[i + 1] = Math.sin(t) * (r * 0.6);
    a[i + 2] = -180 - Math.random() * 8;
  }, 0xFFD700, 0.32);

  // Romantic Wax-Sealed Letter Envelope Centered Alone as the Sacred Climax
  // (All other images removed from here per user request; only letter kept at center)
  ev = pl(realTextures.romanticEnvelope, 5.2, 3.47, 0, 0, -183);
  ev.userData = {
    env: 1,
    y0: 0,
    ph: 0.5,
    title: 'Shaizan’s Letter For Kumkum ♡'
  };
  pickable.push(ev);
  bobs.push(ev);

  // Shaizan's Full Letter Lines
  const LET = [
    'You know what’s funny, Kumkum?',
    'I started all this because I noticed your eyelashes and bunny cheeks and thought you were the prettiest girl ever. And somehow, the more I got to know you, the more I realized that wasn’t even the best part about you.',
    'In your letters, you wondered if you were worthy of me, and asked me to protect your trust. Never once question your worth. Deep down I always had a specific type—and somehow, effortlessly, you fit every single piece of it. You became the absolute definition of perfection in my eyes, and your trust is the safest thing in my hands.',
    'Above everything else—beyond how stunning you are, beyond the butterflies and the dizziness of our kisses—what makes me love you the most is the heart you put into us. The amount of effort, patience, and genuine love you pour into our relationship makes you the absolute best girlfriend in the entire universe.',
    'From that day I first noticed your eyelashes and bunny cheeks, to plotting my way through Kingdom of Joy, to holding you against my chest on early morning walks, every second with you feels like a dream I never want to wake up from.',
    'Forever yours,\n~ Shaizan ♡'
  ];
  STORY.push('The final letter:\n' + LET.join('\n\n'));

  pts(800, (a, i) => {
    a[i] = (Math.random() - 0.5) * 18;
    a[i + 1] = (Math.random() - 0.5) * 10;
    a[i + 2] = 20 - Math.random() * 215;
  }, 0xA6D1E6, 0.16);

  const starM = pts(500, (a, i) => {
    const r = 4 + Math.random() * 7;
    const t = Math.random() * 6.28;
    a[i] = Math.cos(t) * r;
    a[i + 1] = Math.sin(t) * r;
    a[i + 2] = -60 - Math.random() * 60;
  }, 0xFEFBF6, 0.22);

  // ==========================================
  // UI & MODALS
  // ==========================================
  const M = $('#m');
  const B = $('#b');
  const X = $('#x');
  const cap = $('#cap');
  const hud = $('#hud');
  const hint = $('#scroll-hint');
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightbox-img');
  const closeLightbox = $('#close-lightbox');

  const show = () => {
    M.style.display = 'flex';
    X.style.display = 'block';
  };
  const hide = () => {
    const v = B.querySelector('video');
    if (v) v.pause();
    romanticAudio.unduck();
    M.style.display = 'none';
    X.style.display = 'none';
  };

  X.onclick = hide;
  M.onclick = (e) => { if (e.target === M) hide(); };
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hide();
      lightbox.style.display = 'none';
    }
  });

  // Lightbox handlers
  closeLightbox.onclick = () => { lightbox.style.display = 'none'; };
  lightbox.onclick = (e) => { if (e.target === lightbox) lightbox.style.display = 'none'; };

  const openM = (title, text, realPhoto = null, videoSrc = null) => {
    B.innerHTML = '';
    const h = document.createElement('h3');
    h.textContent = title;
    B.appendChild(h);

    if (videoSrc) {
      romanticAudio.duck();
      const wrapDiv = document.createElement('div');
      wrapDiv.className = 'modal-video-wrap';

      const vid = document.createElement('video');
      vid.className = 'modal-video-player';
      vid.src = videoSrc;
      vid.controls = true;
      vid.autoplay = true;
      vid.playsInline = true;
      vid.loop = true;

      wrapDiv.appendChild(vid);
      B.appendChild(wrapDiv);
    } else if (realPhoto) {
      const wrapDiv = document.createElement('div');
      wrapDiv.className = 'modal-photo-wrap';
      wrapDiv.title = 'Click to zoom full-size';

      const img = document.createElement('img');
      img.src = realPhoto;
      img.alt = title;

      const tip = document.createElement('span');
      tip.className = 'zoom-tip';
      tip.textContent = '🔍 Click to zoom';

      wrapDiv.appendChild(img);
      wrapDiv.appendChild(tip);

      wrapDiv.onclick = () => {
        lightboxImg.src = realPhoto;
        lightbox.style.display = 'flex';
      };
      B.appendChild(wrapDiv);
    }

    const p = document.createElement('div');
    p.textContent = text;
    B.appendChild(p);
    show();
  };

  const openChatVault = (initialTab = 'wrapped') => {
    B.innerHTML = '';
    createMemoryMuseum(B, hide);
    show();
  };

  const openMomentsGallery = () => {
    B.innerHTML = '';
    const h = document.createElement('h3');
    h.textContent = 'Our Keepsake Photos & Dance Video 📸✨';
    B.appendChild(h);

    const desc = document.createElement('p');
    desc.textContent = 'Every captured smile, candid memory, and cute dance video from our journey together ♡';
    B.appendChild(desc);

    const vidWrap = document.createElement('div');
    vidWrap.className = 'modal-video-wrap';
    const vid = document.createElement('video');
    vid.className = 'modal-video-player';
    vid.src = '/assets/moments/moment_video.mp4';
    vid.controls = true;
    vid.autoplay = true;
    vid.playsInline = true;
    vid.loop = true;
    romanticAudio.duck();
    vidWrap.appendChild(vid);
    B.appendChild(vidWrap);

    const galleryGrid = document.createElement('div');
    galleryGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-top:16px;';

    const momentPhotos = [
      { src: '/assets/moments/moment_1.jpg', title: 'Traditional Grace 🌸' },
      { src: '/assets/moments/moment_2.jpg', title: 'Those Eyes & Cheeks 🐰' },
      { src: '/assets/moments/moment_3.jpg', title: 'Prettiest in the Universe ✨' },
      { src: '/assets/moments/moment_4.jpg', title: 'Sweetest Smile 🤍' },
      { src: '/assets/moments/moment_5.jpg', title: 'Dancing Under Starlight 🎶' },
      { src: '/assets/moments/moment_6.jpg', title: 'Golden Hour Glow ☀️' },
      { src: '/assets/moments/moment_7.jpg', title: 'Unforgettable Moment 💫' }
    ];

    momentPhotos.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'modal-photo-wrap';
      card.style.cssText = 'margin:0;cursor:pointer;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(61,60,66,0.12);transition:transform 0.2s;';
      card.title = item.title;
      card.onmouseenter = () => { card.style.transform = 'scale(1.04)'; };
      card.onmouseleave = () => { card.style.transform = 'scale(1)'; };
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.title;
      img.style.cssText = 'width:100%;height:130px;object-fit:cover;display:block;';
      card.appendChild(img);
      card.onclick = () => {
        lightboxImg.src = item.src;
        lightbox.style.display = 'flex';
      };
      galleryGrid.appendChild(card);
    });
    B.appendChild(galleryGrid);

    const backRow = document.createElement('div');
    backRow.className = 'bt';
    backRow.style.marginTop = '16px';
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Back to Letter 💌';
    backBtn.onclick = openLetter;
    backRow.appendChild(backBtn);
    B.appendChild(backRow);

    show();
  };

  const openLetter = () => {
    B.innerHTML = '';
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });

    const header = document.createElement('h3');
    header.textContent = 'Shaizan’s Letter For Kumkum ♡';
    B.appendChild(header);

    LET.forEach((l, i) => {
      const p = document.createElement('p');
      p.textContent = l;
      p.style.cssText = 'opacity:0;transition:opacity 1.2s';
      B.appendChild(p);
      setTimeout(() => { p.style.opacity = '1'; }, 200 + i * 1000);
    });

    const d = document.createElement('div');
    d.className = 'bt';
    d.style.opacity = '0';

    [
      ['💬 Unlock Our 37,523 Messages Vault ✨', () => openChatVault()],
      ['Our Keepsake Photos & Dance Video 🎥', () => openMomentsGallery()],
      ['Read Our Full Uncut Story 📖', () => openM('Our Full Story', STORY.join('\n\n'))],
      ['Fly Through Our Universe Again 🌷', () => {
        hide();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }]
    ].forEach(([t, f]) => {
      const b = document.createElement('button');
      b.textContent = t;
      b.onclick = f;
      d.appendChild(b);
    });

    B.appendChild(d);
    setTimeout(() => { d.style.opacity = '1'; }, 300 + LET.length * 1100);
    show();
  };

  // Chapter Breeds
  const BR = [0, 0.15, 0.32, 0.48, 0.68, 0.85];
  const NM = ['The Shift', 'Certified Menace', 'Kingdom of Joy', 'Late-Night Lore', 'Our Sanctuary', 'Underneath It All'];
  const CAP = [
    '"Hey, Kumkum. I made you a flower." (Yes, I know. Professional artist. 🌷)',
    'Certified menace vs. the secret truth',
    'Operation: Kingdom of Joy',
    'The late-night lore & our chemistry',
    'Our little world: where your dreams meet my reality',
    'The reason underneath it all'
  ];

  const ICONS = ['🌷', '🧠', '🎟️', '🎂', '💋', '💌'];
  NM.forEach((t, i) => {
    const b = document.createElement('button');
    b.innerHTML = `${ICONS[i]}<span class="hud-label"> ${t}</span>`;
    b.title = `${i + 1}. ${t}`;
    b.onclick = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: BR[i] * maxScroll + 1, behavior: 'smooth' });
    };
    hud.appendChild(b);
  });

  // Audio button (Mia & Seb's Theme - La La Land)
  const musicBtn = $('#music-btn');
  if (musicBtn) {
    romanticAudio.subscribe((on) => {
      musicBtn.innerHTML = on ? '🎵 Mia &amp; Seb: On' : '🎵 Music: Off';
      musicBtn.classList.toggle('on', on);
      musicBtn.title = on
        ? 'Playing Mia & Seb’s Theme (La La Land) ♡ Click to Pause'
        : 'Play Mia & Seb’s Theme (La La Land) ♡';
    });

    musicBtn.onclick = (e) => {
      e.stopPropagation();
      romanticAudio.toggle();
    };

    // Auto-unlock smoothly on first user interaction (first scroll, click, or tap)
    romanticAudio.setupAutoPlayOnFirstInteraction();
  }

  // Full Story button
  const storyBtn = $('#story-btn');
  if (storyBtn) {
    storyBtn.onclick = () => {
      openM('A Little Universe Called Us', STORY.join('\n\n'));
    };
  }

  // Chat Vault button (37,523 messages time capsule)
  const chatVaultBtn = $('#chat-vault-btn');
  if (chatVaultBtn) {
    chatVaultBtn.onclick = () => {
      openChatVault('milestones');
    };
  }

  // Interaction: Raycasting with Touch + Click support
  let gOpen = false;
  let si = -1;
  let open = 0;
  let sp = 0;

  const rc = new TH.Raycaster();
  const mv = new TH.Vector2();

  const handlePick = (clientX, clientY) => {
    mv.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    rc.setFromCamera(mv, cam);
    const hit = rc.intersectObjects(pickable, true)[0];
    if (!hit) return;

    const u = hit.object.userData;
    if (u.cake) {
      gOpen = true;
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } else if (u.chatVault) {
      openChatVault(u.tab || 'milestones');
    } else if (u.env) {
      openLetter();
    } else if (u.title || u.realPhoto || u.video) {
      openM(u.title, u.text, u.realPhoto, u.video);
    }
  };

  canvas.addEventListener('click', (e) => {
    handlePick(e.clientX, e.clientY);
  });

  // Issue 4: Dynamic cursor pointer feedback when hovering interactive elements
  canvas.addEventListener('pointermove', (e) => {
    mv.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    rc.setFromCamera(mv, cam);
    const hit = rc.intersectObjects(pickable, true)[0];
    canvas.style.cursor = hit ? 'pointer' : 'default';

    // Interactive tactile hover feedback for the romantic letter
    if (ev) {
      const isHoveringEv = hit && (hit.object === ev || hit.object.userData?.env);
      const targetScale = isHoveringEv ? 1.05 : 1.0;
      ev.scale.set(targetScale, targetScale, 1);
    }

    // Interactive tactile hover feedback for the hero tulip painting
    if (tulipHeroGroup) {
      const isHoveringTulip = hit && (hit.object.parent === tulipHeroGroup || hit.object.userData?.title?.includes('flower') || hit.object.userData?.title?.includes('Tulip'));
      const baseScale = window.innerWidth < 768 ? 0.82 : 1.0;
      const targetScale = isHoveringTulip ? baseScale * 1.05 : baseScale;
      tulipHeroGroup.scale.set(targetScale, targetScale, 1);
    }
  });

  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let touchMoved = false;

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      touchMoved = false;
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      if (dx > 8 || dy > 8) {
        touchMoved = true;
      }
    }
  }, { passive: true });

  canvas.addEventListener('touchend', (e) => {
    if (!touchMoved && (Date.now() - touchStartTime < 450) && e.changedTouches.length === 1) {
      const t = e.changedTouches[0];
      handlePick(t.clientX, t.clientY);
    }
  }, { passive: true });

  // Seamless Sky & Fog Color Gradient Stops (FEFBF6 · Sapphire Blue · 7F5283 · 3D3C42)
  const stops = [
    [0.0, '#FEFBF6'],  // Scene 1: The Shift — Warm Pure Cream
    [0.18, '#133B5C'], // Scene 2: Certified Menace — Deep Celestial Sapphire Blue (from user's upload)
    [0.36, '#0B2545'], // Scene 3: Kingdom of Joy — Midnight Sapphire Cosmic Blue (from user's upload)
    [0.48, '#262D4A'], // Sapphire Blue into Romantic Twilight Plum
    [0.55, '#7F5283'], // Scene 4: The Late-Night Lore — Romantic Plum Twilight
    [0.68, '#3D3C42'], // Scene 4: Chemistry in the Starlight — Deep Charcoal Night
    [0.82, '#7F5283'], // Scene 5: Our Sanctuary — Velvet Plum Dawn
    [0.96, '#351640']  // Scene 6: Underneath It All — Pastel Lavender Twilight Dreamscape
  ].map(([p, c]) => [p, new TH.Color(c)]);

  // Smoothstep cubic interpolation (Issue 9: eliminates sharp color banding)
  const smoothstep = (min, max, value) => {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  };

  const bg = (p) => {
    for (let i = 1; i < stops.length; i++) {
      if (p <= stops[i][0] || i === stops.length - 1) {
        const a = stops[i - 1];
        const b = stops[i];
        const t = smoothstep(a[0], b[0], p);
        return a[1].clone().lerp(b[1], t);
      }
    }
    return stops[0][1];
  };

  const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  // Main Render Loop
  function loop(ms) {
    requestAnimationFrame(loop);

    const mx = document.documentElement.scrollHeight - window.innerHeight;
    const p = mx > 0 ? window.scrollY / mx : 0;

    // Smooth damping: ultra-smooth and gentle on mobile so touch swipes glide slowly
    const isMobile = window.innerWidth < 768;
    const damp = isMobile ? 0.026 : (sp > 0.68 && sp < 0.85 ? 0.035 : 0.055);
    sp += (p - sp) * damp;
    const tt = sp * 0.93;

    // Follow CatmullRom spline
    cam.position.copy(curve.getPointAt(tt));
    cam.lookAt(curve.getPointAt(Math.min(1, tt + 0.05)));

    // Subtle natural breathing roll
    cam.rotateZ(Math.sin(Math.PI * cl((sp - 0.02) / 0.12)) * 0.12);

    // Dynamic background & fog
    const c = bg(sp);
    S.background.copy(c);
    S.fog.color.copy(c);
    starM.opacity = cl(1 - Math.abs(sp - 0.66) / 0.16);

    // Update Caption & HUD Pill
    let s = 0;
    BR.forEach((b, i) => { if (sp >= b) s = i; });
    if (s !== si) {
      si = s;
      cap.style.opacity = '0';
      setTimeout(() => {
        cap.textContent = CAP[si];
        cap.style.opacity = '1';
      }, si ? 250 : 0);
      [...hud.children].forEach((b, i) => b.classList.toggle('on', i === si));
    }

    // Fade out scroll prompt as user begins scrolling
    if (hint) {
      hint.style.opacity = sp > 0.015 ? '0' : '0.95';
    }

    // 3D Gatefold Card Doors Opening
    open += ((gOpen || cam.position.z < -87 ? 1 : 0) - open) * 0.05;
    doors[0].rotation.y = -open * 2.09;
    doors[1].rotation.y = open * 2.09;

    // Gentle Bobbing Animation for all Keepsakes
    bobs.forEach((m) => {
      m.position.y = m.userData.y0 + Math.sin(ms * 0.0012 + m.userData.ph) * 0.08;
    });

    // Tulip transparency
    t1.material.opacity = cl((cam.position.z - 3) / 6 + 1);

    R.render(S, cam);
  }

  // Initial responsive layout calculation
  resize();
  loop(0);
}

import fs from 'fs';
import path from 'path';

const projectDir = process.cwd();
const srcAssetsDir = path.join(projectDir, 'asssets');
const publicDir = path.join(projectDir, 'public');
const destAssetsDir = path.join(publicDir, 'assets');
const destAsssetsDir = path.join(publicDir, 'asssets');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(publicDir);
ensureDir(destAssetsDir);
ensureDir(destAsssetsDir);

// Recursively copy directory
function copyRecursive(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy full tree to public/asssets and public/assets
copyRecursive(srcAssetsDir, destAsssetsDir);
copyRecursive(srcAssetsDir, destAssetsDir);

// Map of clean aliases to original files
const cleanAliases = {
  // Base Paper
  'paper_ripped.jpg': 'Base Paper & Scrapbook Textures/Download premium png of DIY ripped paper craft png in white simple style by Chanikarn Thongsupa about ripped paper, torn paper, torn png, ripped, and paper texture 3387339.jpg',
  'tape_masking.jpg': 'Base Paper & Scrapbook Textures/Masking Tape stock photo_ Image of electrical, band, packaging - 21062014.jpg',
  'tape_clear.jpg': 'Base Paper & Scrapbook Textures/Tape.jpg',
  'paper_textured_bg.jpg': 'Base Paper & Scrapbook Textures/bg textured paper image.jpg',
  'paper_kraft.jpg': 'Base Paper & Scrapbook Textures/pa.jpg',
  'paper_bandaid.jpg': 'Base Paper & Scrapbook Textures/paper bandade 1.jpg',
  'paper_torn_curl.jpg': 'Base Paper & Scrapbook Textures/paper cur trown 1.jpg',

  // Scene 01 & 02
  'sticker_bunny.jpg': 'Scene 01 & 02 Stickers/5 Telegram Sticker 🌟 from «Bunny» pack.jpg',
  'sticker_flork_brain.jpg': 'Scene 01 & 02 Stickers/Figurinha engraçada para whatsapp flork of cows___.jpg',
  'stamp_top_secret.jpg': 'Scene 01 & 02 Stickers/HD Top Secret Rectangle Rubber Stamp PNG.jpg',
  'sticker_hair_claw.jpg': 'Scene 01 & 02 Stickers/Pink Hair Claw Sticker Sticker.jpg',
  'doodle_arrow_stars.jpg': 'Scene 01 & 02 Stickers/arrpw nd stars .jpg',

  // Scene 03
  'dossier_secret_files.jpg': 'Scene 03 Assets/31,400+ Secret Files Stock Photos and Royalty-Free Pictures - iStock.jpg',
  'red_pushpin.jpg': 'Scene 03 Assets/Red Pin, Needle, Pin, Red PNG and Vector with Transparent Background for Free Download.jpg',
  'ticket_carnival.png': 'Scene 03 Assets/Vintage Kingdom of Joy Carnival Ticket.png',

  // Scene 04
  'star_metallic.jpg': 'Scene 04 Assets/Download premium png of PNG Shiny metallic star shape by Sasi about 3d star png, chrome star, metallic chrome, chrome texture, and silver star png 15277443.jpg',
  'sticker_party_ghost.jpg': 'Scene 04 Assets/Party Ghost Sticker.jpg',
  'starry_sky_border.jpg': 'Scene 04 Assets/Starry Night PNG Transparent, Abstract Brush Blooming Night Starry Border, Night Clipart, Brush, Bloom PNG Image For Free Download.jpg',
  'bear_hugging.jpg': 'Scene 04 Assets/bear hugging 2.jpg',
  'bear_cute_hug.jpg': 'Scene 04 Assets/bear huginf cute.jpg',
  'bear_cute.jpg': 'Scene 04 Assets/cute bear _)).jpg',
  'letters_ransom.jpg': 'Scene 04 Assets/letters_.jpg',

  // Scene 05 & 06
  'stamp_heart.jpg': 'Scene 05 & 06 Assets/asthatc heart stamp.jpg',
  'envelope_wax_seal.jpg': 'Scene 05 & 06 Assets/asthatic postcard with red wax stamp.jpg',
  'butterfly_brown.jpg': 'Scene 05 & 06 Assets/butter fly brown.jpg',
  'dried_flowers.jpg': 'Scene 05 & 06 Assets/dried flower .jpg',
  'stamp_eiffel.jpg': 'Scene 05 & 06 Assets/efflil towr stamp.jpg',
  'sun_rays_sparkle.jpg': 'Scene 05 & 06 Assets/เปล่งประกาย,เปล่งประกายโปร่งใส,ประกายแสง,เบา,รังสี,ผล,ระเบิด,แฟลช,คาน,เอฟเฟกต์แสง,แสงสีขาวเปล่งประกาย,แสงแดด,สเปกตรัมเร่าร้อน,ดวงอาทิตย์.jpg'
};

for (const [alias, relPath] of Object.entries(cleanAliases)) {
  const fullSrc = path.join(srcAssetsDir, relPath);
  if (fs.existsSync(fullSrc)) {
    fs.copyFileSync(fullSrc, path.join(destAssetsDir, alias));
    console.log(`Aliased: ${alias} -> ${relPath}`);
  } else {
    console.warn(`File not found: ${fullSrc}`);
  }
}

console.log('Assets prepared successfully!');

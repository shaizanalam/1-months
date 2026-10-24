import fs from 'fs';
import path from 'path';

const userUploadedDir = 'C:\\Users\\shahn\\.gemini\\antigravity-ide\\brain\\1d8ad736-6f7e-42f0-99c7-56572e3fb5b3\\.user_uploaded';
const targetDir = path.join(process.cwd(), 'public', 'assets', 'real');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Order of user uploads in conversation:
// Batch 1 (5 items):
// 1. media_1792843703793.jpg: Black envelope closed with pressed flower sticker
// 2. media_1792843712534.jpg: Black envelope open showing letters and kisses
// 3. media_1792843716776.jpg: Card covered in lipstick kisses ("This is for you!")
// 4. media_1792843721929.jpg: Periodic Table card ("I LuV YOU FO ReVEr")
// 5. media_1792843726649.jpg: Flork "Brain hai ye!" card
// Batch 2 (5 items):
// 6. media_1792843770052.jpg: Vintage tea-stained parchment letter ("Dear Shaizan...")
// 7. media_1792843774836.png: Accordion fold-out letter top half
// 8. media_1792843779333.png: Accordion fold-out letter bottom half
// 9. media_1792843783475.jpg: Gatefold card exterior ("HAPPY BIRTH Day ~ Cut the cake ~")
// 10. media_1792843792978.png: Gatefold card interior (Gingham, September 29 heart calendar, ghost, bear)

const fileMapping = {
  'media_1792843703793.jpg': 'real_envelope_closed.jpg',
  'media_1792843712534.jpg': 'real_envelope_open.jpg',
  'media_1792843716776.jpg': 'real_lipstick_kisses.jpg',
  'media_1792843721929.jpg': 'real_periodic_table.jpg',
  'media_1792843726649.jpg': 'real_flork_brain.jpg',
  'media_1792843770052.jpg': 'real_parchment_letter.jpg',
  'media_1792843774836.png': 'real_accordion_top.png',
  'media_1792843779333.png': 'real_accordion_bottom.png',
  'media_1792843783475.jpg': 'real_gatefold_exterior.jpg',
  'media_1792843792978.png': 'real_gatefold_interior.png'
};

for (const [srcName, destName] of Object.entries(fileMapping)) {
  const srcPath = path.join(userUploadedDir, srcName);
  const destPath = path.join(targetDir, destName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcName} -> ${destName}`);
  } else {
    console.warn(`Source not found: ${srcPath}`);
  }
}

console.log('Real assets organized successfully!');

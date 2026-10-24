const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimizeFile(filePath, maxDim = 1400) {
  try {
    const stat = fs.statSync(filePath);
    const origSize = stat.size;
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.png') return;

    const img = sharp(filePath);
    const meta = await img.metadata();

    let resizeOptions = null;
    if (meta.width > maxDim || meta.height > maxDim) {
      if (meta.width > meta.height) {
        resizeOptions = { width: maxDim };
      } else {
        resizeOptions = { height: maxDim };
      }
    }

    let pipeline = sharp(filePath);
    if (resizeOptions) {
      pipeline = pipeline.resize(resizeOptions);
    }

    const buf = await pipeline
      .png({ compressionLevel: 9, palette: true, quality: 85 })
      .toBuffer();

    if (buf.length < origSize) {
      fs.writeFileSync(filePath, buf);
      console.log(`Optimized ${path.basename(filePath)}: ${(origSize/1024).toFixed(0)}KB -> ${(buf.length/1024).toFixed(0)}KB (-${(((origSize - buf.length)/origSize)*100).toFixed(0)}%)`);
    } else {
      console.log(`Kept original ${path.basename(filePath)}`);
    }
  } catch (err) {
    console.error(`Error on ${filePath}:`, err.message);
  }
}

async function run() {
  const assetsDir = path.resolve(__dirname, '../public/assets');
  const targetFiles = [
    path.join(assetsDir, 'ticket_carnival.png'),
    path.join(assetsDir, 'star_metallic.png'),
    path.join(assetsDir, 'real/nobg/real_lipstick_kisses.png'),
    path.join(assetsDir, 'real/nobg/real_gatefold_exterior.png'),
    path.join(assetsDir, 'real/nobg/real_parchment_letter.png'),
    path.join(assetsDir, 'real/nobg/real_gatefold_interior.png'),
    path.join(assetsDir, 'real/nobg/real_flork_brain.png'),
    path.join(assetsDir, 'real/nobg/real_periodic_table.png'),
    path.join(assetsDir, 'real/nobg/real_tulip_portal.png'),
    path.join(assetsDir, 'real/nobg/real_accordion_top.png'),
    path.join(assetsDir, 'real/nobg/real_accordion_bottom.png')
  ];

  for (const f of targetFiles) {
    if (fs.existsSync(f)) {
      await optimizeFile(f);
    }
  }
}

run();

const sharp = require('sharp');

async function inspectCorners() {
  const inputPath = 'C:/Users/shahn/.gemini/antigravity-ide/brain/1d8ad736-6f7e-42f0-99c7-56572e3fb5b3/.user_uploaded/media_1792868620573.png';
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });

  for (const [name, x, y] of [
    ['Top Left (0,0)', 0, 0],
    ['Top Mid (500,0)', 500, 0],
    ['Top Right (999,0)', 999, 0],
    ['Top 300, 0', 300, 0],
    ['Top 700, 0', 700, 0],
  ]) {
    const idx = (y * info.width + x) * info.channels;
    console.log(`${name}: R=${data[idx]} G=${data[idx+1]} B=${data[idx+2]}`);
  }
}

inspectCorners();

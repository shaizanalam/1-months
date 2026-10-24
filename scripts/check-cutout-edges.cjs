const sharp = require('sharp');

async function checkEdges() {
  const { data, info } = await sharp('public/assets/lavender_clouds_cutout.png').raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  console.log('Left edge (x=0, y=200, 300, 400, 500):');
  for (const y of [200, 300, 400, 500]) {
    const idx = (y * width + 0) * channels;
    console.log(`y=${y}: A=${data[idx+3]} R=${data[idx]} G=${data[idx+1]} B=${data[idx+2]}`);
  }

  console.log('Right edge (x=999, y=200, 300, 400, 500):');
  for (const y of [200, 300, 400, 500]) {
    const idx = (y * width + (width - 1)) * channels;
    console.log(`y=${y}: A=${data[idx+3]} R=${data[idx]} G=${data[idx+1]} B=${data[idx+2]}`);
  }

  console.log('Bottom edge (y=515, x=100, 300, 500, 700, 900):');
  for (const x of [100, 300, 500, 700, 900]) {
    const idx = ((height - 1) * width + x) * channels;
    console.log(`x=${x}: A=${data[idx+3]} R=${data[idx]} G=${data[idx+1]} B=${data[idx+2]}`);
  }
}

checkEdges();

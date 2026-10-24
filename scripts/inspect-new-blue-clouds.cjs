const sharp = require('sharp');

async function inspectPixels() {
  const p1 = 'C:/Users/shahn/.gemini/antigravity-ide/brain/1d8ad736-6f7e-42f0-99c7-56572e3fb5b3/.user_uploaded/media_1792869248206.png';
  const p2 = 'C:/Users/shahn/.gemini/antigravity-ide/brain/1d8ad736-6f7e-42f0-99c7-56572e3fb5b3/.user_uploaded/media_1792869254504.png';

  const { data: d1 } = await sharp(p1).raw().toBuffer({ resolveWithObject: true });
  console.log('Watercolor Cloud (Image 1) corners:');
  console.log('Top Left (0,0):', d1[0], d1[1], d1[2], d1[3]);
  console.log('Top Right (625,0):', d1[625*4], d1[625*4+1], d1[625*4+2], d1[625*4+3]);

  const { data: d2, info: info2 } = await sharp(p2).raw().toBuffer({ resolveWithObject: true });
  console.log('Panoramic Cloud Bank (Image 2) sample points:');
  console.log('Top (500,0):', d2[500*4], d2[500*4+1], d2[500*4+2], d2[500*4+3]);
  console.log('Top (510,0):', d2[510*4], d2[510*4+1], d2[510*4+2], d2[510*4+3]);
  console.log('Bottom (500,666):', d2[(666*1000+500)*4], d2[(666*1000+500)*4+1], d2[(666*1000+500)*4+2]);
  console.log('Bottom (510,666):', d2[(666*1000+510)*4], d2[(666*1000+510)*4+1], d2[(666*1000+510)*4+2]);
}

inspectPixels();

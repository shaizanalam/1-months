import sharp from 'sharp';

const SRC = 'C:/Users/shahn/.gemini/antigravity-ide/brain/1d8ad736-6f7e-42f0-99c7-56572e3fb5b3/.user_uploaded/media_1792861203246.png';
const DEST_NOBG = 'c:/Users/shahn/OneDrive/Desktop/project/public/assets/real/nobg/real_tulip_portal.png';

async function cropTulip() {
  await sharp(SRC)
    .extract({ left: 18, top: 6, width: 450, height: 446 })
    .png({ compressionLevel: 8 })
    .toFile(DEST_NOBG);

  console.log('[OK] Cropped pristine real tulip painting without thumb!');
}

cropTulip();

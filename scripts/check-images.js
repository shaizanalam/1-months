import fs from 'fs';
import path from 'path';

// Quick script to read JPEG/PNG dimensions without heavy dependencies
function getDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  // PNG
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    return { width, height, aspect: width / height };
  }
  // JPEG
  let offset = 2;
  while (offset < buf.length) {
    if (buf[offset] !== 0xff) break;
    const marker = buf[offset + 1];
    if (marker === 0xc0 || marker === 0xc2) {
      const height = buf.readUInt16BE(offset + 5);
      const width = buf.readUInt16BE(offset + 7);
      return { width, height, aspect: width / height };
    }
    const len = buf.readUInt16BE(offset + 2);
    offset += 2 + len;
  }
  return { width: 1000, height: 1000, aspect: 1 };
}

const dir = path.join(process.cwd(), 'public', 'assets', 'real');
const files = fs.readdirSync(dir);

for (const file of files) {
  const p = path.join(dir, file);
  const dims = getDimensions(p);
  console.log(`${file}: ${dims.width}x${dims.height} (Aspect: ${dims.aspect.toFixed(3)})`);
}

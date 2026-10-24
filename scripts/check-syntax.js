// scripts/check-syntax.js
import fs from 'fs';
import * as esbuild from 'esbuild';

const files = ['./src/main.js', './src/textureGenerator.js', './src/storyData.js', './src/audio.js'];

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    esbuild.transformSync(content, { loader: 'js' });
    console.log(`✓ ${file} passed esbuild transform`);
  } catch (err) {
    console.error(`✗ ${file} failed:`, err);
  }
}

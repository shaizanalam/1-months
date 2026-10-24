// scripts/find-undeclared.js
import fs from 'fs';

const code = fs.readFileSync('./src/main.js', 'utf8');
const lines = code.split('\n');

lines.forEach((line, idx) => {
  // check for things like foo = bar inside parentheses or without let/const/var/this
  const match = line.match(/\(([^,)]+)\s*=\s*([^)]+)\)/);
  if (match) {
    console.log(`Line ${idx + 1}: ${line}`);
  }
});

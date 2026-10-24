// scripts/test-runtime.js
import fs from 'fs';

const code = fs.readFileSync('./src/main.js', 'utf8');

// Check for accidental assignments like rightDoorRightDoor
const assignments = code.match(/([a-zA-Z0-9_$]+)\s*=\s*([a-zA-Z0-9_$]+)/g);
console.log('Checking line 414:');
const lines = code.split('\n');
console.log('Line 414:', lines[413]);

const fs = require('fs');
const path = require('path');
const envPath = path.resolve(__dirname, '.env');
const buffer = fs.readFileSync(envPath);
// Convert from UTF-16LE to UTF-8
const content = buffer.toString('utf16le');
console.log('Converted content:', content);
fs.writeFileSync(envPath, content, 'utf8');
console.log('Converted .env to UTF-8');

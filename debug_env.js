const fs = require('fs');
const path = require('path');
const envPath = path.resolve(__dirname, '.env');
const buffer = fs.readFileSync(envPath);
console.log('Length:', buffer.length);
console.log('First 20 bytes:', buffer.slice(0, 20));
console.log('Content as UTF-8:', buffer.toString('utf8'));

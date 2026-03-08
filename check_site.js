const http = require('http');

function check(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      console.log(`Checking ${url} - Status: ${res.statusCode}`);
      res.resume(); // Consume response data to free up memory
      resolve();
    }).on('error', (e) => {
      console.error(`Checking ${url} - Error: ${e.message}`);
      reject(e);
    });
  });
}

async function run() {
  try {
    await check('http://localhost:3001');
    await check('http://localhost:5001/api/health');
  } catch (err) {
    process.exit(1);
  }
}

run();

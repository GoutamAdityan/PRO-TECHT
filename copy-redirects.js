const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'public', '_redirects');
const destination = path.join(__dirname, 'dist', '_redirects');

fs.copyFile(source, destination, (err) => {
  if (err) {
    console.error('Error copying _redirects file:', err);
    process.exit(1);
  }
  console.log('_redirects file copied successfully!');
});
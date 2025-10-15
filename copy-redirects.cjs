const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'public', '_redirects');
const destinationDir = path.join(__dirname, 'dist'); // Directory for destination
const destinationFile = path.join(destinationDir, '_redirects'); // Full path to destination file

console.log('Source path:', source);
console.log('Destination path:', destinationFile);

try {
  // Ensure the destination directory exists
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
    console.log('Destination directory created:', destinationDir);
  }

  fs.copyFileSync(source, destinationFile);
  console.log('_redirects file copied successfully (synchronous)!');
} catch (err) {
  console.error('Error copying _redirects file (synchronous):', err);
  process.exit(1);
}
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '..');
// Allow passing the SVG path as first CLI argument, fallback to the known filename.
const argPath = process.argv[2];
const defaultSvg = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res', 'mipmap-anydpi-v26', 'svg (1).svg');
const srcSvg = argPath ? argPath : defaultSvg;
const destDir = path.join(projectRoot, 'assets');
const destPng = path.join(destDir, 'icon-source.png');

if (!fs.existsSync(srcSvg)) {
  console.error('SVG source not found:', srcSvg);
  process.exit(1);
}
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

sharp(srcSvg)
  .png()
  .toFile(destPng)
  .then(() => console.log('Converted SVG to PNG:', destPng))
  .catch(err => { console.error('Conversion failed:', err); process.exit(1); });

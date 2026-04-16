const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
let srcImg = path.join(projectRoot, 'assets', 'icon-source.png');
const altSrc = path.join(projectRoot, 'src', 'assets', 'icon-source.png');
if (!fs.existsSync(srcImg) && fs.existsSync(altSrc)) srcImg = altSrc;
const resDir = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res');

const sizes = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };

if (!fs.existsSync(srcImg)) {
  console.error('Source image not found:', srcImg);
  process.exit(1);
}

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

async function generate() {
  for (const [k, size] of Object.entries(sizes)) {
    const folder = `mipmap-${k}`;
    const outDir = path.join(resDir, folder);
    ensureDir(outDir);
    const fg = path.join(outDir, 'ic_launcher_foreground.png');
    const lg = path.join(outDir, 'ic_launcher.png');
    const rd = path.join(outDir, 'ic_launcher_round.png');
    // Generate foreground with circular transparency but smaller than full size
    // so the adaptive background ring remains visible (reduce zoom).
    const innerFactor = 0.9;
    const innerFg = Math.round(size * innerFactor);
    const fgResizedBuf = await sharp(srcImg)
      .resize(innerFg, innerFg, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    const maskInnerFg = Buffer.from(
      `<svg width="${innerFg}" height="${innerFg}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="black"/><circle cx="${innerFg/2}" cy="${innerFg/2}" r="${innerFg/2}" fill="white"/></svg>`
    );
    const fgMasked = await sharp(fgResizedBuf).composite([{ input: maskInnerFg, blend: 'dest-in' }]).png().toBuffer();
    const canvasFg = sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } });
    await canvasFg
      .composite([{ input: fgMasked, gravity: 'center' }])
      .png()
      .toFile(fg);
    await sharp(srcImg).resize(size, size, { fit: 'contain', background: { r:255,g:255,b:255,alpha:1 } }).png().toFile(lg);
    // Avoid cropping and ensure visibility: create a white circular background
    // and center a slightly smaller image on it (no additional mask).
    // Use a reduced inner size for round icons (less zoom) so background ring shows.
    const inner = Math.round(size * 0.9);
    const resizedBuffer = await sharp(srcImg)
      .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    const maskInner = Buffer.from(
      `<svg width="${inner}" height="${inner}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="black"/><circle cx="${inner/2}" cy="${inner/2}" r="${inner/2}" fill="white"/></svg>`
    );
    const masked = await sharp(resizedBuffer).composite([{ input: maskInner, blend: 'dest-in' }]).png().toBuffer();
    // Create transparent canvas and center the circular image on it (no white background)
    const canvas = sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } });
    await canvas
      .composite([{ input: masked, gravity: 'center' }])
      .png()
      .toFile(rd);
    console.log('Generated', folder);
  }
  console.log('Done');
}

generate().catch(e => { console.error('Error', e); process.exit(1); });

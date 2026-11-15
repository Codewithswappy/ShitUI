import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public/logo/shitlogo1.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  console.log('Generating favicons from shitlogo1.svg...');

  // Also create public/favicon.svg and app/icon.svg
  fs.copyFileSync(svgPath, path.resolve('public/favicon.svg'));
  fs.copyFileSync(svgPath, path.resolve('app/icon.svg'));
  console.log('✅ Copied public/favicon.svg & app/icon.svg');

  // Generate PNG sizes
  const sizes = [
    { name: 'favicon.png', size: 96 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
  ];

  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.resolve('public', name));
    console.log(`✅ Generated public/${name} (${size}x${size})`);
  }

  // Also copy 96px favicon to app/favicon.ico or public/favicon.ico
  // A standard 48x48 PNG buffer can be placed as favicon.ico or converted
  const icoBuffer = await sharp(svgBuffer)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  fs.writeFileSync(path.resolve('public/favicon.ico'), icoBuffer);
  fs.writeFileSync(path.resolve('app/favicon.ico'), icoBuffer);
  console.log('✅ Generated public/favicon.ico & app/favicon.ico');
}

generate().catch(console.error);


const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const previewsDir = path.join(__dirname, '../public/previews');

// Candidate paths for ffmpeg
const localApp = process.env.LOCALAPPDATA || 'C:\\Users\\codew\\AppData\\Local';
const candidates = [
  path.join(localApp, 'Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe'),
  path.join(localApp, 'Microsoft/WinGet/Links/ffmpeg.exe'),
  'ffmpeg',
];

let ffmpegBin = null;
for (const c of candidates) {
  if (fs.existsSync(c)) {
    ffmpegBin = `"${c}"`;
    break;
  }
}
if (!ffmpegBin) {
  ffmpegBin = 'ffmpeg';
}

console.log('Using ffmpeg binary:', ffmpegBin);

const allFiles = fs.readdirSync(previewsDir);
const files = allFiles.filter((f) => f.endsWith('.mp4') && !f.endsWith('.temp.mp4'));

console.log(`\nFound ${files.length} MP4 files in ${previewsDir}\n`);

const summary = [];

for (const file of files) {
  const inputPath = path.join(previewsDir, file);
  const baseName = path.basename(file, '.mp4');
  const webmPath = path.join(previewsDir, `${baseName}.webm`);

  const initialSize = fs.statSync(inputPath).size;
  console.log(`Processing ${file} (${(initialSize / 1024 / 1024).toFixed(2)} MB)...`);

  // 1. Generate ultra-optimized, high-fidelity WebM (VP9, CRF 22, visually lossless)
  let webmSize = 0;
  let webmSavings = '0%';
  try {
    const cmdWebm = `${ffmpegBin} -y -i "${inputPath}" -c:v libvpx-vp9 -crf 22 -b:v 0 -an -pix_fmt yuv420p "${webmPath}"`;
    execSync(cmdWebm, { stdio: 'ignore' });
    webmSize = fs.statSync(webmPath).size;
    webmSavings = `${((1 - webmSize / initialSize) * 100).toFixed(1)}%`;
    console.log(`  ✓ WebM: ${(webmSize / 1024 / 1024).toFixed(2)} MB (${webmSavings} saved)`);
  } catch (err) {
    console.error(`  ✗ Failed WebM for ${file}:`, err.message);
  }

  // 2. Optimize MP4 in-place with +faststart and stripped audio (for instant streaming)
  let mp4Size = initialSize;
  let mp4Savings = '0%';
  try {
    const tempMp4 = path.join(previewsDir, `${baseName}.temp.mp4`);
    const cmdMp4 = `${ffmpegBin} -y -i "${inputPath}" -c:v libx264 -crf 19 -preset slow -movflags +faststart -an -pix_fmt yuv420p "${tempMp4}"`;
    execSync(cmdMp4, { stdio: 'ignore' });
    if (fs.existsSync(tempMp4)) {
      fs.unlinkSync(inputPath);
      fs.renameSync(tempMp4, inputPath);
      mp4Size = fs.statSync(inputPath).size;
      mp4Savings = `${((1 - mp4Size / initialSize) * 100).toFixed(1)}%`;
      console.log(`  ✓ MP4 (Optimized +faststart): ${(mp4Size / 1024 / 1024).toFixed(2)} MB (${mp4Savings} saved)`);
    }
  } catch (err) {
    console.error(`  ✗ Failed MP4 optimization for ${file}:`, err.message);
  }

  summary.push({
    file,
    original: `${(initialSize / 1024 / 1024).toFixed(2)} MB`,
    mp4: `${(mp4Size / 1024 / 1024).toFixed(2)} MB (${mp4Savings})`,
    webm: webmSize ? `${(webmSize / 1024 / 1024).toFixed(2)} MB (${webmSavings})` : 'N/A',
  });
  console.log('');
}

console.log('='.repeat(60));
console.log('CONVERSION SUMMARY');
console.log('='.repeat(60));
console.table(summary);

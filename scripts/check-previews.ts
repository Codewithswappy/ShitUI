import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { SHOWCASE_REGISTRY } from '../components/new-design-components/showcase.config';

interface CheckResult {
  id: string;
  posterFile: string;
  posterExists: boolean;
  posterSizeKb: number;
  posterSizeWarning: boolean;
  posterWidth?: number;
  posterHeight?: number;
  videoFile?: string;
  videoExists?: boolean;
  videoSizeMb?: number;
  videoSizeWarning?: boolean;
  videoWidth?: number;
  videoHeight?: number;
  configWidth: number;
  configHeight: number;
  configRatio: number;
  realRatio?: number;
  ratioMismatch: boolean;
  ratioDeltaPercent?: number;
  posterVsVideoMismatch: boolean;
  errors: string[];
  warnings: string[];
}

// 1. Check sharp availability
let sharp: any;
try {
  sharp = require('sharp');
} catch {
  sharp = null;
}

// 2. Check ffprobe availability
let hasFfprobe = false;
try {
  execSync('ffprobe -version', { stdio: 'ignore' });
  hasFfprobe = true;
} catch {
  hasFfprobe = false;
}

const isFixMode = process.argv.includes('--fix');

async function main() {
  console.log('🔍 Checking Showcase Previews...\n');
  if (!sharp) {
    console.warn('⚠️  sharp is not available. Image dimension checks will be limited.');
  }
  if (!hasFfprobe) {
    console.log('ℹ️  ffprobe is not available. Skipping video frame dimension checks.\n');
  }

  const results: CheckResult[] = [];
  let totalErrors = 0;
  const updatesToApply: Record<string, { width: number; height: number }> = {};

  for (const item of SHOWCASE_REGISTRY) {
    const errors: string[] = [];
    const warnings: string[] = [];

    const posterRel = item.preview.poster.replace(/^\//, '');
    const posterPath = path.resolve(process.cwd(), 'public', posterRel);
    const posterExists = fs.existsSync(posterPath);

    let posterSizeKb = 0;
    let posterSizeWarning = false;
    let posterWidth: number | undefined;
    let posterHeight: number | undefined;

    if (!posterExists) {
      errors.push(`Missing poster: /${posterRel}`);
    } else {
      const stat = fs.statSync(posterPath);
      posterSizeKb = Math.round(stat.size / 1024);
      if (posterSizeKb > 300) {
        posterSizeWarning = true;
        warnings.push(`Poster size > 300KB (${posterSizeKb}KB)`);
      }

      if (sharp) {
        try {
          const meta = await sharp(posterPath).metadata();
          posterWidth = meta.width;
          posterHeight = meta.height;
        } catch (e: any) {
          errors.push(`Failed to read poster image: ${e.message}`);
        }
      }
    }

    let videoFile: string | undefined;
    let videoExists: boolean | undefined;
    let videoSizeMb: number | undefined;
    let videoSizeWarning: boolean | undefined;
    let videoWidth: number | undefined;
    let videoHeight: number | undefined;

    if (item.preview.video) {
      videoFile = item.preview.video;
      const videoRel = item.preview.video.replace(/^\//, '');
      const videoPath = path.resolve(process.cwd(), 'public', videoRel);
      videoExists = fs.existsSync(videoPath);

      if (!videoExists) {
        errors.push(`Missing video: /${videoRel}`);
      } else {
        const stat = fs.statSync(videoPath);
        videoSizeMb = Math.round((stat.size / (1024 * 1024)) * 10) / 10;
        if (videoSizeMb > 2) {
          videoSizeWarning = true;
          warnings.push(`Video size > 2MB (${videoSizeMb}MB)`);
        }

        if (hasFfprobe) {
          try {
            const probeOut = execSync(
              `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${videoPath}"`
            )
              .toString()
              .trim();
            const [wStr, hStr] = probeOut.split('x');
            videoWidth = parseInt(wStr, 10);
            videoHeight = parseInt(hStr, 10);
          } catch {
            warnings.push('Could not probe video dimensions with ffprobe');
          }
        }
      }
    }

    const configRatio = item.preview.width / item.preview.height;
    let realRatio: number | undefined;
    let ratioMismatch = false;
    let ratioDeltaPercent: number | undefined;

    // Use video dims if present and probed, otherwise poster dims
    const primaryWidth = videoWidth ?? posterWidth;
    const primaryHeight = videoHeight ?? posterHeight;

    if (primaryWidth && primaryHeight) {
      realRatio = primaryWidth / primaryHeight;
      const delta = Math.abs(realRatio - configRatio) / configRatio;
      ratioDeltaPercent = Math.round(delta * 1000) / 10;
      if (delta > 0.01) {
        ratioMismatch = true;
        errors.push(
          `Ratio mismatch: config is ${configRatio.toFixed(3)} (${item.preview.width}x${item.preview.height}), real is ${realRatio.toFixed(3)} (${primaryWidth}x${primaryHeight}, Δ${ratioDeltaPercent}%)`
        );
      }

      if (isFixMode) {
        updatesToApply[item.id] = { width: primaryWidth, height: primaryHeight };
      }
    }

    let posterVsVideoMismatch = false;
    if (posterWidth && posterHeight && videoWidth && videoHeight) {
      const pRatio = posterWidth / posterHeight;
      const vRatio = videoWidth / videoHeight;
      const pvDelta = Math.abs(pRatio - vRatio) / pRatio;
      if (pvDelta > 0.01) {
        posterVsVideoMismatch = true;
        errors.push(
          `Poster/video ratio mismatch: poster is ${(pRatio).toFixed(3)}, video is ${(vRatio).toFixed(3)} (Δ${(pvDelta * 100).toFixed(1)}%)`
        );
      }
    }

    if (errors.length > 0) {
      totalErrors += errors.length;
    }

    results.push({
      id: item.id,
      posterFile: item.preview.poster,
      posterExists,
      posterSizeKb,
      posterSizeWarning,
      posterWidth,
      posterHeight,
      videoFile,
      videoExists,
      videoSizeMb,
      videoSizeWarning,
      videoWidth,
      videoHeight,
      configWidth: item.preview.width,
      configHeight: item.preview.height,
      configRatio,
      realRatio,
      ratioMismatch,
      ratioDeltaPercent,
      posterVsVideoMismatch,
      errors,
      warnings,
    });
  }

  // Print results table
  console.log(
    '---------------------------------------------------------------------------------------------------------'
  );
  console.log(
    '| ID                       | Config Dims | Real Dims   | Ratio Δ | Status  | Issues                        |'
  );
  console.log(
    '---------------------------------------------------------------------------------------------------------'
  );

  for (const r of results) {
    const idPad = r.id.padEnd(24).slice(0, 24);
    const configDims = `${r.configWidth}x${r.configHeight}`.padEnd(11).slice(0, 11);
    const realDims = (r.posterWidth && r.posterHeight ? `${r.posterWidth}x${r.posterHeight}` : '-')
      .padEnd(11)
      .slice(0, 11);
    const deltaStr = (r.ratioDeltaPercent !== undefined ? `${r.ratioDeltaPercent}%` : '-')
      .padEnd(7)
      .slice(0, 7);
    const status = (r.errors.length > 0 ? '❌ FAIL' : r.warnings.length > 0 ? '⚠️ WARN' : '✅ OK')
      .padEnd(7)
      .slice(0, 7);
    const issueSummary = [...r.errors, ...r.warnings].join('; ').padEnd(30).slice(0, 30);

    console.log(`| ${idPad} | ${configDims} | ${realDims} | ${deltaStr} | ${status} | ${issueSummary} |`);
  }
  console.log(
    '---------------------------------------------------------------------------------------------------------\n'
  );

  // Print details for items with issues
  const failedItems = results.filter((r) => r.errors.length > 0 || r.warnings.length > 0);
  if (failedItems.length > 0) {
    console.log('📋 Detailed Findings:');
    for (const r of failedItems) {
      console.log(`\n• [${r.id}]`);
      if (!r.posterExists) console.log(`   ❌ Missing poster: ${r.posterFile}`);
      if (r.videoFile && !r.videoExists) console.log(`   ❌ Missing video: ${r.videoFile}`);
      if (r.posterSizeWarning) console.log(`   ⚠️  Poster size warning: ${r.posterSizeKb} KB (> 300 KB)`);
      if (r.videoSizeWarning) console.log(`   ⚠️  Video size warning: ${r.videoSizeMb} MB (> 2 MB)`);
      if (r.ratioMismatch) {
        console.log(
          `   ❌ Ratio mismatch: Config is ${r.configWidth}x${r.configHeight} (${r.configRatio.toFixed(3)}), Real is ${r.posterWidth}x${r.posterHeight} (${r.realRatio?.toFixed(3)}). Δ = ${r.ratioDeltaPercent}%`
        );
      }
      if (r.posterVsVideoMismatch) {
        console.log('   ❌ Poster aspect ratio differs from video aspect ratio by > 1%');
      }
    }
    console.log('');
  }

  // Handle --fix mode
  if (isFixMode && Object.keys(updatesToApply).length > 0) {
    console.log(`🛠️  --fix enabled: Writing real dimensions back to showcase.config.tsx...`);
    const configPath = path.resolve(
      process.cwd(),
      'components/new-design-components/showcase.config.tsx'
    );
    let content = fs.readFileSync(configPath, 'utf8');

    for (const [id, dims] of Object.entries(updatesToApply)) {
      // Find block for this id and replace width and height
      const idRegex = new RegExp(
        `(id:\\s*['"]${id}['"][\\s\\S]*?preview:\\s*\\{[\\s\\S]*?width:\\s*)\\d+([\\s\\S]*?height:\\s*)\\d+`,
        'g'
      );
      content = content.replace(idRegex, `$1${dims.width}$2${dims.height}`);
    }

    fs.writeFileSync(configPath, content, 'utf8');
    console.log('✅ Updated showcase.config.tsx with real dimensions.\n');
  }

  if (totalErrors > 0) {
    console.error(`💥 Validation failed with ${totalErrors} error(s). (Missing files or ratio mismatches > 1%)`);
    process.exit(1);
  } else {
    console.log('🎉 All existing media files verified successfully!');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal check error:', err);
  process.exit(1);
});

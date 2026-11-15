'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Threshold matrices (ordered multi-level Bayer dither)
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (v) => (v + 0.5) / 16
);
const BAYER8 = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36,
  14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23,
  61, 29, 53, 21,
].map((v) => (v + 0.5) / 64);

type ShapeFn = (u: number, v: number, t: number) => boolean;

const disc =
  (r: number): ShapeFn =>
  (u, v) =>
    u * u + v * v < r * r;

const ring =
  (r: number, w: number): ShapeFn =>
  (u, v, t) => {
    const d = Math.sqrt(u * u + v * v);
    return Math.abs(d - r) < Math.max(w, t);
  };

const plus =
  (len: number, w = 0): ShapeFn =>
  (u, v, t) => {
    const h = Math.max(w, t);
    return (
      (Math.abs(u) < h && Math.abs(v) < len) ||
      (Math.abs(v) < h && Math.abs(u) < len)
    );
  };

const cross =
  (len: number, w = 0): ShapeFn =>
  (u, v, t) => {
    const h = Math.max(w, t) * 1.4;
    return (
      Math.abs(u) < len &&
      Math.abs(v) < len &&
      (Math.abs(u - v) < h || Math.abs(u + v) < h)
    );
  };

const diamond =
  (r: number): ShapeFn =>
  (u, v) =>
    Math.abs(u) + Math.abs(v) < r;

const square =
  (r: number): ShapeFn =>
  (u, v) =>
    Math.abs(u) < r && Math.abs(v) < r;

const hollowSquare =
  (r: number): ShapeFn =>
  (u, v, t) =>
    Math.max(Math.abs(u), Math.abs(v)) < r &&
    Math.max(Math.abs(u), Math.abs(v)) > r - Math.max(0.2, t * 2);

const diagonal =
  (w: number): ShapeFn =>
  (u, v, t) =>
    Math.abs(u + v) < Math.max(w, t);

const either =
  (...s: ShapeFn[]): ShapeFn =>
  (u, v, t) =>
    s.some((f) => f(u, v, t));

// Ink glyph sets, lightest to darkest
const INK_SETS: Record<string, ShapeFn[]> = {
  mixed: [
    disc(0.26),
    plus(0.6),
    cross(0.6),
    ring(0.58, 0.12),
    diamond(0.95),
    square(0.8),
  ],
  circles: [
    disc(0.2),
    disc(0.34),
    disc(0.48),
    disc(0.62),
    disc(0.76),
    disc(0.92),
  ],
  lines: [
    diagonal(0.1),
    diagonal(0.22),
    diagonal(0.36),
    diagonal(0.52),
    diagonal(0.7),
    diagonal(0.95),
  ],
  crosses: [
    plus(0.3),
    plus(0.55),
    plus(0.8),
    plus(0.85, 0.2),
    plus(0.9, 0.34),
    plus(0.95, 0.5),
  ],
};

// Trail glyph sets, faint to strong
const TRAIL_SETS: Record<string, ShapeFn[]> = {
  beads: [disc(0.22), ring(0.5, 0.12), disc(0.6), disc(0.85)],
  stars: [
    disc(0.2),
    plus(0.55),
    either(plus(0.75), cross(0.6)),
    either(plus(0.9, 0.14), cross(0.75, 0.1)),
  ],
  frames: [
    square(0.2),
    hollowSquare(0.55),
    hollowSquare(0.85),
    either(hollowSquare(0.9), square(0.4)),
  ],
};

function buildMasks(shapes: ShapeFn[], cell: number) {
  const t = 1.1 / cell;
  return shapes.map((shape) => {
    const m = new Uint8Array(cell * cell);
    for (let y = 0; y < cell; y++) {
      const v = ((y + 0.5) / cell) * 2 - 1;
      for (let x = 0; x < cell; x++) {
        const u = ((x + 0.5) / cell) * 2 - 1;
        m[y * cell + x] = shape(u, v, t) ? 1 : 0;
      }
    }
    return m;
  });
}

let colorCtx: CanvasRenderingContext2D | null = null;
function toPacked(color: string, fallback: string): number {
  if (typeof document === 'undefined') return 0xff000000;
  if (!colorCtx) {
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    colorCtx = c.getContext('2d', { willReadFrequently: true });
  }
  const ctx = colorCtx;
  if (!ctx) return 0xff000000;
  let value = color || fallback;
  const varMatch = /^var\([^,]+,\s*(.+)\)$/.exec(value.trim());
  if (varMatch) value = varMatch[1];
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = fallback;
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export interface GlyphTrailColors {
  background?: string;
  ink?: string;
  trail?: string;
}

export interface GlyphTrailTone {
  contrast?: number;
  brightness?: number;
  invert?: boolean;
}

export interface GlyphTrailConfig {
  radius?: number;
  strength?: number;
  duration?: number;
  spread?: number;
  shape?: 'beads' | 'stars' | 'frames';
  touch?: boolean;
}

export interface GlyphTrailProps {
  image?: string | { src: string };
  cellSize?: number;
  glyphs?: 'mixed' | 'circles' | 'lines' | 'crosses';
  colors?: GlyphTrailColors;
  pattern?: '8' | '4';
  tone?: GlyphTrailTone;
  trail?: GlyphTrailConfig;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function GlyphTrail({
  image,
  cellSize = 10,
  glyphs = 'mixed',
  colors,
  pattern = '8',
  tone,
  trail,
  speed = 1,
  className,
  style,
  children,
}: GlyphTrailProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(false);

  // Auto theme detection if custom colors are not fully specified
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const live = useRef({ trail, speed });
  live.current = { trail, speed };

  const src =
    typeof image === 'string'
      ? image
      : image && typeof image === 'object' && 'src' in image
      ? image.src
      : null;

  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) {
      setImgEl(null);
      return;
    }
    let mounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => mounted && setImgEl(img);
    img.onerror = () => mounted && setImgEl(null);
    img.src = src;
    return () => {
      mounted = false;
    };
  }, [src]);

  // Color defaults aware of theme
  const defaultBg = isDark ? '#0c0c0d' : '#f8fafc';
  const defaultInk = isDark ? '#3074fe' : '#3074fe';
  const defaultTrail = isDark ? '#3074fe' : '#3074fe';

  const bg = colors?.background ?? defaultBg;
  const ink = colors?.ink ?? defaultInk;
  const trailCol = colors?.trail ?? defaultTrail;

  const contrast = tone?.contrast ?? 1;
  const brightness = tone?.brightness ?? 0;
  const invert = tone?.invert ?? false;
  const trailShape = trail?.shape ?? 'stars';
  const drifting = (speed ?? 1) > 0;

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cell = Math.max(4, Math.round(cellSize || 10));
    const matrix = pattern === '4' ? BAYER4 : BAYER8;
    const mSize = pattern === '4' ? 4 : 8;
    const mMask = mSize - 1;
    const half = mSize >> 1;

    const BG = toPacked(bg, '#3074fe');
    const INK = toPacked(ink, '#3074fe');
    const TRAIL = toPacked(trailCol, '#3074fe');

    const inkMasks = buildMasks(INK_SETS[glyphs] || INK_SETS.mixed, cell);
    const trailMasks = buildMasks(
      TRAIL_SETS[trailShape] || TRAIL_SETS.stars,
      cell
    );
    const inkLevels = inkMasks.length;
    const trailLevels = trailMasks.length;

    let cols = 0;
    let rows = 0;
    let W = 0;
    let dark = new Float32Array(0);
    let field = new Float32Array(0);
    let next = new Float32Array(0);
    let imgData: ImageData | null = null;
    let buf: Uint32Array | null = null;
    let usingImage = false;
    let time = 0;

    const shape = (d: number) => {
      let v = (d - 0.5) * contrast + 0.5 - brightness;
      if (invert) v = 1 - v;
      return clamp01(v);
    };

    const sampleProcedural = () => {
      const h = Math.max(1, rows * cell);
      for (let y = 0; y < rows; y++) {
        const py = y * cell;
        for (let x = 0; x < cols; x++) {
          const px = x * cell;
          const d =
            0.4 +
            0.14 * Math.sin((px + py) * 0.006 + time * 0.3) +
            0.1 * Math.sin((px * 0.4 - py) * 0.009 - time * 0.2) +
            0.06 * Math.sin((px + py * 1.3) * 0.017 + time * 0.25) +
            (py / h) * 0.12;
          dark[y * cols + x] = shape(d);
        }
      }
    };

    const sampleImage = () => {
      if (!imgEl) return false;
      try {
        const off = document.createElement('canvas');
        off.width = cols;
        off.height = rows;
        const octx = off.getContext('2d', { willReadFrequently: true });
        if (!octx) return false;
        octx.imageSmoothingEnabled = true;
        octx.imageSmoothingQuality = 'high';
        const iw = imgEl.naturalWidth;
        const ih = imgEl.naturalHeight;
        const s = Math.max(cols / iw, rows / ih);
        const dw = iw * s;
        const dh = ih * s;
        octx.drawImage(imgEl, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
        const px = octx.getImageData(0, 0, cols, rows).data;
        for (let i = 0; i < cols * rows; i++) {
          const a = px[i * 4 + 3] / 255;
          const r = px[i * 4] * a + 255 * (1 - a);
          const g = px[i * 4 + 1] * a + 255 * (1 - a);
          const b = px[i * 4 + 2] * a + 255 * (1 - a);
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          dark[i] = shape(1 - lum);
        }
        return true;
      } catch {
        return false;
      }
    };

    const blit = (
      cx: number,
      cy: number,
      mask: Uint8Array,
      col: number
    ) => {
      if (!buf) return;
      let o = cy * cell * W + cx * cell;
      let m = 0;
      for (let y = 0; y < cell; y++) {
        for (let x = 0; x < cell; x++) {
          if (mask[m++]) buf[o + x] = col;
        }
        o += W;
      }
    };

    const draw = () => {
      if (!buf || !imgData) return;
      buf.fill(BG);
      for (let y = 0; y < rows; y++) {
        const row = (y & mMask) * mSize;
        const row2 = ((y + 1) & mMask) * mSize;
        const base = y * cols;
        for (let x = 0; x < cols; x++) {
          const i = base + x;
          const th = matrix[row + (x & mMask)];
          const th2 = matrix[row2 + ((x + half) & mMask)];
          const tl = Math.min(
            trailLevels,
            Math.floor(clamp01(field[i]) * trailLevels + th2 - 0.25)
          );
          if (tl > 0) {
            blit(x, y, trailMasks[tl - 1], TRAIL);
            continue;
          }
          const il = Math.min(
            inkLevels,
            Math.floor(dark[i] * inkLevels + th)
          );
          if (il > 0) blit(x, y, inkMasks[il - 1], INK);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    };

    const resize = () => {
      const w = root.offsetWidth;
      const h = root.offsetHeight;
      if (w <= 0 || h <= 0) return;
      const nc = Math.max(1, Math.ceil(w / cell));
      const nr = Math.max(1, Math.ceil(h / cell));
      if (nc === cols && nr === rows && imgData) return;
      cols = nc;
      rows = nr;
      W = cols * cell;
      canvas.width = W;
      canvas.height = rows * cell;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${rows * cell}px`;
      dark = new Float32Array(cols * rows);
      field = new Float32Array(cols * rows);
      next = new Float32Array(cols * rows);
      imgData = ctx.createImageData(W, rows * cell);
      buf = new Uint32Array(imgData.data.buffer);
      usingImage = sampleImage();
      if (!usingImage) sampleProcedural();
      draw();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(root);

    // Pointer coordinates
    let px: number | null = null;
    let py: number | null = null;
    let qx: number | null = null;
    let qy: number | null = null;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && !live.current.trail?.touch) return;
      const rect = root.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      // Only paint if inside or closely adjacent to root boundary
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        qx = null;
        qy = null;
        return;
      }

      const sx = rect.width / (root.offsetWidth || 1);
      const sy = rect.height / (root.offsetHeight || 1);
      qx = (clientX - rect.left) / sx / cell;
      qy = (clientY - rect.top) / sy / cell;
    };

    const onLeave = () => {
      px = py = qx = qy = null;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);

    const stamp = (
      x: number,
      y: number,
      r: number,
      strength: number
    ) => {
      const r2 = r * r;
      const x0 = Math.max(0, Math.floor(x - r));
      const x1 = Math.min(cols - 1, Math.ceil(x + r));
      const y0 = Math.max(0, Math.floor(y - r));
      const y1 = Math.min(rows - 1, Math.ceil(y + r));
      if (x0 > x1 || y0 > y1) return;
      for (let yy = y0; yy <= y1; yy++) {
        const dy = yy - y;
        for (let xx = x0; xx <= x1; xx++) {
          const dx = xx - x;
          const d = (dx * dx + dy * dy) / r2;
          if (d >= 1) continue;
          const v = strength * (1 - d) * (1 - d);
          const i = yy * cols + xx;
          if (v > field[i]) field[i] = v;
        }
      }
    };

    let raf = 0;
    let last = performance.now();
    let alive = false;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = live.current.trail || {};
      const radius = Math.max(1, (t.radius ?? 50) / cell);
      const strength = t.strength ?? 0.75;
      const duration = Math.max(0.1, t.duration ?? 1.6);
      const spread = t.spread ?? 0.2;
      let dirty = false;

      // Stamp continuous motion along path
      if (qx !== null && qy !== null) {
        if (px === null || py === null) {
          stamp(qx, qy, radius, strength);
        } else if (qx !== px || qy !== py) {
          const dx = qx - px;
          const dy = qy - py;
          const dist = Math.hypot(dx, dy);
          const steps = Math.max(1, Math.ceil(dist / (radius * 0.3)));
          for (let s = 1; s <= steps; s++) {
            stamp(px + (dx * s) / steps, py + (dy * s) / steps, radius, strength);
          }
        }
        if (px !== qx || py !== qy) {
          alive = true;
          dirty = true;
        }
        px = qx;
        py = qy;
      }

      // Diffuse + decay
      if (alive) {
        const decay = Math.pow(0.03, dt / duration);
        const s = Math.min(1, spread * dt * 60 * 0.5);
        let max = 0;
        for (let y = 0; y < rows; y++) {
          const up = y > 0 ? -cols : 0;
          const down = y < rows - 1 ? cols : 0;
          for (let x = 0; x < cols; x++) {
            const i = y * cols + x;
            const c = field[i];
            const l = x > 0 ? field[i - 1] : c;
            const r = x < cols - 1 ? field[i + 1] : c;
            const avg =
              (l + r + field[i + up] + field[i + down]) * 0.25;
            const v = (c + (avg - c) * s) * decay;
            next[i] = v;
            if (v > max) max = v;
          }
        }
        const tmp = field;
        field = next;
        next = tmp;
        if (max < 0.004) {
          field.fill(0);
          alive = false;
        }
        dirty = true;
      }

      const sp = live.current.speed ?? 1;
      if (sp > 0 && !usingImage) {
        time += dt * sp;
        sampleProcedural();
        dirty = true;
      }

      if (dirty) draw();
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, [
    imgEl,
    cellSize,
    glyphs,
    pattern,
    bg,
    ink,
    trailCol,
    trailShape,
    contrast,
    brightness,
    invert,
    drifting,
    isDark,
  ]);

  return (
    <div
      ref={rootRef}
      style={{
        backgroundColor: bg,
        ...style,
      }}
      className={cn(
        'relative w-full h-full overflow-hidden select-none',
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block pointer-events-none"
      />
      {children && (
        <div className="relative z-10 w-full h-full pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
}

export default GlyphTrail;

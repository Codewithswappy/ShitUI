'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

// ─── Bayer 8x8 Ordered Dithering Threshold Matrix ────────────────────────────
const BAYER_8X8 = [
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64);

// ─── Fast Deterministic Hash & Noise Functions ───────────────────────────────
function hash2D(x: number, y: number): number {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function noise1D(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  const a = hash2D(i, 0);
  const b = hash2D(i + 1, 0);
  return a + (b - a) * u;
}

function fbm1D(x: number, octaves = 3): number {
  let val = 0;
  let amp = 0.55;
  let freq = 1;
  let totalAmp = 0;
  for (let i = 0; i < octaves; i++) {
    val += noise1D(x * freq) * amp;
    totalAmp += amp;
    amp *= 0.45;
    freq *= 2.18;
  }
  return val / totalAmp;
}

// ─── Color Helper Functions ──────────────────────────────────────────────────
interface RgbColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

function parseCssColor(color: string, fallback: RgbColor): RgbColor {
  if (!color) return fallback;
  const c = color.trim().toLowerCase();

  if (c.startsWith('#')) {
    let hex = c.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex.split('').map((ch) => ch + ch).join('');
    }
    const num = parseInt(hex.slice(0, 6), 16);
    if (isNaN(num)) return fallback;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    const a = hex.length >= 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return { r, g, b, a };
  }

  const rgbMatch = c.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
      a: rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1,
    };
  }

  if (c === 'blue') return { r: 37, g: 99, b: 235, a: 1 };
  if (c === 'white') return { r: 255, g: 255, b: 255, a: 1 };
  if (c === 'black') return { r: 0, g: 0, b: 0, a: 1 };

  return fallback;
}

// ─── Click Ripple Types ──────────────────────────────────────────────────────
interface DitherParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  colorType: 'primary' | 'secondary' | 'highlight';
}

interface DitherRipple {
  id: number;
  x: number;
  y: number;
  startTime: number;
  duration: number;
  maxRadius: number;
  particles: DitherParticle[];
}

export type DitherSide = 'top' | 'bottom' | 'left' | 'right' | 'all' | 'outside' | 'overlay';
export type DitherVariant = 'organic' | 'straight';
export type DitherShape = 'square' | 'circle';

export interface PixelDitherProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: DitherVariant;
  shape?: DitherShape;
  side?: DitherSide;
  borderSize?: number;
  pixelSize?: number;
  color?: string;
  secondaryColor?: string;
  darkColor?: string;
  darkSecondaryColor?: string;
  density?: number;
  idleDensity?: number;
  animated?: boolean;
  speed?: number;
  interactive?: boolean;
  clickAnimation?: boolean;
  rippleSpread?: number;
  triggerRipple?: { x: number; y: number; id?: number } | null;
}

export function PixelDither({
  className,
  style,
  variant = 'organic',
  shape = 'square',
  side = 'top',
  borderSize = 64,
  pixelSize = 2,
  color,
  secondaryColor,
  darkColor,
  darkSecondaryColor,
  density = 0.85,
  idleDensity = 1,
  animated = true,
  speed = 0.8,
  interactive = true,
  clickAnimation,
  rippleSpread = 280,
  triggerRipple,
}: PixelDitherProps) {
  const isClickAnimOn = clickAnimation !== undefined ? clickAnimation : interactive;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ripplesRef = useRef<DitherRipple[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const { resolvedTheme } = useTheme();

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, [resolvedTheme]);

  const resolvedColors = useMemo(() => {
    const primaryColorStr = isDark ? (darkColor || color || '#3b82f6') : (color || '#2563eb');
    const primary = parseCssColor(primaryColorStr, { r: 37, g: 99, b: 235, a: 1 });

    const secondaryColorStr = isDark
      ? (darkSecondaryColor || secondaryColor || '#60a5fa')
      : (secondaryColor || '#1d4ed8');
    const secondary = parseCssColor(secondaryColorStr, { r: 29, g: 78, b: 216, a: 1 });

    return { primary, secondary };
  }, [color, secondaryColor, darkColor, darkSecondaryColor, isDark]);

  const spawnRipple = useCallback(
    (x: number, y: number) => {
      if (!isClickAnimOn) return;
      const now = performance.now();
      const count = 64;
      const particles: DitherParticle[] = [];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 4.5;
        const maxLife = 750 + Math.random() * 900;
        const colorRand = Math.random();
        const colorType: 'primary' | 'secondary' | 'highlight' =
          colorRand < 0.55 ? 'primary' : colorRand < 0.8 ? 'secondary' : 'highlight';

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: maxLife,
          maxLife,
          size: pixelSize * (Math.random() > 0.4 ? 1 : 2),
          colorType,
        });
      }

      ripplesRef.current.push({
        id: Math.random(),
        x,
        y,
        startTime: now,
        duration: 1100,
        maxRadius: rippleSpread,
        particles,
      });

      if (ripplesRef.current.length > 8) {
        ripplesRef.current.shift();
      }
    },
    [isClickAnimOn, pixelSize, rippleSpread]
  );

  useEffect(() => {
    if (isClickAnimOn && triggerRipple) {
      spawnRipple(triggerRipple.x, triggerRipple.y);
    }
  }, [isClickAnimOn, triggerRipple, spawnRipple]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isClickAnimOn) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spawnRipple(x, y);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const updateSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.floor(container.clientWidth || container.getBoundingClientRect().width);
      height = Math.floor(container.clientHeight || container.getBoundingClientRect().height);

      if (width <= 0 || height <= 0) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    let startTime = performance.now();

    const render = (currentTime: number) => {
      if (width <= 0 || height <= 0) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const elapsed = (currentTime - startTime) * 0.001 * speed;
      const px = Math.max(1, pixelSize * dpr);
      const cols = Math.ceil(canvas.width / px);
      const rows = Math.ceil(canvas.height / px);

      const now = performance.now();
      const activeRipples = ripplesRef.current.filter(
        (r) => now - r.startTime < r.duration + 300
      );
      ripplesRef.current = activeRipples;

      const { primary, secondary } = resolvedColors;

      const getStraightDensity = (x: number, y: number): number => {
        let dist = 0;
        if (side === 'top') {
          dist = y;
        } else if (side === 'bottom') {
          dist = height - y;
        } else if (side === 'left') {
          dist = x;
        } else if (side === 'right') {
          dist = width - x;
        } else if (side === 'all') {
          dist = Math.min(x, width - x, y, height - y);
        } else if (side === 'outside') {
          const left = borderSize;
          const right = Math.max(left, width - borderSize);
          const top = borderSize;
          const bottom = Math.max(top, height - borderSize);
          // Strictly 0 density anywhere inside the card!
          if (x >= left && x <= right && y >= top && y <= bottom) return 0;
          const dx = Math.max(0, left - x, x - right);
          const dy = Math.max(0, top - y, y - bottom);
          dist = Math.hypot(dx, dy);
          if (dist === 0) return 0;
        } else if (side === 'overlay') {
          const cx = width / 2;
          const cy = height / 2;
          const d = Math.hypot(x - cx, y - cy);
          const maxD = Math.min(cx, cy);
          const t = animated ? elapsed * 0.4 : 0;
          const scan = (Math.sin(y * 0.06 - t * 2.5) + 1) * 0.5 * 0.12;
          const normDist = Math.max(0, d - 12) / Math.max(1, maxD - 12);
          const vignette = Math.min(1, Math.pow(normDist, 1.1) * density * 1.15);
          return Math.min(1, vignette + scan);
        }

        if (dist > borderSize) return 0;

        const onePixelStep = px / dpr;
        if (dist <= onePixelStep * 1.05) {
          return 1.0;
        }

        const decay = (dist - onePixelStep) / Math.max(1, borderSize - onePixelStep);
        if (decay >= 1) return 0;

        let ratio = 0.75 * Math.pow(1 - decay, 1.4) * density;
        if (animated && ratio > 0.02) {
          ratio += Math.sin(x * 0.04 + elapsed * 1.5) * 0.03;
        }
        return Math.max(0, Math.min(1, ratio));
      };

      const peakDensity = Math.min(0.82, Math.max(0.45, density * 0.8));

      const getOrganicDensity = (col: number, row: number, x: number, y: number): number => {
        if (side === 'top') {
          const t = animated ? elapsed * 0.25 : 0;
          const macroWave = (fbm1D(x * 0.012 + t, 3) - 0.5) * 22;
          const microWave = (noise1D(x * 0.055 - t * 0.6) - 0.5) * 8;
          const tooth = (hash2D(col, 0) - 0.5) * 3.5;
          const bandTop = 12 + macroWave + microWave + tooth;
          const dist = y - bandTop;
          if (dist < -12) return 0;
          if (dist < 0) return 0.1 * Math.exp(dist * 0.3);
          const rampLength = 12;
          const dissolveLength = Math.max(24, borderSize - rampLength);
          if (dist < rampLength) {
            return 0.15 + (dist / rampLength) * (peakDensity - 0.15);
          } else {
            const decay = (dist - rampLength) / dissolveLength;
            if (decay >= 1) return 0;
            return peakDensity * Math.pow(1 - decay, 1.65);
          }
        }

        if (side === 'bottom') {
          const fromBottom = height - y;
          const t = animated ? elapsed * 0.25 : 0;
          const macroWave = (fbm1D(x * 0.012 + t, 3) - 0.5) * 22;
          const microWave = (noise1D(x * 0.055 - t * 0.6) - 0.5) * 8;
          const tooth = (hash2D(col, 1) - 0.5) * 3.5;
          const bandBottom = 12 + macroWave + microWave + tooth;
          const dist = fromBottom - bandBottom;
          if (dist < -12) return 0;
          if (dist < 0) return 0.1 * Math.exp(dist * 0.3);
          const rampLength = 12;
          const dissolveLength = Math.max(24, borderSize - rampLength);
          if (dist < rampLength) {
            return 0.15 + (dist / rampLength) * (peakDensity - 0.15);
          } else {
            const decay = (dist - rampLength) / dissolveLength;
            if (decay >= 1) return 0;
            return peakDensity * Math.pow(1 - decay, 1.65);
          }
        }

        if (side === 'left') {
          const t = animated ? elapsed * 0.25 : 0;
          const macroWave = (fbm1D(y * 0.012 + t, 3) - 0.5) * 22;
          const microWave = (noise1D(y * 0.055 - t * 0.6) - 0.5) * 8;
          const tooth = (hash2D(row, 2) - 0.5) * 3.5;
          const bandLeft = 12 + macroWave + microWave + tooth;
          const dist = x - bandLeft;
          if (dist < -12) return 0;
          if (dist < 0) return 0.1 * Math.exp(dist * 0.3);
          const rampLength = 12;
          const dissolveLength = Math.max(24, borderSize - rampLength);
          if (dist < rampLength) {
            return 0.15 + (dist / rampLength) * (peakDensity - 0.15);
          } else {
            const decay = (dist - rampLength) / dissolveLength;
            if (decay >= 1) return 0;
            return peakDensity * Math.pow(1 - decay, 1.65);
          }
        }

        if (side === 'right') {
          const fromRight = width - x;
          const t = animated ? elapsed * 0.25 : 0;
          const macroWave = (fbm1D(y * 0.012 + t, 3) - 0.5) * 22;
          const microWave = (noise1D(y * 0.055 - t * 0.6) - 0.5) * 8;
          const tooth = (hash2D(row, 3) - 0.5) * 3.5;
          const bandRight = 12 + macroWave + microWave + tooth;
          const dist = fromRight - bandRight;
          if (dist < -12) return 0;
          if (dist < 0) return 0.1 * Math.exp(dist * 0.3);
          const rampLength = 12;
          const dissolveLength = Math.max(24, borderSize - rampLength);
          if (dist < rampLength) {
            return 0.15 + (dist / rampLength) * (peakDensity - 0.15);
          } else {
            const decay = (dist - rampLength) / dissolveLength;
            if (decay >= 1) return 0;
            return peakDensity * Math.pow(1 - decay, 1.65);
          }
        }

        if (side === 'outside') {
          const left = borderSize;
          const right = Math.max(left, width - borderSize);
          const top = borderSize;
          const bottom = Math.max(top, height - borderSize);
          // Zero density anywhere inside the card bounds!
          if (x >= left && x <= right && y >= top && y <= bottom) return 0;

          const dx = Math.max(0, left - x, x - right);
          const dy = Math.max(0, top - y, y - bottom);
          const distFromCard = Math.hypot(dx, dy);

          if (distFromCard <= 0) return 0;

          const t = animated ? elapsed * 0.25 : 0;
          const perimeterCoord = (x + y) * 0.015;
          const macroWave = (fbm1D(perimeterCoord + t, 3) - 0.5) * (borderSize * 0.35);
          const microWave = (noise1D(perimeterCoord * 3.5 - t * 0.6) - 0.5) * 5;
          const tooth = (hash2D(col, row) - 0.5) * 3;

          const effectiveDist = distFromCard + macroWave + microWave + tooth;

          if (effectiveDist <= 0) return peakDensity;
          if (effectiveDist >= borderSize) return 0;

          const decay = effectiveDist / borderSize;
          return peakDensity * Math.pow(1 - decay, 1.6);
        }

        if (side === 'overlay') {
          const cx = width / 2;
          const cy = height / 2;
          const dist = Math.hypot(x - cx, y - cy);
          const maxD = Math.min(cx, cy);
          const t = animated ? elapsed * 0.4 : 0;
          const scan = (Math.sin(y * 0.06 - t * 2.5) + 1) * 0.5 * 0.14;
          const normDist = Math.max(0, dist - 12) / Math.max(1, maxD - 12);
          const vignette = Math.min(1, Math.pow(normDist, 1.1) * peakDensity * 1.35);
          return Math.min(1, vignette + scan);
        }

        const t = animated ? elapsed * 0.25 : 0;
        const distEdge = Math.min(x, width - x, y, height - y);
        const perimeterCoord = (x + y) * 0.015;
        const macroWave = (fbm1D(perimeterCoord + t, 3) - 0.5) * (borderSize * 0.25);
        const microWave = (noise1D(perimeterCoord * 3.5 - t * 0.6) - 0.5) * 4;
        const tooth = (hash2D(col, row) - 0.5) * 3;

        const effectiveDist = distEdge + macroWave + microWave + tooth;

        if (effectiveDist < 0) return 0.25 * Math.exp(effectiveDist * 0.3);
        if (effectiveDist > borderSize) return 0;

        const decay = effectiveDist / borderSize;
        return peakDensity * Math.pow(1 - decay, 1.5);
      };

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const physX = (c * px) / dpr;
          const physY = (r * px) / dpr;

          const isBurstMode = idleDensity === 0;
          const baseRatio = isBurstMode
            ? 0
            : (variant === 'straight'
                ? getStraightDensity(physX, physY)
                : getOrganicDensity(c, r, physX, physY));

          // Compute ripple influence (only when interactive / click animation is enabled!)
          let rippleBoost = 0;
          if (isClickAnimOn) {
            let allowRippleHere = true;
            if (side === 'outside') {
              const left = borderSize;
              const right = Math.max(left, width - borderSize);
              const top = borderSize;
              const bottom = Math.max(top, height - borderSize);
              // Do NOT allow click shockwaves inside the card for outside aura!
              if (physX >= left && physX <= right && physY >= top && physY <= bottom) {
                allowRippleHere = false;
              }
            }

            if (allowRippleHere) {
              for (let i = 0; i < activeRipples.length; i++) {
                const rip = activeRipples[i];
                const dt = (now - rip.startTime) / rip.duration;
                if (dt < 0 || dt > 1) continue;

                const currentR = dt * rip.maxRadius;
                const dist = Math.hypot(physX - rip.x, physY - rip.y);
                const ringDist = Math.abs(dist - currentR);

                const ringThickness = 28 + (1 - dt) * 20;
                if (ringDist < ringThickness) {
                  const crest = Math.exp(-Math.pow(ringDist / (ringThickness * 0.5), 2));
                  const fade = Math.sin(dt * Math.PI);
                  let boost = crest * fade * (isBurstMode ? 1.25 : 0.85);

                  // In side='all' card frame, keep the middle of the card clean!
                  if (side === 'all' && !isBurstMode) {
                    const distEdge = Math.min(physX, width - physX, physY, height - physY);
                    if (distEdge > borderSize * 1.15) {
                      boost *= Math.max(0, 1 - (distEdge - borderSize * 1.15) / 20);
                    }
                  }

                  rippleBoost += boost;
                }
              }
            }
          }

          // If there is no base border AND no active ripple wave passing through, SKIP!
          // This guarantees that the middle of the card and outside area remain 100% CLEAN!
          if (baseRatio <= 0.002 && rippleBoost <= 0.002) continue;

          // Only apply organic jitter where the border or ripple actually exists!
          const jitter =
            variant === 'organic' && baseRatio > 0.01
              ? (hash2D(c * 17 + 13, r * 29 + 31) - 0.5) * 0.12
              : 0;

          const totalRatio = Math.min(1, Math.max(0, baseRatio + jitter + rippleBoost));
          if (totalRatio <= 0.01) continue;

          const bayerThreshold = BAYER_8X8[(r % 8) * 8 + (c % 8)];

          if (totalRatio > bayerThreshold) {
            let fillColor = primary;

            const sparkleHash = hash2D(c * 37 + 101, r * 53 + 203);

            if (totalRatio > 0.28) {
              if (sparkleHash < 0.12) {
                fillColor = { r: 255, g: 255, b: 255, a: 1 };
              } else if (sparkleHash < 0.22) {
                fillColor = { r: 147, g: 197, b: 253, a: 1 };
              } else if (sparkleHash < 0.36) {
                fillColor = secondary;
              }
            }

            ctx.fillStyle = `rgba(${fillColor.r}, ${fillColor.g}, ${fillColor.b}, ${fillColor.a ?? 1})`;

            if (shape === 'circle') {
              const radius = px * 0.48;
              ctx.beginPath();
              ctx.arc(c * px + px * 0.5, r * px + px * 0.5, Math.max(0.5, radius), 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillRect(c * px, r * px, px, px);
            }
          }
        }
      }

      for (let i = 0; i < activeRipples.length; i++) {
        const rip = activeRipples[i];
        for (let j = 0; j < rip.particles.length; j++) {
          const p = rip.particles[j];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.life -= 16.6;

          if (p.life <= 0) continue;

          // If outside aura, skip drawing any particle that lands inside the card boundary!
          if (side === 'outside') {
            const left = borderSize;
            const right = Math.max(left, width - borderSize);
            const top = borderSize;
            const bottom = Math.max(top, height - borderSize);
            if (p.x >= left && p.x <= right && p.y >= top && p.y <= bottom) {
              continue;
            }
          }

          const alpha = (p.life / p.maxLife) * 0.95;
          const col =
            p.colorType === 'primary'
              ? primary
              : p.colorType === 'secondary'
              ? secondary
              : { r: 255, g: 255, b: 255 };

          const drawPx = Math.max(1, p.size * dpr);
          const snapX = Math.floor((p.x * dpr) / drawPx) * drawPx;
          const snapY = Math.floor((p.y * dpr) / drawPx) * drawPx;

          ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha})`;

          if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(snapX + drawPx * 0.5, snapY + drawPx * 0.5, drawPx * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(snapX, snapY, drawPx, drawPx);
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [
    variant,
    shape,
    side,
    borderSize,
    pixelSize,
    density,
    idleDensity,
    animated,
    speed,
    resolvedColors,
    interactive,
  ]);

  return (
    <div
      ref={containerRef}
      onClick={interactive ? handleClick : undefined}
      className={cn('relative overflow-hidden pointer-events-auto', className)}
      style={{
        imageRendering: 'pixelated',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        className="block pointer-events-none select-none"
        style={{
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}

// ─── Wrapper Component: PixelDitherBorder ─────────────────────────────────────
export interface PixelDitherBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: DitherVariant;
  shape?: DitherShape;
  side?: DitherSide;
  borderSize?: number;
  borderPadding?: number;
  pixelSize?: number;
  color?: string;
  secondaryColor?: string;
  density?: number;
  interactive?: boolean;
  clickAnimation?: boolean;
  rippleSpread?: number;
  animated?: boolean;
  placement?: 'inside' | 'outside';
  outsideSpread?: number;
  burstOnClick?: boolean;
}

export function PixelDitherBorder({
  children,
  className,
  contentClassName,
  variant = 'organic',
  shape = 'square',
  side = 'all',
  borderSize = 28,
  borderPadding,
  pixelSize = 2,
  color,
  secondaryColor,
  density = 0.85,
  interactive = true,
  clickAnimation,
  rippleSpread = 320,
  animated = true,
  placement = 'inside',
  outsideSpread = 32,
  burstOnClick = false,
  onClick,
  style,
  ...props
}: PixelDitherBorderProps) {
  const isClickAnimOn = clickAnimation !== undefined ? clickAnimation : interactive;
  const [triggerRipple, setTriggerRipple] = useState<{ x: number; y: number; id?: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isClickAnimOn) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (placement === 'outside') {
      x += outsideSpread;
      y += outsideSpread;
    }

    setTriggerRipple({ x, y, id: Date.now() + Math.random() });
  };

  if (placement === 'outside') {
    const spread = outsideSpread;
    return (
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onClick={onClick}
        className={cn('relative group/dither inline-block', className)}
        style={style}
        {...props}
      >
        <PixelDither
          variant={variant}
          shape={shape}
          side="outside"
          borderSize={spread}
          pixelSize={pixelSize}
          color={color}
          secondaryColor={secondaryColor}
          density={density}
          interactive={isClickAnimOn}
          clickAnimation={isClickAnimOn}
          rippleSpread={rippleSpread || 360}
          animated={animated}
          idleDensity={burstOnClick ? 0 : 1}
          triggerRipple={isClickAnimOn ? triggerRipple : null}
          className="absolute z-0 pointer-events-none"
          style={{
            top: -spread,
            left: -spread,
            right: -spread,
            bottom: -spread,
            width: `calc(100% + ${spread * 2}px)`,
            height: `calc(100% + ${spread * 2}px)`,
          }}
        />

        <div className={cn('relative z-10 w-full h-full', contentClassName)}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onClick={onClick}
      className={cn('relative group/dither overflow-hidden', className)}
      style={{
        ...(borderPadding !== undefined ? { padding: borderPadding } : {}),
        ...style,
      }}
      {...props}
    >
      <div className={cn('relative z-10 w-full h-full', contentClassName)}>
        {children}
      </div>

      <PixelDither
        variant={variant}
        shape={shape}
        side={side}
        borderSize={borderSize}
        pixelSize={pixelSize}
        color={color}
        secondaryColor={secondaryColor}
        density={density}
        interactive={isClickAnimOn}
        clickAnimation={isClickAnimOn}
        rippleSpread={rippleSpread}
        animated={animated}
        idleDensity={burstOnClick ? 0 : 1}
        triggerRipple={isClickAnimOn ? triggerRipple : null}
        className="absolute inset-0 z-20 h-full w-full pointer-events-none"
      />
    </div>
  );
}

export default PixelDither;
